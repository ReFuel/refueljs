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
        this.enableAutoUpdate(this.dataSource.data);

        this.init = function(myConfig) {
             this.config = Refuel.mix(this.config, myConfig);
        }

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
            this.template.setRoot(this.config.root);
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
            var rootSymbol = self.template.getSymbolByAction('list');
            var listItem = Refuel.createInstance('ListItemModule', { parentRoot: this.config.root, template: rootSymbol.template });

            listItem.dataSource.data = e.data;
            self.items.push(listItem);
            listItem.create(); //do we really need this?
            listItem.draw();
        }
});

