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
				extData = extData[item];
				
				while (Refuel.refuelClass(extData) == 'DataSource') {
					parent = extData;
					extData = extData.getData()[item];
				}
			}
		}
		if (getParent) return {'value': extData, 'parent': parent}
		else return extData;
	}

	Refuel.createInstance = function (className, initObj) {
	    var cl = classMap[className];
	    if(typeof cl === 'undefined') throw className+' not defined, please use Refuel.define';

	    var instance;
	    var F = cl.body;
	    if (cl.inherits) {
	    	if (!classMap[cl.inherits]) throw cl.inherits+' not defined, please use Refuel.define'  
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
	        console.error(className,' alredy defined!');
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

        classMap[className] = {
            body: body,
            inherits: req.inherits
        };
	    define(className, requirements, function() {
	   		console.log('define', className);
	    });
	}

	Refuel.static = function(className, body) {
		Refuel[className] = body();
	}
	
	var head = document.querySelector('head');
	var script = head.querySelector('script[data-rf-startup]'); 
	var node = document.createElement('script');
	var startupModule = script.getAttribute('data-rf-startup');
	var path = script.getAttribute('src').split('/');
	path = path.slice(0,path.length-1).join('/') || '.';


    node.type = 'text/javascript';
    node.charset = 'utf-8';
    node.async = true;
	node.addEventListener('load', onScriptLoad, false);
	node.src = path+'/require.js';
	head.appendChild(node);


	//Il nome del file linkato è con JS in modo da rendere chiaro il riferimento al path ./
	//ma se il nome del file è quello poi noi lo cerchiamo così nella startupModule
	function onScriptLoad(e) {
		if(e.type === 'load') {
			console.log(node.src, 'loaded!');
			e.target.parentNode.removeChild(e.target);
			
			require.config({
            	baseUrl: path,
            	paths: {
            		//'hammer': path+'/hammer',
            		//'path' : path+'/path'
            	}
          	});
			
          	startupRequirements = [startupModule, 'hammer', 'path'];
          	require(startupRequirements, function(start) {
				Path.listen();
				//At this phase there will always be only one module defined: the startup one
				for (var cl in classMap) {
					try {
						classMap[cl].body();
					}
					catch(e) {
						throw 'Refuel startup failed - Cannot find \'Refuel.define\' declaration in '+cl;
					}
				}
			
			});
		}

	}


})();

