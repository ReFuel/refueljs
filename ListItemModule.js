/** 
    Every config param can be set in the Module
    
    @param parentRoot: HTMLElement
    @param template: Refuel.Template instance
**/

Refuel.define('ListItemModule', {inherits: 'BasicModule'},  
    function ListItemModule() {
        var self = this;

        this.init = function(myConfig) {
            this.config = Refuel.mix(this.config, myConfig);
            //this.defineUpdateManager(oa_update);
            this.enableAutoUpdate(this.dataSource.getData());
        }

        /*
        function oa_update(e) {
            console.log('ListItemModule.oa_update', e);
        }
        */

        this.create = function() {
        }


        
        //serve anche sapere quando il tmpl ha finito di parsare? automatizzare il processo!
        //in callback del datasource, probabilmente automatizzando
        this.draw = function() {
            this.template.create(this.config.parentRoot, this.config.template, this.dataSource.getData());
            //console.log('ListItemModule getObservers',this.getObservers());
        }
});

