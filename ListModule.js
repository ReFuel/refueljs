

defineModule('ListModule', {inherits: 'AbstractModule'}, function() {
    return function ListModule() {
      	this.addTodo = function(e) {
			console.log('addElement',e);
		}
	}
});