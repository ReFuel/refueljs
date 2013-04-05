
Refuel.define('DataSource', {inherits: 'Events', require: ['ajax']}, 
	function DataSource() {
		var data = null;
    	var self = this;
		var config = {};
    	//Core.implement(Events, this);    	
		
		this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
           	loadData();
        }	

		this.setData = function(dataObj) {
			data = dataObj;
			this.saveData();
			self.notify("dataAvailable", {'data': data});
		}
		this.getData = function() {
			return data;
		}

		function loadData() {
			if (config.key) {
				var storedData = localStorage.getItem(config.key);
				var storedObject = JSON.parse(storedData);
				if (storedObject) {
            		data = storedObject;
            		self.notify("dataAvailable", {'data': data});
            		console.log('dataAvailable', data);
            	}else {
            		self.notify("dataAvailable", {'data': data});
            		console.log('no-data', data);
            	}
            }
		}

		this.saveData = function () {
			if (config.key) localStorage.setItem(config.key, JSON.stringify(data));
		}

		this.model =  function(dataObj, xhr) {
			//specificare qui il modello dei dati???
			//se non è specificato la mappatura è 1 a 1
			return dataObj;
		}
		
		function okCallback(dataObj) {
			self.setData(self.model(dataObj));
		}
		
		function koCallback(dataObj) {
			console.error("datasource error:", config, dataObj);
			self.notify("dataError", self.getData());
		}
		
		function initialize(options) {
			var facade = {};
			if (options) {
				if(!options.url || !options.key) {
					self.setData(options);	//XXX why?
				}
				if (options.url) {
					if (!options.ajaxOptions.ok) {
						options.ajaxOptions.ok = okCallback;
					}
					if (!options.ajaxOptions.ko) { 
						options.ajaxOptions.ko = koCallback;
					}
					facade = {
						"get": function() {
							ajax.get(options.url, options.ajaxOptions);
						},
						"post": function(body) {
							ajax.post(options.url, body, options.ajaxOptions);
						},
						"put": function(body) {
							ajax.put(options.url, body, options.ajaxOptions);
						},
						"delete": function() {
							ajax.delete(options.url, options.ajaxOptions);
						},
						"getData": self.getData //è veramente da rendere pubblica??? potrebbe essere necessario 
					}
				 }
				 else if (options.key){
					facade = {
						"get": function() {
							return localStorage.getItem(options.key);
						},
						"set": function(dataObj) {
							localStorage.setItem(options.key, JSON.stringify(data));


						},
						/*"update": function(dataObj) {
							localstorage.update(options.options.key, dataObj);
						},*/
						"remove": function() {
							localStorage.removeItem(options.key);
						}
					}
				}
			}
			return facade;
		}
    });
