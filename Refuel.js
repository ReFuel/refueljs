(function() {
	window.Refuel = {};
	var classMap = {};
	  
	function argumentsToArray(args){
		return Array.prototype.slice.call(args);
	}

	Refuel.implement = function(interface, target, options) {
		target.constructor = target;
		interface.apply(target);
	}

	Refuel.isArray = function(target) {
		return toString.call(target) === '[object Array]';
	}
	
	function clone(old) {
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
	    if(typeof cl === 'undefined') throw className+" not declared, please use defineModule!";
	    var instance;
	    var F = cl.body;
	    if (cl.inherits) {
	        F.prototype = new classMap[cl.inherits].body();
	        cl.body.apply(instance);
	    }
	    instance = new F();    
	    return instance;
	}

	Refuel.defineClass = function(className, req, body) {
	    if(classMap[className] !== undefined) {
	        console.error(className," alredy defined!");
	        return;
	    }
	    if(body === undefined) {
	        body = req;
	    }
	    //console.log( 'defineClass',className, req);
	    var require = [];
	    require = require.concat(req.require, req.inherits);
	    require = require.filter(function(c){
	        if (c !== undefined) return true;
	        else return false;
	    });

	    define(className, require, function() {
	        console.log('defineClass.define', className,'->', require);
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
			console.log(node.src, 'loaded!',e);
			e.target.parentNode.removeChild(e.target);
			require([startupModule], function() {});
		}

	}

  	console.log('refuel.js loaded',script);

})()
