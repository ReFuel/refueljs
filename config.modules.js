
Refuel.config.modules = {
	'generic': {
		className: 'GenericModule'
	},
	'list': {
		className: 'ListModule',
		elements: {
			//'>:first-child': { name: 'template' },
			'template': { selector: '[data-rf-template]', strip: true, onlyone: true} 
		}
	},
	'sayt': {
		className: 'SaytModule',
		elements: {
			'inputField': 		{selector: 'input'},
			'resultList':  		{selector: 'ul' },
			'listItemTemplate': {selector: 'ul > li'}
		}
	},
	'scroller': {
		className: 'ScrollerModule'
	}
};
