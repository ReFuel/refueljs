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

        this.doFilter = function(param) {
            var data = this.dataSource.getData().todoList; // da cambiare nell'array vero
            switch(param){
                case 'completed': {
                    data = Filter(data).where(function(item) {return item.done === true}).returnResult();
                    break;
                }
                case 'active': {
                    data = Filter(data).where(function(item) {return item.done === false}).returnResult();
                    break;
                }
                default: {
                    return data;
                }
            }
        }

        this.add = function(objData) {
            console.error('ListModule.add', objData);
            addListItem({data: objData});
        }
               
        this.update = function(e) {
            if (e.keyCode === ENTER_KEY) {
                e.currentTarget.className = e.currentTarget.className.replace(" editing", "");
//                 this.dataSource.data.todoList[+e.currentTarget.dataset.rfId].text = e.target.value;
            }
        }

        function oa_update(e) {
            switch(e.action) {
                case 'add': 
                    addListItem({data: e.data, observer: e.observer});
                break;
                case 'delete': {
                    removeListItem({index: e.index});
                }
                break;
                case 'filter': {
                    console.log('ListModule.oa_update', e);
                    self.draw();
                }
                break;
            }
        }

        function removeListItem(e) {
            self.items[e.index].template.remove();
            self.items.splice(e.index, 1);
        }

        //XXX fattorizzare l'add di un elemento?
        function addListItem(e) {
            var rootSymbol = self.template.getSymbolByAction('list');
            var listItem = Refuel.createInstance('ListItemModule', { 
                parentRoot: self.config.root, 
                template: rootSymbol.template
            });
            listItem.dataSource.setData(e.data);
            self.addModule(listItem);

            listItem.create();
            listItem.draw();
        }


        //TODO defineAction('add') ?
        this.defineAction('delete', function(e) {
            var index = this.getItemIndex(e.module);
            var ds = this.dataSource.getData()[label];
            ds.splice(index, 1);    
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

        this.filterBy = function(prop, negated) {
            //var newDS = {}; 
            //newDS[label] = 
            this.dataSource.getData()[label].filter(function(item, index, array) {
                var value = Refuel.resolveChain(prop, item);
                if (negated) value = !value;
                return value;
            });
            
            //console.log(this.dataSource.getData(),newDS);

            //NON deve essere risettato il DS
            //var obj = {};
            //obj[label] = newDS;
            //this.dataSource.setData(newDS);
        }

        this.filterClear = function() {
            this.dataSource.getData()[label].filterClear();
        }

});