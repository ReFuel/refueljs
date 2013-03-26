var app;


Refuel.define('TodoApp',{require: ['GenericModule']},
    function TodoApp() {    
        var root = document.querySelector("#todoapp"); 
        
        app = Refuel.createInstance('GenericModule', {root: root});
        //Main DataSource creation, will be replaced by the REAL DataSource
        var numberOfElements = 3;
        app.dataSource.data = {title:'ReFuel Todo App', todoList: []};
        for (var i = 0; i < numberOfElements; i++) {
            app.dataSource.data.todoList.push({ text: 'my text '+i, done: false });
        };
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
            	this.items['todoList'].dataSource.data.push({ text: e.target.value, done: false });
                e.target.value = '';
            }
        }
    
});
