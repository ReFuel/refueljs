/**
*	@class DataSource
*	@param data direct set data
*	@param key  localStorage key
*	@param url  ajax call url
*	@param dataPath when data are loaded
*   
*	@fires dataAvaiable The class has loaded its data and is ready
*	@fires dataError Some error is occurred during data loading
*	@author Stefano Sergio
*/
Refuel.define('DataSource', {inherits: 'Events'}, 
	function DataSource() {
		var data = {},
			sourceData = {}, 
			lastLoadConfig = null,
			_loadStatus = 'idle',
			currentXHR = null;

		var config = {
				'defaultDataType': 'Object',
				'dataPath': null,
				'successCallback': successCallback.bind(this),
				'errorCallback': errorCallback.bind(this),
				'timeoutCallback': timeoutCallback.bind(this),
				'autoload': false,
				'_genericCallback': genericCallback.bind(this),
				'mode': 'new'
				//,allowedStatus: []
			},
			extLoadingState = {
				requested: 0,
				completed: 0
			};

		this.setLoadComplete = function() {
			_loadStatus = 'complete';
		}
		this.setLoadProgress = function() {
			_loadStatus = 'progress'; 
		}
		this.setLoadIdle = function() {
			_loadStatus = 'idle';
		}
		Object.defineProperty(this, 'loadComplete', {
			get: function() {
		        return _loadStatus == 'complete';
		    }
		});
		Object.defineProperty(this, 'loadProgress', {
			get: function() {
		        return _loadStatus == 'progress';
		    }
		});
		Object.defineProperty(this, 'loadIdle', {
			get: function() {
		        return _loadStatus == 'idle';
		    }
		});
		Object.defineProperty(this, 'loadStatus', {
			get: function() {
		        return _loadStatus;
		    }
		});
		Object.defineProperty(this, 'sourceData', {
			get: function() {
		        return sourceData;
		    }
		});


		Object.defineProperty(this, 'data', {
			configurable: true,				
			get: function() {
		        return data;
		    },
		    set: function(val) {
		    	data = val;
		    }
		});

		this.init = function(myConfig) {
			config = Refuel.mix(config, myConfig);

			//console.log('datasource.init',config.dataLabel,_loadStatus,config.autoload, config.msg );
			refreshInterface.call(this);
			if (this.loadComplete) {
           		this.notify('dataAvailable', {'data': data});
           	}
           	else if (config.data) {
           		setData.call(this, config.data);
           		config.data = null;
			} 
           	else if (config.autoload) {
           		this.load();
           	}
        }

        this.abort = function() {
        	//not implemented yet
        }
        this.clear = function() {
        	//not implemented yet
        }

        this.setConfig = function (myConfig) {
        	config.params = null;
        	config.mode = 'new';
        	config = Refuel.mix(config, myConfig || {});
        	lastLoadConfig = config;
        	refreshInterface.call(this);
        }
        //XXX Really?
        this.getConfig = function() {
        	return config;
        }

		this.setData = function(dataObj) {
			setData.call(this, dataObj);
		}

		function setData (dataObj) {
			//console.log(config.dataLabel,'setData', dataObj);
			this.setLoadProgress();
			if (Refuel.refuelClass(dataObj) == 'DataSource') {
				dataObj = Refuel.resolveChain('data', dataObj);
			}
			if (config.mode === 'new') {
				data = dataObj;
			}
			else if (config.mode === 'add') {
				if (dataObj.hasOwnProperty('length') && data.concat) {
					data = data.concat(dataObj);
				}
				else {
					data = Refuel.mix(data, dataObj);
				}
			} 
			
			this.setConfig(); //reset config before passing on other DS
			extLoadingState.found = extLoadingState.requested = extLoadingState.completed = 0;

			for(var key in data) {
				var prop = data[key];

				if (Refuel.refuelClass(prop) == 'DataSource') {
					extLoadingState.found++;
					if (prop.loadComplete) {
						checkLoadingState.call(this);
					}
					else if (!prop.loadProgress || !prop.loadComplete) {
						extLoadingState.requested++;
						prop.subscribe('dataAvailable', function() {
							extLoadingState.completed++;
							checkLoadingState.call(this);
						}, this);
						prop.setConfig({autoload: config.autoload})
						prop.init();
					}
				}
			}
			if (!extLoadingState.found) checkLoadingState.call(this);
		}

		function checkLoadingState() {
			if (this.loadProgress && extLoadingState.requested == extLoadingState.completed) {
				this.setLoadComplete();
				this.notify('dataAvailable', {'data': data});
			}
		}

		this.getData = function() {
			return data;
		}

		function filterLSData(key, value) {
			if (Refuel.refuelClass(value) == 'ObservableArray') {
				return value.data;
			}
			else {
				return value;
			}
		}

		this.save = function() {
			if (config.key) {
				localStorage.setItem(config.key, JSON.stringify(data, filterLSData));
            }
            else if (config.url) {
            	console.error('Ajax call not yet implemented');
            }

			for(var key in data) {
				var prop = data[key];
				if (Refuel.refuelClass(prop) == 'DataSource') {
					prop.save();
				}	
			}
		}

		this.load = function(myConfig) {
			this.setConfig(myConfig);
			if (this.loadProgress) return;
			//console.log('DataSource start loading data labelled',config.dataLabel,'from',config.url || config.key);
			
			this.setLoadProgress();
			if (config.key) {
				
				var storedData = localStorage.getItem(config.key);
				
				var storedObject = JSON.parse(storedData);
				if (storedObject) {
					sourceData = storedObject;
					var puredata = Refuel.resolveChain(config.dataPath, storedObject);
            		setData.call(this, puredata);
            	}
            	else {
            		var defaultEmptyData = config.defaultDataType == 'Array' ? [] : {};
            		setData.call(this, defaultEmptyData);
            	}
            }
            else if (config.url) {
            	currentXHR = Refuel.ajax.get(config.url, config);
            }

            for(var key in data) {
				var prop = data[key];
				if (Refuel.refuelClass(prop) == 'DataSource') {
					if (!prop.loadComplete) prop.load();
				}	
			}
		}

		this.abort = function() {
			currentXHR.abort();
		}

		this.reload = function() {
			this.load(lastLoadConfig);
		}

		function successCallback(dataObj) {}
		function errorCallback(dataObj) {}
		function timeoutCallback(dataObj) {}

		function genericCallback(response, status, xhr, type) {
			switch(type) {
				case 'success':
					sourceData = response.responseJSON;
					var puredata = Refuel.resolveChain(config.dataPath, response.responseJSON);
					setData.call(this, puredata);	
				break;
				case 'error':
					this.setLoadIdle();
					console.error("datasource error:", config);
					this.notify("dataError", data);
				break;
				case 'timeout':
					this.setLoadIdle();
					console.error("datasource Timed-Out:", config);
					this.notify("dataError", data);
				break;
			}
		}

		function refreshInterface() {
			var facade = {},
				url = config.url,
				key = config.key;

			if (url) {

				facade = {
					"get": function(params, callback) {
						var postconf = Refuel.clone(config);
						if (callback) 
							postconf.successCallback = postconf.errorCallback = postconf.timeoutCallback = callback;
						postconf.params = params;
						Refuel.ajax.get(config.url, postconf);
					},
					"post": function(body, callback) {
						var postconf = Refuel.clone(config);
						if (callback) 
							postconf.successCallback = postconf.errorCallback = postconf.timeoutCallback = callback;
						Refuel.ajax.post(config.url, body, postconf);
					},
					"put": function(body) {
						Refuel.ajax.put(url, body, config);
					},
					"delete": function() {
						Refuel.ajax.delete(url, config);
					}
				}
			 }
			 else if (key) {
				facade = {
					"get": function() {
						return localStorage.getItem(key);
					},
					"set": function(dataObj) {
						localStorage.setItem(key, JSON.stringify(data));


					},
					/*"update": function(dataObj) {
						localstorage.update(config.config.key, dataObj);
					},*/
					"remove": function() {
						localStorage.removeItem(key);
					}
				}
			}
			
			for (var key in facade) {
				if (!this[key]) {
					this[key] = facade[key];
				}
			}
			return facade;
		}


    });
