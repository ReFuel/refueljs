define(['Core', 'BasicModule'] , function(Core, BasicModule) {
	return function ListModule(options) {
        this.name='ListModule';
        Core.implement(BasicModule, this);

        //sostituire con un datasource
        var dataList = [];
        var numberOfElements = 3;
        for (var i = 0; i < numberOfElements; i++) {
            dataList.push({ text: 'my text '+i, done: false });
        };

        this.data = {
            length: numberOfElements,
            todoList: dataList
        }
        
        this.parse(options.root);
        //serve anche sapere quando il tmpl ha finito di parsare? automatizzare il processo!
        //in callback del datasource, probabilmente automatizzando
        this.render(this.data);

      	this.addTodo = function(e) {
            if (e.keyIdentifier == 'Enter') {
                dataList.push({ text: e.target.value, done: false });    
                e.target.value = '';
                this.data.length = dataList.length;
                console.log('addElement',dataList);
            }
		}

        //metodo applicativo non deve sta qui
		this.changeDone = function(e) {
			//console.log('changeDone',e);
            if (e.target.checked)
                e.target.parentNode.parentNode.className = 'completed';
            else 
                e.target.parentNode.parentNode.classList.remove('completed');
		}
	}
});
