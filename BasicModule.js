    /**
    *   @class BasicModule
    *   @fires _unhandledAction Fired when an Action is requested on this module but is not defined
    *   @fires observableChange Fired when some data observed by this module changes
    *
    *   @author Stefano Sergio
    */
Refuel.define('BasicModule', {require: ['Template', 'DataSource'], inherits: 'Observer'}, 
    function BasicModule() {
        var actionMap = {};
        /**
        * @type {object}
        * @property {string} dataPath 
        *
        */
        var config = {
            dataPath: '.'
        };

        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
            this.items = [];
            if ( Refuel.refuelClass(config.data) == 'DataSource') {
                this.dataSource = config.data; 
            }else {
                this.dataSource = Refuel.newModule('DataSource');
            }
             
            this.template = Refuel.newModule('Template', config);
            this.defineUpdateManager(oa_update.bind(this));
            this.template.subscribe('genericBinderEvent', genericEventHandler, this);
            this.template.subscribe('_observe', observeTemplateSymbol, this);
        }

        function genericEventHandler(e) {    
            var action = actionMap[e.linkedTo];
            if (action) {
                var context = e.options ? action.context.items[e.options] : action.context;
                if (!e.module) e.module = context; 
                action.callback.call(context, e);
            }
            else {
                this.notify('_unhandledAction', e);
            }
        }

        /**
            called by the template (via event) when something has an option: observe
        **/
        function observeTemplateSymbol(e) {
            this.enableAutoUpdate(this.dataSource.getData(), config.dataLabel); //FIXME not generic
            //TODO levare i parametri passati all'observe
            var path = e.linkedTo;
            var obs = this.observe(path, e.symbol, 
                function(observable, tmplSymbol) {
                    this.template.renderSymbol(tmplSymbol, this.data);
                    this.notify('observableChange', {'observable': observable}, true);
                }
            );
        }

        /**
        *   @memberof BasicModule#addModule
        *   Add a child module. Child module is added in the 'items' collection under the name specified in the template if any.
        *   Otherwise is pushed as array element inside the 'items' collection.
        */ 
        this.addModule = function(module) {
            if (module.dataLabel) this.items[module.dataLabel] = module;
            else             this.items.push(module);

            module.subscribe('observableChange', function(e) {
                this.notify('observableChange', e);
            }, this);

            module.subscribe('_unhandledAction', function(e) {
                if (!e.module) e.module = module; //keeps only the original module inside the event data
                genericEventHandler.call(this, e);
            }, this);
        }
        
        function oa_update(e) {
            //console.log('BasicModule','update ->',e);      
        }

        /**
        *   @method BasicModule#draw
        *   Begin the render of the part of template owned by this module
        *   @param data The data to populate the template with, define this if data are different from the dataSource's data    
        */
        this.draw = function(data) {
            data = data || this.dataSource.getData();
            this.template.render(data);
        }

        /**
        * @method BasicModule#defineUpdateManager
        * @param callback The function that will manage _oa_update event
        */        
        this.defineUpdateManager = function(callback) {
            this.unsubscribe('_oa_update');
            this.subscribe('_oa_update', callback);  
        }
        /**
        * @method BasicModule#defineAction
        */
        this.defineAction = function(name, callback) {
            actionMap[name] = {context: this, callback: callback};
        }
        /**
        * @method BasicModule#querySelector
        */
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
        this.getModule = function(name) {
            return this.items[name];
        }

        Object.defineProperty(this, 'data', {
            configurable: true,            
            get: function() {
                return this.dataSource.data;
            },
            set: function(value) {
                this['data'] = value; 
            }
        });
        
        
});
