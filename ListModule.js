/**
    @param root: HTMLElement,
    @param symbol: Parsed template symbol, if this symbol exists, this Module's Template has been already parsed
    
    @param items Array of ListItemModule [read only]

**/
Refuel.define('ListModule',{inherits: 'BasicModule', require:'ListItemModule'}, 
    function ListModule() {
        var self = this;
        var ENTER_KEY = 13;
        this.items = [];
        var label;   

        this.init = function(myConfig) {
            this.config = Refuel.mix(this.config, myConfig);
            this.defineUpdateManager(oa_update);
            label = this.label = this.config.label;
        }

        this.create = function() {
            this.template.subscribe('_new_listitem', addListItem);
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

        function oa_update(e) {
            switch(e.action) {
                case 'add': 
                    addListItem({data: e.data, index:e.index});
                break;
                case 'delete': 
                    removeListItem({index: e.index});
                break;
                break;
                case 'filterApply': 
                case 'filterClear': 
                    self.draw(); 
                break;
            }
        }

        //Data change callbacks
        function removeListItem(e) {
            self.items[e.index].template.remove();
            self.items.splice(e.index, 1);
        }
        function addListItem(obj) {
            var rootSymbol = self.template.getSymbolByAction('list');
            var listItem = Refuel.createInstance('ListItemModule', { 
                parentRoot: self.config.root, 
                template: rootSymbol.template
            });

            //listItem.dataSource.setData(obj.data);
            listItem.dataSource.setData(self.dataSource.getData()[label][obj.index]);

            self.addModule(listItem);

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

        this.applyFilterBy = function(prop, negated) {
            this.dataSource.getData()[label].applyFilter(function(item, index, array) {
                var value = Refuel.resolveChain(prop, item);
                if (negated) value = !value;
                return value;
            });            
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