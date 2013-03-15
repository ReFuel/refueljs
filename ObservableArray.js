
define(['Core', 'Events'],function(Core, Events) {
	return function ObservableArray(data) {
		var self = this;
		var index = 0;
		Core.implement(Events, this);

		this.__defineGetter__('data', function() {
    		return data;
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

        for (var i = 0, prop; prop = data[i]; i++) {
            	watchElement(index, prop);
               	/*
                	Object.defineProperty(self, thisIndex, {
                		get:function() {
		            			console.log('getter called',index, prop);
		            			return data[index];
			                    //return self.getElementAt(thisIndex);
	                    	}(index, prop),
	                    set:function(val) {
	                    		console.log('setter called',index, prop);
	                    		self.setElementAt(thisIndex, val);
	                    	}

                	});
				*/
				//})(index, prop);	
                index++;
            
        };
		
		["pop", "push", "reverse", "shift", "sort", "splice", "unshift"].forEach(function (methodName) {
		  	self[methodName] = function (val) {
				//check della len anzichè gestire ogni singolo metodo?
		  		var r = data[methodName].apply(data, arguments);
		  		switch(methodName) {
		  			case 'push': 
		  				var index = self.length-1;
		  				watchElement(index, val);
		  			break;
		  		}
		  		self.notify('_update', {action: methodName});
		  		return r;
		    };
		});

		this.setElementAt = function(index, val) {
			data[index] = val;
		}
		this.getElementAt = function(index) {
			return data[index];
		}



	}	
});
