//TODO distinguere componenti implementabili da componenti istanziabili

define(['Core', 'Template', 'Events', 'Updater', 'DataSource'], function(Core, Template, Events, Updater, DataSource) {
    return function AbstractModule() {
        var self = this;
        Core.implement(Events, this);
        Core.implement(Updater, this);
        this.dataSource = new DataSource();        
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
                    console.log('AUTOUPDATE!!',observable);
                    self.template.renderSymbol(observable.data, self.dataSource.data);
                }
            );
        }
        //magari trasformiamo in updateCallback
        this.update = function(e) {
            console.log('update ->',e, self.dataSource.data);
            self.template.renderSymbol(e.symbol.data, self.dataSource.data);

        }
        this.parse = function(root) {
            this.template.setRoot(document.querySelector(root));
            this.template.parser();
        }
        this.render = function() {
            this.template.render(self.dataSource.data);
        }

        this.template.subscribe('genericBinderEvent', this.genericEventHandler);
        this.template.subscribe('_autoupdate', this.autoupdate);
        this.subscribe('_update', this.update);
    }
});
