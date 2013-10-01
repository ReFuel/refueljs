/**
*   @class Template
*	@fires _generic_binder_event An event bound on the markup has been triggered
*	@fires _observe Notifies the module to observe some data marked as "observe" in the template
*	@fires _new_list Notifies the module to create a new List as per rf-list in template
*	@fires _new_listitem Notifies the module to create a new ListItem 
*	@fires parsingComplete 
*
*   @author Stefano Sergio
*/

Refuel.define('Template',{inherits: 'Events'}, function Template() {
		var self = this; //FIXME levare self
		var root, 
			config = {},
			profiler = {},
			bindingTable = {},
			symbolTable = [],
			templateBound = false;
		var refuelModules = Refuel.config.modules;
		var defaultPartsConfig = { strip: false, required: false };

		this.markMissedRefs = false;
		this.bindingsProxy = null;
		var markupPrefix = 'data-rf-';
		var markupActionPrefix = 'data-rf-action-';
		var regExpToMatchName = new RegExp(markupPrefix+'([a-z-]*)');
		var regExpToMatchValue = new RegExp('\\{\\{(.*)\\}\\}');
		var attributeRegExp = new RegExp(markupActionPrefix,'i');
		var datasetRegExp = new RegExp('rfAction', 'i');
		
		this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
           	root = config.root;
        }

		function parseDOMElement(node, symbolTable, regExpToMatchName, regExpToMatchValue, refId,
			 					/* privates */ nodeAttributes, matchedElms, attribute, attributeName, attributeValue) {
			nodeAttributes = node.attributes;
			var parsedAttributes = {};
			//if (node.hasAttribute('debugger')) debugger;
			for (var i = 0; attribute = nodeAttributes[i]; i++) {
				if (!attribute.specified) continue;
				attributeName = attribute.name;
				attributeValue = attribute.value;
				var matchedElms = null;
				var symbol = null;
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
					symbol = splitOptions(symbol, symbol.linkedTo);
				}
				if (symbol) {
					parsedAttributes[symbol.action] = symbol; 
				}
			}
			//return a list of actions to the dom parser to know what kind of features that element has
			return parsedAttributes;
		}

		function splitOptions(symbol, data) {
			if (data.indexOf('?') != -1 && data.indexOf(':') != -1) {
				data = data.replace(/\s+/g, '');
				var opts = data.split('?');
				symbol.linkedTo = opts[0];
				symbol.expression = data;
			} 
			else if (data.indexOf('&&') != -1) {
				symbol.expression = data;
			}
			else if (data.indexOf('||') != -1) {
				symbol.expression = data;
			}
			else {
				var opts = data.split(':');
				symbol.linkedTo = opts.length > 1 ? opts[1] : opts[0];
				if (opts.length > 1) symbol.options = opts[0];	
			}
			symbol.linkedTo = symbol.linkedTo.trim();
			if (symbol.options) symbol.options = symbol.options.trim();
			if (symbol.expression) symbol.expression = symbol.expression.trim();
			return symbol;
		}

		//TODO need better factorization
		function evalExpression(exp, data) {
			exp = exp.replace(/\s+/g, '');
			var dataArr = exp.split(/\&\&|\|\||\=\=|\?|\:/),
				map = {},
				solvedExpression = '';
			if (dataArr.length > 1) {
				for (var i = 0, key; key = dataArr[i]; i++) {
					if (!key[0].match(/\'|\"/)) map[key] = Refuel.resolveChain(key, data);	
				}
				solvedExpression = exp;
				for (var key in map) {
					if (typeof map[key] === 'string') map[key] = '\"'+map[key]+'\"'; 
					solvedExpression = solvedExpression.replace(key, map[key]);
				}
				return eval(solvedExpression);
			}
		}

		function normalizePath(path) {
			path = path.replace(config.dataLabel, '');
			if (path.charAt(0) == '.') path = path.substr(1);
			return path || '.';
		}

		function hasDataAction(element, type) {
			for (var i in element.dataset) {
				var action = i.replace(datasetRegExp, '');
				if (action.toLowerCase() === type || action === '') return element; 
			}
			return false;
		}

		function notifyEvent(e) {
 			e.stopPropagation();
			self.bindingsProxy = self.bindingsProxy || self;
			var target = hasDataAction(e.target, e.type) || hasDataAction(e.currentTarget, e.type);
			if (bindingTable[e.type] && target) {
				e.action = (e.type === 'click' || e.type === 'tap' ? 
					target.dataset['rfAction'] || target.dataset['rfActionClick'] : 
					target.getAttribute(markupActionPrefix + e.type)
			    );
			    e = splitOptions(e, e.action);
			   	self.bindingsProxy.notify('_generic_binder_event', e);
			}
		}

		// Per un bug degli eventi del dom, non è possibile associare ad un elemento l'evento doppio click e il click. 
		// Diventa allora difficile agganciare tutti gli eventi alla root del template (TODO add a workaround)
		// Viene richiamato solo una volta per Template.parse
		function templateBinder (rootEl, symbolTable) {
			self.bindingsProxy = self.bindingsProxy || self;
			//if (rootEl.hasAttribute('debugger')) debugger;
			for(var i = 0, symbol;  symbol = symbolTable[i]; i++) {
				var isRoot = symbol.domElement === root;
				if (symbol.action.indexOf('action') == 0) {
					symbol.domAction = true;
					var eventType = (symbol.attributeName === 'data-rf-action' ? 'click' : symbol.attributeName.replace(attributeRegExp, ''));
					if (!bindingTable[eventType]) {
						var gesture;
						if (typeof(Hammer) !== 'undefined') {
							gesture = Hammer(rootEl).on(eventType, notifyEvent);
						}
						else {
							if (rootEl.addEventListener) {
								rootEl.addEventListener(eventType, notifyEvent, false); 
							} else if (el.attachEvent) {
								rootEl.attachEvent('on'+eventType, notifyEvent);
							}
						}
						bindingTable[eventType] = true;
					}
				}
				
				var autoObserveEnabled = config.autoObserve && Refuel.config.autoObserve;
				var observeEnabled = symbol.options && symbol.options === 'observe';

				if (!symbol.domAction && (observeEnabled || autoObserveEnabled)) {
					//console.log('#',this._owner, 'templateBinder->', symbol.action)
					var path = normalizePath(symbol.linkedTo);
					self.notify('_observe', {'linkedTo': path, 'symbol': symbol});
				}
			}
			templateBound = true;
		}

		function getModuleParts(moduleObj) {
			var parts = moduleObj['elements'];
			this.parts = this.parts || {};
			for (var partName in parts) {
				//Takes parts from config or search in dom
				var partObj = parts[partName];
				var selector = partObj['selector'];
				var onlyone = partObj['onlyone'];
				var found;
				if (config['elements'] && config.elements[partName]) {
					found = config.elements[partName];
				}
				else {
					found = root.querySelectorAll(selector);
				}
				if (selector) {
					if (found.length) {
						var child = this.parts[partName] = found.length > 1 && !onlyone ? found : found[0];

						if (partObj['strip']) root.removeChild(child);
						this.notify('_template_element_found', {'name': partName, 'element': child});
					}
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
			if (!node) {
				throw "No root defined";
			}
			nodeValue = node.nodeValue;
			var isRoot = node === root;
			//Sets the style class to the root element
			if (isRoot && config.styleClass) root.classList.add(config.styleClass);

			switch (node.nodeType){
				case 1:
					//FIXME alcuni symbol vengono parsati a doppio, perchè vengono trattati sia nel 
					//	generic che nella root del modulo controllare che non vengano anche agganciati doppi eventi
					var parsedAttributes = parseDOMElement(node, symbolTable, regExpToMatchName, regExpToMatchValue);

					var moduleObj = null;
					for (var key in refuelModules) {
						var attribKey = markupPrefix+key;
						if (node.hasAttribute(attribKey)) {
							moduleObj = refuelModules[key];
							if (!isRoot) {
								this.submodules = this.submodules || {};
								var mName = node.getAttribute(attribKey);
								
								
								this.notify('_new_module_requested', {
									'symbol': parsedAttributes[key],
									'module': moduleObj,
									'config': parsedAttributes
								});
							}
							//find  parts defined inside config.modules 
							//XXX if this is the root of a code-defined module this wont happen. Should be fixed unsing config.className
							else {
								moduleTemplateConfig = moduleObj;
								getModuleParts.call(this, moduleObj);
								for (var key in parsedAttributes) {
									symbolTable.push(parsedAttributes[key]);
								}
							}
						}
					}

					if (parsedAttributes['data-rf-visibility']) {
						symbol.displayStyle = symbol.domElement.style.display;
					}

					if(!moduleObj || isRoot) {
						for (var i=0, childElm; childElm = node.childNodes[i++];) {
							this.parse(childElm, symbolTable);
						}
						for (var key in parsedAttributes) {
							symbolTable.push(parsedAttributes[key]);
						}
					}
				break;
				case 3: //Text Node
					if (matchedElms = nodeValue.match(regExpToMatchValue)) {
						//The nodeContent CAN contain two parameters separed by ':'
						var symbol = {
							action: 'replaceText',
							domElement: node.parentElement,
							textNode: node,
							originalContent: nodeValue,
							originalSymbol: matchedElms[0]
						}
						symbol = splitOptions(symbol, matchedElms[1]);
						symbolTable.push(symbol);
					}
				break;
			}
			return symbolTable;
		}

		this.parseTemplate = function(reparse) {
			symbolTable = this.parse();
			this.notify('parsingComplete', symbolTable);
		}

		/**
		*	@param data array or object of data to insert inside the template 
		*	@tSymbolTable parsed template symbolTable to use, should be generated by the Template.parse action
		**/
		//TODO if !symbolTable should auto-parse
		this.render = function(data) {
			profiler.timestart = new Date().getTime();
			if (!data) console.error('Template::render data argument is null');
			//TODO why we dont notify? check sayt
			if (!symbolTable.length)  this.parseTemplate();
			//if (!templateBound) 
				templateBinder(root, symbolTable);
			self.notify('_template_parsed', {symbolTable: symbolTable});
			
			for(var i = 0, symbol;  symbol = symbolTable[i]; i++) {
				self.renderSymbol(symbol, data)
			}
			profiler.timestop = new Date().getTime();
			if(profiler.enabled) console.log('Template.profiler[render]',root.id, profiler.timestop - profiler.timestart);
		}

		this.renderSymbol = function(symbol, data) {
			//optimize symbol processed: ignore action
			if (symbol.domAction || symbol.action === 'list') return;

			var isRoot = symbol.domElement === root;
			var path = normalizePath(symbol.linkedTo);
			var linkedData = Refuel.resolveChain(path, data);
			if (symbol.expression) linkedData = evalExpression(symbol.expression, data);

			//console.log('renderSymbol',path, symbol.linkedTo, linkedData);
			switch(symbol.action) {
				case 'replaceText': 
					markMissing(symbol, linkedData);
					symbol.textNode.textContent = symbol.originalContent.replace(symbol.originalSymbol, linkedData || '');
				break;
				
				case 'replaceAttributeValue':
					markMissing(symbol);
					switch(symbol.attributeName) {
						case 'checked':
						case 'selected':
							symbol.domElement[symbol.attributeName] = linkedData == true;
						break;
						case 'data-src':
							var src = symbol.originalContent.replace(symbol.originalSymbol, linkedData || '');
							symbol.domElement.removeAttribute('data-src');
							symbol.domElement.setAttribute('src', src);
						break;
						default:
							symbol.attribute.value = symbol.originalContent.replace(symbol.originalSymbol, linkedData);	
					}
				break;
				case 'visibility':
					if (linkedData) symbol.domElement.style.display = symbol.displayStyle;
					else  symbol.domElement.style.display = 'none';
				break;
				case 'loop':
					symbol.elements = [];
					symbol.domElement.innerHTML = '';
					var docFragment = document.createDocumentFragment();
					for (var i = 0; i < linkedData.length; i++) {
						var el = createListElement(linkedData[i], symbol);
						el.setAttribute(markupPrefix+id, i);
						docFragment.appendChild(el);
					};
					symbol.domElement.appendChild(docFragment);
				break;
			}
		}

		/**
			Creates a new Template fragment and append it to the dom, this action is alternative to Template.render()
			
			@param rootElement root to append the newly created template into
			@param template template fragment to render data
			@param data 
			
		**/
		this.create = function(rootElement, template, data) {
			root = template.cloneNode(true);
			this.render(data);
			rootElement.appendChild(root);
		}

		this.remove = function() {
			root.parentNode.removeChild(root);
		}

		this.clear = function() {
			root.innerHTML = '';
		}

		function createListElement(data, parentSymbol) {
			var domClone = parentSymbol.template.cloneNode(true);
			var tmpl = Refuel.newModule('Template', {'root': domClone});
			tmpl.bindingsProxy = self;
			tmpl.render(data);
			parentSymbol.elements.push(tmpl);
			return tmpl.getRoot();
		}

		function markMissing(symbol, linkedData) {
			if (self.markMissedRefs &&  typeof(linkedData) == 'undefined') {
				symbol.domElement.style.border = '1px solid red';
				console.warn('missing', symbol.linkedTo, typeof linkedData);
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

		this.setRoot = function(r) {
			root = r;
		}
		this.getRoot = function() {
			return root;
		}
		this.getBindings = function() {
			return bindingTable;
		}
});