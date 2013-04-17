var app;
Refuel.define('TodoApp',{require: ['GenericModule', 'DataSource', 'ajax']},
    function TodoApp() {    
        var root = document.querySelector('#todoapp');

        //TODO sostituire con data from remote
        var numberOfElements = 1;
        var todoList = [];
        for (var i = 0; i < numberOfElements; i++) {
            todoList.push({ title: 'my text '+i, completed: false });
        };
        
        app = Refuel.createInstance('GenericModule', { 'root': root });
        //TODO set in module.data
        app.dataSource.setData({
            'title':'ReFuel Todo App',
            'todoList': Refuel.createInstance('DataSource', {key: 'todos-refuel', autoload: true}),
            'completedLength': 0, 
            'remainingLength': 0
        });

        //TODO app.observe(['todoList.lenght','completed'], function() {})
        //sono  i nomi del simbolo nel markup
        app.subscribe('observableChange', function(e) {
            var name = e.observable.name;
            if (name == 'todoList.length' ||  name == 'completed') {
                var len = app.data('todoList').length;
                var completed = app.items['todoList'].filterBy({'completed': true}).length;

                app.data('completedLength', completed );
                app.data('remainingLength', len-completed);
                app.saveData();
            }
        });

        app.defineAction('clearComplete', function(e) {
            var res = e.module.applyFilterBy({'completed': false}, true);
            app.saveData();
        });

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
                e.module.add({ title: textContent, completed: false });
                e.target.value = '';
				e.target.blur();
            }
        });

        app.defineAction('edit', function(e) {
            e.module.toggleClass('editing', true);
            e.module.querySelector('input.edit').focus();
        });

        app.defineAction('save', function(e) {
            var textContent = e.target.value.trim();
            if (e.keyIdentifier === 'Enter' || e.type === 'focusout') {
                if (textContent != '') e.module.data('title', textContent);
                e.module.toggleClass('editing', false);
                app.saveData();
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

        Path.root('#/');
        Path.map('#/').to(function() {
            app.items['todoList'].filterClear();
            selectFilter(document.querySelector('[href="#/"]'));
        });
        Path.map('#/active').to(function(){
            app.items['todoList'].applyFilterBy({'completed': false});
            selectFilter(document.querySelector('[href="#/active"]'));
        });
        Path.map('#/completed').to(function(){
            app.items['todoList'].applyFilterBy({'completed': true}); 
            selectFilter(document.querySelector('[href="#/completed"]'));
        });    
});


