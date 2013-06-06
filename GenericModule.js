/**
*   @class GenericModule
*
*   @author Stefano Sergio
*/

//XXX this module will be just a concrete implementation of AbstractModule 
Refuel.define('GenericModule',{inherits: 'AbstractModule', require:'ListModule'}, 
    function GenericModule() {
        var config = {};
        this.items = [];
        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
            delete config['data'];
            //console.log('GenericModule.init', config);

            this.defineUpdateManager(oa_update);

            this.template.subscribe('_new_module_requested', createSubmodule, this);
            if (config.root) this.template.setRoot(config.root);
            
            this.template.parseTemplate();
            
            if (this.dataSource) {
                console.log(Refuel.refuelClass(this),config.dataLabel,'have dataSource and is waiting for data...');
                this.dataSource.subscribe('dataAvailable', function(data) {
                    console.log(Refuel.refuelClass(this),'got all data (dataAvailable), now he can draw()');
                    this.draw();
                }, this);
                this.dataSource.init(config);    
            }
        }
        /*
        
        data-rf-name = gli assegna un nome sottomodulo diverso dal suo datapath
        Una volta creati i sottomoduli gli vengoono assegnati i dati in maniere diverse a seconda di come
        sono definiti.
        

1       <Generic>
            <div data-rf-list="top.results"> : gli vengono assegnati i dati da top.results del Generic (MP: Generic)


2       <Generic>
            <div  data-rf-name="tops" data-rf-list>
        
        app.config = {
            data: { 'top': DataSource({url: 'http://callmemaybe.io'}); }
        }           
        // tops.config.mountpoint === app.config.data
        app.getModule('tops').setDataPath('top.results'); //tops.config.dataPath
        app.getModule('tops').load(); //tops.init()
    
        <div data-rf-name="top.results" data-rf-list>  ===  <div data-rf-list="top.results">
        <div data-rf-name="tops" data-rf-list="top.results"> 
        
        

        sayt si chiama 'searchSayt'
        chiama la url: 'http://tvshowmark.com/api/search'
        e devo prendere i dati nell'oggetto 'result.series'
        searchSayt.config = {
            data: DataSource({url: 'http://tvshowmark.com/api/search', path: 'result.series'})
        } 
        ==
        searchSayt.config = {
            url: 'http://tvshowmark.com/api/search', 
            path: 'result.series'
        }


        */
        function createSubmodule(e) {
            var symbol = e.symbol;
            var module = e.module;
            var path = symbol.linkedTo.split('.');
            var label = path.splice(0,1)[0];
            path = path.join('.');

            console.log('GenericModule creates a Submodule',module.className,'with data', symbol.linkedTo);

            var newmodule = Refuel.newModule(module.className, {
                autoload: false
                ,root: symbol.domElement
                ,dataLabel: label //rename in 'name'?
                ,data: this.data[label]
                ,dataPath: path
                //,mountpoint: this.data
            });

            // se sono linkedTo bisogna dargli una label, bisogna dargli un rootpath e il resto del path
            //newmodule.dataSource = this.data[label];

            this.addModule(newmodule);
        }

        
        function initSubmodules() {
            console.log('GenericModule.initSubmodules',this.items);
            for(var moduleName in this.items) {
                var module = this.items[moduleName];
                module.notify('_parentDataAvailable', this);
            } 
        }

        function oa_update(e) {
            //console.log('GenericModule.update ->',e);      
        }

});
