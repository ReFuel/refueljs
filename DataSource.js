//TODO Rename in BasicModule?
define(['Core', 'Events'], function(Core, Events) {
    return function DataSource() {
    	var self = this;
    	//Core.implement(Events, this);    	
    	var data = [];
        this.data = data;

        var index = 0;
        for (var i = 0, prop; prop = data[i]; i++) {
            if(!self.__lookupGetter__(prop)) {
                (function(thisIndex, thisProp) {
                    Object.defineProperty(self, thisIndex, {
                        get:function() {
                                return self.getElementAt(thisIndex);
                            }(index, prop),
                        set:function(val) {
                                self.setElementAt(thisIndex, val);
                            }
                    });
                });
                index++;
            }
        };

        this.setElementAt = function(index, val) {
            data[index] = val;
        }
        this.getElementAt = function(index) {
            return data[index];
        }
        this.getData = function() {
            return data;
        }
        

    }
});
