(function() {
	window.Refuel = {};
	var classMap = {};

	Refuel.classMap = classMap;
	  
	function argumentsToArray(args){
		return Array.prototype.slice.call(args);
	}

	Refuel.mix = function(base, argumenting) {
		var res = Refuel.clone(base);
		for (var prop in argumenting) {
			res[prop] = argumenting[prop];
		}
		return res;
	}

	Refuel.implement = function(interface, target, options) {
		target.constructor = target;
		interface.apply(target);
	}

	Refuel.isArray = function(target) {
		return toString.call(target) === '[object Array]';
	}
	Refuel.isFunction = function(target) {
		return toString.call(target) === '[object Function]';
	}
	Refuel.isUndefined = function(target) {
		return typeof(target) === 'undefined';
	}
	
	Refuel.clone = function(old) {
		var obj = {};
		for (var i in old) {
			if (old.hasOwnProperty(i)) {
				obj[i] = old[i];
			}
		}
		return obj;
	}
	
	Refuel.resolveChain = function(path, data) {
		var extractedData = data;
		if (path && path != '.' && path != '') {
			var dataPath = path.split('.');
			for (var c in dataPath) {
				extractedData = extractedData[dataPath[c]];
			}
		}
		return extractedData;
	}

	Refuel.createInstance = function (className, initObj) {
	    var cl = classMap[className];
	    if(typeof cl === 'undefined') throw className+" not defined, please use Refuel.define";

	    var instance;
	    var F = cl.body;
	    //console.log('createInstance', className, '<-', cl.inherits);
	    if (cl.inherits) {
	    	if (!classMap[cl.inherits]) throw cl.inherits+" not defined, please use Refuel.define"  
	        F.prototype = Refuel.createInstance(cl.inherits, initObj);
	    }
	    instance = new F(initObj);    
	   	instance._refuelClassName = className;
	    if (instance.hasOwnProperty('init')) {
	    	instance.init(initObj);
	    } 
	    return instance;

	}

	Refuel.define = function(className, req, body) {
	    if(classMap[className] !== undefined) {
	        console.error(className," alredy defined!");
	        return;
	    }
	    if(body === undefined) {
	        body = req;
	    }
	    //console.log( 'defineClass',className, req);
	    var requirements = [];
	    requirements = requirements.concat(req.require, req.inherits);
	    requirements = requirements.filter(function(c){
	        if (c !== undefined) return true;
	        else return false;
	    });

	    define(className, requirements, function() {
	        //console.log('defineClass.define', className,'->', require);
	        classMap[className] = {
	            body: body,
	            inherits: req.inherits
	        };
	    });
	}
	
	var head = document.querySelector('head');
	var script = head.querySelector("script[data-rf-startup]"); 
	var node = document.createElement('script');
	var startupModule = script.getAttribute('data-rf-startup');
    node.type = 'text/javascript';
    node.charset = 'utf-8';
    node.async = true;
	node.addEventListener('load', onScriptLoad, false);
	node.src = 'require.js';
	head.appendChild(node);

	function onScriptLoad(e) {
		if(e.type === 'load') {
			console.log(node.src, 'loaded!');
			e.target.parentNode.removeChild(e.target);
			require.config({
            	baseUrl: ".",
            	paths: {
            		"hammer.js": ".",
            		"path.js": "."
            	}
          	});
          	startupRequirements = [startupModule, 'hammer.js', 'path.js'];
			require(startupRequirements, function(start) {
				Path.listen();
				classMap[startupModule].body();
			});
		}

	}

  	console.log('refuel.js loaded',script);

})()
