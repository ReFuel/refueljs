/**
*   @param options = {
        root: HTMLElement,

    }
**/

define(['Core', 'BasicModule', 'ObservableArray'] , function(Core, BasicModule, ObservableArray) {
	return function ListItemModule(options) {
        this.name='ListItemModule';
        var self = this;

        Core.implement(BasicModule, this);
        this.enableAutoUpdate(this.dataSource.data);

        this.create = function() {
            //console.log('ListItemModule.create', options.root);
            //this.parse(options.root);
        }
        //serve anche sapere quando il tmpl ha finito di parsare? automatizzare il processo!
        //in callback del datasource, probabilmente automatizzando
        this.draw = function() {
            this.template.create(options.parentRoot, options.template, this.dataSource.data);
        }
        


	}
});

