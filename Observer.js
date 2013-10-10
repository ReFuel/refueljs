/**
*   @class Observer
*
*	@fires _oa_update ObservableArray change event
*   @author Stefano Sergio
*/
//TODO rename in Observer and option in 'observe'
Refuel.define('Observer',{require: ['ObservableArray'], inherits: 'Events'}, 
	function Observer() {
    	if (this.observe) return;
		var mountpoint, label;
		var _map = {};
		
	    this.getObservers = function() {
	        return _map;
	    }
	    this.clearObservers = function() {
	    	_map = {};
	    }
	    this.enableAutoUpdate = function(mpDataSource) {
	    	mountpoint = mpDataSource;
	    }

	    function makeObservable(name, value, parent) {  
	        if (name && name != '.') {
				var path = name.split('.');
				var propName = path[path.length-1];
				var resolvedData = Refuel.resolveChain(name, mountpoint, true);
					value = resolvedData.value;
		        	parent = resolvedData.parent;
			}
			else {
	        	parent = this.dataSource; // facciamo mountpoint = ds?
			}
			
			//XXX if _map = {} doesnt work the second time you rebind
			if (Refuel.refuelClass(parent) == 'DataSource') {
				value = parent.data;
				propName = 'data';
			}
			
			//console.log('makeObservable(resolved):',name);
			//Observe an Array
	        if (value && Refuel.isArray(value)) {
				parent[propName] = Refuel.createInstance('ObservableArray', {'value': value});
				makeObservable.call(this, name);
			}
			//Observe (an already) ObservableArray
			else if (value && Refuel.refuelClass(value) == 'ObservableArray') {
				parent[propName].subscribe('_oa_update', function(e) {
					e.observer = _map[name];
					this.notify('_oa_update', e);
			   	}, this);
			}
			//Observe an Object
			else {
				Object.defineProperty(parent, propName, {
				    configurable: true,
					set: function(val) {
						//if (_map[name].value !== val) {
				            _map[name].value = val;
				            notifyChange(_map[name]);
						//}
				    },
					get: function() {
			        	return _map[name].value;
				    }
				});
			}
	        _map[name] = {
	            'name': name
	            ,'value': value
	            ,'owner': parent
	        }
			return _map[name];
	    }

	    function notifyChange(obs) {
	    	var callList = obs['callbackList'];
            if (callList && callList.length) {
            	var len = callList.length;
            	for (var i = 0, call; call = callList[i]; i++) {
            		call.callback.call(call.context, obs, call.params);
            	}
            }
		}
 
	    /**
	    *	this.observe(propName, callback);
	    *	this.observe(propName, data, callback);
	    **/
	    this.observe = function(name, data, callback) {
	    	var context = this;
			if (!callback) {
				callback = data;
				data = null;
			}
	    	if (!mountpoint) {
	    		console.error('Before making',name,'observable you should enableAutoUpdate on',name,'or it\'s parent');
	    		return;
	    	} 
	    	
	    	//XXX shouldnt re-make an already observed property, only add callbacks
	    	//but doing this causes the need to reset _map when  re-rendering
	    	var callbackList = (_map[name] && _map[name].callbackList) ? _map[name].callbackList : [];

	        var obj = makeObservable.call(this, name);	        
	        obj.callbackList = callbackList;
	        _map[name] = obj;

	        // Add Callback
	        if (callback) {
	        	obj.callbackList.push({
		        	'callback': callback,
		        	'context' : this,
		        	'params'  : data
		       	});
	       	}
	       	return obj;
	    }
});

