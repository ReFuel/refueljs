requirejs.config({
    enforceDefine: true
});


var app;
var metasintattica = { text: 'Tommaso Culo', done: false };
define(['GenericModule', 'ObservableArray'], function(GenericModule, ObservableArray) {
	var root = document.querySelector("#todoapp"); 
	app = new GenericModule({root: root});

	//Main DataSource creation
    var numberOfElements = 3;
    app.dataSource.data = {title:'Refuel Todo App', length: numberOfElements, todoList: [] };
    for (var i = 0; i < numberOfElements; i++) {
        app.dataSource.data.todoList.push({ text: 'my text '+i, done: false });
    };
    app.obs = new ObservableArray(app.dataSource.data.todoList);

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

});