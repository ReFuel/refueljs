
Refuel.config.modules = {
	'list': {
		className: 'ListModule',
		parts: {
			':first-child': { name: 'template' },
			'[data-rf-template]': { name: 'template' } 
		}
	},
	'sayt': {
		className: 'SaytModule',
		parts: {
			'input': 	{ name: 'inputField' },
			'ul': 		{ name: 'listElement' },
			'ul > li': 	{ name: 'listItemTemplate' }
		}
	}
}

