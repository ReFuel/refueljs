/**
*	@class SaytModule
*	@param root 
*   
*	@fires dataAvailable The class has loaded its data and is ready
*	@fires dataError Some error is occurred during data loading
*	@author Stefano Sergio
*/
Refuel.define('SaytModule', {inherits: 'GenericModule', require: ['ListModule']},  
    function SaytModule() {
        var config = {
            minChars: 2,
            searchParam: 'q',
            delay: 100,
            primaryField: 'name',
            enableKeySelection: true,
            keySelectionInsideInput: true,
            enterDefaultAction: null
        };
        var lastQuery,
            searchTimeout,
            inputField,
            resultList,
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
                    this.notify('loadComplete');
                    this.draw();
                }, this);
                this.dataSource.init(config);
            }
            this.currentQuery = null;
        }

        function create(e) {
            var self = this;
            inputField = this.elements['inputField'];
            resultList = this.elements['resultList'];
            listItemTemplate = this.elements['listItemTemplate'];
            inputField.addEventListener('keyup', handleTyping.bind(this));
            inputField.addEventListener('blur', function() { self.hide(); });
            inputField.addEventListener('focus', function() { self.show(); });
            
            if (config.enableKeySelection) {
                inputField.addEventListener('keydown', function(e) {
                    if(!theList.items.length || (e.keyCode != 40 && e.keyCode != 38 && e.keyCode != 13) ) return;
                    switch(e.keyCode) {
                        case 38: //up
                            if (theList.selectedIndex > 0) {
                                theList.selectChildAt(theList.selectedIndex-1);
                            }
                            else {
                                theList.selectChildAt(theList.items.length-1);
                            }
                        break;
                        case 40: //down
                            if (theList.selectedIndex < theList.items.length-1) {
                                theList.selectChildAt(theList.selectedIndex+1);
                            }
                            else {
                                theList.selectChildAt(0);
                            }
                        break;
                        case 13:
                            if(config.enterDefaultAction) {
                                e.preventDefault();
                                e.stopPropagation();
                                e.module = theList.items[theList.selectedIndex];
                                config.enterDefaultAction.call(this, e);
                            }
                        break;
                    }
                    if (config.keySelectionInsideInput && theList.selectedIndex) 
                        inputField.value = theList.items[theList.selectedIndex].data[config.primaryField];

                });
            }
            /*
            if (!resultList) {
                resultList = document.createElement('ul');
                this.template.getRoot().appendChild(resultList);
                this.elements['resultList'] = resultList;
            }
            if (!listItemTemplate) {
                listItemTemplate = document.createElement('li');
                listItemTemplate.innerHTML = '<div class="view">{{name}}</div>';
                resultList.appendChild(listItemTemplate);
                this.elements['listItemTemplate'] = listItemTemplate;
            }
            */
            //if ListModule is defined inside markup
            theList = this.getModulesByClass('ListModule')[0];
            //if ListModule is not already defined
            if (!theList) {
                theList = Refuel.newModule('ListModule', {
                    'root': resultList,
                    'dataLabel': 'list',
                    'elements': {
                        'template': listItemTemplate 
                    }
                });
                this.addModule(theList);
            }
            this.hide();
            //XXX why?
            theList.template.parseTemplate();
        }

        this.draw = function(data) {
            //XXX with super() method we'll be fine
            data = data || this.data;
            this.template.render(data);

            //ignores any dataPath the list may have
            theList.data = data;

            //theList.toggleClass('show', data.length);
            data.length ? this.show() : this.hide();
            this.notify('drawComplete');
        }

        function handleTyping(e) {
            if (e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 13) return;
            var query = inputField.value.trim();
            if (query != this.currentQuery ) {
                if (searchTimeout) window.clearTimeout(searchTimeout);
                searchTimeout = window.setTimeout(startSearch.bind(this, query),config.delay);
            }
            else {
                this.show();
            }
        }

        function cancelSearch() {
            lastQuery = this.currentQuery; //move in currentQuery setter?
            this.currentQuery = null;
        }
        function startSearch(query) {
            //console.log('start sayt search', query);
            if (searchTimeout) window.clearTimeout(searchTimeout);
            lastQuery = this.currentQuery;
            if (query.length === 0) {
                this.hide();
            }
            else if (query.length >= config.minChars) {
                this.currentQuery = query;
                theList.template.clear();
                this.dataSource.load({'params': config.searchParam+'='+query});
            }
        }

        this.hide = function() {
             theList.toggleClass('hide', true);
        }
        this.show = function() {
             theList.toggleClass('hide', false);
        }

        function oa_update(e) {
            //console.log('SaytModule.oa_update', e);
        }

      	
});
