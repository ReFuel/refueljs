
Refuel.config.modules = {
	'list': {
		className: 'ListModule',
		parts: {
			//'>:first-child': { name: 'template' },
			'template': { selector: '[data-rf-template]', strip: true} 
		}
	},
	'sayt': {
		className: 'SaytModule',
		parts: {
			'inputField': 		{selector: 'input'},
			'listElement':  	{selector: 'ul' },
			'listItemTemplate': {selector: 'ul > li'}
		}
	}
}