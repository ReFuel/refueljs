
define(['Core', 'BasicModule', 'ObservableArray', 'ListModule'] , function(Core, BasicModule, ObservableArray, ListModule) {
	return function GenericModule(options) {
		this.name = 'GenericModule';
		var self = this;
		this.items = [];
		Core.implement(BasicModule, this);

		this.create = function() {
            this.template.subscribe('_new_list', createList);
            this.template.setRoot(options.root);
        }
        //serve anche sapere quando il tmpl ha finito di parsare? automatizzare il processo!
        //in callback del datasource, probabilmente automatizzando
        this.draw = function() {
            this.render();
        }

        function createList(e) {
        	console.log(self.name+'::createList', e);
        	var list = new ListModule({root: e.symbol.domElement});
        	//var linkedData = Core.resolveChain(e.symbol.linkedTo, self.dataSource.data) || '';
            list.dataSource.data = e.symbol.linkedData;// = linkedData;
            self.items.push(list);
            list.create();
            list.draw();
        }

	}
});

/**
	Quando il template di un modulo A arriva a parsare un DOMElement che dà vita ad un nuovo Modulo B, salta quel simbolo
	Tuttavia in questa maniera anche il Modulo B davanti a quel simbolo salta il suo aggancio
	Per questo prima di saltare bisogna controllare che quel simbolo non sia la root del template attuale.


*/