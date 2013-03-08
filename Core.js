var moduleMap = {};
var classIndex = 0;
/**
*   cWhore structure is { inherits: (string), requires: [(string)] }
*   cInheritBody always is the class define by inherits property
*   
**/
function defineModule(cName, cWhore, cBody) {
    requireList = cWhore;
    if (!isArray(cWhore)) {
        requireList = [].concat(cWhore.inherits, cWhore.requires);
    }
    define(cName, requireList, function(cInheritBody) {
        var dependencyList = argumentsToArray(arguments);
        dependencyList.shift();
        var depLen = dependencyList.length;

        var events = new Events();

        for (var i = 0; i < depLen; i++) {
            var dep = dependencyList[i];
            if (dep) dependencyList[i] = dep = dep();
            dep.events = events;
        }
        cBody = cBody.apply(this, dependencyList);

        // TODO: Gianni!
        cBody.events = cBody.prototype.events = events;
        
        if (cWhore.inherits) {
            cInheritBody.apply(cBody, dependencyList); //arguments
            cBody.prototype = new cInheritBody();
            cBody.prototype.constructor = cBody;
        }

        console.log(cName, cBody.events);
        moduleMap[cName] = {superClass: cWhore, body: cBody};
        return cBody;
    });       
};

function newModule(module, options) {
    console.log("newmodule", module, options);
    if (typeof(module) === 'string' && moduleMap[module]){
        return new moduleMap[module].body(options); 
    } else {
        console.error('ReFuel::Module '+module+' must be defined');
    }
}

function isArray(target) {
    return toString.call(target) === '[object Array]';
}
function argumentsToArray(args){
    return Array.prototype.slice.call(args);
}

function getRefFromObject(target) {
    for (var inst in moduleMap) {
        if (target === inst.body) return inst.refId;
    }
}


function Events() {
    var onGoingNotification = {};

    function notify(name, data){
        if (!name || typeof(name)!=='string'){
            throw new TypeError("Invalid event name '" + name);
        }
        if (!data || typeof(data)!=='object'){
            throw new TypeError("Invalid event data '" + data);
        }

        if (onGoingNotification[name] instanceof Array) {
            var listeners = [].concat(onGoingNotification[name]);
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(this, data);
            }
        }
    }

    function subscribe(name, handler){
        if (!name || typeof(name)!=='string'){
            throw new TypeError("Invalid event name '" + name);
        }
        if (!handler || typeof(handler)!=='function'){
            throw new TypeError("Invalid event handler '" + handler);
        }

        if (typeof onGoingNotification[name] === "undefined") {
            onGoingNotification[name] = [];
        }
        onGoingNotification[name].push(handler);
    }   
    return {
        onGoingNotification: onGoingNotification,
        notify: notify,
        subscribe: subscribe
    }
}
