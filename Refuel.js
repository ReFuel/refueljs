(function() {
	window.Refuel = {};
	var classMap = {};
	
	Refuel.classMap = classMap;
	Refuel.config = Refuel.config || {};

	function argumentsToArray(args){
		return Array.prototype.slice.call(args);
	}

	Refuel.mix = function(base, argumenting) {
		//var res = Refuel.clone(base);
		var res = {};
		for (var prop in base) {
			res[prop] = base[prop];
		}
		for (var prop in argumenting) {
			res[prop] = argumenting[prop];
		}
		return res;
	}


	Refuel.isArray = function(target) {
		return toString.call(target) === '[object Array]';
	}
	Refuel.isUndefined = function(target) {
		return typeof(target) === 'undefined';
	}
	
    Refuel.getCookie = function(name) {
	    var cookieValue = null;
	    if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
		    var cookie = cookies[i].trim();
		    if (cookie.substring(0, name.length + 1) == (name + '=')) {
			cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
			break;
		    }
		}
	    }
	    return cookieValue;
	}

	Refuel.clone = function(obj) {
		if(obj === null || typeof(obj) !== 'object'){
			return obj;
		}
		var temp;
		try {
			temp = obj.constructor(); // changed
		}
		catch(e) {
			//htmlElement returns itself
			return obj;
		}
		
		for(var key in obj){
			temp[key] = Refuel.clone(obj[key]);
		}
		return temp;
	}

	Refuel.refuelClass = function(obj) {
		var res = undefined;
		if (obj && obj._refuelClassName) {
			res = obj._refuelClassName
		}
		return res;
			
	}
	
	Refuel.resolveChain = function(path, data, getParent) {
		var extData = data;
		if (path && path != '.' && path != '') {
			var dataPath = path.split('.');
			var parent;
			for (var i=0, item; item = dataPath[i]; i++) {
				parent = extData;
				if (extData === undefined) {
					console.error(item,'in',path,'from',data,'is undefined');
				}
				extData = extData[item];
				
				while (Refuel.refuelClass(extData) == 'DataSource') {
					parent = extData;
					extData = extData.getData();//[item];
				}

			}
		}
		if (getParent) return {'value': extData, 'parent': parent}
		else return extData;
	}

	Refuel.createInstance = function (className, initObj) {
		var cl = classMap[className];
	    if(typeof cl === 'undefined') {
			throw className + ' not defined, please use Refuel.define';
		}
	    var instance;
	    var F = cl.body;
	    if (!initObj._refuelClassName) initObj._refuelClassName = className;
	    if (cl.inherits) {
	    	if (!classMap[cl.inherits]) {
				throw cl.inherits + ' not defined, please use Refuel.define';
			}
	        F.prototype = Refuel.createInstance(cl.inherits, initObj);
	    }
	    instance = new F(initObj);   
	    //Parent-class keeps child-class className
	   	if (!instance._refuelClassName) {
	   		instance._refuelClassName = initObj._refuelClassName;
	   		delete initObj._refuelClassName;
	    }
	    if (instance.hasOwnProperty('init')) {
	    	instance.init(initObj);
	    } 
	    return instance;

	}
	Refuel.newModule = function (className, initObj) {
		return Refuel.createInstance(className, initObj);
	}

	Refuel.define = function(className, req, body) {
	   	//console.log('define', className);
	    if(classMap[className] !== undefined) {
			throw new TypeError(className + ' alredy defined!');
	        return;
	    }
	    if(body === undefined) {
	        body = req;
	    }

	    var requirements = [];
	    requirements = requirements.concat(req.require, req.inherits);
	    requirements = requirements.filter(function(c){
	        if (c !== undefined) return true;
	        else return false;
	    });
		try{
			define(className, requirements, function() {
				classMap[className] = {
					body: body,
					inherits: req.inherits
				};
			});
		}
		catch(e){
			console.log(e)
		}
	}

	Refuel.static = function(className, body) {
		Refuel[className] = body();
	}
	
 	var head = document.querySelector('head');
 	var script = head.querySelector('script[data-rf-startup]'); 
 	var node = document.createElement('script');
	if (script) {
	 	var startupModule = script.getAttribute('data-rf-startup');
	 	var startupPath = startupModule.split('/');
	 	startupModule = startupPath[startupPath.length-1];
		startupPath = startupPath.slice(0,startupPath.length-1).join('/') || '.';
	 	var path = script.getAttribute('src').split('/');
	 	path = path.slice(0,path.length-1).join('/') || '.';
	}
 
 	if (typeof define == 'undefined') {
     	node.type = 'text/javascript';
     	node.charset = 'utf-8';
     	node.async = true;
 		node.addEventListener('load', onScriptLoad, false);
 		node.src = path+'/lib/require.min.js';
 		head.appendChild(node);
 	}
 	else {
 		startApplication();
 	}


	function onScriptLoad(e) {
		if(e && e.type === 'load') {
			console.log(node.src, 'loaded!');
			e.target.parentNode.removeChild(e.target);
			startApplication();
		}
	}
	function startApplication() {
		var baseConfig = { baseUrl: '', paths: {} };
		if (path) baseConfig.baseUrl = path;
		if (startupModule) baseConfig.paths[startupModule] = location.pathname+startupPath+'/'+startupModule;

		Refuel.config = Refuel.mix(baseConfig, Refuel.config);
      	require.config(Refuel.config);
		startupRequirements = [startupModule];
      	if (!window.Path) startupRequirements.push('lib/path.min');
      	if (!window.Hammer) startupRequirements.push('lib/hammer.min');
      	startupRequirements.push('lib/polyfills.min');
      	require(startupRequirements, function() {
			Path.listen();
			classMap[startupModule].body();
		});
	}
})();

