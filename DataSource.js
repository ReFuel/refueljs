/*

	@param data direct set data
	@param key  localStorage key
	@param url  ajax call url
*/
Refuel.define('DataSource', {inherits: 'Events', require: ['ajax']}, 
	function DataSource() {
		var data = null,
			config = {},
			items = {},
			extLoadingState = {
				requested: 0,
				completed: 0
			};

		this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
            this.loadComplete = false;
            refreshInterface.call(this);
           	this.load();
        }

		this.setData = function(dataObj) {
			data = dataObj;
			extLoadingState.found = extLoadingState.requested = extLoadingState.completed = 0;
			for(var key in data) {
				var prop = data[key];
				/*
				(function(context, name) {
					Object.defineProperty(context, name, {
					    configurable: true,
						get: function() {
					        return data[name];
					    }
					});
				})(this, key);
				*/

				if (prop._refuelClassName && prop._refuelClassName === 'DataSource') {
					extLoadingState.found++;
					if (prop.loadComplete) {
						checkLoadingState.call(this);
					}
					else {
						extLoadingState.requested++;
						prop.subscribe('dataAvailable', function() {
							extLoadingState.completed++;
							checkLoadingState.call(this);
						}, this);
					}
				}
			}
			if (!extLoadingState.found) checkLoadingState.call(this);
		}

		function checkLoadingState() {
			//item is not required
			if (extLoadingState.requested == extLoadingState.completed) {
				this.loadComplete = true;
				this.notify('dataAvailable', {'data': data});
			}
			else {
				//console.log(config.name+'.checkLoadingState','NOT loadComplete');
			}
		}

		this.getData = function() {
			return data;
		}

		this.save = function() {
			//save dei dati del ds
			for(var key in data) {
				var prop = data[key];
				if (prop._refuelClassName && prop._refuelClassName == 'DataSource') {
					prop.save();
				}	
			}
		}

		this.load = function() {
			if (config.data) {
				this.setData(config.data);
			} 
			else if (config.key) {
				var storedData = localStorage.getItem(config.key);
				var storedObject = JSON.parse(storedData);
				if (storedObject) {
            		this.setData(storedObject);
            	}
            	else {
            		this.setData(null);
            	}
            }
            else if (config.url) {
            	console.error('Ajax call not yet implemented');
            }

            for(var key in data) {
				var prop = data[key];
				if (prop._refuelClassName && prop._refuelClassName == 'DataSource') {
					prop.load();
				}	
			}
		}

		function okCallback(dataObj) {
			//this.setData(this.model(dataObj));
		}
		
		function koCallback(dataObj) {
			console.error("datasource error:", config, dataObj);
			this.notify("dataError", this.getData());
		}
		
		function refreshInterface() {
			var facade = {},
				url = config.url,
				key = config.key;

			if(!url || !key) {
				this.setData(config);	//XXX why?
			}
			if (url) {
				if (!config.ajaxOptions.ok) {
					config.ajaxOptions.ok = okCallback.bind(this);
				}
				if (!config.ajaxOptions.ko) { 
					config.ajaxOptions.ko = koCallback.bind(this);
				}
				facade = {
					"get": function() {
						ajax.get(url, config.ajaxOptions);
					},
					"post": function(body) {
						ajax.post(url, body, config.ajaxOptions);
					},
					"put": function(body) {
						ajax.put(url, body, config.ajaxOptions);
					},
					"delete": function() {
						ajax.delete(url, config.ajaxOptions);
					},
					"getData": this.getData //è veramente da rendere pubblica??? potrebbe essere necessario 
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
