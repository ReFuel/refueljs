/**
*   @class ListItemModule
*
*   @param parentRoot: HTMLElement
*   @param template: Refuel.Template instance
*   @author Stefano Sergio
**/

Refuel.define('ListItemModule', {inherits: 'BasicModule'},  
    function ListItemModule() {
        var config = {};
        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
            //this.defineUpdateManager(oa_update);
            this.dataSource.name = this.template.name = 'ListItemModule';
            this.enableAutoUpdate(this.dataSource.getData());
            
            this.dataSource.subscribe('dataAvailable', function(data) {
                this.draw();
            }, this);

            this.dataSource.init(config);
        }
        
        function oa_update(e) {
            //console.log('ListItemModule.oa_update', e);
        }

        this.destroy = function() {
            this.template.remove();
            delete this;
        }

        this.draw = function() {
            this.template.create(config.parentRoot, config.template, this.dataSource.getData());
        }
});

