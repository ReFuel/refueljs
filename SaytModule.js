/**
*	@class SaytModule
*	@param root 
*   
*	@fires dataAvailable The class has loaded its data and is ready
*	@fires dataError Some error is occurred during data loading
*	@author Stefano Sergio
*/
Refuel.define('SaytModule', {inherits: 'GenericModule'},  
    function SaytModule() {
        var config = {};
        var lastQuery,
            searchTimeout,
            listElement,
            listItemTemplate,
            theList;

        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig); 
            delete config['data'];
            
            if (config.root) this.template.setRoot(config.root);
            this.template.subscribe('parsingComplete', create, this);
            this.template.parseTemplate();
            
            if (this.dataSource) {
                this.dataSource.subscribe('dataAvailable', function(data) {
                    this.draw();
                }, this);
                this.dataSource.init(config);
            }
            this.currentQuery = null;
        }

        function create(e) {
            this.elements['inputField'].addEventListener('keyup', handleTyping.bind(this));
            listElement = this.elements['listElement'];
            if (!listElement) {
                listElement = document.createElement('ul');
                this.template.getRoot().appendChild(listElement);
                this.elements['listElement'] = listElement;
            }
            listItemTemplate = this.elements['listItemTemplate'];
            if (!listItemTemplate) {
                listItemTemplate = document.createElement('li');
                listItemTemplate.innerHTML = '<div class="view">{{title}}</div>';
                listElement.appendChild(listItemTemplate);
                this.elements['listItemTemplate'] = listItemTemplate;
            }

            //ListModule is defined inside markup
            theList = this.getModulesByClass('ListModule')[0];
            //ListModule is not defined by the developer
            if (!theList) {
                theList = Refuel.newModule('ListModule', {
                    'root': listElement, 
                    'dataPath': config.dataPath,
                    'dataLabel': 'list',
                    'elements': {
                        'template': listItemTemplate 
                    }
                });
                this.addModule(theList);
            }
            //XXX when ListModule -> GenericModule this is unuseful
            theList.template.parseTemplate();
        }

        this.draw = function(data) {
            //XXX with super() method we'll be fine
            data = data || this.data;
            this.template.render(data);

            //XXX this ignores List dataPath
            theList.data = data;

            theList.toggleClass('show', data.length);
            theList.toggleClass('hide', !data.length);
        }

        function handleTyping(e) {
            var query = e.target.value.trim();
            if (searchTimeout) window.clearTimeout(searchTimeout);
            searchTimeout = window.setTimeout(startSearch.bind(this, query),config.delay);
        }

        function cancelSearch() {
            lastQuery = this.currentQuery; //move in currentQuery setter?
            this.currentQuery = null;
        }
        function startSearch(query) {
            if (searchTimeout) window.clearTimeout(searchTimeout);
            theList.template.clear();
            if (query != this.currentQuery) {
                lastQuery = this.currentQuery;
                this.currentQuery = query;
            //  console.log(this.dataSource.getConfig());
                if (query.length < config.minChars) { //XXX this control on the upper if
                    this.dataSource.setData([]);
                    return;
                }
                this.dataSource.load({'params': 'q='+query});
            }
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
