/**
*   @class ObservableArray
*	@fires _oa_update ObservableArray change event
*	@author Stefano Sergio
*/

Refuel.define('ObservableArray',{inherits: 'Events'}, 
	function ObservableArray() {
		this.config = {};
		var index = 0;
		var data, unFilteredData, lastAppliedFilter;

		this.init = function(myConfig) {
			this.config = Refuel.mix(this.config, myConfig);
			data = this.config.value;
			this.length = data.length;
			this.subscribe('change', function(e){console.log(e.type, e)});
	        for (var i = 0, prop; prop = data[i]; i++) {
	            	watchElement.call(this, index);
	                index++;  
	        };
			['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'].forEach(handleChange.bind(this));
			this.notify('_oa_update',{action: 'set'});
		}

		function refreshLength() {
            var e =  {action: 'update', data: data.length, prop: 'length'};
	  		this.notify('_oa_update',e);
		}

		function handleChange(methodName) {
		  	this[methodName] = function () {
				var r = data[methodName].apply(data, arguments);
		  		switch(methodName) {
		  			case 'push': 
		  				var index = data.length-1;
		  				watchElement.call(this, index);
		  				this.length = data.length;
		  				var e =  {action: 'add', index: index, data: this[index]};
		  				this.notify('_oa_update',e);
		  			break;
		  			case 'splice': 
		  				var index = arguments[0];
		  				this.length = data.length;
		  				unWatchElement.call(this, index);
		  				var e =  {action: 'delete', index: index};
		  				this.notify('_oa_update',e);
		  			break;  			
		  		}
		  		return r;
		    };
		}

		this.__defineGetter__('data', function() {
    		return data;
    	});
		
		//XXX Quando viene osservata questi get/set vengono sovrascritti da Observer
		Object.defineProperty(this, 'length', {
		    configurable: true,
			set: function(val) {
				var e =  {action: 'update', data: data.length, prop: 'length'};
	  			this.notify('_oa_update',e);
	           
		    },
			get: function() {
				return data.length;
		    }
		});

    	function watchElement(index) {
    		if(!this.__lookupGetter__(index)) {
	    		(function(context, thisIndex) {
		    		Object.defineProperty(context, thisIndex, {
					    configurable: true,
						set: function(val) {
				            context.setElementAt(thisIndex, val);
					    },
						get: function() {
					        return context.getElementAt(thisIndex);
					    }
					});
	            })(this, index);
	        }
    	}
    	function unWatchElement(index) {
    		if (index) delete this[index];
    		resetWatchers.call(this);
    	}
    	function resetWatchers() {
    		for (var i = 0; i < data.length; i++) {
    			delete this[i];
    			watchElement.call(this, i)
    		};	
    	}

		this.setElementAt = function(index, val) {
			data[index] = val;
		
		}
		this.getElementAt = function(index) {
			return data[index];
		}

		this.filter = function(callback) {
			return data.filter(callback);
		}
		
});
