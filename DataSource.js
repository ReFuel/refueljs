//TODO Rename in BasicModule?
define(['Events', 'ajax', 'localstorage'], function(Events, ajax, localstorage) {
	var data = {};
	var iface;
    return function DataSource(options) {
    	var self = this;
    	Refuel.implement(Events, this);    	
		
		this.setData = function(newData) {
			data = newData;
			self.notify("dataAvailable", self.getData());
		}
		
		this.getData = function() {
			return data;
		}
		
// 		this.push = function(obj) {
// 			if(obj){
// 				var res;
// 				if (data.push) {
// 					res = data.push(obj);
// 				}
// 				else {
// 					res = [];
// 					if(!isEmpty(data)) {
// 						res.push(data);
// 						res.push(obj);
// 						data = res;
// 					}
// 					else {
// 						return data = obj;
// 					}
// 				}
// 				self.notify("dataModified", self.getData());
// 				return res;
// 			}
// 		}
// 		
// 		this.pop = function() {
// 			var res;
// 			if (data.pop) {
// 				res = data.pop();
// 			}
// 			else {
// 				res = data;
// 				data = {};
// 			}
// 			self.notify("dataModified", self.getData());
// 			return res;
// 		}
		
		function isEmpty(obj) {
			if (Object.keys) {
				return !Object.keys(obj).length;
			}
			for(var i in obj) {
				if (obj.hasOwnProperty(i)) { return false; }
			}
			return true;
		}
		
		function initialize(options, iface) {
			if (!options) {
				return;
			}
			if (options.url) {
				//wrap ajax comunication:
				iface = {
					//set the dataSource interface here
				}
			}
			else if (options.key) {
				//wrap localstorage comunication:
				iface = {
					//set the dataSource interface here
				}
			}
		}
		
		initialize();
		return iface;
			
    }
});
