/**
*   @class ListModule
*   @param root: HTMLElement,
*   @param symbol: Parsed template symbol, if this symbol exists, this Module's Template has been already parsed 
*   @param items Array of ListItemModule [read only]
*
*   @author Stefano Sergio
**/
Refuel.define('ListModule',{inherits: 'AbstractModule', require:'ListItemModule'}, 
    function ListModule() {
        var config = {};
        this.items = [];
        var filterApplied = null;

        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);  
            delete config['data'];

            //XXX shouldnt be auto-detect which type?   
            this.dataSource.setConfig({defaultDataType: 'Array'});

            this.defineUpdateManager(oa_update.bind(this));
            if (config.root) this.template.setRoot(config.root);
            
            if (this.dataSource) {
                //console.log(Refuel.refuelClass(this),config.dataLabel,'have dataSource and is waiting for data...');
                this.dataSource.subscribe('dataAvailable', function(data) {
                    //console.log(Refuel.refuelClass(this),'got all data ',this.data,', now he can draw()');
                    this.draw();
                    set.call(this);
                }, this);
                this.dataSource.init(config);    
            }
        }

        this.haslistener = function() {
            return this.dataSource.isSubscribed('dataAvailable');   
        }

        this.create = function() {
            this.enableAutoUpdate(this.dataSource.getData(), config.dataLabel);
        }

        this.add = function(objData) {
            this.dataSource.data.push(objData);
        }
        /*
        this.remove = function(objData) {
            var index = this.getItemIndex(objData);
            this.removeAt(index);
        }
        */
        this.removeAt = function(index) {
            this.data.splice(index, 1);    
        }

        this.removeByFilter = function(filterObj) {
            var todelete = this.filterBy(filterObj);
            for (var i=0, item; item = this.data[i]; i++) {
                this.removeAt(this.getItemIndex(item));
            }
        }

        this.update = function(objData) {
            var obj = {};
            obj[config.dataLabel] = objData;
            this.dataSource.setData(obj);
        }

        function oa_update(e) {
            switch(e.action) {
                case 'set':
                    set.call(this);
                break;
                case 'add': 
                    addListItem.call(this,{data: e.data, index:e.index});
                    if(filterApplied) this.filterApply(filterApplied);
                break;
                case 'delete':
                    removeListItem.call(this, {index: e.index});
                break;
            }
        }
        function set(dataToShow) {
            dataToShow = dataToShow || this.data;
            //console.log('ListModule.set', this.data.length);
            this.items = [];
            this.template.clear();
            for (var i = 0, item; item = dataToShow[i]; i++) {
                addListItem.call(this,{'data': item, 'index':i});
            }
        }

        //Data change callbacks
        function removeListItem(e) {
            this.items[e.index].destroy();
            this.items.splice(e.index, 1);
        }

        function getElementStyle() {   
            var rowStyle = null;
            if (config.rowStyle) {
                var index = this.items.length;
                var even = (index % 2) == 0 ? 0 : 1;
                rowStyle = config.rowStyle.length == 1 ? config.rowStyle[0] : config.rowStyle[even];                
            }

            return rowStyle;
        }

        function addListItem(obj) {
            var rowStyle = getElementStyle.call(this);
            var listItem = Refuel.newModule('ListItemModule', { 
                parentRoot: config.root, 
                template: this.elements['template'],
                autoload: false,
                styleClass: rowStyle,
                data: obj.data
            });
            this.addModule(listItem);
        }
       
        this.applyOnItems = function(callback, args) {
            var data = this.items;
            for(var i = 0, item; item = data[i]; i++) {
                var newargs = [].concat(args);
                newargs.unshift(item);
                callback.apply(item, newargs);
            }
        }

        //XXX this returns index of DATA not ITEM
        this.getItemIndex = function(item) {
            for (var i = 0, curItem; curItem = this.data[i]; i++) {
                if (curItem === item) return i;
            };
            return null;
        }

        //XXX this is filtering DATA not ITEM
        this.filterBy = function(filterObj) {
            return this.data.filter(function(item, index, array) {
                var result = true;
                for (var key in filterObj) {
                    result = result && (filterObj[key] == Refuel.resolveChain(key, item));
                }
                return result;
            });
        }

        this.filterApply = function(filterObj) { 
            filterApplied = filterObj;
            var filtered = this.filterBy(filterObj);
            set.call(this, filtered);
            return filtered;
        }

        this.filterClear = function() {
            filterApplied = null;
            set.call(this);
        }

});