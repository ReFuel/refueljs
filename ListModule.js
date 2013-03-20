/**
*   @param options = {
        root: HTMLElement,

    }
    @param items array of ListItemModule-s


**/

define(['Core', 'BasicModule', 'ObservableArray', 'ListItemModule', 'Filter'] , function(Core, BasicModule, ObservableArray, ListItemModule, Filter) {
    return function ListModule(options) {
        this.name='ListModule';
        var ENTER_KEY = 13;
        var self = this;
        this.items = [];
        
        Core.implement(BasicModule, this);

        //POPOLAMENTO DATASOURCE
        
        /**
        
        **/
		this.doFilter = function(param) {
			var data = this.dataSource.data.todoList; // da cambiare nell'array vero
			switch(param){
				case 'completed': {
					data = Filter(data).where(function(item) {return item.done === true}).returnResult();
					break;
				}
				case 'active': {
					data = Filter(data).where(function(item) {return item.done === false}).returnResult();
					break;
				}
				default: {
					return data;
				}
			}
		}

        this.create = function() {
            this.template.subscribe('_new_listitem', createListItem);
            this.template.setRoot(options.root);
        }
        //serve anche sapere quando il tmpl ha finito di parsare? automatizzare il processo!
        //in callback del datasource, probabilmente automatizzando
        this.draw = function() {
            this.template.render(this.dataSource.data);
        }

        this.add = function(e) {
            if (e.keyIdentifier === 'Enter') {
                this.dataSource.data.todoList.push({ text: e.target.value, done: false });
                e.target.value = '';
                this.dataSource.data.length = this.dataSource.data.todoList.length;
            }
        }
        this.delete = function(e) {
        	this.dataSource.data.todoList.splice(e.currentTarget.dataset.rfId, 1);
        }

        this.update = function(e){
            if (e.keyCode === ENTER_KEY){
                e.currentTarget.className = e.currentTarget.className.replace(" editing", "");
                this.dataSource.data.todoList[+e.currentTarget.dataset.rfId].text = e.target.value;
            }
        }

        /**
            this ha riferimenti a symbolTable e template per creare i nuovi item senza ri-parsare il tmpl
        **/
        function createListItem(obj) {
            console.log('ListModule < Template::_new_listitem');
            var listItem = new ListItemModule({rootSymbol: obj.symbol});
            listItem.dataSource.data = obj.data;
            self.items.push(listItem);
            listItem.create();
            listItem.draw();
        }

        


	}
});

