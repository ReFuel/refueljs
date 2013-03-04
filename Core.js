var moduleMap = [];
requirejs.config({
    enforceDefine: true
});

function defineModule(cName, cParent, cBody) {
    define(cName, [cParent], function(cParentBody) {
        if (cParentBody) {
            cParentBody.apply(cBody); //arguments
            cBody.prototype = new cParentBody;
            cBody.prototype.constructor = cBody;
            
        }
        cBody = cBody();
        moduleMap[cName] = {superClass: cParent, body: cBody};
        console.log('moduleMap', moduleMap[cName]);
        return cBody;
    });       
};

function newModule(cName) {
    require([cName], function(cBody) {
        return new cBody();
    });
}

defineModule('BasicModule', 'AbstractModule', function() {
     return function BasicModule(){
        var name = "BasicModule";
        this.publicName = "Basic-Module";
        var length = 0;
        this.setLength = function(n) {
            length = n;
        }
        this.getLength = function(){
            return length;
        }
    }
});

//var mod1 = newModule('BasicModule');
