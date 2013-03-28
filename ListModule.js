/**
    @param root: HTMLElement,
    @param symbol: Parsed template symbol, if this symbol exists, this Module's Template has been already parsed
    
    @param items Array of ListItemModule [read only]

**/
Refuel.define('ListModule',{inherits: 'BasicModule', require:'ListItemModule'}, 
    function ListModule() {
        var self = this;
        var ENTER_KEY = 13;
        this.items = [];   

        this.init = function(myConfig) {
            this.config = Refuel.mix(this.config, myConfig);
            this.defineUpdateManager(oa_update);
            this._label = this.config.label;
        }

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

        this.create = function() {
            this.template.subscribe('_new_listitem', addListItem);
            this.template.setRoot(this.config.root);
            this.enableAutoUpdate(this.dataSource.getData(), this._label);
        }

        this.doFilter = function(param) {
            var data = this.dataSource.getData().todoList; // da cambiare nell'array vero
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
            console.log('ListModule.add', objData);
            addListItem({data: objData});
        }
               
        //TODO serve anche sapere quando il tmpl ha finito di parsare? automatizzare il processo!
        //in callback del datasource, probabilmente automatizzando
        this.draw = function() {
            this.template.render(this.dataSource.getData());
        }

        this.update = function(e) {
            if (e.keyCode === ENTER_KEY) {
                e.currentTarget.className = e.currentTarget.className.replace(" editing", "");
//                 this.dataSource.data.todoList[+e.currentTarget.dataset.rfId].text = e.target.value;
            }
        }

        function oa_update(e) {
            switch(e.action) {
                case 'add': 
                    addListItem({data: e.data, observer: e.observer});
                break;
                case 'delete': {
                    removeListItem({index: e.index});
                }
            }
        }

        function removeListItem(e) {
            self.items[e.index].template.remove();
        }

        //XXX fattorizzare l'add di un elemento?
        function addListItem(e) {
            var rootSymbol = self.template.getSymbolByAction('list');
            var listItem = Refuel.createInstance('ListItemModule', { 
                parentRoot: self.config.root, 
                template: rootSymbol.template
            });

            listItem.dataSource.setData(e.data);
            self.items.push(listItem);
            listItem.create(); 
            listItem.draw();
            listItem.subscribe('delete', function(e) {
                var index = self.getItemIndex(e.item);
                var ds = self.dataSource.getData()[self._label];

                ds.splice(index, 1);
                self.items.splice(index, 1);
            });
        }

        this.getItemIndex = function(item) {
            for (var i = 0, curItem; curItem = this.items[i]; i++) {
                if (curItem === item) return i;
            };
        }

});

