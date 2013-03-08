


define(function() {
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

	return {
		getSymbolTable: getSymbolTable,
		DOMParser: DOMParser
	};

	// Usage: DOMParser(DOMElement);
	// Array: Contains elements to be replaced by template renderer
	// DOMElement: Root DOM element to start from
});