define(function() {
    var moduleMap = {};
    /**
    *   cWhore structure is { inherits: (string), requires: [(string)] }
    *   cInheritBody always is the class define by inherits property
    *  
    **/
    function implement(interface, target) {
        interface.apply(target); //arguments   
    }

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

    function isArray(target) {
        return toString.call(target) === '[object Array]';
    }
    function argumentsToArray(args){
        return Array.prototype.slice.call(args);
    }

    return {
        implement: implement
    }


});