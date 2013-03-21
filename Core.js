define(function() {
    var modules = {};
    function argumentsToArray(args){
        return Array.prototype.slice.call(args);
    }
    /*
    function implement(interface, target) {
        var obj = new interface();
        //console.log('implement',target,obj);
        for (l in obj) {
            if (typeof target[l] === 'undefined') {
                var prop = obj[l];
                //console.log(l, typeof prop);
                //if (typeof prop !== 'function') 
                    target[l] = prop; 
                //if (typeof prop === 'function') prop.apply(target); 
                
            }
                
        }
    }
    */
    function implement(interface, target) {
        interface.apply(target);
    }
    
    function isArray(target) {
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
    function resolveChain(path, data) {
        var extractedData = data;
        if (path && path != '.' && path != '') {
            var dataPath = path.split('.');
            for (var c in dataPath) {
                extractedData = extractedData[dataPath[c]];
            }
        }
        return extractedData;
    }

    function defineModule(name, inherits, body) {
        modules[name] = {body: body, inherits: inherits};
        define(inherits, body);


        //define(['Core', 'Template', 'Events', 'Updater', 'DataSource'], function(Core, Template, Events, Updater, DataSource) {
    }
    function newModule(name) {

    }

    return {
        implement: implement,
        clone: clone,
        isArray: isArray,
        resolveChain: resolveChain,
        defineModule: defineModule,
        newModule: newModule
    }

});
