/**
*   @class GenericModule
*
*   @author Stefano Sergio
*/

//XXX this module will be just a concrete implementation of AbstractModule 
Refuel.define('GenericModule',{inherits: 'AbstractModule', require: ['ListModule']}, 
    function GenericModule() {
        var config = {};

        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
            delete config['data'];
            //console.log(config.dataLabel,'GenericModule.init', config);
            this.defineUpdateManager(oa_update);

            
            if (config.root) {
                this.template.setRoot(config.root);
                this.template.parseTemplate();
            }
            
            if (this.dataSource) {
                //console.log(config.dataLabel, Refuel.refuelClass(this),'have dataSource and is waiting for data...');
                this.dataSource.subscribe('dataAvailable', function(data) {
                    //console.log(config.dataLabel, Refuel.refuelClass(this),'got all data (dataAvailable), now he can draw()');
                    this.draw();
                   
                }, this);
                this.dataSource.init(config);
            }
        }

        /*
        function initSubmodules() {
            console.log('Abstract.initSubmodules',this.items);
            for(var moduleName in this.items) {
                var module = this.items[moduleName];
                module.notify('_parentDataAvailable', this);
            } 
        }
        */

        function oa_update(e) {
            //console.log('GenericModule.update ->',e);      
        }

});
