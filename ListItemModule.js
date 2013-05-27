/**
*   @class ListItemModule
*
*   @param parentRoot: HTMLElement
*   @param template: Refuel.Template instance
*   @author Stefano Sergio
**/

Refuel.define('ListItemModule', {inherits: 'GenericModule'},  
    function ListItemModule() {
        var config = {};
        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
            //this.defineUpdateManager(oa_update);
            this.enableAutoUpdate(this.dataSource.getData());
            
            this.dataSource.subscribe('dataAvailable', function(data) {
                console.log('ListItemModule.dataAvailable');
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

