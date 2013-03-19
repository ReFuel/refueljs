define(['Core', 'BasicModule', 'ObservableArray'] , function(Core, BasicModule, ObservableArray) {
	var ENTER_KEY = 13;

	return function ListModule(options) {
        this.name='ListModule';

        Core.implement(BasicModule, this);

        //sostituire con un datasource
        var numberOfElements = 3;
        this.dataSource.data = {
            length: numberOfElements,
            todoList: []
        };
        for (var i = 0; i < numberOfElements; i++) {
            this.dataSource.data.todoList.push({ text: 'my text '+i, done: false });
        };

        
        this.parse(options.root);  //BasicModule.parse
        //serve anche sapere quando il tmpl ha finito di parsare? automatizzare il processo!
        //in callback del datasource, probabilmente automatizzando
        this.render(); //BasicModule.render

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
				this.dataSource.data.todoList[new Number(e.currentTarget.dataset.rfId)].done = true;
			} else {
                e.target.parentNode.parentNode.classList.remove('completed');
				this.dataSource.data.todoList[new Number(e.currentTarget.dataset.rfId)].done = false;
			}
        }
        //come sopra, ma forse questo è da rendere standard e quindi DEVE stare qui????
        this.destroy = function(e) {
			this.dataSource.data.todoList.splice(e.currentTarget.dataset.rfId, 1);
        }
        //idem????
        this.editable = function(e) {
			e.currentTarget.className += " editing";
			e.currentTarget.querySelector("input.edit").focus();
        }
		this.update = function(e){
			if (e.keyCode === ENTER_KEY){
				e.currentTarget.className = e.currentTarget.className.replace(" editing", "");
				this.dataSource.data.todoList[new Number(e.currentTarget.dataset.rfId)].text = e.target.value;
			}
		}



        this.obs = new ObservableArray(this.dataSource.data.todoList);

	}
});

