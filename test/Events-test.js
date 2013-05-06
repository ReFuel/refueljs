define(["Refuel","Events"], function(){
	buster.testCase("Events", {
		setUp: function(){
			this.eventHandler = Refuel.createInstance("Events", {});
		},
		notify: function(){
			var t =  this.eventHandler;
			assert.exception(function(){t.notify()});
			assert.exception(function(){t.notify(3)});
			assert.exception(function(){t.notify({a:3, b:6})});
			assert.exception(function(){t.notify([a, b, c])});
			refute.exception(function(){t.notify("evento")});
			refute.exception(function(){t.notify("evento", {})});
			refute.exception(function(){t.notify("evento", null)});
			var eventArraySpy = sinon.spy();
			t.subscribe("testEventArray", eventArraySpy);
			t.subscribe("testEventArray", eventArraySpy);
			t.subscribe("testEventArray", eventArraySpy);
			t.notify("testEventArray");
			assert.isTrue(eventArraySpy.calledThrice);
		},
		subscribe: function(){
			var t =  this.eventHandler;
			assert.exception(function(){t.subscribe()});
			assert.exception(function(){t.subscribe(3)});
			assert.exception(function(){t.subscribe({a:3, b:6})});
			assert.exception(function(){t.subscribe([a, b, c])});
			assert.exception(function(){t.subscribe("evento")});
			assert.exception(function(){t.subscribe("evento", {})});
			assert.exception(function(){t.subscribe("evento", null)});
			refute.exception(function(){t.subscribe("evento", function(){console.log("callback")})});
			var eventSpy = sinon.spy();
			t.subscribe("testEvent", eventSpy);
			t.notify("notTestEvent");
			refute.isTrue(eventSpy.called);
			t.notify("testEvent");
			assert.isTrue(eventSpy.calledOnce);
			t.notify("testEvent",{a: "primo", b: "secondo"});
			assert.isTrue(eventSpy.calledWith({a: "primo", b: "secondo"}));
			var control = 42;
			var contextObj = {control: 3};
			t.subscribe("contextEvent", function(){
				this.control = this.control - 3;
			}, contextObj);
			t.notify("contextEvent");
			assert.equals(0, contextObj.control);
			
		},
		isSubscribed: function() {
			var t =  this.eventHandler;
			refute.isTrue(t.isSubscribed("casuale"));
			t.subscribe("isSubscribedEvent", function() {});
			assert.isTrue(t.isSubscribed("isSubscribedEvent"));
		},
		unsubscribe: function() {
			var t =  this.eventHandler;
			assert.exception(function(){t.unsubscribe()});
			assert.exception(function(){t.unsubscribe(3)});
			assert.exception(function(){t.unsubscribe({a:3, b:6})});
			assert.exception(function(){t.unsubscribe([a, b, c])});
			refute.exception(function(){t.unsubscribe("evento")});
			assert.exception(function(){t.unsubscribe("evento", {})});
			refute.exception(function(){t.unsubscribe("evento", null)});
			t.subscribe("unsubscriveEvent", function(){console.log(a)});
			t.unsubscribe("unsubscriveEvent", function(){console.log(a)});
			refute.isTrue(t.isSubscribed("unsubscriveEvent"));
			t.subscribe("unsubscriveEvent1", function(){console.log(a)});
			t.subscribe("unsubscriveEvent1", function(){console.log(b)});
			t.unsubscribe("unsubscriveEvent1", function(){console.log(a)});
			assert.isTrue(t.isSubscribed("unsubscriveEvent1"));
			t.subscribe("unsubscriveEvent2", function(){console.log(a)});
			t.subscribe("unsubscriveEvent2", function(){console.log(b)});
			t.unsubscribe("unsubscriveEvent2");
			refute.isTrue(t.isSubscribed("unsubscriveEvent2"));
		}
		
	});
})
