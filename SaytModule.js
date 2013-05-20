/**
*	@class SaytModule
*	@param root 
*   
*	@fires dataAvailable The class has loaded its data and is ready
*	@fires dataError Some error is occurred during data loading
*	@author Stefano Sergio
*/
Refuel.define('SaytModule', {inherits: 'BasicModule'},  
    function SaytModule() {
        var config = {};
        var lastQuery;
        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
            this.enableAutoUpdate(this.data);
            
            this.template.setRoot(config.root);
            
            this.addEventListener('keyup', handleTyping.bind(this));

            this.dataSource.subscribe('dataAvailable', function(data) {
                console.log('Sayt.dataAvailable', data);
                this.draw();
            }, this);

            this.dataSource.init(config);
            this.currentQuery = null;
        }

        function handleTyping(e) {
            var query = e.target.value.trim();
            startSearch.call(this, query);
        }
        function cancelSearch() {
            lastQuery = this.currentQuery; //move in currentQuery setter?
            this.currentQuery = null;
        }
        function startSearch(query) {
            lastQuery = this.currentQuery;
            this.currentQuery = query;
            this.dataSource.load({'params': 'q='+query});
        }
        //XXX Cache will be a DataSource functionality
        function writeCache(key, data){
        	localStorage.setItem(key, data);	
        }
        function readCache(key){
        	var data = null;
        	data = localStorage.getItem(key);
        	data = JSON.parse(data);
        	return data;
        }
        
        function oa_update(e) {
            //console.log('SaytModule.oa_update', e);
        }

      	
});
