var app;
Refuel.define('TodoApp',{require: ['GenericModule', 'DataSource']},
    function TodoApp() {    
        var rootElement = document.querySelector('#todoapp');
        document.location.hash = '';

        //var numberOfElements = 1;
        //var todoList = [];
        //for (var i = 0; i < numberOfElements; i++) {
        //    todoList.push({ title: 'my text '+i, completed: false });
        //};
        
        app = Refuel.createInstance('GenericModule', { 
            'root': rootElement, 
            autoload: true,
            data: {
                'title':'ReFuel Todo App',
                'todoList': Refuel.createInstance('DataSource', {key: 'todos-refuel', defaultDataType: 'Array'}),
                'completedLength': 0, 
                'activeLength': 0
            } 
        });

        var todoListModule = app.getModule('todoList');

        //sono  i nomi del simbolo nel markup
             
        app.subscribe('observableChange', function(e) {
            var name = e.observable.name;
            if (name == 'todoList.length' ||  name == 'completed') {
                var data = app.data['todoList'].data;
                var curLength = data.length;
                var completedLength = todoListModule.filterBy({'completed': true}).length;

                app.data['completedLength'] = completedLength;
                app.data['activeLength'] = curLength-completedLength;
                //console.log(curLength, completedLength);
                /*
                if (curLength == completedLength) {
                    document.querySelector("#toggle-all").checked = true;
                }else {
                    document.querySelector("#toggle-all").checked = false;
                } 
                */
            }
        });

        app.defineAction('clearComplete', function(e) {
            var res = e.module.applyFilter({'completed': false}, true);
            app.saveData();
        });

        app.defineAction('changeDone', function(e) {
            var checked =  e.target.checked;
            e.module.data['completed'] = checked;
            app.saveData();
        });

        //TODO selezione del tasto changeDoneAll, dipendente praticamente dal filterBy:completed .lenght
        app.defineAction('changeDoneAll', function(e) {
            e.module.applyOnItems(function(item) {
                var checked =  e.target.checked;
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
            console.log('delete',e.module);
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
            todoListModule.filterClear();
            selectFilter(document.querySelector('[href="#/"]'));
        });
        Path.map('#/active').to(function(){
            todoListModule.applyFilter({'completed': false});
            selectFilter(document.querySelector('[href="#/active"]'));
            //document.querySelector("#toggle-all").checked = false;
        });
        Path.map('#/completed').to(function(){
            todoListModule.applyFilter({'completed': true}); 
            selectFilter(document.querySelector('[href="#/completed"]'));
        });    
});


