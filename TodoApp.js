var app;
Refuel.define('TodoApp',{require: ['GenericModule']},
    function TodoApp() {    
        var root = document.querySelector("#todoapp"); 
        
        app = Refuel.createInstance('GenericModule', {root: root});
        //Main DataSource creation, will be replaced by the REAL DataSource
        var numberOfElements = 3;
        var appliedFilter;

        //TODO sostituire con data from remote
        var todoList = [];
        for (var i = 0; i < numberOfElements; i++) {
            todoList.push({ text: 'my text '+i, completed: false });
        };
        app.dataSource.subscribe('dataAvailable', function(data) {
            app.create();
            app.draw();
        });
        app.dataSource.setData({title:'ReFuel Todo App', 'todoList': todoList});

        //app.init({dataUrl:  ''});
        //app.data({key: 'todo_'});
        //app.start()

        app.defineAction('changeDone', function(e) {
            var checked =  e.target.checked;
            e.module.data('completed', checked);
        });

        //TODO selezione del tasto changeDoneAll, dipendente praticamente dal filterBy:completed .lenght
        app.defineAction('changeDoneAll', function(e) {
            e.module.applyOnItems(function(item) {
                var checked =  e.target.checked;
                item.data('completed', checked);
            });
        });

        app.defineAction('add', function(e) {
            var textContent = e.target.value.trim();
            if (e.keyIdentifier === 'Enter' && textContent != '') {
                e.module.add({ text: textContent, completed: false });
                e.target.value = '';
            }
        });

        app.defineAction('edit', function(e) {
            e.module.toggleClass('editing', true);
            e.module.querySelector('input.edit').focus();
        });

        app.defineAction('save', function(e) {
            var textContent = e.target.value.trim();
            if (e.keyIdentifier === 'Enter' || e.type === 'focusout') {
                if (textContent != '') e.module.data('text', textContent);
                e.module.toggleClass('editing', false);
            }
        });

        app.defineAction('toggleDeleteButton', function(e) {
            e.module.toggleClass('show-delete');
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
            app.items['todoList'].applyFilterBy('completed', true);
            selectFilter(document.querySelector('[href="#/active"]'));
        });
        Path.map("#/completed").to(function(){
            app.items['todoList'].applyFilterBy('completed'); 
            selectFilter(document.querySelector('[href="#/completed"]'));
        });    
    
        
});
