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
            this.enableAutoUpdate(this.dataSource.getData());
        }
        this.create = function() {
        }
        
        //serve anche sapere quando il tmpl ha finito di parsare? automatizzare il processo!
        //in callback del datasource, probabilmente automatizzando
        this.draw = function() {
            this.template.create(this.config.parentRoot, this.config.template, this.dataSource.getData());
        }

        this.defineAction('delete', function(e) {
            this.notify('delete', {'item': this});
        });
		
		this.defineAction('toggleDeleteButton', function(e) {
			console.log('showDeleteButton:', e);
			var el = e.currentTarget.querySelector('.destroy');
			if (el.style.display === 'block') {
				el.style.display = 'none';
			}
			else {
				el.style.display = 'block';
			}
		});

});

