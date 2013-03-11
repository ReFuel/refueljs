requirejs.config({
    enforceDefine: true
});


var list;
define(['ListModule'], function(ListModule) {
	list = new ListModule({root: '#todoapp'});
});