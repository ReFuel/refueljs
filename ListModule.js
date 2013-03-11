define(['Core', 'AbstractModule'] , function(Core, AbstractModule) {
	return function ListModule(options) {
        Core.implement(AbstractModule, this);

        this.parse(options.root);

        //sostituire con un datasource
        
        var dataList = [];
        var num = 3;
        for (var i = 0; i < num; i++) {
        	dataList.push({ text: 'my text '+i, done: false });
        };

        var data = {
        	text: 'my text',
        	length: 12,
        	todoList: dataList
        }

        //serve anche sapere quando il tmpl ha finito di parsare? automatizzare il processo!
        //in callback del datasource, probabilmente automatizzando
        
        this.render(data);

      	this.addTodo = function(e) {
			console.log('addElement',e);
		}
		this.changeDone = function(e) {
			console.log('changeDone',e);
		}
	}
});

