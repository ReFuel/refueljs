define(function() {
    
    function argumentsToArray(args){
        return Array.prototype.slice.call(args);
    }
    
    function implement(interface, target) {
        interface.apply(target); //arguments   
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

    return {
        implement: implement,
        clone: clone,
        isArray: isArray,
        resolveChain: resolveChain
    }

});