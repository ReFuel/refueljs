define('Template', ['Core','Events'], function(Core,Events) {
	return function Template (tRoot) {
		var self = this;
		var root = tRoot;
		Core.implement(Events, this);
		this.autoBindActive = true;
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

		this.parser = function(node,
						   /* privates */ nodeValue, matchedElms) {
			var node = node || root;
			nodeValue = node.nodeValue;
			switch (node.nodeType){
				case 1:
					_parseAttributes(symbolTable, node, regExpToMatchName, regExpToMatchValue);
					for (var i=0, childElm; childElm = node.childNodes[i++];) {
						this.parser(childElm);
					}
					self.notify('myEvent', {'symbolTable': symbolTable});
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
			autoBind();
		}

		this.getSymbolTable = function() {
			return symbolTable;
		}
		this.setRoot = function(r) {
			root = r;
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
			if (eventTable[e.type] && hasDataMethod(e.target, e.type)) {
				e.method = (e.type === "click"? 
					e.target.dataset["rfMethod"] || e.target.dataset["rfMethodClick"] : 
					e.target.getAttribute("data-rf-method-" + e.type)
			    );
			    console.log('Template.events.notify',e);
				self.notify('genericBinderEvent', e);
			}
			event.preventDefault ? event.preventDefault() : event.returnValue = false;
		}
		// Per un bug degli eventi del dom, non è possibile associare ad un elemento l'evento doppio click e il click. 
		// Diventa allora difficile agganciare tutti gli eventi alla root del template (TODO add a workaround)
		function templateBinder (rootEl, symbolTable) {
			for(var i = 0, symbol;  symbol = symbolTable[i]; i++) {
				if (symbol.action === 'method') {
					var eventType = (symbol.attributeName === 'data-rf-method' ? 'click' : symbol.attributeName.replace(attributeRegExp, '')); 
					if (!eventTable[eventType]) {
						if (rootEl.addEventListener) {
							rootEl.addEventListener(eventType, notifyEvent, false); 
						} else if (el.attachEvent) {
							rootEl.attachEvent("on"+eventType, notifyEvent);
						}
						console.log('registered:', eventType);
						eventTable[eventType] = true;
					}
				}
			}
		}
		function autoBind() {
			if (self.autoBindActive) {
				templateBinder(root, symbolTable);
			}
		}
		//RENDERER

	};
});