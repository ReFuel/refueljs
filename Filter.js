define(function(){
	var items=[];
	return function Filter(data){
		
		function where(clause) {
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
		function select(clause) {
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
		function orderBy(clause) {
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
		function orderByDescending(clause) {
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
		function returnResult() {
			return items;
		}

		items = data;
		
		return{
			where: where,
			select: select,
			orderBy: orderBy,
			orderByDescending: orderByDescending,
			returnResult: returnResult
		}
	}
}) 
