
//TODO rename in Observer and option in "observe"

Refuel.define('Updater',{require: ['ObservableArray'], inherits: 'Events'}, 
	function Updater() {
    	if (this.observe) return;
		var self = this;
		var mountpoint, label;
		var _map = {};
		
	    this.getObservers = function() {
	        return _map;
	    }
	    this.enableAutoUpdate = function(mpDataSource, moduleLabel) {
	    	mountpoint = mpDataSource;
	    	label = moduleLabel;
	    }

	    function makeObservable(name, value) {
	        
	        // Create object in map
	        if (!_map[name]) {
		        _map[name] = {
		            'name': name,
		            'owner': mountpoint, 
		            'value': value
		        }
	        }

	        var parent = name.split('.');
	        var propName = parent[parent.length-1];
	        parent = parent.slice(0,parent.length-1).join('.');
	        parent = Refuel.resolveChain(parent, mountpoint);
	        if (Refuel.isArray(value)) {
		        /**
					@param parent is often some data inside DataSource
					@param propName is the name of the property to bind inside the parent
				**/
				parent[propName] = Refuel.createInstance('ObservableArray', {'value': value});
				parent[propName].subscribe('_oa_update', function(e) {
					e.observer = _map[name];
					self.notify('_oa_update', e);
			   	});

			} 
			else if (value._refuelClassName && value._refuelClassName == 'ObservableArray') {
				parent[propName].subscribe('_oa_update', function(e) {
					e.observer = _map[name];
					self.notify('_oa_update', e);
			   	});
			}
			else {
				Object.defineProperty(parent, propName, {
				    configurable: true,
					set: function(val) {
			            var obj = _map[name];
			            obj.propName = propName;
			            obj.value = val;
			            var callList = obj['callbackList'];
			            if (callList && callList.length) {

			            	var len = callList.length;
			            	for (var i = 0, call; call = callList[i]; i++) {
			            		call.callback.call(call.context, obj, call.params);
			            	}
			            }
				    },
					get: function() {
				        return _map[name].value;
				    }
				});
			}
	       	return _map[name];
	    }

	    /**
	    *	this.observe(propName, callback);
	    *	this.observe(propName, data, callback);
	    **/
	    this.observe = function(name, data, callback) {
	    	//if (name == 'text') console.log('observe',name, data);
	    	var context = this;
			if (!callback) {
				callback = data;
				data = null;
			}
	    	if (!mountpoint) {
	    		console.error('Before making',name,'observable you should enableAutoUpdate on',name,'or it\'s parent');
	    		return;
	    	} 
	    	var value = Refuel.resolveChain(name, mountpoint);
	        if (Refuel.isUndefined(value)) return;
	        var obj = makeObservable(name, value);      
			
			// Add Callback
	        if (callback) {
		        if (!obj.callbackList) {
		        	obj.callbackList = [];
		       	}
		        obj.callbackList.push({
		        	'callback': callback,
		        	'context' : this,
		        	'params'  : data
		       	});
	       	}
	    }
});

