//TODO distinguere componenti implementabili da componenti istanziabili

define(['Template', 'Events', 'Updater', 'DataSource'], function(Template, Events, Updater, DataSource) {
    return function BasicModule() {
        this.name = 'BasicModule';
        var self = this;
        Refuel.implement(Events, this);
        Refuel.implement(Updater, this);
        
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
        
        function oa_update(e) {
            console.log('BasicModule','update ->',e);      
        }
        
        this.render = function() {
            this.template.render(self.dataSource.data);
        }

        this.defineUpdateManager = function(callback) {
            this.unsubscribe('_oa_update');
            this.subscribe('_oa_update', callback);  
        };

        this.template.subscribe('genericBinderEvent', self.genericEventHandler);
        this.template.subscribe('_set_autoupdate', autoupdateOnSymbol);
        this.defineUpdateManager(oa_update);
    }
});
