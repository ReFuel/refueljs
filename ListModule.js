define(['Core', 'AbstractModule'] , function(Core, AbstractModule) {
	return function ListModule(options) {
        Core.implement(AbstractModule, this);

        this.parse(options.root);  	
      	this.addTodo = function(e) {
			console.log('addElement',options);
		}
	}
});

