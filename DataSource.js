
Refuel.define('DataSource', {inherits: 'Events', require: ['ajax', 'localstorage']}, 
	function DataSource(options) {
		var data = {};
    	var self = this;
		var facade = {};
    	//Core.implement(Events, this);    	
		
		this.setData = function(dataObj) {
			data = dataObj;
			self.notify("dataAvailable", {'data': data});
		}
		
		this.getData = function() {
			return data;
		}

		this.setOptions = function(newopts) {
			options = Refuel.mix(options, newopts);
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
			//something gone wrong
			console.error("datasource error:", options, dataObj);
			self.notify("dataError", self.getData());
		}
		
		function initialize(options) {
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
							localstorage.get(options.key);
						},
						"set": function(dataObj) {
							localstorage.set(options.key, dataObj);
							self.setData(dataObj);
						},
						"update": function(dataObj) {
							localstorage.update(options.key, body);
							self.setData(dataObj);
						},
						"remove": function() {
							localstorage.remove(options.key);
							self.setData({});
						},
						"getData": self.getData
					}
				}
			}

			facade = Refuel.mix(facade, self);
			return facade;
		}
		return initialize(options);
    });
