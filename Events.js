Refuel.define('Events',
	function Events() {
		if(this.notify && this.subscribe) return;
		var onGoingNotification = {};
		this.eventTable = onGoingNotification;
		this.notify = function(name, data, bubble){
			if (!name || typeof(name)!=='string'){
				throw new TypeError("Invalid event name '" + name);
			}	
			data = data || {};
			data.type = name;

			if (onGoingNotification[name] instanceof Array) {
				var listeners = [].concat(onGoingNotification[name]);
				for (var i = 0, len = listeners.length; i < len; i++) {
					listeners[i].call(this, data);
				}
			}
		}

		this.subscribe = function(name, handler){
			if (!name || typeof(name)!=='string'){
				throw new TypeError("Invalid event name '" + name);
			}
			if (!handler || typeof(handler)!=='function'){
				throw new TypeError("Invalid event handler '" + handler);
			}

			if (typeof onGoingNotification[name] === "undefined") {
				onGoingNotification[name] = [];
			}
			onGoingNotification[name].push(handler);
		}

		this.isSubscribed = function(name) {
			return !Refuel.isUndefined(onGoingNotification[name]);
		}
		this.unsubscribe = function(name) {
			delete onGoingNotification[name];
		}
		this.unsubscribeAll = function() {
			onGoingNotification = {};
		}
});


