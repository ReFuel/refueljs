var app;

Refuel.define('TodoApp',{require: ['GenericModule']},
    function TodoApp() {    
        var root = document.querySelector("#todoapp"); 
        
        app = Refuel.createInstance('GenericModule', {root: root});
        //Main DataSource creation, will be replaced by the REAL DataSource
        var numberOfElements = 3;
        var appliedFilter;

        
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
            e.module.toggleClass('completed', checked);
            e.module.dataSource.getData().done = checked;
        });

        app.defineAction('changeDoneAll', function(e) {
            e.module.applyOnItems(function(item) {
                var checked =  e.target.checked;
                item.dataSource.getData().done = checked;
                item.toggleClass('completed', checked);
            });
        });
        
        app.defineAction('add', function(e) {
            var textContent = e.target.value;
            if (e.keyIdentifier === 'Enter' && textContent != '') {
                data.todoList.push({ text: textContent.trim(), done: false });
                e.target.value = '';
            }
        });

        //XXX potremmo inserirla in GenericModule in qualche maniera figa?
        function selectFilter(target) {
            var els = document.querySelectorAll('#filters li a');
            for (var i=0, item; item = els[i]; i++) {
                item.classList.remove('selected');
            }
            target.classList.add('selected');
        }

        Path.root("#/");

        Path.map("#/").to(function() {
            app.items['todoList'].filterClear();
            selectFilter(document.querySelector('[href="#/"]'));
        });
        Path.map("#/active").to(function(){
            app.items['todoList'].filterBy('done', true);
            selectFilter(document.querySelector('[href="#/active"]'));
        });
        Path.map("#/completed").to(function(){
            app.items['todoList'].filterBy('done'); 
            selectFilter(document.querySelector('[href="#/completed"]'));
        });
        

        app.defineAction('toggleDeleteButton', function(e) {
            var el = e.currentTarget.querySelector('.destroy');
            if (el.style.display === 'block') {
                el.style.display = 'none';
            }
            else {
                el.style.display = 'block';
            }
        });
    
        
});
