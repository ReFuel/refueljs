define(['Core', 'BasicModule', 'ObservableArray'] , function(Core, BasicModule, ObservableArray) {
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
            if (e.keyIdentifier == 'Enter') {
                this.dataSource.data.todoList.push({ text: e.target.value, done: false });    
                e.target.value = '';
                this.dataSource.data.length = this.dataSource.data.todoList.length;
            }
        }

        //metodo applicativo non deve sta qui
        this.changeDone = function(e) {
            //console.log('changeDone',e);
            if (e.target.checked)
                e.target.parentNode.parentNode.className = 'completed';
            else 
                e.target.parentNode.parentNode.classList.remove('completed');
        }


        this.obs = new ObservableArray(this.dataSource.data.todoList);

	}
});

