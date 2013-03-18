/**
Symbol-Structure = {
	action: replaceText|replaceAttributeValue|loop|method
	attribute: [DOM Reference to an Attribute if symbol is inside an attribute]
	attributeName: [if attribute is present]
	originalContent: original content of the symbol, not resolved
	linkedTo: The name of the property the symbol is linked to
}
*/

define(['Core','Events'], function(Core,Events) {
	return function Template (tRoot) {
		var self = this;
		var root = tRoot;
		Core.implement(Events, this);
		this.markMissedRefs = true;
		this.bindingsProxy = null;

		var regExpToMatchName = new RegExp('data-rf-(\\w*)');
		var regExpToMatchValue = new RegExp('\\{\\{(.*)\\}\\}');
		var attributeRegExp = new RegExp('data-rf-method-','i');
		var datasetRegExp = new RegExp('rfMethod', 'i');
		
		var eventTable = {};
		var symbolTable = [];

		function parseAttributes(node, symbolTable, regExpToMatchName, regExpToMatchValue, refId,
			 					/* privates */ nodeAttributes, matchedElms, attribute, attributeName, attributeValue) {
			nodeAttributes = node.attributes;
			var parsedAttributes = [];
			for (var i = 0; attribute = nodeAttributes[i]; i++) {
				if (!attribute.specified) continue;
				attributeName = attribute.name;
				attributeValue = attribute.value;
				var matchedElms = null;
				var symbol;
				//Attribute is like data-rf-*
				if (matchedElms = attributeName.match(regExpToMatchName)) {
					symbol = {
						action: matchedElms[1],
						attribute: attribute,
						attributeName: attributeName,
						domElement: node,
						linkedTo: attributeValue,
						originalSymbol: attributeValue
					};
					if (symbol.action == 'loop') symbol.symbolTable = [];
				}
				//Attribute Value contains {{*}}
				else if (matchedElms = attributeValue.match(regExpToMatchValue)) {
					symbol = {
						action: 'replaceAttributeValue',
						attribute: attribute,
						attributeName: attributeName,
						domElement: node,
						linkedTo: matchedElms[1],
						originalSymbol: matchedElms[0]
					};
				}
				//parse linkedSymbol and options separated with ':'
				if (matchedElms) {
					symbol.originalContent = attributeValue;
					var opts = symbol.linkedTo.split(':'); //<*--					
					symbol.linkedTo = opts.length > 1 ? opts[1] : opts[0];
					if (opts.length > 1) symbol.options = opts[0];
				}

				if (symbol) {
					symbolTable.push(symbol);
					parsedAttributes[symbol.action] = symbol; 
				}
			}
			//return a list of actions to the dom parser to know what kind of features that element has
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
		}

		// Per un bug degli eventi del dom, non è possibile associare ad un elemento l'evento doppio click e il click. 
		// Diventa allora difficile agganciare tutti gli eventi alla root del template (TODO add a workaround)
		function templateBinder (rootEl, symbolTable) {
			//console.log('binder with', symbolTable.length);
			for(var i = 0, symbol;  symbol = symbolTable[i]; i++) {
				if (symbol.action === 'method') {
					var eventType = (symbol.attributeName === 'data-rf-method' ? 'click' : symbol.attributeName.replace(attributeRegExp, '')); 
					if (!eventTable[eventType]) {
						if (rootEl.addEventListener) {
							rootEl.addEventListener(eventType, notifyEvent, false); 
						} else if (el.attachEvent) {
							rootEl.attachEvent('on'+eventType, notifyEvent);
						}
						//console.log('registered:', eventType);
						eventTable[eventType] = true;
					}
				}
				if (symbol.options == 'autoupdate') {
					self.notify('_autoupdate', {symbol: symbol});
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
				case 3: //Text Node
					if (matchedElms = nodeValue.match(regExpToMatchValue)) {
						//The nodeContent CAN contain two parameters separed by ':'
						var opts = matchedElms[1].split(':');
						var linkedTo = opts.length > 1 ? opts[1] : opts[0];
						var symbol = {
							action: 'replaceText',
							domElement: node.parentElement,
							textNode: node,
							originalContent: nodeValue,
							originalSymbol: matchedElms[0],
							linkedTo: linkedTo
						}
						if (opts.length > 1) symbol.options = opts[0];
						localSymbolTable.push(symbol);
					}
				break;
			}
			if (node == root) templateBinder(node, symbolTable);
		}

		//RENDERER
		/**
		*	@param data array or object of data to insert inside the template 
		*/
		this.render = function(data, tSymbolTable) {
			console.log('render', data, tSymbolTable);

			if (!data) console.error('Template::render data argument is null');
			if (!tSymbolTable) tSymbolTable = symbolTable;

			for(var i = 0, symbol;  symbol = tSymbolTable[i]; i++) {
				self.renderSymbol(symbol, data)
			}
		}
		this.renderSymbol = function(symbol, data) {
			var linkedData = Core.resolveChain(symbol.linkedTo, data) || '';
			
			switch(symbol.action) {
				case 'replaceText': 
					//console.log('renderSymbol',symbol, data);
					markMissing(symbol, linkedData);
					symbol.textNode.textContent = symbol.originalContent.replace(symbol.originalSymbol, linkedData);
				break;
				
				case 'replaceAttributeValue':
					markMissing(symbol);
					switch(symbol.attributeName) {
						case 'checked':
						case 'selected':
							linkedData ? symbol.domElement.setAttribute(symbol.attributeName, 'true') : 
										 symbol.domElement.removeAttribute(symbol.attributeName)
							symbol.attribute.value = linkedData == true;
						break;
						default:
							symbol.attribute.value = symbol.originalContent.replace(symbol.originalSymbol, linkedData);	
					}
				break;

				case 'loop':
					//TODO da fattorizzare
					symbol.elements = [];
					symbol.domElement.innerHTML = '';
					console.log('renderSymbol',  symbol.linkedTo, data[symbol.linkedTo]);
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
						html.setAttribute("data-rf-id", i);
						symbol.domElement.appendChild(html);
					};
					
					
				break;
			}
		}

		function markMissing(symbol, linkedData) {
			if (self.markMissedRefs &&  typeof(linkedData) == 'undefined') {
				symbol.domElement.style.border = "1px solid red";
				//console.warn('missing', symbol.linkedTo, typeof linkedData);
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