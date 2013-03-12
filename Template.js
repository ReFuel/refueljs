define(['Core','Events'], function(Core,Events) {
	return function Template (tRoot) {
		var self = this;
		var root = tRoot;
		Core.implement(Events, this);
		this.markMissedRefs = true;
		this.bindingsProxy = null;
		//	PARSER
		var regExpToMatchName = new RegExp('data-rf-(\\w*)');
		var regExpToMatchValue = new RegExp('\\{\\{(.*)\\}\\}');
		var attributeRegExp = new RegExp('data-rf-method-','i');
		var datasetRegExp = new RegExp('rfMethod', 'i');
		
		//	BINDER
		var eventTable = {};
		var symbolTable = [];

		//TODO Clonare la root dentro un fragment
		//TODO Trasformare in hash con un ID = chiave primaria (generare id seq. se non definito nel dom)
		function parseAttributes(node, symbolTable, regExpToMatchName, regExpToMatchValue, refId,
			 					/* privates */ nodeAttributes, matchedElms, attribute, attributeName, attributeValue) {
			nodeAttributes = node.attributes;
			var parsedAttributes = [];
			for (var i = 0; attribute = nodeAttributes[i]; i++) {
				attributeName = attribute.name;
				attributeValue = attribute.value;
				if (!attribute.specified || attribute.name == 'data-rf-name' || attribute.name == 'data-rf-parent') {
					continue;
				}
				var name = node.getAttribute('data-rf-name');
				var symbol;
				if (matchedElms = attributeName.match(regExpToMatchName)) {
					symbol = {
						domElement: node,
						action: matchedElms[1],
						attribute: attribute,
						attributeName: attributeName,
						attributeValue: attributeValue,
						match: matchedElms,
						name: name,
						symbolTable: []
					};
				}
				else if (matchedElms = attributeValue.match(regExpToMatchValue)) {
					symbol = {
						domElement: node,
						action: 'replaceAttributeValue',
						attribute: attribute,
						attributeName: attributeName,
						attributeValue: attributeValue,
						match: matchedElms,
						name: name
					};
				}
				if (symbol) {
					symbolTable.push(symbol);
					parsedAttributes[symbol.action] = symbol; 
				}
			}
			return parsedAttributes;
		}


		function hasDataMethod(element, type) {
			for (var i in element.dataset) {
				var method = i.replace(datasetRegExp, '');
				return method.toLowerCase() === type || method === ''; 
			}
		}

		function notifyEvent(e) {
			self.bindingsProxy = self.bindingsProxy || self;
			if (eventTable[e.type] && hasDataMethod(e.target, e.type)) {
				e.method = (e.type === 'click'? 
					e.target.dataset['rfMethod'] || e.target.dataset['rfMethodClick'] : 
					e.target.getAttribute('data-rf-method-' + e.type)
			    );
				self.bindingsProxy.notify('genericBinderEvent', e);
			}
			//TODO preventDefault: Why Judy, why?
			//event.preventDefault ? event.preventDefault() : event.returnValue = false;
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
							rootEl.attachEvent('on'+eventType, notifyEvent);
						}
						console.log('registered:', eventType);
						eventTable[eventType] = true;
					}
				}
			}
		}

		/**
		*	@param node HTMLDomElement to be processed as root
		*	@param localSymbolTable can be passed to define another scope for the symbiol table (like in loops)
		*/
		this.parser = function(node, localSymbolTable,
						   /* privates */ nodeValue, matchedElms) {
			if (!localSymbolTable) localSymbolTable = symbolTable;
			var node = node || root;
			nodeValue = node.nodeValue;
			switch (node.nodeType){
				case 1:
					var parsedAttributes = parseAttributes(node, localSymbolTable, regExpToMatchName, regExpToMatchValue);
					var loopSymbol = parsedAttributes['loop'];
					if (loopSymbol) {
						var troot = loopSymbol.domElement;
						var child = troot.querySelector("[data-rf-template]"); 
						var tmpl = troot.removeChild(child);
						loopSymbol.template = tmpl;
						this.parser(tmpl, loopSymbol.symbolTable);
					}
					else {
						for (var i=0, childElm; childElm = node.childNodes[i++];) {
							this.parser(childElm, localSymbolTable);
						}	
					}
				break;
				case 3:
					if (matchedElms = nodeValue.match(regExpToMatchValue)) {
						localSymbolTable.push({
							textNode: node,
							domElement: node.parentElement,
							action: 'replaceText',
							text: nodeValue,
							match: matchedElms
						});
					}
				break;
			}
			templateBinder(root, symbolTable);	
		}


		//RENDERER
		/**
		*	@param data array or object of data to insert inside the template 
		*/
		this.render = function(data, tSymbolTable) {
			if (!data) console.error('Template::render data argument is null');
			if (!tSymbolTable) tSymbolTable = symbolTable;
			for(var i = 0, symbol;  symbol = tSymbolTable[i]; i++) {
				renderSymbol(data, symbol)
			}
		}
		function renderSymbol(data, symbol) {
			//console.log(symbol);
			switch(symbol.action) {
				case 'replaceText': 
					var linkedData = Core.resolveChain(symbol.match[1], data) || '';
					if (!linkedData && self.markMissedRefs) symbol.domElement.style.border = "1px solid red";
					symbol.textNode.textContent = symbol.text.replace(symbol.match[0], linkedData);
				break;
				case 'replaceAttributeValue':
					var linkedData = Core.resolveChain(symbol.match[1], data) || '';
					if (!linkedData && self.markMissedRefs) symbol.domElement.style.border = "1px solid red";

					switch(symbol.attributeName) {
						case 'checked':
						case 'selected':
							linkedData ? symbol.domElement.setAttribute(symbol.attributeName, 'true') : 
										 symbol.domElement.removeAttribute(symbol.attributeName)
							symbol.attribute.value = linkedData == true;
						break;
						default:
							symbol.attribute.value = symbol.attributeValue.replace(symbol.match[0], linkedData);	
					}
				break;
				case 'loop':
					//TODO da fattorizzare
					var linkedData = Core.resolveChain(symbol.attributeValue, data) || '';
					symbol.elements = [];

					
					for (var i = 0; i < linkedData.length; i++) {
						var domClone = symbol.template.cloneNode(true);
						var tmpl = new Template(domClone);
						tmpl.bindingsProxy = self;

						//La symbol table per ogni elemento non ha bisogno di essere ri-parsata ogni volta
						//andrebbe parsata una volta dal main-tmpl, clonata e passata direttamente al template 
						//con un metodo apposito 
						tmpl.parser();
						tmpl.render(linkedData[i]);
						symbol.elements.push(tmpl);
						var html = tmpl.getRoot();
						symbol.domElement.appendChild(html);
					};
					
					
				break;
			}
		}


		this.getSymbolByName = function(name) {
			for(var i = 0, symbol;  symbol = symbolTable[i]; i++) {
				if(symbol.name && symbol.name == name) return symbol;
			}
		}
		this.getSymbolTable = function() {
			return symbolTable;
		}
		this.setRoot = function(r) {
			root = r;
		}
		this.getRoot = function() {
			return root;
		}
		this.getBindings = function() {
			return eventTable;
		}

	};
});