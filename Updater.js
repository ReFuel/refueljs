//TODO Rename in BasicModule?
define(['Core', 'Events'], function(Core, Events) {
    return function Updater() {
		var self = this;
		var _map = {};
	    this.getObservers = function() {
	        return _map;
	    }
	    this.getObservable = function(name) {
	    	return _map[name];
	    }


	    this.observable = function(name, dontNotify) {
	        //if (!dontNotify) 
	        //	console.log(this.name.toUpperCase(), "Ha dichiarato osservabile", name);
	        
	        var value = Core.resolveChain(name, this);
	        // Create object in map
	        if (!_map[name]) {
		        _map[name] = {
		            'name': name,
		            'owner': this,
		            'value': value
		        }
	        }
	        
	       	if (!dontNotify) {
		        var parent = name.split('.');
		        var propName = parent[parent.length-1];
		        parent = parent.slice(0,parent.length-1).join('.');
		        parent = Core.resolveChain(parent, this);
	       		// Define Setter
		        parent.__defineSetter__(propName, function(val) {
		            var obj = _map[name];
		            obj.propName = propName;
		            obj.value = val;
		            var callList = obj['callbackList'];
		            if (callList && callList.length) {
		            	var len = callList.length;
		            	for (var i = 0; i < len; i++) {
		            		var call = callList[i];
		            		call.callback.apply(call.context, [obj]);
		            	}
		            }
		        });
		        // Define Getter
		        parent.__defineGetter__(propName, function() {
		            return _map[name].value;
		        });
	       	}
	       	return _map[name];
	    }

	    /**
	    *	this.observe(propName, callback);
	    *	this.observe(externalClass, propName, callback);
	    **/
	    this.observe = function() {
	    	var context, name, callback;
			if (arguments.length == 2) {
				context = this;
				name = arguments[0];
				callback = arguments[1];
			}
			else if (arguments.length == 3) {
				context =  arguments[0];
				name = arguments[1];
				callback = arguments[2];
			}
	        var obj = context.observable(name, true);      
			// Add Callback
	        if (callback) {
		        if (!obj.callbackList) {
		        	obj.callbackList = [];	
		       	}
		        obj.callbackList.push({
		        	'callback': callback,
		        	'context' : this
		       	});
	       	}
	        //console.log(this.name.toUpperCase(),"sta osservando", context.name+'.'+name);
	    }
	}
});