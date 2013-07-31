var app;
Refuel.define('TodoApp',{require: ['GenericModule', 'ListModule']},
    function TodoApp() {    
        var rootElement = document.querySelector('#todoapp');
        document.location.hash = '';

        app = Refuel.newModule('GenericModule', { 
            'root': rootElement, 
            'autoload': true,
            data: {
                'title':'ReFuel Todo App',
                'todoList': Refuel.newModule('DataSource', {key: 'todos-refuel', defaultDataType: 'Array'}),
                'completedLength': 0, 
                'activeLength': 0
            } 
        });

        var todoListModule = app.getModule('todoList');       
        checkCounters();
        app.subscribe('observableChange', function(e) {
            var name = e.observable.name;
            if (name == 'todoList.length' ||  name == 'completed') {
                checkCounters();
            }
        });
        function checkCounters() {
            var curLength = todoListModule.data.length;
            var completedLength = todoListModule.filterBy({'completed': true}).length;
            app.data['completedLength'] = completedLength;
            app.data['activeLength'] = curLength-completedLength;
            
            document.querySelector("#toggle-all").checked = curLength == completedLength;
        }

        app.defineAction('clearComplete', function(e) {
            var res = e.module.removeByFilter({'completed': true});
            app.saveData();
        });

        app.defineAction('changeDone', function(e) {
            var checked =  e.target.checked; 
            e.module.data['completed'] = checked;
            app.saveData();
        });

        app.defineAction('changeDoneAll', function(e) {
            var checked =  e.target.checked;
            e.module.applyOnItems(function(item) {
                item.data['completed'] = checked;
            });
            app.saveData();
        });

        app.defineAction('add', function(e) {
            var textContent = e.target.value.trim();
            if (e.keyIdentifier === 'Enter' && textContent !== '') {
                e.module.add({ title: textContent, completed: false });
                e.target.value = '';
				e.target.blur();
                app.saveData();
            }
        });

        app.defineAction('delete', function(e) {
            todoListModule.remove(e.module);
            app.saveData();
        });

        app.defineAction('edit', function(e) {
            e.module.toggleClass('editing', true);
            e.module.querySelector('input.edit').focus();
        });

        app.defineAction('save', function(e) {
            var textContent = e.target.value.trim();
            if (e.keyIdentifier === 'Enter' || e.type === 'focusout') {
                if (textContent != '') e.module.data['title'] = textContent;
                e.module.toggleClass('editing', false);
                app.saveData();
            }
        });

        app.defineAction('toggleDeleteButton', function(e) {
            e.module.toggleClass('show-delete');
        });

        function selectFilter(target) {
            var els = document.querySelectorAll('#filters li a');
            for (var i=0, item; item = els[i]; i++) {
                item.classList.remove('selected');
            }
            target.classList.add('selected');
        }

        Path.root('#/');
        Path.map('#/').to(function() {
            todoListModule.filterClear();
            selectFilter(document.querySelector('[href="#/"]'));
        });
        Path.map('#/active').to(function(){
            todoListModule.filterApply({'completed': false});
            selectFilter(document.querySelector('[href="#/active"]'));
            document.querySelector("#toggle-all").checked = false;
        });
        Path.map('#/completed').to(function(){
            todoListModule.filterApply({'completed': true}); 
            selectFilter(document.querySelector('[href="#/completed"]'));
            document.querySelector("#toggle-all").checked = true;
        });    

});


