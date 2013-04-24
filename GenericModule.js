Refuel.define('GenericModule',{inherits: 'BasicModule', require:'ListModule'}, 
    function GenericModule() {
        var config = {};
        this.items = [];

        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
            this.defineUpdateManager(oa_update);
            this.template.subscribe('_new_list', createList, this);
            this.template.setRoot(config.root);
            
            this.dataSource.subscribe('dataAvailable', function(data) {
                this.draw();
            }, this);
            this.dataSource.init(config);
        }

        function createList(e) {
            var path = e.symbol.linkedTo.split('.');
            var label = path[0];
            path = path.slice(1).join('.');
            //add name to listModule and path for data
            
            if (typeof this.items[label] === 'undefined') {
                var passthison = this.dataSource.data[label];
                var list = Refuel.newModule('ListModule', {
                    data: passthison  
                    ,autoload: false
                    ,root: e.symbol.domElement
                    ,dataLabel: label //rename in 'name'
                    ,dataPath: path
                });
                this.addModule(list);
            }
        }

        function oa_update(e) {
            //console.log('GenericModule.update ->',e);      
        }

});
