
requirejs.config({
    enforceDefine: true
});



define(function() {
	debugger;
	

	var list;// = newModule('ListModule');

	
	require(['ListModule'], function(ListModule) {
		list = newModule(ListModule);
	});

});