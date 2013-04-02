var app;

Refuel.define('TodoApp',{require: ['GenericModule']},
    function TodoApp() {    
        var root = document.querySelector("#todoapp"); 
        
        app = Refuel.createInstance('GenericModule', {root: root});
        //Main DataSource creation, will be replaced by the REAL DataSource
        var numberOfElements = 3;
        
        //TODO fare subscribe di dataAvailable
        app.dataSource.setData({title:'ReFuel Todo App', todoList: []});
        var data = app.dataSource.getData();
        for (var i = 0; i < numberOfElements; i++) {
            data.todoList.push({ text: 'my text '+i, done: false });
        };
        app.create();
        app.draw();


        app.defineAction('changeDone', function(e) {
            var checked =  e.target.checked;
            e.item.dataSource.getData().done = checked;
            e.item.toggleClass('completed', checked);    
        });

        app.defineAction('add', function(e) {
            if (e.keyIdentifier === 'Enter') {
                data.todoList.push({ text: e.target.value, done: false });
                e.target.value = '';
            }
        });

        
    
});
