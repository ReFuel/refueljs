
Refuel.config.modules = {
	'data-rf-list': {
		className: 'ListModule',
		parts: {
			':first-child': { name: 'template' },
			'[data-rf-template]': { name: 'template' } 
		}
	},
	'data-rf-sayt': {
		className: 'SaytModule',
		parts: {
			'input': 	{ name: 'inputField' },
			'ul': 		{ name: 'listElement' },
			'ul > li': 	{ name: 'listItemTemplate' }
		}
	}
}

