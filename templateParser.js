var regExpToMatchName = new RegExp("data-rf-(\\w*)");
var regExpToMatchValue = new RegExp("\\{\\{(.*)\\}\\}");

function _parseAttributes(stuffToBeReplaced, node, regExpToMatchName, regExpToMatchValue,
	 					/* privates */ nodeAttributes, matchedElms, attribute, attributeName, attributeValue){
	nodeAttributes = node.attributes;
	for (var i = 0; attribute = nodeAttributes[i]; i++){
		attributeName = attribute.name;
		attributeValue = attribute.value;
		if (!attribute.specified){ // prevents parsing default and unspecified attributes
			continue;
		}
		if (matchedElms = attributeName.match(regExpToMatchName)){
			stuffToBeReplaced.push({
				domElement: node,
				action: matchedElms[1],
				attribute: attribute,
				attributeName: attributeName,
				attributeValue: attributeValue
			});
		} else if (regExpToMatchValue.test(attributeValue)){
			stuffToBeReplaced.push({
				domElement: node,
				action: "replaceAttributeValue",
				attribute: attribute,
				attributeName: attributeName,
				attributeValue: attributeValue
			});
		}
	}
}
function DOMParser(stuffToBeReplaced, node,
				   /* privates */ nodeValue){
	nodeValue = node.nodeValue;
	switch (node.nodeType){
		case 1:
			_parseAttributes(stuffToBeReplaced, node, regExpToMatchName, regExpToMatchValue);
			for (var i=0, childElm; childElm = node.childNodes[i++];){
				domParser(stuffToBeReplaced, childElm);
			}
			break;
		case 3:
			if (regExpToMatchValue.test(nodeValue)){
				stuffToBeReplaced.push({
					domElement: node,
					action: "replaceText",
					text: nodeValue
				});
			}
			break;
	}
}
// Usage: DOMParser(Array, DOMElement);
// Array: Contains elements to be replaced by template renderer
// DOMElement: Root DOM element to start from