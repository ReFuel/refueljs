//TODO distinguere componenti implementabili da componenti istanziabili

Refuel.define('BasicModule', {require: ['Template', 'DataSource'], inherits: 'Updater'}, 
    function BasicModule() {
        var self = this;

        var actionMap = {};
        this.name = 'BasicModule';
        this.config = {};
        this.init = function(myConfig) {
            this.config = Refuel.mix(this.config, myConfig);
            this.dataSource = Refuel.createInstance('DataSource');  
            this.template = Refuel.createInstance('Template', {root: this.config.root});
            
            //console.log('BasicModule.init',this.config.root);
            this.enableAutoUpdate(this.dataSource.data);     
            this.defineUpdateManager(oa_update);
            this.template.subscribe('genericBinderEvent', genericEventHandler);
            this.template.subscribe('_set_autoupdate', autoupdateOnSymbol);
        }

        //TODO eventizzare
        function genericEventHandler(e) {
            var action = actionMap[e.action];
            if (!action)
                console.error("No Callback defined for",e.action, 'on', self.name, 'inside', actionMap);
            else 
                action.callback.call(action.context, e);
        }


        /**
            @param e Template symbol
        **/
        
        function autoupdateOnSymbol(e) {
            self.enableAutoUpdate(self.dataSource.getData());
            self.observe(e.symbol.linkedTo, e.symbol, 
                function(observable) {
					self.template.renderSymbol(observable.data, self.dataSource.getData());
                }
            );
        }
        
        function oa_update(e) {
            console.log('BasicModule','update ->',e);      
        }
<<<<<<< HEAD
        
        this.render = function() {
			this.template.render(self.dataSource.getData());
=======


        this.draw = function() {
            this.template.render(this.dataSource.data);
>>>>>>> 13ff27c45832cc20f7c590d09723f43eb03b5534
        }

        this.defineUpdateManager = function(callback) {
            this.unsubscribe('_oa_update');
            this.subscribe('_oa_update', callback);  
        };

        this.defineAction = function(name, callback) {
            actionMap[name] = {context: this, callback: callback};
        }

       
});
