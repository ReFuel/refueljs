
Refuel.define('DataSource', {inherits: 'Events'}, 
	function DataSource(myConfig) {
    	var self = this;
    	var data = {};
    	this.config = {};

		this.init = function(myConfig) {
            this.config = Refuel.mix(self.config, myConfig);
        }

    	//Core.implement(Events, this);    	
        this.data = data;
});
