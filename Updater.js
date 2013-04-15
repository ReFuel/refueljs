
//TODO rename in Observer and option in 'observe'
//XXX capire quando viene usato il value registrato nell'oggetto
Refuel.define('Updater',{require: ['ObservableArray'], inherits: 'Events'}, 
	function Updater() {
    	if (this.observe) return;
		var mountpoint, label;
		var _map = {};
		
	    this.getObservers = function() {
	        return _map;
	    }
	    this.enableAutoUpdate = function(mpDataSource, moduleLabel) {
	    	mountpoint = mpDataSource;
	    	label = moduleLabel;
	    }

	    function makeObservable(name, value, parent) {  
	        // Create object in map
        	var path = name.split('.');
	        var propName = path[path.length-1];

	        if (!parent) {
		        path = path.slice(0,path.length-1).join('.');
	        }
	      
	        var resolvedData = Refuel.resolveChain(name, mountpoint, true);
	        value = resolvedData.value;
	        parent = resolvedData.parent;
			if (Refuel.refuelClass(parent) == 'DataSource') {
				parent =  parent.getData();
			}

	        //Observe an Array
	        /**
				@param parent is often some data inside DataSource
				@param propName is the name of the property to bind inside the parent
			**/			
	        if (Refuel.isArray(value)) {
				parent[propName] =  value = Refuel.createInstance('ObservableArray', {'value': value});
				makeObservable.call(this, name);
			}
			//Observe (an already) ObservableArray
			else if (Refuel.refuelClass(value) == 'ObservableArray') {
				parent[propName].subscribe('_oa_update', function(e) {
					e.observer = _map[name];
					this.notify('_oa_update', e);
			   	}, this);
			}
			
			//Observe data inside a DataSource
			//Observe an Object
			else {
				Object.defineProperty(parent, propName, {
				    configurable: true,
					set: function(val) {
			            _map[name].value = val;
			            notifyChange(_map[name]);
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
	        var obj = _map[name];
	        if (!obj) obj = makeObservable.call(this, name);

			// Add Callback
	        if (callback) {
	        	if(!obj.callbackList) obj.callbackList = [];
		        obj.callbackList.push({
		        	'callback': callback,
		        	'context' : this,
		        	'params'  : data
		       	});
	       	}
	       	return obj;
	    }
});

