//TODO Template e Datasource come pezzi fondamentali quindi con una loro set/get?

define(['Core', 'Template', 'Events', 'Updater'], function(Core, Template, Events, Updater) {
    return function AbstractModule() {
        var self = this;

        Core.implement(Events, this);
        Core.implement(Updater, this);
        
        this.template = new Template();
        

        this.genericEventHandler = function(e) {
            //console.log('genericEventHandler', e);
            if (!self[e.method]) 
                console.error("No Callback defined for",e.method);
            else 
                self[e.method].call(self, e);
        }
        this.autoupdate = function(e) {
            self.observe(e.symbol.linkedTo, e.symbol, 
                function(observable) {
                    console.log('UPDATE!!',observable);
                    self.template.renderSymbol(observable.data, this.dataSource);
                }
            );
            console.log('autoupdate',self.getObservers());
        }
        this.parse = function(root){
            this.template.setRoot(document.querySelector(root));
            this.template.parser();
        }
        this.render = function(data){
            this.template.render(data);
        }

        this.template.subscribe('genericBinderEvent', this.genericEventHandler);
        this.template.subscribe('_autoupdate', this.autoupdate);
    }
});
