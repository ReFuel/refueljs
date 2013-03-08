defineModule('ListModule', {inherits: 'AbstractModule'}, function() {
	return function ListModule(options) {
        this.parse(options.root);
    	
      	this.addTodo = function(e) {
			console.log('addElement',e);
		}		
	}
});

