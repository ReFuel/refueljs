/* il Binder deve processare la symbolTable,
 * associando gli elementi method ai metodi del modulo "owner" del template 
 * prende la symbolTable 
 * agganciare listener al dom
 * al fire dell'evento notificare all'esterno tale evento
*/

define(function() {
	var eventTable = {},
		attributeRegExp = new RegExp("data-rf-method-",'i'),
		datasetRegExp = new RegExp("rfMethod", 'i');

	this.hasDataMethod = function(element, type) {
		for (var i in element.dataset) {
			var method = i.replace(datasetRegExp, '');
			return method.toLowerCase() === type || method === ''; 
		}
	}

	this.notifyEvent = function(e) {
		debugger;
		if (eventTable[e.type] && hasDataMethod(e.target, e.type)) {
			e.method = (e.type === "click"? 
							e.target.dataset["rfMethod"] || e.target.dataset["rfMethodClick"] : 
							e.target.getAttribute("data-rf-method-" + e.type)
					   );
			//notify(e.type, e);
			notify('genericBinderEvent', e);
		}
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
	}
	// Per un bug degli eventi del dom, non è possibile associare ad un elemento l'evento doppio click e il click. 
	// Diventa allora difficile agganciare tutti gli eventi alla root del template (to do: add a workaround)
	this.templateBinder = function(root, symbolTable) {
		for(var i = 0, symbol;  symbol = symbolTable[i]; i++) {
			if (symbol.action === 'method') {
				var eventType = (symbol.attributeName === 'data-rf-method' ? 'click' : symbol.attributeName.replace(attributeRegExp, '')); 
				if (!eventTable[eventType]) {
					if (root.addEventListener) {
						root.addEventListener(eventType, notifyEvent, false); 
					} else if (el.attachEvent) {
						root.attachEvent("on"+eventType, notifyEvent);
					}
					console.log('registered:', eventType);
					eventTable[eventType] = true;
				}
			}
		}
	}
});