/**
*   @class Filter
*
*   @author Matteo Burgassi
*/

Refuel.define('Filter',
    function Filter() {
        var self = this;
		var items=[];

		this.where = function(clause) {
			var item;
			var newArray = new Array();
			for (var index = 0; index < items.length; index++) {
				if (clause(items[index], index)) {
					newArray[newArray.length] = items[index];
				}
			}
			items = newArray;
			return this;
		}
		this.select = function(clause) {
			var item;
			var newArray = new Array();
			for (var i = 0; i < items.length; i++) {
				if (clause(items[i])) {
					newArray[newArray.length] = clause(items[i]);
				}
			}
			items = newArray;
			return this;
		}
		this.orderBy = function(clause) {
			var tempArray = new Array();
			for (var i = 0; i < items.length; i++) {
				tempArray[tempArray.length] = items[i];
			}
			items = tempArray.sort(function(a, b) {
				var x = clause(a);
				var y = clause(b);
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
			return this;
		}
		this.orderByDescending = function(clause) {
			var tempArray = new Array();
			for (var i = 0; i < items.length; i++) {
				tempArray[tempArray.length] = items[i];
			}
			items = tempArray.sort(function(a, b) {
				var x = clause(b);
				var y = clause(a);
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
			return this;
		}
		this.returnResult = function() {
			return items;
		}

}) 
