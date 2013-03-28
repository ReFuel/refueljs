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
			  				watchElement(index, val);
			  				self.length = data.length;
			  				var e =  {action: 'add', index: index, data: self[index]};
			  				self.notify('_oa_update',e);
			  			break;
			  			case 'splice': 
			  				var index = val;
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


    	function watchElement(index, prop) {
    		if(!self.__lookupGetter__(prop)) {
	    		(function(thisIndex, thisProp) {
	            		self.__defineGetter__(thisIndex, function() {
	                		//console.log('getter called',thisIndex, thisProp); 
	                		return self.getElementAt(thisIndex);
	                	});
	                	self.__defineSetter__(thisIndex, function(val) {
	                		self.setElementAt(thisIndex, val);
	                	});
	            })(index, prop);
	        }
    	}
		this.setElementAt = function(index, val) {
			data[index] = val;
		}
		this.getElementAt = function(index) {
			return data[index];
		}

});
