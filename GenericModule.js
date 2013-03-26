
define(['BasicModule', 'ObservableArray', 'ListModule'] , function(BasicModule, ObservableArray, ListModule) {
    return function GenericModule(options) {
        this.name = 'GenericModule';
        var self = this;
        this.items = {};
        
        Refuel.implement(BasicModule, this);



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
                list.dataSource.setData(e.symbol.linkedData);// = linkedData;
                self.items[e.symbol.linkedTo] = list;
                list.create();
                list.draw();
            }
        }


        function oa_update(e) {
            console.log(self.name,'GenericModule','update ->',e);      
        }
        this.defineUpdateManager(oa_update);

    }
});
