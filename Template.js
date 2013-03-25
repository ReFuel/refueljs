/**
Symbol-Structure = {
	action: replaceText|replaceAttributeValue|loop|method
	attribute: [DOM Reference to an Attribute if symbol is inside an attribute]
	attributeName: [if attribute is present]
	originalContent: original content of the symbol, not resolved
	linkedTo: The name of the property the symbol is linked to
}
*/

define(['Events'], function(Events) {
	return function Template (tRoot) {
		var self = this;
		var root = tRoot;
		var profiler = {};
		Refuel.implement(Events, this);
		this.markMissedRefs = false;
		this.bindingsProxy = null;

		var regExpToMatchName = new RegExp('data-rf-(\\w*)');
		var regExpToMatchValue = new RegExp('\\{\\{(.*)\\}\\}');
		var attributeRegExp = new RegExp('data-rf-method-','i');
		var datasetRegExp = new RegExp('rfMethod', 'i');
		
		var eventTable = {};
		var symbolTable = [];
		
		function parseDOMElement(node, symbolTable, regExpToMatchName, regExpToMatchValue, refId,
			 					/* privates */ nodeAttributes, matchedElms, attribute, attributeName, attributeValue) {
			nodeAttributes = node.attributes;
			var parsedAttributes = {};
			parsedAttributes['elementSymbolTable'] = [];
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
					if (symbol.action === 'loop') symbol.symbolTable = [];
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
					parsedAttributes[symbol.action] = symbol; 
					parsedAttributes['elementSymbolTable'].push(symbol);
				}
			}
			//return a list of actions to the dom parser to know what kind of features that element has
			return parsedAttributes;
		}

		function hasDataMethod(element, type) {
			for (var i in element.dataset) {
				var method = i.replace(datasetRegExp, '');
				if (method.toLowerCase() === type || method === '') return true; 
			}
			return false;
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
			self.bindingsProxy = self.bindingsProxy || self;
			for(var i = 0, symbol;  symbol = symbolTable[i]; i++) {
				if (symbol.action === 'method') {
					var eventType = (symbol.attributeName === 'data-rf-method' ? 'click' : symbol.attributeName.replace(attributeRegExp, ''));
					if (!eventTable[eventType]) {
						if (rootEl.addEventListener) {
							rootEl.addEventListener(eventType, notifyEvent, false); 
						} else if (el.attachEvent) {
							rootEl.attachEvent('on'+eventType, notifyEvent);
						}
						eventTable[eventType] = true;
					}
				}
				if (symbol.options && symbol.options === 'autoupdate') {
					self.notify('_set_autoupdate', {symbol: symbol});
				}
				else if (symbol.options){

				}
			}
		}

		/**
		*	
		*	@param node HTMLDomElement to be processed as root
		*	@param localSymbolTable can be passed to define another scope for the symbiol table (like in loops)
		*/
		this.parse = function(node,
						   /* privates */ nodeValue, matchedElms) {
			var node = node || root;
			nodeValue = node.nodeValue;
			switch (node.nodeType){
				case 1:
					var parsedAttributes = parseDOMElement(node, symbolTable, regExpToMatchName, regExpToMatchValue);
					var isRoot = node === root;
					var loopSymbol = parsedAttributes['loop'];
					var listSymbol = parsedAttributes['list'];
					var templateSymbol = parsedAttributes['template'];
					
					//This code parses childrenNodes of the current DOMElement, there are some DOMElement that not always you should 
					//investigate inside, unless this particular node is the proper root of the current template.
					if (loopSymbol) {
						var tmplRoot = loopSymbol.domElement;
						var child = tmplRoot.querySelector("[data-rf-template]"); 
						var tmpl = tmplRoot.removeChild(child);
						loopSymbol.template = tmpl;
						this.parse(tmpl, loopSymbol.symbolTable);
					}
					else if ((templateSymbol || listSymbol) && !isRoot) { 

					}
					else if (listSymbol && isRoot) { 
						var tmplRoot = listSymbol.domElement;
						var child = tmplRoot.querySelector("[data-rf-template]"); 
						var tmpl = tmplRoot.removeChild(child);
						listSymbol.template = tmpl;
					}
					else {
						for (var i=0, childElm; childElm = node.childNodes[i++];) {
							this.parse(childElm, symbolTable);
						}	
					}
					
					symbolTable = symbolTable.concat(parsedAttributes['elementSymbolTable']);
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
						symbolTable.push(symbol);
					}
				break;
			}

			

			if (node === root) templateBinder(node, symbolTable);
			return symbolTable;
		}

		/**
		*	@param data array or object of data to insert inside the template 
		*	@tSymbolTable parsed template symbolTable to use, should be generated by the Template.parse method
		**/
		//TODO if !symbolTable should auto-parse
		this.render = function(data) {
			profiler.timestart = new Date().getTime();
			if (!data) console.error('Template::render data argument is null');
			if (!symbolTable.length) symbolTable = this.parse();
			self.notify('_template_parsed', {symbolTable: symbolTable});
			
			for(var i = 0, symbol;  symbol = symbolTable[i]; i++) {
				self.renderSymbol(symbol, data)
			}
			profiler.timestop = new Date().getTime();
			//if(profiler.enabled) console.log('Template.profiler[render]',root.id, profiler.timestop - profiler.timestart);
		}

		


		this.renderSymbol = function(symbol, data) {
			var isRoot = symbol.domElement === root;
			var linkedData = Refuel.resolveChain(symbol.linkedTo, data) || '';

			switch(symbol.action) {
				case 'replaceText': 
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
					//La symbol table per ogni elemento non ha bisogno di essere ri-parsata ogni volta
					//andrebbe parsata una volta dal main-tmpl, clonata e passata direttamente al template 
					//con un metodo apposito 
					symbol.elements = [];
					symbol.domElement.innerHTML = '';
					var docFragment = document.createDocumentFragment();
					for (var i = 0; i < linkedData.length; i++) {
						var el = createListElement(linkedData[i], symbol);
						el.setAttribute("data-rf-id", i);
						docFragment.appendChild(el);
					};
					symbol.domElement.appendChild(docFragment);
				break;
				case 'list':
					if (isRoot) {
						linkedData = Refuel.resolveChain('.', data) || '';
						for (var i = 0; i < linkedData.length; i++) {
							self.notify('_new_listitem', {symbol:symbol, data:linkedData[i]});
						}
					} 
					else {
						symbol.linkedData = linkedData;
						self.notify('_new_list', {symbol: symbol});
					}					
				break;
			}
		}

		/**
			Creates a new Template fragment and append it to the dom, this method is alternative to Template.render()
			
			@param rootElement root to append the newly created template into
			@param template template fragment to render data
			@param data 
			
		**/
		this.create = function(rootElement, template, data) {
			root = template.cloneNode(true);
			this.render(data);
			rootElement.appendChild(root);
		}

		function createListElement(data, parentSymbol) {
			var domClone = parentSymbol.template.cloneNode(true);
			var tmpl = new Template(domClone);
			tmpl.bindingsProxy = self;
			tmpl.parse();
			tmpl.render(data);
			parentSymbol.elements.push(tmpl);
			return tmpl.getRoot();
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
		this.getSymbolByAction = function(action) {
			for (var i = 0, symbol; symbol = symbolTable[i]; i++) {
				if (symbol.action === action) 
					return symbol;
			};
		}

		//TODO getter and setter?
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