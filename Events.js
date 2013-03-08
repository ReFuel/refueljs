function Events() {
	var onGoingNotification = {};

	function notify(name, data){
		if (!name || typeof(name)!=='string'){
			throw new TypeError("Invalid event name '" + name);
		}
		if (!data || typeof(data)!=='object'){
			throw new TypeError("Invalid event data '" + data);
		}

		if (onGoingNotification[name] instanceof Array) {
			var listeners = [].concat(onGoingNotification[name]);
			for (var i = 0, len = listeners.length; i < len; i++) {
				listeners[i].call(this, data);
			}
		}
	}

	function subscribe(name, handler){
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
	return {
		notify: notify,
		subscribe: subscribe
	}
}
