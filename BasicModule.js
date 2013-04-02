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
            //this.subscribe('unhandledAction', genericEventHandler);
            this.template.subscribe('_set_autoupdate', autoupdateOnSymbol);
        }

        //TODO eventizzare

        function genericEventHandler(e) {
            var action = actionMap[e.linkedTo];
            if (action) {
                //TODO questa è moooolto fragile, e se uno scrive minchiate:add? 
                if (e.options) 
                    action.callback.call(action.context.items[e.options], e);
                else 
                    action.callback.call(action.context, e);
            }
            else {
            	self.notify('unhandledAction', e);
                //console.error("No Callback defined on",self._refuelClassName ,"for",e.linkedTo, 'inside', actionMap);
            }
            
        }

        /**
            called by the template (via event) when something has an option: autoupdate
        **/
        function autoupdateOnSymbol(e) {
            self.enableAutoUpdate(self.dataSource.getData());
            self.observe(e.symbol.linkedTo, e.symbol, 
                function(observable) {
					self.template.renderSymbol(observable.data, self.dataSource.getData());
                }
            );
        }

        this.addItem = function(item) {
        	if (item._label) this.items[item._label] = item;
        	else 			 this.items.push(item);
            item.subscribe('unhandledAction', function(e) {  
                if (!e.item) e.item = item; //keeps only the original item inside the event data
                genericEventHandler(e);
            });
        }
        
        function oa_update(e) {
            console.log('BasicModule','update ->',e);      
        }

        this.draw = function() {
			this.template.render(self.dataSource.getData());
        }
        //XXX perchè UpdateManager lavora solo sugli ObsArray e non anche sugli object?
        this.defineUpdateManager = function(callback) {
            this.unsubscribe('_oa_update');
            this.subscribe('_oa_update', callback);  
        }

        this.defineAction = function(name, callback) {
            actionMap[name] = {context: this, callback: callback};
        }
});
