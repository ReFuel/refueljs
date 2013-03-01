/* il Binder deve processare la symbolTable,
 * associando gli elementi method ai metodi del modulo "owner" del template 
 * prende la symbolTable 
 * agganciare listener al dom
 * al fire dell'evento richiamare callback
*/

function notifyEvent(e) {
	e.preventDefault(); //occorre????
	notify('templateEvent', e); //Nome dell'evento????'
}

function templateBinder(root, symbolTable) {
	/*var*/eventTable = {};
	for(var i = 0, symbol;  symbol = symbolTable[i]; i++) {
		if (symbol.action === 'method') {
			var event = symbol.attributeName === 'data-rf-method' ? 'click' : symbol.attributeName.split('-rf-method-')[1]; //prestazioni!!!
			if (!eventTable[event]) {
				root.addEventListener(event, notifyEvent, true);
				console.log('registered:', event, symbol.domElement)
				eventTable[event] = true;
			}
		}
	}
}