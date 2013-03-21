//TODO distinguere componenti implementabili da componenti istanziabili

define(['Core', 'Template', 'Events', 'Updater', 'DataSource'], function(Core, Template, Events, Updater, DataSource) {
    return function AbstractModule() {
        this.name = 'AbstractModule';
        var self = this;
        Core.implement(Events, this);
        Core.implement(Updater, this);
        
        this.dataSource = new DataSource();        
        this.template = new Template();
        this.enableAutoUpdate(this.dataSource.data);
        
        //TODO eventizzare
        this.genericEventHandler = function(e) {
            if (!self[e.method]) 
                console.error("No Callback defined for",e.method, 'on',self.name);
            else 
                self[e.method].call(self, e);
        }

        /**
            @param e Template symbol
        **/
        function autoupdateOnSymbol(e) {
            self.enableAutoUpdate(self.dataSource.data);
            self.observe(e.symbol.linkedTo, e.symbol, 
                function(observable) {
                    self.template.renderSymbol(observable.data, self.dataSource.data);
                }
            );
        }
        
        this.oa_update = function(e) {
            console.log(self.name,'update ->',e);      
            self.template.updateSymbol(e.action, e.symbol.data, e.data);
        }
        

        this.render = function() {
            this.template.render(self.dataSource.data);
        }

        this.template.subscribe('genericBinderEvent', this.genericEventHandler);
        this.template.subscribe('_set_autoupdate', autoupdateOnSymbol);
        this.subscribe('_oa_update', this.oa_update);
    }
});
