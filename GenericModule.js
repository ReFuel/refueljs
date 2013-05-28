/**
*   @class GenericModule
*
*   @author Stefano Sergio
*/

//XXX this module will be just a concrete implementation of AbstractModule (ex AbstractModule)
Refuel.define('GenericModule',{inherits: 'AbstractModule', require:'ListModule'}, 
    function GenericModule() {
        var config = {};
        this.items = [];

        this.init = function(myConfig) {
            //XXX in AbstractModule please
            config = Refuel.mix(config, myConfig);
            this.defineUpdateManager(oa_update);

            this.template.subscribe('_new_module_requested', createSubmodule, this);
            if (config.root) this.template.setRoot(config.root);
            
            //this.template.parseTemplate();
            
            this.dataSource.subscribeOnce('dataAvailable', function(data) {
                console.log('GenericModule.dataAvailable');
                initSubmodules.call(this);
                this.draw();
            }, this);

            this.dataSource.init(config);
        }
        /*
        Una volta creati i sottomoduli gli vengoono assegnati i dati in maniere diverse a seconda di come
        sono definiti.
        
        <div data-rf-list="top.results"> : gli vengono assegnati i dati da top.results del Generic
        <div data-rf-name="tops"> : prende i dati da Generic.data.tops se esiste altrimenti può essere richiamato come .tops
        <div data-rf-name="top.results" data-rf-list>  ===  <div data-rf-list="top.results">
        <div data-rf-name="tops" data-rf-list="top.results"> 
        

        sayt si chiama 'searchSayt'
        chiama la url: 'http://tvshowmark.com/api/search'
        e devo prendere i dati nell'oggetto 'result.series'
        sayt.config = {
            data: DataSource({url: 'http://tvshowmark.com/api/search', path: 'result.series'})
        }
        


        */
        function createSubmodule(e) {
            var symbol = e.symbol;
            var module = e.module;
            var label = symbol.linkedTo.split('.')[0];
            console.log('createSubmodule',label, this.data);
            
            var newmodule = Refuel.newModule(module.className, {
                autoload: false
                ,root: symbol.domElement
                ,dataLabel: label //rename in 'name'?
                ,data: this.data[label]
            });
            // se sono linkedTo bisogna dargli una label, bisogna dargli un rootpath e il resto del path
            // 

            this.addModule(newmodule);
            //newmodule.init();
            //TODO app.DS === submodule.DS / init deve essere fatto una volta  
            //  il dato del submodule deve essere quello del path
        }

        
        function initSubmodules() {
            console.log('GenericModule.initSubmodules',this.items);
            for(var moduleName in this.items) {
                var module = this.items[moduleName];
                module.notify('_parentDataAvailable', this);
            } 
        }
        
        /*
        function createList(e) {
            console.log('createList',e);
            var path = e.symbol.linkedTo.split('.');
            var label = path[0];
            path = path.slice(1).join('.');
            console.log('createList', [e.symbol.linkedTo, label]);
            //qui arriva il path del dato come 'top.results', viene presa la prima parolina, quindi 'top'
            //e quello diventa il nome del dato da cercare in questo DS

            //add name to listModule and path for data 
            if (typeof this.items[label] === 'undefined') {
                var passthison = this.dataSource.data[label];
                var list = Refuel.newModule('ListModule', {
                    data: passthison  
                    ,autoload: false
                    ,root: e.symbol.domElement
                    ,dataLabel: label //rename in 'name'?
                    ,dataPath: path //non usato
                });
                this.addModule(list);
            }
        }
        */
        function oa_update(e) {
            //console.log('GenericModule.update ->',e);      
        }

});
