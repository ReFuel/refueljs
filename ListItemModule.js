/** 
    Every config param can be set in the Module
    
    @param parentRoot: HTMLElement
    @param template: Refuel.Template instance
**/

Refuel.define('ListItemModule', {inherits: 'BasicModule'},  
    function ListItemModule() {
        var config;
        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
            //this.defineUpdateManager(oa_update);
            this.enableAutoUpdate(this.dataSource.getData());
            
            this.dataSource.subscribe('dataAvailable', function(data) {
         
                //console.log('ListItemModule::dataAvailable');
                this.create();
                this.draw();
            }, this);

            this.dataSource.init(config);
        }

        /*
        function oa_update(e) {
            //console.log('ListItemModule.oa_update', e);
        }
        */

        this.create = function() {
        }

        //serve anche sapere quando il tmpl ha finito di parsare? automatizzare il processo!
        //in callback del datasource, probabilmente automatizzando
        this.draw = function() {
            //console.log('ListItemModule.draw',this.dataSource.getData().title);
            this.template.create(config.parentRoot, config.template, this.dataSource.getData());
        }
});

