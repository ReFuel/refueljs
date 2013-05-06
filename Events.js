/**
*   @class Events
*
*   @author Matteo Burgassi
*/
/*
	onGoingNotification {
		'event_name01': [
			0 : {
				callback: function(event) {} 			
				context: object_or_class
			}
			1: ...
		]
		'event_name02': ...
	}
*/
Refuel.define('Events',
	function Events() {
		if(this.notify && this.subscribe) return;
		var onGoingNotification = {};
		this.notify = function(name, data, bubble){
			if (!name || typeof(name)!=='string'){
				throw new TypeError('Invalid event name ' + name);
			}	
			data = data || {};
			
			if (onGoingNotification[name] instanceof Array) {
				var handlers = [].concat(onGoingNotification[name]);
				for (var i = 0, handler; handler = handlers[i]; i++) {
					handler.callback.call(handler.context, data);
				}
			}
		}

		this.subscribe = function(name, callback, context){
			if (!name || typeof(name)!=='string'){
				throw new TypeError('Invalid event name ' + name);
			}
			if (!callback || typeof(callback)!=='function'){
				throw new TypeError('Invalid event callback ' + callback);
			}
			if (!context) context = this;

			if (typeof onGoingNotification[name] === 'undefined') {
				onGoingNotification[name] = [];
			}

			var handler = {
				'callback': callback,
				'context': context
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


