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
		var data;

		this.init = function(myConfig) {
			this.config = Refuel.mix(this.config, myConfig);
			data = this.config.value;
		
	        for (var i = 0, prop; prop = data[i]; i++) {
	            	watchElement(index, prop);
	                index++;  
	        };
			
			["pop", "push", "reverse", "shift", "sort", "splice", "unshift"].forEach(function (methodName) {
			  	self[methodName] = function (val) {
					//check della len anzichè gestire ogni singolo metodo?
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
			  				var index = val;
			  				self.length = data.length;
			  				unWatchElement(index);
			  				var e =  {action: 'delete', index: index};
			  				self.notify('_oa_update',e);
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
    		self.length = val;
    		var e =  {action: 'update', data: val, prop: 'length'};
		  	self.notify('_oa_update',e);
    	});

    	this.__defineGetter__('length', function() {
    		return data.length;
    	});

    	//FIXME al delete i getter restano ai vecchi indici
    	function watchElement(index) {
    		if(!self.__lookupGetter__(index)) {
	    		(function(thisIndex) {
		    		Object.defineProperty(self, thisIndex, {
					    configurable: true,
						set: function(val) {
				            self.setElementAt(thisIndex, val);
					    },
						get: function() {
					        return self.getElementAt(thisIndex);
					    }
					});
	            })(index);
	        }
    	}
    	function unWatchElement(index) {
    		delete self[index];
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

});
