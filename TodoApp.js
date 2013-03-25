var app;

define(['GenericModule', 'ObservableArray'], function(GenericModule, ObservableArray) {
    
    var root = document.querySelector("#todoapp"); 
    //classeFijo = Refuel.createInstance('ClasseFijo', {root: root});
    //classePadre = Refuel.createInstance('ClassePadre', {root: root});
    app = new GenericModule({root: root});

    //Main DataSource creation, will be replaced by the REAL DataSource
    var numberOfElements = 3;
    app.dataSource.data = {title:'ReFuel Todo App', todoList: []};
    for (var i = 0; i < numberOfElements; i++) {
        app.dataSource.data.todoList.push({ text: 'my text '+i, done: false });
    };
    //app.obs = new ObservableArray(app.dataSource.data.todoList);

    app.create();
    app.draw();
    app.changeDone = function(e) {
		if (e.target.checked) {
			e.target.parentNode.parentNode.className = 'completed';
			this.dataSource.data.todoList[+e.currentTarget.dataset.rfId].done = true;
		} else {
		    e.target.parentNode.parentNode.classList.remove('completed');
			this.dataSource.data.todoList[+e.currentTarget.dataset.rfId].done = false;
		}
	}

    app.add = function(e) {
        if (e.keyIdentifier === 'Enter') {
        	//this.items['todoList'].add({ text: e.target.value, done: false });
            
        	this.items['todoList'].dataSource.data.push({ text: e.target.value, done: false });
            e.target.value = '';
            //this.dataSource.data.length = this.dataSource.data.todoList.length;
        }
    }
});
