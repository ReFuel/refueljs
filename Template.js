define(function() {
	return function Template () {

		//	PARSER
		var regExpToMatchName = new RegExp("data-rf-(\\w*)");
		var regExpToMatchValue = new RegExp("\\{\\{(.*)\\}\\}");
		var symbolTable = [];
		var referenceCounter = 0;
		
		//TODO Clonare la root dentro un fragment
		//TODO Trasformare in hash con un ID = chiave primaria (generare id seq. se non definito nel dom)
		function _parseAttributes(symbolTable, node, regExpToMatchName, regExpToMatchValue, refId,
			 					/* privates */ nodeAttributes, matchedElms, attribute, attributeName, attributeValue) {
			nodeAttributes = node.attributes;
			for (var i = 0; attribute = nodeAttributes[i]; i++) {
				attributeName = attribute.name;
				attributeValue = attribute.value;
				if (!attribute.specified) { // prevents parsing default and unspecified attributes
					continue;
				}
				if (matchedElms = attributeName.match(regExpToMatchName)) {

					symbolTable.push({
						domElement: node,
						action: matchedElms[1],
						attribute: attribute,
						attributeName: attributeName,
						attributeValue: attributeValue
					});
				}
				else if (regExpToMatchValue.test(attributeValue)) {
					symbolTable.push({
						domElement: node,
						action: "replaceAttributeValue",
						attribute: attribute,
						attributeName: attributeName,
						attributeValue: attributeValue
					});
				}
			}
		}

		function DOMParser(node,
						   /* privates */ nodeValue, matchedElms) {
			nodeValue = node.nodeValue;
			switch (node.nodeType){
				case 1:
					_parseAttributes(symbolTable, node, regExpToMatchName, regExpToMatchValue);
					for (var i=0, childElm; childElm = node.childNodes[i++];) {
						DOMParser(childElm);
					}
					this.events.notify('myEvent', {'symbolTable': symbolTable});
					break;
				case 3:
					//if (regExpToMatchValue.test(nodeValue)) {
					if (matchedElms = nodeValue.match(regExpToMatchValue)) {
						symbolTable.push({
							textNode: node,
							domElement: node.parentElement,
							action: "replaceText",
							text: nodeValue
						});
					}
					break;
			}
		}

		function getSymbolTable() {
			return symbolTable;
		}


		//	BINDER
		var eventTable = {};
		var attributeRegExp = new RegExp('data-rf-method-','i');
		var datasetRegExp = new RegExp('rfMethod', 'i');

		function hasDataMethod(element, type) {
			for (var i in element.dataset) {
				var method = i.replace(datasetRegExp, '');
				return method.toLowerCase() === type || method === ''; 
			}
		}

		function notifyEvent(e) {
			debugger;
			if (eventTable[e.type] && hasDataMethod(e.target, e.type)) {
				e.method = (e.type === "click"? 
					e.target.dataset["rfMethod"] || e.target.dataset["rfMethodClick"] : 
					e.target.getAttribute("data-rf-method-" + e.type)
			    );
				notify('genericBinderEvent', e);
			}
			event.preventDefault ? event.preventDefault() : event.returnValue = false;
		}
		// Per un bug degli eventi del dom, non è possibile associare ad un elemento l'evento doppio click e il click. 
		// Diventa allora difficile agganciare tutti gli eventi alla root del template (to do: add a workaround)
		function templateBinder (root, symbolTable) {
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

		//RENDERER





		return {
	    	getSymbolTable: getSymbolTable,
			DOMParser: DOMParser,
			hasDataMethod: hasDataMethod,
			notifyEvent: notifyEvent,
			templateBinder: templateBinder
	    };
	};
});