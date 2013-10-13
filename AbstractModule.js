    /**
    *   @class AbstractModule
    *   @fires _unhandledAction Fired when an Action is requested on this module but is not defined
    *   @fires observableChange Fired when some data observed by this module changes
    *   @fires loadComplete
    *
    *   @author Stefano Sergio
    */
Refuel.define('AbstractModule', {require: ['Template', 'DataSource'], inherits: 'Observer'}, 
    function AbstractModule() {
        var actionMap = {};
        this.items = {};
        /**
        * @type {object}
        * @property {string} dataPath 
        *
        */
        var config = {
            dataPath: '.',
            autoload: false,
            autoObserve: true
        }

        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
            this.elements = {};
            if (config.elements) this.elements = config.elements;
            this.defineUpdateManager(oa_update.bind(this));
            this.dataLabel = config.dataLabel;
            this.name = config.name;

            if ( Refuel.refuelClass(config.data) == 'DataSource') {
                //console.log('a newly created '+Refuel.refuelClass(this)+' have DataSource PASSED by parent with name:', config.dataLabel, 'in status: '+ config.data.loadStatus );
                this.dataSource = config.data; 
            }
            else {
                //console.log('a newly created '+Refuel.refuelClass(this)+' instances new DataSource with config:', config );
                this.dataSource = Refuel.newModule('DataSource', config);
            }
            config.data = null;
            this.template = Refuel.newModule('Template', config);
            this.template.subscribe('_new_module_requested', createSubmodule, this);
            this.template.subscribe('_generic_binder_event', genericEventHandler, this);
            this.template.subscribe('_observe', observeTemplateSymbol, this);
            this.template.subscribe('_template_element_found', addTemplateElement, this);            
        }

        function addTemplateElement(e) {
            //console.log('#',Refuel.refuelClass(this), e.name, e.element);
            this.elements[e.name] = e.element;
        }

        function createSubmodule(e) {
            var symbol = e.symbol;
            var module = e.module;
            var conf = e.config;
            //onsole.log('submodule',e);

            //dataPath from module label
            var path = symbol.linkedTo.split('.');
            var label = path.splice(0,1)[0];
            path = path.join('.');
            if (path && config.datapath) console.error(label,'error. dataPath defined twice');

            //console.log(this.dataLabel,'creates a Submodule',module.className,'with data', symbol.linkedTo);
            //dataLabel collega i dati del parent
            var defaultSubmoduleConfig = {
                autoload: false
                ,root: symbol.domElement
                ,dataLabel: label //rename in 'name'?
                ,data: this.data[label] //e se non esiste?
                ,dataPath: path 
            }
            conf = Refuel.mix(defaultSubmoduleConfig, conf);
            conf = Refuel.mix(conf, config[label]);
            var newmodule = Refuel.newModule(module.className, conf);
            
            // newmodule.dataSource = this.data[label];
            this.addModule(newmodule);
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
            this.enableAutoUpdate(this.data); //FIXME not generic
            //TODO levare i parametri passati all'observe
            var path = e.linkedTo;
            var obs = this.observe(path, e.symbol, 
                function(observable, tmplSymbol) {
                    this.template.renderSymbol(tmplSymbol, this.data);
                    this.notify('observableChange', {'observable': observable}, true);
                }
            );
        }

        this.setDataPath = function(path) {
            this.config.dataPath = path;
        }

        /**
        *   @memberof AbstractModule#addModule
        *   Add a child module. Child module is added in the 'items' collection under the name specified in the template if any.
        *   Otherwise is pushed as array element inside the 'items' collection.
        */ 
        this.addModule = function(module) {
            module.parentModule = this;
            if (module.dataLabel) this.items[module.dataLabel] = module;
            else                  this.items.push(module);
            module.subscribe('observableChange', function(e) {
                this.notify('observableChange', e);
            }, this);

            module.subscribe('_unhandledAction', function(e) {
                if (!e.module) e.module = module; //keeps only the original module inside the event data
                genericEventHandler.call(this, e);
            }, this);

            //XXX dataAvaiable when module.data changes, use updater
            this.dataSource.subscribe('dataAvailable', function(e) {
                if (module.dataLabel && this.data[module.dataLabel]) {
                    module.data = this.data[module.dataLabel];
                }
            }, this);
            
        }
        
        this.getModulesByClass = function(classname) {
            var res = [];
            for (var mod in this.items) {
                if (Refuel.refuelClass(this.items[mod]) == classname) res.push(this.items[mod]);
            }
            return res;    
        }

        function oa_update(e) {
            //console.log('AbstractModule','update ->',e);      
        }

        /**
        *   @method AbstractModule#draw
        *   Begin the render of the part of template owned by this module
        *   @param data The data to populate the template with, define this if data are different from the dataSource's data    
        */
        this.draw = function(data) {
            data = data || this.data;
            //this.clearObservers();
            this.template.render(data);
            this.notify('drawComplete');
        }

        /**
        * @method AbstractModule#defineUpdateManager
        * @param callback The function that will manage _oa_update event
        */        
        this.defineUpdateManager = function(callback) {
            this.unsubscribe('_oa_update');
            this.subscribe('_oa_update', callback);
        }
        /**
        * @method AbstractModule#defineAction
        */
        this.defineAction = function(name, callback) {
            actionMap[name] = {context: this, callback: callback};
        }
        /**
        * @method AbstractModule#querySelector
        */
        this.querySelector = function(query) {
            return this.template.getRoot().querySelector(query);
        } 

        this.toggleClass = function(classname, value) {
            if (value === undefined) {
                this.classList.toggle(classname);
            }
            else {
                if (value) this.classList.add(classname);
                else this.classList.remove(classname);
            }
        }
        this.reload = function() {
            this.dataSource.reload();
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
                return this.dataSource.getData();
            },
            //used in Abstract.addModule
            //questo è molto male, controllare come viene usato dall'esterno
            //se voglio settare i data di un module dovrei settarli nel suo dataSource
            set: function(value) {
                this.dataSource.setData(value); 
            }
        });
        Object.defineProperty(this, 'classList', {
            configurable: true,            
            get: function() {
                return this.template.getRoot().classList;
            },
            set: function(value) {
                console.error('cannot set '+this+'classList');
            }
        });
        Object.defineProperty(this, 'root', {
            configurable: true,            
            get: function() {
                return this.template.getRoot();
            },
            set: function(value) {
                console.error('cannot set '+this+'classList');
            }
        });
        
        
});
