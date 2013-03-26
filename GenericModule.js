
Refuel.define('GenericModule',{inherits: 'BasicModule', require:'ListModule'}, 
    function GenericModule() {
        this.name = 'GenericModule';
        var self = this;
        this.items = {};
       
        
        this.create = function() {
            console.log('GenericModule.create',this.config.root);
            this.template.subscribe('_new_list', createList);
            this.template.setRoot(this.config.root);
        }

        function createList(e) {
            if (typeof self.items[e.symbol.linkedTo] === 'undefined') {
                var list = Refuel.createInstance('ListModule', { root: e.symbol.domElement });
                list.dataSource.data = e.symbol.linkedData;// = linkedData;
                self.items[e.symbol.linkedTo] = list;
                list.create();
                list.draw();
            }
        }

        function oa_update(e) {
            console.log(self.name,'update ->',e);      
        }
        this.defineUpdateManager(oa_update);

});
