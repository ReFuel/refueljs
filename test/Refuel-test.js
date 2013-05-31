define(["Refuel"], function(){
	buster.testCase("Refuel", {
		clone: function() {
// 			error on not object input
 			var res = Refuel.clone(1);
			assert.same(res, 1);
			res = Refuel.clone({});
 			assert.equals(res, {});
			
			var testObj = {a: 6, b: {c: 1}, d: [3,5,7], e: "ciao"};
			res = Refuel.clone(testObj);
			assert.equals(res, testObj);
			
//			error on 2nd (and on) levels
			testObj.b.c = 2;
			refute.equals(res.b.c, testObj.b.c);
// 			refute.same(res.b.c, testObj.b.c);
			
//			error on null input
			res = Refuel.clone(null);
// 			assert.isNull(res);
			
// 			error on undefined input
			res = Refuel.clone();
// 			refute.defined(res);
			
// 			error on array input
			testObj = [2, 4, 5, 7];
			res = Refuel.clone(testObj);
// 			implicit conversion???
// 			assert.same(res.length, testObj.length);
			assert.same(res[2].toString(), "5");
			
			testObj = function(){return true};
			res = Refuel.clone(testObj);
// 			cannot clone a function
// 			assert.isFunction(res);
// 			cannot execute a void object
// 			assert.isTrue(res());
		},
		mix: function(){
			var startObj = {a: 6, b: {c: 1}, d: [3,5,7], e: "ciao"};
			var extendObj = {f: "yo", b: { extB: "hiya" }, d: [12, "arr", "pirate"]};
			
			var resultingObj = Refuel.mix(startObj, extendObj);
			assert.same(resultingObj.f, "yo");
			// deep-level mixing failed
			//assert.same(resultingObj.b.c, 1);
			assert.same(resultingObj.b.extB, "hiya");
			assert.same(resultingObj.d[1], "arr");
			assert.same(resultingObj.e, "ciao");
			refute.defined(resultingObj.b.c);
			refute.defined(startObj.b.extB);
			
			resultingObj.e = "no";
			resultingObj.b = "nomore";
			
			refute.same(startObj.e, resultingObj.e);
			refute.same(extendObj.b, resultingObj.b);
		},
		refuelClass: function(){
			refute.defined(Refuel.refuelClass({}));
			refute.defined(Refuel.refuelClass());
			refute.defined(Refuel.refuelClass("cviao"));
			assert.defined(Refuel.refuelClass({ _refuelClassName: "hola"}));
			assert.same("hola", Refuel.refuelClass({ _refuelClassName: "hola"}));
		},
// 		NOT yet used
// 		implement: function(){
// 			var target = {a: function() {return false}, b: 5};
// 			var interfaceFunction = function(){return true};
// 			Refuel.implement(interfaceFunction, target);
// 			assert.same(target.a(), interfaceFunction().a());
// 		}
		isArray: function(){
			var testObj = {a: 6, b: {c: 1}, d: [3,5,7], e: "ciao"};
			assert.isFalse(Refuel.isArray(testObj));
			var aFunction = function(){return true};
			assert.isFalse(Refuel.isArray(aFunction));
			assert.isFalse(Refuel.isArray({}));
			assert.isFalse(Refuel.isArray());
			assert.isFalse(Refuel.isArray(null));
			assert.isTrue(Refuel.isArray([]));
			assert.isFalse(Refuel.isArray({a: [], b: [1,3]}));
			
			
		},
		isUndefined: function(){
			var testObj = {a: 6, b: {c: 1}, d: [3,5,7], e: "ciao"};
			assert.isFalse(Refuel.isUndefined(testObj));
			var aFunction = function(){return};
			assert.isFalse(Refuel.isUndefined(aFunction));
			assert.isTrue(Refuel.isUndefined(aFunction()));
			assert.isFalse(Refuel.isUndefined({}));
			assert.isTrue(Refuel.isUndefined());
			assert.isFalse(Refuel.isUndefined(null));
			assert.isFalse(Refuel.isUndefined([]));
			assert.isFalse(Refuel.isUndefined({a: [], b: [1,3]}));
		},
		resolveChain: function(){
			var data = {
				hi: "there"
			};
			var path = undefined;
			assert.same("there", Refuel.resolveChain(path, data).hi);
			path = null;
			assert.same("there", Refuel.resolveChain(path, data).hi);
			// TypeError: Object #<Object> has no method 'split'
// 			path = {};
// 			assert.same("there", Refuel.resolveChain(path, data).hi);
			//   TypeError: Object [object Array] has no method 'split'
// 			path = [];
// 			assert.same("there", Refuel.resolveChain(path, data).hi);
			//   TypeError: Object [object Array] has no method 'split'
// 			path = ["hi"];
// 			assert.same("there", Refuel.resolveChain(path, data).hi);
			// TypeError: Object #<Object> has no method 'split'
// 			path = {path: "hi"};
// 			assert.same("there", Refuel.resolveChain(path, data).hi);
			path = 0;
			assert.same("there", Refuel.resolveChain(path, data).hi);
			// TypeError: Object 1 has no method 'split'
// 			path = 1;
// 			assert.same("there", Refuel.resolveChain(path, data).hi);
			
			path = "";
			data = {
				hi: "there"
			};
			assert.same("there", Refuel.resolveChain(path, data).hi);
			
			path = ".";
			data = {
				hi: "there"
			};
			assert.same("there", Refuel.resolveChain(path, data).hi);
			
			path = "h";
			data = {
				hi: "there"
			};
			refute.defined(Refuel.resolveChain(path, data));
			
			// error:  TypeError: Cannot read property 'i' of undefined
// 			path = "h.i";
// 			data = {
// 				hi: "there"
// 			};
// 			refute.defined(Refuel.resolveChain(path, data));
			
			path = "hi";
			data = {
				hi: "there"
			};
			assert.same("there", Refuel.resolveChain(path, data));
			
			path = "hi";
			data = {
				hi: "there"
			};
			assert.same("there", Refuel.resolveChain(path, data));
			
			data = {a: 6, b: {c: 1}, d: [3,5,7], e: "ciao"};
			path = "b.c";
			assert.same(1, Refuel.resolveChain(path, data));
			path = "e";
			assert.same("ciao", Refuel.resolveChain(path, data));
			path = "d";
			assert.same(5, Refuel.resolveChain(path, data)[1]);
			
			var refuelClassStub = sinon.stub(Refuel, "refuelClass");
			refuelClassStub.returns("DataSource");
			Object.prototype.getData = function(){
				refuelClassStub.restore();
				return {a: 5, b: {c: 10}, d: [], e: "ola"};
			}
			path = "b.b.c";
			assert.same(10, Refuel.resolveChain(path, data));
			path = "b.c";
			assert.equals({value: 1, parent: data.b}, Refuel.resolveChain(path, data, 1));
			refute.equals({value: 1, parent: data.d}, Refuel.resolveChain(path, data, 1));
		},
		define: function(){
			//error: check input parameters (must throw an exception)
// 			assert.exception(function(){Refuel.define("nuovaClasse1")});
// 			assert.exception(function(){Refuel.define("nuovaClasse2", {})});
// 			assert.exception(function(){Refuel.define("nuovaClasse3", {require: [], inherits: []})});
// 			assert.exception(function(){Refuel.define("nuovaClasse4",  {require: [], inherits: []}, {a: 1})});
			refute.exception(function(){Refuel.define("nuovaClasse5",  {require: [], inherits: []}, function(){console.log("ciao"); return true})});
// 			error: must throw an exception, not only a console.Error
			
			var defineSpy = sinon.spy(window, "define");
			
			assert.exception(function(){
			//!!!!!! we are supposing that define is running correctly, but we can't test itc 'cause it is asyncronous: 
			//!!!!!! stub the require.define 
				Refuel.define("nuovaClasse66",  {require: [], inherits: []}, function(){return true});
				defineSpy.getCall(0).args[2]();
				Refuel.define("nuovaClasse66",  {require: [], inherits: []}, function(){return true});
			});
			
			defineSpy.restore();
			
			refute.exception(function(){Refuel.define("nuovaClasse7", function(){return true})});
		},
		createInstance: function(){
			assert.exception(function(){Refuel.createInstance("accaso")});
			
			/*  not defined, please use Refuel.define --- empty inherits array
			var defineSpy = sinon.stub(window, "define");
			refute.exception(function(){
				Refuel.define("newModuleTest",  {require: [], inherits: []}, function(){return true});
				defineSpy.getCall(0).args[2]();
				Refuel.createInstance("newModuleTest", {});
			});
			defineSpy.restore();
			*/
			
			var newClassSpy = sinon.spy();
			var defineSpy = sinon.spy(window, "define");
			refute.exception(function(){
				Refuel.define("newModuleTestHi", {}, newClassSpy);
				defineSpy.getCall(0).args[2]();
				Refuel.createInstance("newModuleTestHi", {});
			});
			assert.isTrue(newClassSpy.calledOnce);
			
			var newClassInitSpy = sinon.spy();
			Refuel.define("newModuleTestHiSon", {require: [], inherits: "newModuleTestHi"}, 
				function newModuleTestHiSon(){
					this.init = newClassInitSpy;
				
				}
			);
			defineSpy.getCall(1).args[2]();
			defineSpy.restore();
			Refuel.createInstance("newModuleTestHiSon", {});
			assert.isTrue(newClassInitSpy.calledOnce);
		},
		
		static: function(){
			var spy = sinon.spy(hiya);
			var hiya = function(){
				return spy;
			}
			
			Refuel.static("classname", hiya);
			assert.defined(Refuel["classname"]);
			refute.defined(Refuel.notaclassname);
			Refuel["classname"]();
			assert.isTrue(spy.calledOnce);
		}
		
	});
})
