Refuel.define('GenericModule',{inherits: 'BasicModule', require:'ListModule'}, 
    function GenericModule() {
        var self = this;
        this.items = {};

        this.init = function(myConfig) {
            this.config = Refuel.mix(this.config, myConfig);
            this.defineUpdateManager(oa_update);
        }
            
        this.create = function() {
            this.template.subscribe('_new_list', createList);
            this.template.setRoot(this.config.root);

        }

        function createList(e) {
            var label = e.symbol.linkedTo;
            if (typeof self.items[label] === 'undefined') {
                var linkedData = Refuel.resolveChain(label, self.dataSource.getData()) || '';
                var list = Refuel.createInstance('ListModule', { 
                    root: e.symbol.domElement,
                    label: label
                });

                var obj = {};
                obj[label] = e.symbol.linkedData;
                list.dataSource.setData(obj);

                self.items[label] = list;
                list.create();
                list.draw();
            }
        }

        function oa_update(e) {
            console.log('GenericModule.update ->',e);      
        }

});
