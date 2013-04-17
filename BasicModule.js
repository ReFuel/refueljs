//TODO distinguere componenti implementabili da componenti istanziabili

Refuel.define('BasicModule', {require: ['Template', 'DataSource'], inherits: 'Updater'}, 
    function BasicModule() {
        var actionMap = {};
        var config = {};

        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
            this.items = [];

            this.dataSource = Refuel.refuelClass(config.data) == 'DataSource' ? config.data : 
                              Refuel.newModule('DataSource');
                              
            this.template = Refuel.newModule('Template', {root: config.root});
            this.defineUpdateManager(oa_update.bind(this));
            this.template.subscribe('genericBinderEvent', genericEventHandler, this);
            this.template.subscribe('_set_autoupdate', observeTemplateSymbol, this);

            
        }
        //TODO eventizzare

        function genericEventHandler(e) {    
            var action = actionMap[e.linkedTo];
            if (action) {
                var context = e.options ? action.context.items[e.options] : action.context;
                if (!e.module) e.module = context; 
                action.callback.call(context, e);
            }
            else {
            	this.notify('unhandledAction', e);
            }
        }

        /**
            called by the template (via event) when something has an option: autoupdate
        **/
        function observeTemplateSymbol(e) {
            this.enableAutoUpdate(this.dataSource.getData()); //FIXME not generic
            //TODO levare i parametri passati all'observe
            var obs = this.observe(e.symbol.linkedTo, e.symbol, 
                function(observable, tmplSymbol) {
                    this.template.renderSymbol(tmplSymbol, this.dataSource.getData());
                    this.notify('observableChange', {'observable': observable}, true);
                }
            );
        }

        this.addModule = function(module) {
        	if (module.dataLabel) this.items[module.dataLabel] = module;
        	else 			 this.items.push(module);

            module.subscribe('observableChange', function(e) {
                this.notify('observableChange', e);
            }, this);

            module.subscribe('unhandledAction', function(e) {
                if (!e.module) e.module = module; //keeps only the original module inside the event data
                genericEventHandler.call(this, e);
            }, this);
        }
        
        function oa_update(e) {
            //console.log('BasicModule','update ->',e);      
        }

        this.draw = function(data) {
            data = data || this.dataSource.getData();
            this.template.render(data);
        }

        this.defineUpdateManager = function(callback) {
            this.unsubscribe('_oa_update');
            this.subscribe('_oa_update', callback);  
        }

        this.defineAction = function(name, callback) {
            actionMap[name] = {context: this, callback: callback};
        }

        this.querySelector = function(query) {
            return this.template.getRoot().querySelector(query);
        } 

        this.toggleClass = function(classname, value) {
            var root = this.template.getRoot();
            if (value === undefined) {
                root.classList.toggle(classname);
            }
            else {
                if (value) root.classList.add(classname);
                else root.classList.remove(classname);
            }
        } 
        this.saveData = function() {
            this.dataSource.save();
        }

        this.data = function(prop, value) {
            if (!prop && !value) {
                console.error('No parameters in '+this+'.data');
                return undefined;
            }
            var data = this.dataSource.getData()[prop];
            
            if (typeof(value) === 'undefined') {
                return data;
            }
            else {
                if (Refuel.isArray(data)) {
                    console.error('Setting an Array in '+this+'.data');
                    return undefined;
                }
                this.dataSource.getData()[prop] = value;
            }
        }

});
