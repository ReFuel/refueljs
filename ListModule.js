/**
*   @param options = {
        root: HTMLElement,
        symbol: Parsed template symbol, if this symbol exists, this Module's Template has been already parsed
    }
    @param items Array of ListItemModule-s

**/

define(['Core', 'BasicModule', 'ObservableArray', 'ListItemModule', 'Filter'] , function(Core, BasicModule, ObservableArray, ListItemModule, Filter) {
    return function ListModule(options) {
        this.name='ListModule';
        var ENTER_KEY = 13;
        var self = this;
        this.items = [];   
        Core.implement(BasicModule, this, true);
        this.enableAutoUpdate(this.dataSource.data);

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

        this.add = function(objData) {

            createListItem({data: objData});
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

        this.delete = function(e) {
        	this.dataSource.data.todoList.splice(e.currentTarget.dataset.rfId, 1);
        }

        this.update = function(e) {
            if (e.keyCode === ENTER_KEY){
                e.currentTarget.className = e.currentTarget.className.replace(" editing", "");
                this.dataSource.data.todoList[+e.currentTarget.dataset.rfId].text = e.target.value;
            }
        }


        function createListItem(e) {
            //console.log(self.name);
            var rootSymbol = self.template.getSymbolByAction('list');
            var listItem = new ListItemModule({ parentRoot: options.root, template: rootSymbol.template });
            listItem.dataSource.data = e.data;
            self.items.push(listItem);
            listItem.create(); //do we really need this?
            listItem.draw();
        }
	}
});

