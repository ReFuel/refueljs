//{requires: 'Template', inherits: 'Template'},
defineModule('AbstractModule', ['Template'], function(template) {
    return function AbstractModule () {

        var self = this;
        var eventMap = {};
        //
        //var root = document.querySelector("#todoapp");
        //DOMParser(root);
        //var dom = getSymbolTable(); 
        //templateBinder(root, dom);
        //var template = new
        //

        this.genericEventHandler = function(e) {
            self[e.method].call(self, e);
        }

        this.notify = function(name, data){
            if (!name || typeof(name)!=='string') {
                throw new TypeError("Invalid event name '" + name);
            }
            if (!data || typeof(data)!=='object') {
                throw new TypeError("Invalid event data '" + data);
            }

            if (eventMap[name] instanceof Array) {
                var listeners = [].concat(eventMap[name]);
                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].call(this, data);
                }
            }
        }

        this.subscribe = function(name, handler) {
            if (!name || typeof(name)!=='string') {
                throw new TypeError("Invalid event name '" + name);
            }
            if (!handler || typeof(handler)!=='function') {
                throw new TypeError("Invalid event handler '" + handler);
            }

            if (typeof eventMap[name] === "undefined") {
                eventMap[name] = [];
            }

            eventMap[name].push(handler);
        }

        //template.subscribe('genericBinderEvent', this.genericEventHandler);

    }
});


