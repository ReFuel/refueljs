/**
    @param root: HTMLElement,
    @param symbol: Parsed template symbol, if this symbol exists, this Module's Template has been already parsed
    
    @param items Array of ListItemModule [read only]

**/
Refuel.define('ListModule',{inherits: 'BasicModule', require:'ListItemModule'}, 
    function ListModule() {
        var ENTER_KEY = 13;
        this.items = [];
        var label;   

        this.init = function(myConfig) {
            this.config = Refuel.mix(this.config, myConfig);
            this.defineUpdateManager(oa_update.bind(this));
            label = this.label = this.config.label;
        }

        this.create = function() {
            this.template.subscribe('_new_listitem', addListItem, this);
            this.template.setRoot(this.config.root);
            this.enableAutoUpdate(this.dataSource.getData(), label);
        }

        this.add = function(objData) {
            this.dataSource.getData()[label].push(objData);
        }

        this.remove = function(objData) {
            var index = this.getItemIndex(objData);
            this.dataSource.getData()[label].splice(index, 1);    
        }
        this.removeAt = function(index) {
            this.dataSource.getData()[label].splice(index, 1);    
        }
        this.update = function(objData) {
            var obj = {};
            obj[label] = objData;
            this.dataSource.setData(obj);
        }

        function oa_update(e) {
            switch(e.action) {
                case 'add': 
                    addListItem.call(this,{data: e.data, index:e.index});
                break;
                case 'delete': 
                    removeListItem.call(this, {index: e.index});
                break;
                break;
                case 'filterApply': 
                case 'filterClear': 
                    this.draw();
                break;
            }
        }

        //Data change callbacks
        function removeListItem(e) {
            this.items[e.index].template.remove();
            this.items.splice(e.index, 1);
        }
        function addListItem(obj) {
            var rootSymbol = this.template.getSymbolByAction('list');
            var listItem = Refuel.createInstance('ListItemModule', { 
                parentRoot: this.config.root, 
                template: rootSymbol.template
            });

            //listItem.dataSource.setData(obj.data);
            listItem.dataSource.setData(this.dataSource.getData()[label][obj.index]);

            this.addModule(listItem);

            listItem.create();
            listItem.draw();
        }

        //TODO defineAction('add') ?

        this.defineAction('delete', function(e) {
            this.remove(e.module)
        });

        this.applyOnItems = function(callback, args) {
            var data = this.items;
            for(var i = 0, item; item = data[i]; i++) {
                var newargs = [].concat(args);
                newargs.unshift(item);
                callback.apply(item, newargs);
            }
        }

        this.getItemIndex = function(item) {
            for (var i = 0, curItem; curItem = this.items[i]; i++) {
                if (curItem === item) return i;
            };
            return null;
        }

        this.applyFilterBy = function(prop, negated, permanent) {
            this.dataSource.getData()[label].applyFilter(function(item, index, array) {
                var value = Refuel.resolveChain(prop, item);
                if (negated) value = !value;
                return value;
            });
            if (permanent) this.dataSource.getData()[label].consolidate();
        }

        this.filterBy = function(prop, negated) {
            return this.dataSource.getData()[label].filter(function(item, index, array) {
                var value = Refuel.resolveChain(prop, item);
                if (negated) value = !value;
                return value;
            });
        }

        this.filterClear = function() {
            this.dataSource.getData()[label].filterClear();
        }

});