define('AbstractModule', ['Core', 'Template', 'Events'], function(Core, Template, Events) {
    return function AbstractModule() {
        var self = this;
        Core.implement(Events, this);
        this.template = new Template(); //Deve stare in Abstract, fa parte dell'interface?
        
        this.genericEventHandler = function(e) {
            console.log('genericEventHandler', e);
            self[e.method].call(self, e);
        }
        this.parse = function(root){
            this.template.setRoot(document.querySelector(root));
            this.template.parser();
        }

        this.template.subscribe('genericBinderEvent', this.genericEventHandler);
    }
});
