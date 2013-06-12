/**
*   @class GenericModule
*
*   @author Stefano Sergio
*/

//XXX this module will be just a concrete implementation of AbstractModule 
Refuel.define('GenericModule',{inherits: 'AbstractModule', require: ['ListModule']}, 
    function GenericModule() {
        var config = {};
        this.items = {};

        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
            delete config['data'];
            //console.log('GenericModule.init', config);
            this.defineUpdateManager(oa_update);

            this.template.subscribe('_new_module_requested', createSubmodule, this);
            if (config.root) this.template.setRoot(config.root);
            
            this.template.parseTemplate();
            
            if (this.dataSource) {
                //console.log(Refuel.refuelClass(this),config.dataLabel,'have dataSource and is waiting for data...');
                this.dataSource.subscribe('dataAvailable', function(data) {
                    //console.log(Refuel.refuelClass(this),'got all data (dataAvailable), now he can draw()');
                    this.draw();
                }, this);
                this.dataSource.init(config);
            }
        }

        function createSubmodule(e) {
            var symbol = e.symbol;
            var module = e.module;
            var path = symbol.linkedTo.split('.');
            var label = path.splice(0,1)[0];
            path = path.join('.');

            console.log('GenericModule creates a Submodule',module.className,'with data', symbol.linkedTo);
            var defaultSubmoduleConfig = {
                autoload: false
                ,root: symbol.domElement
                ,dataLabel: label //rename in 'name'?
                ,data: this.data[label]
                ,dataPath: path
            }
            defaultSubmoduleConfig = Refuel.mix(defaultSubmoduleConfig, config[label]);
            var newmodule = Refuel.newModule(module.className, defaultSubmoduleConfig);

            // se sono linkedTo bisogna dargli una label, bisogna dargli un rootpath e il resto del path
            //newmodule.dataSource = this.data[label];
            this.addModule(newmodule);
        }

        
        function initSubmodules() {
            console.log('GenericModule.initSubmodules',this.items);
            for(var moduleName in this.items) {
                var module = this.items[moduleName];
                module.notify('_parentDataAvailable', this);
            } 
        }

        function oa_update(e) {
            //console.log('GenericModule.update ->',e);      
        }

});
