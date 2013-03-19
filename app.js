requirejs.config({
    enforceDefine: true
});


var list;
define(['ListModule'], function(ListModule) {
	var root = document.querySelector("#todoapp"); 
	list = new ListModule({root: root});
	list.create();
	list.draw();

});