//{requires: 'Template', inherits: 'Template'},
defineModule('AbstractModule', {requires: 'Template'}, function(template) {
    return function AbstractModule () {
        var self = this;
        this.template = template;
        
        this.events.subscribe('myEvent', function(e) {
            console.log('myEvent ->',e);
            //e.notifier.draw();
            //  e.notifier == instance of component
        });
        
        //
        //var root = document.querySelector("#todoapp");
        //DOMParser(root);
        //var dom = getSymbolTable(); 
        //templateBinder(root, dom);
        //var template = new
        //
        this.parse = function(root){
            //template.DOMParser(document.querySelector(root));
        }

        this.genericEventHandler = function(e) {
            self[e.method].call(self, e);
        }
        //template.events.subscribe('genericBinderEvent', this.genericEventHandler);

    }
});


