
define(['Core', 'BasicModule', 'ObservableArray', 'ListModule'] , function(Core, BasicModule, ObservableArray, ListModule) {
    return function GenericModule(options) {
        this.name = 'GenericModule';
        var self = this;
        this.items = {};
        
        Core.implement(BasicModule, this);

        this.create = function() {
            this.template.subscribe('_new_list', createList);
            this.template.setRoot(options.root);
        }
        
        this.draw = function() {
            this.render();
        }

        function createList(e) {
            if (typeof self.items[e.symbol.linkedTo] === 'undefined') {
                //console.log(self.name+'::createList', e);
                var list = new ListModule({ root: e.symbol.domElement });
                list.dataSource.data = e.symbol.linkedData;// = linkedData;
                self.items[e.symbol.linkedTo] = list;
                list.create();
                list.draw();
            }
        }

    }
});
