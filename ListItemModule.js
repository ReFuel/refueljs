/** 
    Every config param can be set in the Module
    
    @param parentRoot: HTMLElement
    @param template: Refuel.Template instance
**/

Refuel.define('ListItemModule', {inherits: 'BasicModule'},  
    function ListItemModule() {
        var self = this;
        this.enableAutoUpdate(this.dataSource.data);

        this.init = function(myConfig) {
             this.config = Refuel.mix(this.config, myConfig);
        }

        this.create = function() {
            //console.log('ListItemModule.create', this.config.parentRoot);
            //this.parse(this.config.root);
        }
        //serve anche sapere quando il tmpl ha finito di parsare? automatizzare il processo!
        //in callback del datasource, probabilmente automatizzando
        this.draw = function() {

            this.template.create(this.config.parentRoot, this.config.template, this.dataSource.data);
        }

});

