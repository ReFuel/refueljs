//TODO Rename in BasicModule?
define(['Core', 'Events'], function(Core, Events) {
    return function Updater() {
    	if (this.observe) return;
		var self = this;
		var _map = {};
	    this.getObservers = function() {
	        return _map;
	    }
	    this.getObservable = function(name) {
	    	return _map[name];
	    }

	    function makeObservable(name) {
	        var value = Core.resolveChain(name, self);
	        // Create object in map
	        if (!_map[name]) {
		        _map[name] = {
		            'name': name,
		            'owner': self,
		            'value': value
		        }
	        }
	        var parent = name.split('.');
	        var propName = parent[parent.length-1];
	        parent = parent.slice(0,parent.length-1).join('.');
	        parent = Core.resolveChain(parent, self);
       		// Define Setter
	        parent.__defineSetter__(propName, function(val) {
	            var obj = _map[name];
	            obj.propName = propName;
	            obj.value = val;
	            var callList = obj['callbackList'];
	            if (callList && callList.length) {
	            	var len = callList.length;
	            	for (var i = 0, call; call = callList[i]; i++) {
	            		call.callback.call(call.context, obj);
	            	}
	            }
	        });
	        // Define Getter
	        parent.__defineGetter__(propName, function() {
	            return _map[name].value;
	        });
	       	
	       	return _map[name];
	    }
	    
	    /**
	    *	this.observe(propName, callback);
	    *	this.observe(propName, data, callback);
	    **/
	    this.observe = function() {
	    	var context, name, callback, data;
			context = this;
			name = arguments[0];
			if (arguments.length == 2) {
				callback = arguments[1];
			}
			else if (arguments.length == 3) {
				data = arguments[1];
				callback = arguments[2];
			}
	        //var obj = context.observable(name);      
	        var obj = makeObservable(name);      
			// Add Callback
			obj.data = data;
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

/**
	METODO 1: Al parsing dei symbol di replace viene controllato se sono "observable", in tal caso si aggancia 
	un observe di quella variabile e si rifà il rendering di quel "symbol" ad ogni evento change della variabile
	+ è più veloce e lineare
	- bisogna definire prima del parsing cosa è osservabile... o in alternativa lo è sempre tutto 
	
	METODO 2: Quando si definisce observable una variabile accade che al suo "change" vengano presi dalla symbolTable del 
	tmpl i simboli associati e ri-renderizzati.
	+ possiamo definire osservabile un dato a runtime
	- è più lento e potrebbe essere un problema con i dati degli elementi di una lista

**/