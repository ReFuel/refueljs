Refuel.define('GenericModule',{inherits: 'BasicModule', require:'ListModule'}, 
    function GenericModule() {
        this.items = {};

        this.init = function(myConfig) {
            this.config = Refuel.mix(this.config, myConfig);
            this.defineUpdateManager(oa_update);

            this.dataSource.subscribe('dataAvailable', function(data) {
                this.create();
                this.draw();
            }, this);
            if (this.config.localStorageKey) this.dataSource.init({key: this.config.localStorageKey});
        }
            
        this.create = function() {
            this.template.subscribe('_new_list', createList, this);
            this.template.setRoot(this.config.root);
        }

        function createList(e) {
            var label = e.symbol.linkedTo;
            if (typeof this.items[label] === 'undefined') {
                var linkedData = Refuel.resolveChain(label, this.dataSource.getData()) || '';
                var list = Refuel.createInstance('ListModule', { 
                    root: e.symbol.domElement,
                    label: label
                });

                var obj = {};
                if (linkedData) obj[label] = linkedData;
                else obj[label] = [];
                
                list.dataSource.setData(obj);
                this.addModule(list);
                list.create();
                list.draw();
            }
        }

        function oa_update(e) {
            //console.log('GenericModule.update ->',e);      
        }

});
