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
		this.config = {};
		var index = 0;
		var data, unFilteredData;

		this.init = function(myConfig) {
			this.config = Refuel.mix(this.config, myConfig);
			data = this.config.value;
			this.subscribe('change', function(e){console.log(e.type, e)});
	        for (var i = 0, prop; prop = data[i]; i++) {
	            	watchElement.call(this, index);
	                index++;  
	        };
			['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'filter'].forEach(handleChange.bind(this));
		}

		function handleChange(methodName) {
		  	this[methodName] = function () {
				//TODO fattorizzare len.
				//XXX c'è un setter pubblico per la len.. sicuri?
				if (unFilteredData) {
  					filterClear.call(this);
  				} 
				//var oldData = data;
		  		var r = data[methodName].apply(data, arguments);
		  		switch(methodName) {
		  			case 'push': 
		  				var index = this.length;
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
		  			case 'filter': 
		  				//r = Refuel.createInstance('ObservableArray', {'value': r});
		  			break;			  			
		  		}
		  		return r;
		    };
		}
		
		this.__defineGetter__('data', function() {
    		return data;
    	});

    	this.__defineSetter__('length', function(val) {
  			//console.log('OA set length', val);
    		var e =  {action: 'update', data: data.length, prop: 'length'};
		  	this.notify('_oa_update',e);
    	});

    	this.__defineGetter__('length', function() {
    		return data.length;
    	});

    	function watchElement(index) {
    		if(!this.__lookupGetter__(index)) {
	    		(function(context, thisIndex) {
		    		Object.defineProperty(context, thisIndex, {
					    configurable: true,
						set: function(val) {
				            console.log('set element', thisIndex);
				            context.setElementAt(thisIndex, val);
					    },
						get: function() {
							//console.log('set element', index);
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
		function filterClear() {
			data = unFilteredData;
			unFilteredData = null;
			resetWatchers.call(this);
			this.length = data.length;
		}

		this.filterClear = function() {
			if (unFilteredData) {
				filterClear.call(this);
				var e =  {action: 'filterClear', index: null};
				this.notify('_oa_update',e);	
			}
		}
		this.applyFilter = function() {
			var filteredData = this.filter(arguments[0]);
			unFilteredData = data;
			data = filteredData;
			this.length = data.length;
			resetWatchers.call(this);
			var e =  {action: 'filterApply', index: null};
			this.notify('_oa_update',e);
		}

		this.consolidate = function() {
			unFilteredData = null;
		}

});
