//TODO distinguere componenti implementabili da componenti istanziabili

Refuel.define('BasicModule', {require: ['Template', 'DataSource'], inherits: 'Updater'}, 
    function BasicModule() {
        var self = this;

        var actionMap = {};
        this.config = {};
        
        this.init = function(myConfig) {
            this.config = Refuel.mix(this.config, myConfig);
            this.dataSource = Refuel.createInstance('DataSource');  
            this.template = Refuel.createInstance('Template', {root: this.config.root});
            
            this.defineUpdateManager(oa_update);
            this.template.subscribe('genericBinderEvent', genericEventHandler);
            this.template.subscribe('_set_autoupdate', autoupdateOnSymbol);
        }

        //TODO eventizzare
        function genericEventHandler(e) {
            var action = actionMap[e.linkedTo];
            if (!action) {
                console.error("No Callback defined for",e.linkedTo, 'on', self.name, 'inside', actionMap);
            }
            else {
                //TODO questa è moooolto fragile, e se uno scrive minchiate:add? 
                if (e.options) 
                    action.callback.call(action.context.items[e.options], e);
                else 
                    action.callback.call(action.context, e);
            }
        }

        /**
            called by the template (via event) when something has an option: autoupdate
        **/
        function autoupdateOnSymbol(e) {
            //TODO enableAutoUpdate dev'essere fatto solo un DS vero della sottoclasse
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

        this.draw = function() {
			this.template.render(self.dataSource.getData());

        }
        //TODO perchè defineUpdateManager lavora solo sugli ObsArray?
        this.defineUpdateManager = function(callback) {
            this.unsubscribe('_oa_update');
            this.subscribe('_oa_update', callback);  
        }

        this.defineAction = function(name, callback) {
            actionMap[name] = {context: this, callback: callback};
        }
});
