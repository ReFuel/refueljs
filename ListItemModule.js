/**
*   @class ListItemModule
*
*   @param parentRoot: HTMLElement
*   @param template: Refuel.Template instance
*   @author Stefano Sergio
**/

Refuel.define('ListItemModule', {inherits: 'AbstractModule'},  
    function ListItemModule() {
        var config = {};
        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
            delete config['data'];
            this.enableAutoUpdate(this.data);
            this.isSelected = false;

            if (this.dataSource) {
                //console.log(Refuel.refuelClass(this),config.dataLabel,'have dataSource and is waiting for data...');
                this.dataSource.subscribe('dataAvailable', function(data) {
                    //console.log(Refuel.refuelClass(this),'got all data (dataAvailable), now he can draw()');
                    this.notify('loadComplete');
                    this.draw();
                }, this);
                this.dataSource.init(config);    
            }
        }
        
        function oa_update(e) {
            //console.log('ListItemModule.oa_update', e);
        }

        this.destroy = function() {
            this.template.remove();
            delete this;
        }

        this.draw = function() {
            if (!config.template) throw "No template found for ListItemModule";
            this.template.create(config.parentRoot, config.template, this.data);
            this.notify('drawComplete');
        }
        this.select = function() {
            this.classList.add('selected');
            this.isSelected = true;
        }
        this.deselect = function() {
            this.classList.remove('selected');
            this.isSelected = false;
        }
});

