var moduleMap = [];
requirejs.config({
    enforceDefine: true
});

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
    console.log('defineModule.requireList',cName, requireList);

    //var requires = [];
    /*
    if (typeof(cWhore) === 'object' && )*/
  /*  else if (typeof(cWhore) === 'array')
*/

    define(cName, requireList, function(cInheritBody) {
        //debugger;
        console.log('defineModule.deps shiftato',cName, arguments);
        var deps = argumentsToArray(arguments);
        deps.shift();
        cBody = cBody.apply(this, deps);
        if (cInheritBody) {
            cInheritBody.apply(cBody); //arguments
            cBody.prototype = new cInheritBody;
            cBody.prototype.constructor = cBody;
        }
        moduleMap[cName] = {superClass: cWhore, body: cBody};
        return cBody;
    });       
};

function newModule(module) {


    if (typeof(module) === 'string' && moduleMap[module]){
        return new moduleMap[module].body(); 
    } else if (typeof(module) === 'function') {
        return new module();
    } else {
        console.error('ReFuel::Module '+module+' must be defined');
    }
    //require([cName], function(cBody) {
    //});
}

function isArray(target) {
    return toString.call(target) === '[object Array]';
}
function argumentsToArray(args){
    return Array.prototype.slice.call(args);
}
