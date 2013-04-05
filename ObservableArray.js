/**
    @event _oa_update = {
        symbol: ObservableArray corresponding template-symbol,
        action: performed action by the ObservableArray (add|move|remove),
        index: ObservableArray's index involved in the action,
        data: ObservableArray's involved item
    }

*/
Refuel.define('ObservableArray',{inherits: 'Events'}, 
	function ObservableArray() {
		var self = this;
		this.config = {};
		var index = 0;
		var data, unFilteredData;

		this.init = function(myConfig) {
			this.config = Refuel.mix(this.config, myConfig);
			data = this.config.value;
			this.subscribe('change', function(e){console.log(e.type, e)});
	        for (var i = 0, prop; prop = data[i]; i++) {
	            	watchElement(index, prop);
	                index++;  
	        };
			
			["pop", "push", "reverse", "shift", "sort", "splice", "unshift", "filter"].forEach(function (methodName) {
			  	self[methodName] = function () {
					//TODO fattorizzare len.
					//XXX c'è un setter pubblico per la len.. sicuri?
					if (unFilteredData) {
	  					filterClear();
	  				} 
					//var oldData = data;
			  		var r = data[methodName].apply(data, arguments);
			  		switch(methodName) {
			  			case 'push': 
			  				var index = self.length;
			  				watchElement(index);
			  				self.length = data.length;
			  				var e =  {action: 'add', index: index, data: self[index]};
			  				self.notify('_oa_update',e);
			  			
			  			break;
			  			case 'splice': 
			  				var index = arguments[0];
			  				self.length = data.length;
			  				unWatchElement(index);
			  				var e =  {action: 'delete', index: index};
			  				self.notify('_oa_update',e);
			  			
			  			break;
			  			case 'filter': 
			  				//r = Refuel.createInstance('ObservableArray', {'value': r});
			  			break;			  			
			  		}
			  		return r;
			    };
			});
		}

		
		this.__defineGetter__('data', function() {
    		return data;
    	});

    	this.__defineSetter__('length', function(val) {
    		var e =  {action: 'update', data: data.length, prop: 'length'};
		  	self.notify('_oa_update',e);
    	});

    	this.__defineGetter__('length', function() {
    		return data.length;
    	});

    	function watchElement(index) {
    		if(!self.__lookupGetter__(index)) {
	    		(function(thisIndex) {
		    		Object.defineProperty(self, thisIndex, {
					    configurable: true,
						set: function(val) {
				            console.log('set element', thisIndex);
				            self.setElementAt(thisIndex, val);
					    },
						get: function() {
							//console.log('set element', index);
					        return self.getElementAt(thisIndex);
					    }
					});
	            })(index);
	        }
    	}
    	function unWatchElement(index) {
    		if (index) delete self[index];
    		resetWatchers();
    	}
    	function resetWatchers() {
    		for (var i = 0; i < data.length; i++) {
    			delete self[i];
    			watchElement(i)
    		};	
    	}

		this.setElementAt = function(index, val) {
			data[index] = val;
		
		}
		this.getElementAt = function(index) {
			return data[index];
		}
		function filterClear() {
			data = unFilteredData;
			unFilteredData = null;
			resetWatchers();
			self.length = data.length;
		}

		this.filterClear = function() {
			if (unFilteredData) {
				filterClear();
				var e =  {action: 'filterClear', index: null};
				this.notify('_oa_update',e);	
			}
		}
		this.applyFilter = function() {
			var filteredData = this.filter(arguments[0]);
			unFilteredData = data;
			data = filteredData;
			this.length = data.length;
			resetWatchers();
			var e =  {action: 'filterApply', index: null};
			this.notify('_oa_update',e);
		}

		this.consolidate = function() {
			unFilteredData = null;
		}

});
