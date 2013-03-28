define(function() {
	if (!window.localStorage) {
		console.error("local storage unavailable");
		return;
	}
	
	function get(key) {
		return localStorage.getItem(key);
	}
	function set(key, data) {
		localStorage.setItem(key, JSON.stringify(data));
	}
	function remove(key) {
		localStorage.removeItem(key);
	}
	
	return {
		get: get,
		set: set,
		update: set,
		remove: remove
	}
})