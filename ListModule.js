/**
*   @param options = {
        root: HTMLElement,
        symbol: Parsed template symbol, if this symbol exists, this Module's Template has been already parsed
    }
    @param items Array of ListItemModule-s

**/
define(['BasicModule', 'ObservableArray', 'ListItemModule', 'Filter'] , function(BasicModule, ObservableArray, ListItemModule, Filter) {
    return function ListModule(options) {
        this.name='ListModule';
        var ENTER_KEY = 13;
        var self = this;
        this.items = [];   
        Refuel.implement(BasicModule, this, true);
        this.enableAutoUpdate(this.dataSource.getData());

		this.doFilter = function(param) {
			var data = this.dataSource.getData(); // da cambiare nell'array vero
			switch(param){
				case 'completed': {
					data = Filter(data.todoList).where(function(item) {return item.done === true}).returnResult();
					break;
				}
				case 'active': {
					data = Filter(data.todoList).where(function(item) {return item.done === false}).returnResult();
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
            this.template.render(this.dataSource.getData());
        }

        this.delete = function(e) {
//         	this.dataSource.remove(e.currentTarget.dataset.rfId, 1); implementare remove
        }

        this.update = function(e) {
            if (e.keyCode === ENTER_KEY){
                e.currentTarget.className = e.currentTarget.className.replace(" editing", "");
//                 this.dataSource.data.todoList[+e.currentTarget.dataset.rfId].text = e.target.value;
            }
        }

        this.oa_update = function(e) {
            console.log(self.name,'update ->',e);      
            //self.updateSymbol(e.action, e.symbol.data, e.data);

            switch(e.action) {
                case 'add': 
                    var html = createListElement(e.data, e.symbol.data);
                    e.symbol.data.domElement.appendChild(html);
                break;
            }
        }

        function createListItem(e) {
            //console.log(self.name);
            var rootSymbol = self.template.getSymbolByAction('list');
            var listItem = new ListItemModule({ parentRoot: options.root, template: rootSymbol.template });
            listItem.dataSource.setData(e.data);
            self.items.push(listItem);
            listItem.create(); //do we really need this?
            listItem.draw();
        }
	}
});

