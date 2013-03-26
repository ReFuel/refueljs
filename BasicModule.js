//TODO distinguere componenti implementabili da componenti istanziabili

Refuel.define('BasicModule', {require: ['Template', 'DataSource'], inherits: 'Updater'}, 
    function BasicModule() {
        var self = this;
        this.name = 'BasicModule';
        this.config = {};
        this.init = function(myConfig) {
            this.config = Refuel.mix(this.config, myConfig);
            this.dataSource = Refuel.createInstance('DataSource');  
            this.template = Refuel.createInstance('Template', {root: this.config.root});
            
            //console.log('BasicModule.init',this.config.root);
            this.enableAutoUpdate(this.dataSource.data);     
            this.defineUpdateManager(oa_update);
            this.template.subscribe('genericBinderEvent', self.genericEventHandler);
            this.template.subscribe('_set_autoupdate', autoupdateOnSymbol);
        }

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
        
        this.draw = function() {
            this.template.render(this.dataSource.data);
        }

        this.defineUpdateManager = function(callback) {
            this.unsubscribe('_oa_update');
            this.subscribe('_oa_update', callback);  
        };
       
});
