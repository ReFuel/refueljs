
Refuel.config.modules = {
	'generic': {
		className: 'GenericModule'
	},
	'list': {
		className: 'ListModule',
		elements: {
			//'>:first-child': { name: 'template' },
			'template': { selector: '[data-rf-template]', strip: true} 
		}
	},
	'sayt': {
		className: 'SaytModule',
		elements: {
			'inputField': 		{selector: 'input'},
			'listElement':  	{selector: 'ul' },
			'listItemTemplate': {selector: 'ul > li'}
		}
	}
}