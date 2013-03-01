/* il Binder deve processare la symbolTable,
 * associando gli elementi method ai metodi del modulo "owner" del template 
 * prende la symbolTable 
 * agganciare listener al dom
 * al fire dell'evento notificare all'esterno tale evento
*/
var eventTable = {};

function hasDataMethod(element, type) {
	for (var i in element.dataset) {
		var res = (i.replace(/^rfMethod/, '').toLowerCase()) === type; 
		return res || i.replace(/^rfMethod/, '') === '';
	}
}

function notifyEvent(e) {
	if (eventTable[e.type] && hasDataMethod(e.target, e.type)) {
		notify(e.type, e)
	}
	e.preventDefault();
}

function templateBinder(root, symbolTable) {

	for(var i = 0, symbol;  symbol = symbolTable[i]; i++) {
		if (symbol.action === 'method') {
			var eventType = symbol.attributeName === 'data-rf-method' ? 'click' : symbol.attributeName.split('-rf-method-')[1]; //prestazioni!!!
			if (!eventTable[eventType]) {
				if (root.addEventListener) {
					root.addEventListener(eventType, notifyEvent, false); 
				} else if (el.attachEvent) {
					root.attachEvent(eventType, notifyEvent);
				}
				console.log('registered:', eventType)
				eventTable[eventType] = true;
			}
		}
	}
}