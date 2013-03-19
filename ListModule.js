
define(['Core', 'BasicModule', 'ObservableArray', 'ListItemModule'] , function(Core, BasicModule, ObservableArray, ListItemModule) {
    return function ListModule(options) {
	   var ENTER_KEY = 13;
        this.name='ListModule';
        var self = this;
        this.items = [];

        Core.implement(BasicModule, this);

        //POPOLAMENTO DATASOURCE
        var numberOfElements = 3;
        this.dataSource.data = { length: numberOfElements, todoList: [] };
        for (var i = 0; i < numberOfElements; i++) {
            this.dataSource.data.todoList.push({ text: 'my text '+i, done: false });
        };
        this.obs = new ObservableArray(this.dataSource.data.todoList);
        
        /**
        
        **/
        this.create = function() {
            this.template.subscribe('_new_listitem', createListItem);
            this.parse(options.root);
        }
        //serve anche sapere quando il tmpl ha finito di parsare? automatizzare il processo!
        //in callback del datasource, probabilmente automatizzando
        this.draw = function() {
            this.render();
        }

        this.addTodo = function(e) {
            if (e.keyIdentifier === 'Enter') {
                this.dataSource.data.todoList.push({ text: e.target.value, done: false });    
                e.target.value = '';
                this.dataSource.data.length = this.dataSource.data.todoList.length;
            }
        }

        //metodi applicativi non devono sta qui
        this.changeDone = function(e) {
            //console.log('changeDone',e);
            if (e.target.checked) {
				e.target.parentNode.parentNode.className = 'completed';
				this.dataSource.data.todoList[+e.currentTarget.dataset.rfId].done = true;
			} else {
                e.target.parentNode.parentNode.classList.remove('completed');
				this.dataSource.data.todoList[+e.currentTarget.dataset.rfId].done = false;
			}
        }
        //come sopra, ma forse questo è da rendere standard e quindi DEVE stare qui????
        this.destroy = function(e) {
			this.dataSource.data.todoList.splice(e.currentTarget.dataset.rfId, 1);
        }
        //idem????

        //come sopra, ma forse questo è da rendere standard e quindi DEVE stare qui????
        this.destroy = function(e) {
            console.log("destroyed:", this.dataSource.data.todoList.splice(e.target.getAttribute("data-rf-id"), 1));        
        }
        //idem????
        this.update = function(e) {
            
        }

        function createListItem(obj) {
            var listItem = new ListItemModule();
            self.items.push(listItem);
            //console.log('createListItem',obj.symbol, obj.data);
        }
		this.update = function(e){
			if (e.keyCode === ENTER_KEY){
				e.currentTarget.className = e.currentTarget.className.replace(" editing", "");
				this.dataSource.data.todoList[+e.currentTarget.dataset.rfId].text = e.target.value;
			}
		}


        


	}
});

