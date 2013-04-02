var app;

Refuel.define('TodoApp',{require: ['GenericModule']},
    function TodoApp() {    
        var root = document.querySelector("#todoapp"); 
        
        app = Refuel.createInstance('GenericModule', {root: root});
        //Main DataSource creation, will be replaced by the REAL DataSource
        var numberOfElements = 3;
        var appliedFilter;

        //XXX potremmo inserirla in GenericModule in qualche maniera figa?
        function selectFilter(target) {
            var els = document.querySelectorAll('#filters li a');
            for (var i=0, item; item = els[i]; i++) {
                item.classList.remove('selected');
            }
            target.classList.add('selected');
        }
        
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
            e.module.dataSource.getData().done = checked;
        });

        app.defineAction('changeDoneAll', function(e) {
            e.module.applyOnItems(function(item) {
                item.dataSource.getData().done = true;
                item.toggleClass('completed', true);
            });
        });
        
        app.defineAction('add', function(e) {
            if (e.keyIdentifier === 'Enter') {
                data.todoList.push({ text: e.target.value, done: false });
                e.target.value = '';
            }
        });

        app.defineAction('filterCompleted', function(e) {
            selectFilter(e.target);
            e.module.filterBy('done');
        });
        app.defineAction('filterActive', function(e) {
            selectFilter(e.target);
            e.module.filterBy('done', true);
        });
        
        app.defineAction('unfilter', function(e) {
            selectFilter(e.target);
            e.module.filterClear();
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
