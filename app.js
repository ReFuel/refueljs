requirejs.config({
    enforceDefine: true
});


	var list;// = newModule('ListModule');
define(['ListModule'], function() {
	list = newModule('ListModule', {
		root: '#todoapp'
	});
});