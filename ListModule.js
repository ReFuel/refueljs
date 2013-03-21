/**
*   @param options = {
        root: HTMLElement,

    }
    @param items array of ListItemModule-s


**/

define(['Core', 'BasicModule', 'ObservableArray', 'ListItemModule'] , function(Core, BasicModule, ObservableArray, ListItemModule) {
    return function ListModule(options) {
        this.name='ListModule';
        var ENTER_KEY = 13;
        var self = this;
        this.items = [];
        
        Core.implement(BasicModule, this);

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

        function createListItem(obj) {
            var listItem = new ListItemModule({rootSymbol: obj.symbol});
            listItem.dataSource.data = obj.data;
            self.items.push(listItem);
            listItem.create();
            listItem.draw();
        }

        


	}
});

