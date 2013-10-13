/*
 RequireJS 2.1.5 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
var requirejs,require,define;
(function(aa){function I(b){return"[object Function]"===L.call(b)}function J(b){return"[object Array]"===L.call(b)}function y(b,c){if(b){var d;for(d=0;d<b.length&&(!b[d]||!c(b[d],d,b));d+=1);}}function M(b,c){if(b){var d;for(d=b.length-1;-1<d&&(!b[d]||!c(b[d],d,b));d-=1);}}function s(b,c){return ga.call(b,c)}function m(b,c){return s(b,c)&&b[c]}function G(b,c){for(var d in b)if(s(b,d)&&c(b[d],d))break}function R(b,c,d,m){c&&G(c,function(c,j){if(d||!s(b,j))m&&"string"!==typeof c?(b[j]||(b[j]={}),R(b[j],
c,d,m)):b[j]=c});return b}function u(b,c){return function(){return c.apply(b,arguments)}}function ba(b){if(!b)return b;var c=aa;y(b.split("."),function(b){c=c[b]});return c}function B(b,c,d,m){c=Error(c+"\nhttp://requirejs.org/docs/errors.html#"+b);c.requireType=b;c.requireModules=m;d&&(c.originalError=d);return c}function ha(b){function c(a,f,b){var e,n,c,g,d,S,i,h=f&&f.split("/");e=h;var j=k.map,l=j&&j["*"];if(a&&"."===a.charAt(0))if(f){e=m(k.pkgs,f)?h=[f]:h.slice(0,h.length-1);f=a=e.concat(a.split("/"));
for(e=0;f[e];e+=1)if(n=f[e],"."===n)f.splice(e,1),e-=1;else if(".."===n)if(1===e&&(".."===f[2]||".."===f[0]))break;else 0<e&&(f.splice(e-1,2),e-=2);e=m(k.pkgs,f=a[0]);a=a.join("/");e&&a===f+"/"+e.main&&(a=f)}else 0===a.indexOf("./")&&(a=a.substring(2));if(b&&j&&(h||l)){f=a.split("/");for(e=f.length;0<e;e-=1){c=f.slice(0,e).join("/");if(h)for(n=h.length;0<n;n-=1)if(b=m(j,h.slice(0,n).join("/")))if(b=m(b,c)){g=b;d=e;break}if(g)break;!S&&(l&&m(l,c))&&(S=m(l,c),i=e)}!g&&S&&(g=S,d=i);g&&(f.splice(0,d,
g),a=f.join("/"))}return a}function d(a){A&&y(document.getElementsByTagName("script"),function(f){if(f.getAttribute("data-requiremodule")===a&&f.getAttribute("data-requirecontext")===i.contextName)return f.parentNode.removeChild(f),!0})}function z(a){var f=m(k.paths,a);if(f&&J(f)&&1<f.length)return d(a),f.shift(),i.require.undef(a),i.require([a]),!0}function h(a){var f,b=a?a.indexOf("!"):-1;-1<b&&(f=a.substring(0,b),a=a.substring(b+1,a.length));return[f,a]}function j(a,f,b,e){var n,C,g=null,d=f?f.name:
null,j=a,l=!0,k="";a||(l=!1,a="_@r"+(M+=1));a=h(a);g=a[0];a=a[1];g&&(g=c(g,d,e),C=m(q,g));a&&(g?k=C&&C.normalize?C.normalize(a,function(a){return c(a,d,e)}):c(a,d,e):(k=c(a,d,e),a=h(k),g=a[0],k=a[1],b=!0,n=i.nameToUrl(k)));b=g&&!C&&!b?"_unnormalized"+(Q+=1):"";return{prefix:g,name:k,parentMap:f,unnormalized:!!b,url:n,originalName:j,isDefine:l,id:(g?g+"!"+k:k)+b}}function r(a){var f=a.id,b=m(p,f);b||(b=p[f]=new i.Module(a));return b}function t(a,f,b){var e=a.id,n=m(p,e);if(s(q,e)&&(!n||n.defineEmitComplete))"defined"===
f&&b(q[e]);else r(a).on(f,b)}function v(a,f){var b=a.requireModules,e=!1;if(f)f(a);else if(y(b,function(f){if(f=m(p,f))f.error=a,f.events.error&&(e=!0,f.emit("error",a))}),!e)l.onError(a)}function w(){T.length&&(ia.apply(H,[H.length-1,0].concat(T)),T=[])}function x(a){delete p[a];delete V[a]}function F(a,f,b){var e=a.map.id;a.error?a.emit("error",a.error):(f[e]=!0,y(a.depMaps,function(e,c){var g=e.id,d=m(p,g);d&&(!a.depMatched[c]&&!b[g])&&(m(f,g)?(a.defineDep(c,q[g]),a.check()):F(d,f,b))}),b[e]=!0)}
function D(){var a,f,b,e,n=(b=1E3*k.waitSeconds)&&i.startTime+b<(new Date).getTime(),c=[],g=[],h=!1,j=!0;if(!W){W=!0;G(V,function(b){a=b.map;f=a.id;if(b.enabled&&(a.isDefine||g.push(b),!b.error))if(!b.inited&&n)z(f)?h=e=!0:(c.push(f),d(f));else if(!b.inited&&(b.fetched&&a.isDefine)&&(h=!0,!a.prefix))return j=!1});if(n&&c.length)return b=B("timeout","Load timeout for modules: "+c,null,c),b.contextName=i.contextName,v(b);j&&y(g,function(a){F(a,{},{})});if((!n||e)&&h)if((A||da)&&!X)X=setTimeout(function(){X=
0;D()},50);W=!1}}function E(a){s(q,a[0])||r(j(a[0],null,!0)).init(a[1],a[2])}function K(a){var a=a.currentTarget||a.srcElement,b=i.onScriptLoad;a.detachEvent&&!Y?a.detachEvent("onreadystatechange",b):a.removeEventListener("load",b,!1);b=i.onScriptError;(!a.detachEvent||Y)&&a.removeEventListener("error",b,!1);return{node:a,id:a&&a.getAttribute("data-requiremodule")}}function L(){var a;for(w();H.length;){a=H.shift();if(null===a[0])return v(B("mismatch","Mismatched anonymous define() module: "+a[a.length-
1]));E(a)}}var W,Z,i,N,X,k={waitSeconds:7,baseUrl:"./",paths:{},pkgs:{},shim:{},config:{}},p={},V={},$={},H=[],q={},U={},M=1,Q=1;N={require:function(a){return a.require?a.require:a.require=i.makeRequire(a.map)},exports:function(a){a.usingExports=!0;if(a.map.isDefine)return a.exports?a.exports:a.exports=q[a.map.id]={}},module:function(a){return a.module?a.module:a.module={id:a.map.id,uri:a.map.url,config:function(){return k.config&&m(k.config,a.map.id)||{}},exports:q[a.map.id]}}};Z=function(a){this.events=
m($,a.id)||{};this.map=a;this.shim=m(k.shim,a.id);this.depExports=[];this.depMaps=[];this.depMatched=[];this.pluginMaps={};this.depCount=0};Z.prototype={init:function(a,b,c,e){e=e||{};if(!this.inited){this.factory=b;if(c)this.on("error",c);else this.events.error&&(c=u(this,function(a){this.emit("error",a)}));this.depMaps=a&&a.slice(0);this.errback=c;this.inited=!0;this.ignore=e.ignore;e.enabled||this.enabled?this.enable():this.check()}},defineDep:function(a,b){this.depMatched[a]||(this.depMatched[a]=
!0,this.depCount-=1,this.depExports[a]=b)},fetch:function(){if(!this.fetched){this.fetched=!0;i.startTime=(new Date).getTime();var a=this.map;if(this.shim)i.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],u(this,function(){return a.prefix?this.callPlugin():this.load()}));else return a.prefix?this.callPlugin():this.load()}},load:function(){var a=this.map.url;U[a]||(U[a]=!0,i.load(this.map.id,a))},check:function(){if(this.enabled&&!this.enabling){var a,b,c=this.map.id;b=this.depExports;
var e=this.exports,n=this.factory;if(this.inited)if(this.error)this.emit("error",this.error);else{if(!this.defining){this.defining=!0;if(1>this.depCount&&!this.defined){if(I(n)){if(this.events.error)try{e=i.execCb(c,n,b,e)}catch(d){a=d}else e=i.execCb(c,n,b,e);this.map.isDefine&&((b=this.module)&&void 0!==b.exports&&b.exports!==this.exports?e=b.exports:void 0===e&&this.usingExports&&(e=this.exports));if(a)return a.requireMap=this.map,a.requireModules=[this.map.id],a.requireType="define",v(this.error=
a)}else e=n;this.exports=e;if(this.map.isDefine&&!this.ignore&&(q[c]=e,l.onResourceLoad))l.onResourceLoad(i,this.map,this.depMaps);x(c);this.defined=!0}this.defining=!1;this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0)}}else this.fetch()}},callPlugin:function(){var a=this.map,b=a.id,d=j(a.prefix);this.depMaps.push(d);t(d,"defined",u(this,function(e){var n,d;d=this.map.name;var g=this.map.parentMap?this.map.parentMap.name:null,h=
i.makeRequire(a.parentMap,{enableBuildCallback:!0});if(this.map.unnormalized){if(e.normalize&&(d=e.normalize(d,function(a){return c(a,g,!0)})||""),e=j(a.prefix+"!"+d,this.map.parentMap),t(e,"defined",u(this,function(a){this.init([],function(){return a},null,{enabled:!0,ignore:!0})})),d=m(p,e.id)){this.depMaps.push(e);if(this.events.error)d.on("error",u(this,function(a){this.emit("error",a)}));d.enable()}}else n=u(this,function(a){this.init([],function(){return a},null,{enabled:!0})}),n.error=u(this,
function(a){this.inited=!0;this.error=a;a.requireModules=[b];G(p,function(a){0===a.map.id.indexOf(b+"_unnormalized")&&x(a.map.id)});v(a)}),n.fromText=u(this,function(e,c){var d=a.name,g=j(d),C=O;c&&(e=c);C&&(O=!1);r(g);s(k.config,b)&&(k.config[d]=k.config[b]);try{l.exec(e)}catch(ca){return v(B("fromtexteval","fromText eval for "+b+" failed: "+ca,ca,[b]))}C&&(O=!0);this.depMaps.push(g);i.completeLoad(d);h([d],n)}),e.load(a.name,h,n,k)}));i.enable(d,this);this.pluginMaps[d.id]=d},enable:function(){V[this.map.id]=
this;this.enabling=this.enabled=!0;y(this.depMaps,u(this,function(a,b){var c,e;if("string"===typeof a){a=j(a,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap);this.depMaps[b]=a;if(c=m(N,a.id)){this.depExports[b]=c(this);return}this.depCount+=1;t(a,"defined",u(this,function(a){this.defineDep(b,a);this.check()}));this.errback&&t(a,"error",this.errback)}c=a.id;e=p[c];!s(N,c)&&(e&&!e.enabled)&&i.enable(a,this)}));G(this.pluginMaps,u(this,function(a){var b=m(p,a.id);b&&!b.enabled&&i.enable(a,
this)}));this.enabling=!1;this.check()},on:function(a,b){var c=this.events[a];c||(c=this.events[a]=[]);c.push(b)},emit:function(a,b){y(this.events[a],function(a){a(b)});"error"===a&&delete this.events[a]}};i={config:k,contextName:b,registry:p,defined:q,urlFetched:U,defQueue:H,Module:Z,makeModuleMap:j,nextTick:l.nextTick,onError:v,configure:function(a){a.baseUrl&&"/"!==a.baseUrl.charAt(a.baseUrl.length-1)&&(a.baseUrl+="/");var b=k.pkgs,c=k.shim,e={paths:!0,config:!0,map:!0};G(a,function(a,b){e[b]?
"map"===b?(k.map||(k.map={}),R(k[b],a,!0,!0)):R(k[b],a,!0):k[b]=a});a.shim&&(G(a.shim,function(a,b){J(a)&&(a={deps:a});if((a.exports||a.init)&&!a.exportsFn)a.exportsFn=i.makeShimExports(a);c[b]=a}),k.shim=c);a.packages&&(y(a.packages,function(a){a="string"===typeof a?{name:a}:a;b[a.name]={name:a.name,location:a.location||a.name,main:(a.main||"main").replace(ja,"").replace(ea,"")}}),k.pkgs=b);G(p,function(a,b){!a.inited&&!a.map.unnormalized&&(a.map=j(b))});if(a.deps||a.callback)i.require(a.deps||[],
a.callback)},makeShimExports:function(a){return function(){var b;a.init&&(b=a.init.apply(aa,arguments));return b||a.exports&&ba(a.exports)}},makeRequire:function(a,f){function d(e,c,h){var g,k;f.enableBuildCallback&&(c&&I(c))&&(c.__requireJsBuild=!0);if("string"===typeof e){if(I(c))return v(B("requireargs","Invalid require call"),h);if(a&&s(N,e))return N[e](p[a.id]);if(l.get)return l.get(i,e,a,d);g=j(e,a,!1,!0);g=g.id;return!s(q,g)?v(B("notloaded",'Module name "'+g+'" has not been loaded yet for context: '+
b+(a?"":". Use require([])"))):q[g]}L();i.nextTick(function(){L();k=r(j(null,a));k.skipMap=f.skipMap;k.init(e,c,h,{enabled:!0});D()});return d}f=f||{};R(d,{isBrowser:A,toUrl:function(b){var d,f=b.lastIndexOf("."),g=b.split("/")[0];if(-1!==f&&(!("."===g||".."===g)||1<f))d=b.substring(f,b.length),b=b.substring(0,f);return i.nameToUrl(c(b,a&&a.id,!0),d,!0)},defined:function(b){return s(q,j(b,a,!1,!0).id)},specified:function(b){b=j(b,a,!1,!0).id;return s(q,b)||s(p,b)}});a||(d.undef=function(b){w();var c=
j(b,a,!0),d=m(p,b);delete q[b];delete U[c.url];delete $[b];d&&(d.events.defined&&($[b]=d.events),x(b))});return d},enable:function(a){m(p,a.id)&&r(a).enable()},completeLoad:function(a){var b,c,e=m(k.shim,a)||{},d=e.exports;for(w();H.length;){c=H.shift();if(null===c[0]){c[0]=a;if(b)break;b=!0}else c[0]===a&&(b=!0);E(c)}c=m(p,a);if(!b&&!s(q,a)&&c&&!c.inited){if(k.enforceDefine&&(!d||!ba(d)))return z(a)?void 0:v(B("nodefine","No define call for "+a,null,[a]));E([a,e.deps||[],e.exportsFn])}D()},nameToUrl:function(a,
b,c){var e,d,h,g,j,i;if(l.jsExtRegExp.test(a))g=a+(b||"");else{e=k.paths;d=k.pkgs;g=a.split("/");for(j=g.length;0<j;j-=1)if(i=g.slice(0,j).join("/"),h=m(d,i),i=m(e,i)){J(i)&&(i=i[0]);g.splice(0,j,i);break}else if(h){a=a===h.name?h.location+"/"+h.main:h.location;g.splice(0,j,a);break}g=g.join("/");g+=b||(/\?/.test(g)||c?"":".js");g=("/"===g.charAt(0)||g.match(/^[\w\+\.\-]+:/)?"":k.baseUrl)+g}return k.urlArgs?g+((-1===g.indexOf("?")?"?":"&")+k.urlArgs):g},load:function(a,b){l.load(i,a,b)},execCb:function(a,
b,c,d){return b.apply(d,c)},onScriptLoad:function(a){if("load"===a.type||ka.test((a.currentTarget||a.srcElement).readyState))P=null,a=K(a),i.completeLoad(a.id)},onScriptError:function(a){var b=K(a);if(!z(b.id))return v(B("scripterror","Script error",a,[b.id]))}};i.require=i.makeRequire();return i}var l,w,x,D,t,E,P,K,Q,fa,la=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,ma=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,ea=/\.js$/,ja=/^\.\//;w=Object.prototype;var L=w.toString,ga=w.hasOwnProperty,ia=
Array.prototype.splice,A=!!("undefined"!==typeof window&&navigator&&document),da=!A&&"undefined"!==typeof importScripts,ka=A&&"PLAYSTATION 3"===navigator.platform?/^complete$/:/^(complete|loaded)$/,Y="undefined"!==typeof opera&&"[object Opera]"===opera.toString(),F={},r={},T=[],O=!1;if("undefined"===typeof define){if("undefined"!==typeof requirejs){if(I(requirejs))return;r=requirejs;requirejs=void 0}"undefined"!==typeof require&&!I(require)&&(r=require,require=void 0);l=requirejs=function(b,c,d,z){var h,
j="_";!J(b)&&"string"!==typeof b&&(h=b,J(c)?(b=c,c=d,d=z):b=[]);h&&h.context&&(j=h.context);(z=m(F,j))||(z=F[j]=l.s.newContext(j));h&&z.configure(h);return z.require(b,c,d)};l.config=function(b){return l(b)};l.nextTick="undefined"!==typeof setTimeout?function(b){setTimeout(b,4)}:function(b){b()};require||(require=l);l.version="2.1.5";l.jsExtRegExp=/^\/|:|\?|\.js$/;l.isBrowser=A;w=l.s={contexts:F,newContext:ha};l({});y(["toUrl","undef","defined","specified"],function(b){l[b]=function(){var c=F._;return c.require[b].apply(c,
arguments)}});if(A&&(x=w.head=document.getElementsByTagName("head")[0],D=document.getElementsByTagName("base")[0]))x=w.head=D.parentNode;l.onError=function(b){throw b;};l.load=function(b,c,d){var l=b&&b.config||{},h;if(A)return h=l.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script"),h.type=l.scriptType||"text/javascript",h.charset="utf-8",h.async=!0,h.setAttribute("data-requirecontext",b.contextName),h.setAttribute("data-requiremodule",c),
h.attachEvent&&!(h.attachEvent.toString&&0>h.attachEvent.toString().indexOf("[native code"))&&!Y?(O=!0,h.attachEvent("onreadystatechange",b.onScriptLoad)):(h.addEventListener("load",b.onScriptLoad,!1),h.addEventListener("error",b.onScriptError,!1)),h.src=d,K=h,D?x.insertBefore(h,D):x.appendChild(h),K=null,h;if(da)try{importScripts(d),b.completeLoad(c)}catch(j){b.onError(B("importscripts","importScripts failed for "+c+" at "+d,j,[c]))}};A&&M(document.getElementsByTagName("script"),function(b){x||(x=
b.parentNode);if(t=b.getAttribute("data-main"))return r.baseUrl||(E=t.split("/"),Q=E.pop(),fa=E.length?E.join("/")+"/":"./",r.baseUrl=fa,t=Q),t=t.replace(ea,""),r.deps=r.deps?r.deps.concat(t):[t],!0});define=function(b,c,d){var l,h;"string"!==typeof b&&(d=c,c=b,b=null);J(c)||(d=c,c=[]);!c.length&&I(d)&&d.length&&(d.toString().replace(la,"").replace(ma,function(b,d){c.push(d)}),c=(1===d.length?["require"]:["require","exports","module"]).concat(c));if(O){if(!(l=K))P&&"interactive"===P.readyState||M(document.getElementsByTagName("script"),
function(b){if("interactive"===b.readyState)return P=b}),l=P;l&&(b||(b=l.getAttribute("data-requiremodule")),h=F[l.getAttribute("data-requirecontext")])}(h?h.defQueue:T).push([b,c,d])};define.amd={jQuery:!0};l.exec=function(b){return eval(b)};l(r)}})(this);

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
(function() {
	var config = {
		basePath: '/',
		requireFilePath: 'lib/require.min.js',
		libs: {
			Path: 'lib/path.min.js',
			Hammer: 'lib/hammer.min.js',
			polyfills: 'lib/polyfills.min.js'
		},
		autoObserve: true
	}
	window.Refuel = window['Refuel'] || {};
	Refuel.config = Refuel.config || config; //overwrite not merge
	var classMap = {};
	var defaultClassName = '_Refuel-default-start-class';
	Refuel.classMap = classMap;

	function argumentsToArray(args){
		return Array.prototype.slice.call(args);
	}

	Refuel.mix = function(base, argumenting) {
		//var res = Refuel.clone(base);
		var res = {};
		for (var prop in base) {
			res[prop] = base[prop];
		}
		for (var prop in argumenting) {
			res[prop] = argumenting[prop];
		}
		return res;
	}

	Refuel.isArray = function(target) {
		return Object.prototype.toString.call(target) === '[object Array]';
	}
	Refuel.isUndefined = function(target) {
		return typeof(target) === 'undefined';
	}
	
    Refuel.getCookie = function(name) {
	    var cookieValue = null;
	    if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
		    var cookie = cookies[i].trim();
		    if (cookie.substring(0, name.length + 1) == (name + '=')) {
			cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
			break;
		    }
		}
	    }
	    return cookieValue;
	}

	Refuel.clone = function(obj) {
		if(obj === null || typeof(obj) !== 'object'){
			return obj;
		}
		var temp;
		try {
			temp = obj.constructor(); // changed
		}
		catch(e) {
			//htmlElement returns itself
			return obj;
		}
		
		for(var key in obj){
			temp[key] = Refuel.clone(obj[key]);
		}
		return temp;
	}

	Refuel.refuelClass = function(obj) {
		var res = undefined;
		if (obj && obj._refuelClassName) {
			res = obj._refuelClassName
		}
		return res;
			
	}
	
	Refuel.resolveChain = function(path, data, getParent) {
		var extData = data;
		var negate = false;
		if (path && path != '.' && path != '') {
			negate = path.indexOf('!') != -1;
			if (negate) {

				path = path.substr(negate);
			}
			var dataPath = path.split('.');
			var parent;
			for (var i=0, item; item = dataPath[i]; i++) {
				parent = extData;
				if (extData === undefined) {
					console.error(item,'in',path,'from',data,'is undefined');
				}
				extData = extData[item];
				
				while (Refuel.refuelClass(extData) == 'DataSource') {
					parent = extData;
					extData = extData.getData();//[item];
				}

			}
		}
		if (negate) extData = !extData;
		
		if (getParent) return {'value': extData, 'parent': parent}
		else return extData;
	}

	Refuel.createInstance = function (className, initObj) {
		var cl = classMap[className];
	    if(typeof cl === 'undefined') {
			throw className + ' not defined, please use Refuel.define';
		}
	    var instance;
	    var F = cl.body;
	    if (!initObj._refuelClassName) initObj._refuelClassName = className;
	    if (cl.inherits) {
	    	if (!classMap[cl.inherits]) {
				throw cl.inherits + ' not defined, please use Refuel.define';
			}
	        F.prototype = Refuel.createInstance(cl.inherits, initObj);
	    }
	    instance = new F(initObj);   
	    //Parent-class keeps child-class className
	   	if (!instance._refuelClassName) {
	   		instance._refuelClassName = initObj._refuelClassName;
	   		delete initObj._refuelClassName;
	    }
	    if (instance.hasOwnProperty('init')) {
	    	instance.init(initObj);
	    } 
	    return instance;

	}
	Refuel.newModule = function (className, initObj) {
		return Refuel.createInstance(className, initObj);
	}

	Refuel.define = function(className, req, body) {
	   	if(classMap[className] !== undefined) {
			throw new TypeError(className + ' alredy defined!');
	        return;
	    }
	    if(body === undefined) {
	        body = req;
	    }

	    var requirements = [];
	    requirements = requirements.concat(req.require, req.inherits);
	    requirements = requirements.filter(function(c){
	        if (c !== undefined) return true;
	        else return false;
	    });
		try{
			define(className, requirements, function() {
				classMap[className] = {
					body: body,
					inherits: req.inherits
				};
			});
		}
		catch(e){
			console.log(e)
		}
	}

	Refuel.start = function(req, body) {
		startupModule = defaultClassName;
		Refuel.define(defaultClassName, req, body);
		startApplication();
	}

	Refuel.static = function(className, body) {
		Refuel[className] = body();
	}
	var userDefinedModules;
 	var head = document.querySelector('head');
 	var script = head.querySelector('script[data-rf-startup]');
 	var userModulesElement = head.querySelector('script[data-rf-confmodules]');
 	var node = document.createElement('script');
 	if (userModulesElement) {
	 	userDefinedModules = userModulesElement.getAttribute('data-rf-confmodules');
 	}
	//var path = window.location.pathname;
	if (script) {
	 	var startupModule = script.getAttribute('data-rf-startup');
	 	var startupPath = startupModule.split('/');
	 	startupModule = startupPath[startupPath.length-1];
		startupPath = startupPath.slice(0,startupPath.length-1).join('/') || '.';
	}

 	if (typeof define == 'undefined') {
     	node.type = 'text/javascript';
     	node.charset = 'utf-8';
     	node.async = true;
 		node.addEventListener('load', onScriptLoad, false);
 		node.src = Refuel.config.requireFilePath;
 		head.appendChild(node);
 	} else {
		startApplication();
 	}

	function onScriptLoad(e) {
		if(e && e.type === 'load') {
			console.log(node.src, 'loaded!');
			e.target.parentNode.removeChild(e.target);
			startApplication();
		}
	}
	function startApplication() {
		if (!startupModule) return;
		var baseConfig = { baseUrl: '', paths: {} };
		baseConfig.baseUrl = Refuel.config.basePath;//path;
		var startupRequirements = [];
		if (startupModule) {
			baseConfig.paths[startupModule] = location.pathname+startupPath+'/'+startupModule;
			startupRequirements.push(startupModule);
		} 

		Refuel.config = Refuel.mix(baseConfig, Refuel.config);
      	require.config(Refuel.config);
      	for (var lib in Refuel.config.libs) {
      		if (!window[lib]) startupRequirements.push(Refuel.config.libs[lib]);
      	}

      	if(userDefinedModules) {
      		startupRequirements.push(userDefinedModules);	
      	} 
      	else {
      		if (!Refuel.config.modules) startupRequirements.push('config.modules');	
      	}
      	
      	require(startupRequirements, function() {
      		try {
				Path.listen();
			}
			catch (e) {}
			if (startupModule) classMap[startupModule].body();
		});
	}
})();

Refuel.static('ajax',
	function ajax() {
		var ajaxCounter = 0;
		var callLog = {};
		var profiler = {
			enabled: false
		}
		var config = {
			'callerModule': this,
		    mimeType: 'json',
		    headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json; charset=utf-8',
		    },
			_genericCallback: function() {return true;},
			successCallback: function() {},
			errorCallback: function() {},
			timeoutCallback: function() {}
		};
		var timer = {};

		function setProvider(){
			var XMLHttpRequest;
			if (window.XMLHttpRequest){
				XMLHttpRequest = new window.XMLHttpRequest();
			} else {
				XMLHttpRequest = function () {
					try {
						return new ActiveXObject("Msxml2.XMLHTTP.6.0");
					} catch (e) {}
					try {
						return new ActiveXObject("Msxml2.XMLHTTP.3.0");
					} catch (e) {}
					try {
						return new ActiveXObject("Microsoft.XMLHTTP");
					} catch (e) {}

					throw new Error("This browser does not support XMLHttpRequest.");
				};
			}

			return XMLHttpRequest;
		}


		function killAjaxCall(xhr, url, options){
			xhr.onreadystatechange = null;
			xhr.abort();
			ajaxCounter--;
			clearTimeout(callLog[url].timeoutId);

			var resp = {
				url: url,
				responseText: "",
				responseJSON: {}
			};
			if (options.retryTimes) {
				var tempDelay = options.retryDelay;
				options.retryTimes -= 1;
				options.retryDelay += options.retryDelayIncrease;
				options.timeout += options.retryTimeoutIncrease;
				setTimeout(function(){ajax(url, options)}, tempDelay);
			} 
			else {
				callLog[url].counter = 0;
				options[options.timeout ? 'timeoutCallback' : 'errorCallback'].call(options.callerModule, resp, 0, xhr);
				options._genericCallback(resp, null, xhr, 'timeout');
			}
		}

		function ajax(url, options){
			options.headers = Refuel.mix(config.headers, options.headers);
			options = Refuel.mix(config, options);
			
			var xhr = setProvider();
			var method = options.method ? options.method : "GET";
			var headers, timeout;
			options.timeout = options.timeout || 60000;
			//console.log('timeout',url,options.timeout);
			
			timeout = setTimeout(function(xhr, url, options){
				return function timeoutHandler(){
					killAjaxCall(xhr, url, options);
				}
			}(xhr, url, options), options.timeout);
			callLog[url] = {
				counter: callLog[url] ? callLog[url].counter + 1 : 1,
				timeoutId: timeout
			};
			xhr.onreadystatechange = function() {
				var status, resp = {};
				//console.log('XHR STATE', xhr.readyState );
				if (xhr.readyState === 4){
					callLog[url].counter = 0;
					clearTimeout(callLog[url].timeoutId);
					ajaxCounter--;
					try {
						status = xhr.status;
					} catch (e){
						status = 0;
					}
					resp = {
						url: url,
						responseXML: xhr.responseXML,
						responseText: xhr.responseText
					};
					//MIME TYPE CONVERSION
					//dataType (default: Intelligent Guess (xml, json, script, or html))
					if (resp.responseText) {
						try {
							switch(options.mimeType) {
								case 'json':
									resp.responseJSON = JSON.parse(resp.responseText) || {};	
								break;
							}
						}
						catch (e) {
							console.error("Parsing Error in responseText", resp);
							type = 'error';
						}
					}

					var allowed = false;
					var type = 'timeout';
					if (options.allowedStatus) {
						allowed = options.allowedStatus.indexOf(status) > -1 ? true : false;
					}
					if (status >= 200 && status < 400 || status === 1224 || allowed){
						type = 'success';
					} else if (status >= 400){
						type = 'error';
					}
					options._genericCallback(resp, status, xhr, type);
					if (type === 'success')	options.successCallback.call(options.callerModule, resp, status, xhr);
					else if (type === 'error')	options.errorCallback.call(options.callerModule, resp, status, xhr);
				}
			};
			var params = options.params;
			var queryString = params ? '?'+params : '';
			
			//ebugger;
			var currentTime = new Date().getTime();
			if (!timer.last) timer.last = new Date().getTime();
			var ttd = Math.max((20 - (currentTime - timer.last)), 0);
			
			setTimeout(function() {
				xhr.open(method, url+queryString);
				ajaxCounter++;
				if (headers = options.headers){
					for (var h in headers){
						if (headers.hasOwnProperty(h)){
							xhr.setRequestHeader(h, headers[h]);
						}
					}
				}
				xhr.send(method.match(/POST|PUT/) && options.body ? options.body : null);
				timer.last = new Date().getTime();
			}, ttd);
			
			return xhr;
		}
		
		return {
			haveActiveConnections: function(){
				return ajaxCounter > 0;
			},
			"get": function(url, options){
				options = Refuel.mix(config, options);
				options.method = "GET";
				return ajax(url, options);
			},
			"post": function(url, body, options){
				options = Refuel.mix(config, options);
				options.method = "POST";
				options.body = body;
				return ajax(url, options);
			},
			"put": function(url, body, options){
				options = Refuel.mix(config, options);
				options.method = "PUT";
				options.body = body;
				return ajax(url, options);
			},
			"delete": function(url, options){
				options = Refuel.mix(config, options);
				options.method = "DELETE";
				return ajax(url, options);
			}
		}
		
});
/**
*   @class Events
*
*   @author Matteo Burgassi
*/
/*
	onGoingNotification {
		'event_name01': [
			0 : {
				callback: function(event) {} 			
				context: object_or_class
			}
			1: ...
		]
		'event_name02': ...
	}
*/
Refuel.define('Events',
	function Events() {
		if(this.notify && this.subscribe) return;
		var onGoingNotification = {};
		this.onGoingNotification = onGoingNotification;
		this.notify = function(name, data, bubble){
			if (!name || typeof(name)!=='string'){
				throw new TypeError('Invalid event name ' + name);
			}
			data = data || {};

			
			if (onGoingNotification[name] instanceof Array) {
				var handlers = [].concat(onGoingNotification[name]);
				for (var i = 0, handler; handler = handlers[i]; i++) {
					handler.callback.call(handler.context, data);
				}
			}
		}

		this.subscribe = function(name, callback, context){
			if (!name || typeof(name)!=='string'){
				throw new TypeError('Invalid event name ' + name);
			}
			if (!callback || typeof(callback)!=='function'){
				throw new TypeError('Invalid event callback ' + callback);
			}
			if (!context) context = this;

			if (typeof onGoingNotification[name] === 'undefined') {
				onGoingNotification[name] = [];
			}
			else {
				//if the same callback is subscribed to the same event, remove it
				this.unsubscribe(name, callback);
			}

			var handler = {
				'callback': callback,
				'context': context
			}
			onGoingNotification[name].push(handler);
		}

		this.isSubscribed = function(name) {
			return !(Refuel.isUndefined(onGoingNotification[name]) || onGoingNotification[name].length===0);
		}

		this.unsubscribe = function(name, callback) {
			if(!name || typeof name !== "string" || (callback && typeof callback !== "function")){
				throw new TypeError("name is not defined or wrong callback");
			}
			if (callback) {
				for (var i=0, l=onGoingNotification[name].length;  i<l; i++) {
					if(onGoingNotification[name][i].callback.toString() === callback.toString()){
						onGoingNotification[name].splice(i, 1);
						return;
					}
				}
			}
			else{
				delete onGoingNotification[name];
			}
		}

});


    /**
    *   @class AbstractModule
    *   @fires _unhandledAction Fired when an Action is requested on this module but is not defined
    *   @fires observableChange Fired when some data observed by this module changes
    *   @fires loadComplete
    *
    *   @author Stefano Sergio
    */
Refuel.define('AbstractModule', {require: ['Template', 'DataSource'], inherits: 'Observer'}, 
    function AbstractModule() {
        var actionMap = {};
        this.items = {};
        /**
        * @type {object}
        * @property {string} dataPath 
        *
        */
        var config = {
            dataPath: '.',
            autoload: false,
            autoObserve: true
        }

        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
            this.elements = {};
            if (config.elements) this.elements = config.elements;
            this.defineUpdateManager(oa_update.bind(this));
            this.dataLabel = config.dataLabel;
            this.name = config.name;

            if ( Refuel.refuelClass(config.data) == 'DataSource') {
                //console.log('a newly created '+Refuel.refuelClass(this)+' have DataSource PASSED by parent with name:', config.dataLabel, 'in status: '+ config.data.loadStatus );
                this.dataSource = config.data; 
            }
            else {
                //console.log('a newly created '+Refuel.refuelClass(this)+' instances new DataSource with config:', config );
                this.dataSource = Refuel.newModule('DataSource', config);
            }
            config.data = null;
            this.template = Refuel.newModule('Template', config);
            this.template.subscribe('_new_module_requested', createSubmodule, this);
            this.template.subscribe('_generic_binder_event', genericEventHandler, this);
            this.template.subscribe('_observe', observeTemplateSymbol, this);
            this.template.subscribe('_template_element_found', addTemplateElement, this);            
        }

        function addTemplateElement(e) {
            //console.log('#',Refuel.refuelClass(this), e.name, e.element);
            this.elements[e.name] = e.element;
        }

        function createSubmodule(e) {
            var symbol = e.symbol;
            var module = e.module;
            var conf = e.config;
            //onsole.log('submodule',e);

            //dataPath from module label
            var path = symbol.linkedTo.split('.');
            var label = path.splice(0,1)[0];
            path = path.join('.');
            if (path && config.datapath) console.error(label,'error. dataPath defined twice');

            //console.log(this.dataLabel,'creates a Submodule',module.className,'with data', symbol.linkedTo);
            //dataLabel collega i dati del parent
            var defaultSubmoduleConfig = {
                autoload: false
                ,root: symbol.domElement
                ,dataLabel: label //rename in 'name'?
                ,data: this.data[label] //e se non esiste?
                ,dataPath: path 
            }
            conf = Refuel.mix(defaultSubmoduleConfig, conf);
            conf = Refuel.mix(conf, config[label]);
            var newmodule = Refuel.newModule(module.className, conf);
            
            // newmodule.dataSource = this.data[label];
            this.addModule(newmodule);
        }

        function genericEventHandler(e) {    
            var action = actionMap[e.linkedTo];
            if (action) {
                var context = e.options ? action.context.items[e.options] : action.context;
                if (!e.module) e.module = context; 
                action.callback.call(context, e);
            }
            else {
                this.notify('_unhandledAction', e);
            }

        }

        /**
            called by the template (via event) when something has an option: observe
        **/
        function observeTemplateSymbol(e) {
            this.enableAutoUpdate(this.data); //FIXME not generic
            //TODO levare i parametri passati all'observe
            var path = e.linkedTo;
            var obs = this.observe(path, e.symbol, 
                function(observable, tmplSymbol) {
                    this.template.renderSymbol(tmplSymbol, this.data);
                    this.notify('observableChange', {'observable': observable}, true);
                }
            );
        }

        this.setDataPath = function(path) {
            this.config.dataPath = path;
        }

        /**
        *   @memberof AbstractModule#addModule
        *   Add a child module. Child module is added in the 'items' collection under the name specified in the template if any.
        *   Otherwise is pushed as array element inside the 'items' collection.
        */ 
        this.addModule = function(module) {
            module.parentModule = this;
            if (module.dataLabel) this.items[module.dataLabel] = module;
            else                  this.items.push(module);
            module.subscribe('observableChange', function(e) {
                this.notify('observableChange', e);
            }, this);

            module.subscribe('_unhandledAction', function(e) {
                if (!e.module) e.module = module; //keeps only the original module inside the event data
                genericEventHandler.call(this, e);
            }, this);

            //XXX dataAvaiable when module.data changes, use updater
            this.dataSource.subscribe('dataAvailable', function(e) {
                if (module.dataLabel && this.data[module.dataLabel]) {
                    module.data = this.data[module.dataLabel];
                }
            }, this);
            
        }
        
        this.getModulesByClass = function(classname) {
            var res = [];
            for (var mod in this.items) {
                if (Refuel.refuelClass(this.items[mod]) == classname) res.push(this.items[mod]);
            }
            return res;    
        }

        function oa_update(e) {
            //console.log('AbstractModule','update ->',e);      
        }

        /**
        *   @method AbstractModule#draw
        *   Begin the render of the part of template owned by this module
        *   @param data The data to populate the template with, define this if data are different from the dataSource's data    
        */
        this.draw = function(data) {
            data = data || this.data;
            //this.clearObservers();
            this.template.render(data);
            this.notify('drawComplete');
        }

        /**
        * @method AbstractModule#defineUpdateManager
        * @param callback The function that will manage _oa_update event
        */        
        this.defineUpdateManager = function(callback) {
            this.unsubscribe('_oa_update');
            this.subscribe('_oa_update', callback);
        }
        /**
        * @method AbstractModule#defineAction
        */
        this.defineAction = function(name, callback) {
            actionMap[name] = {context: this, callback: callback};
        }
        /**
        * @method AbstractModule#querySelector
        */
        this.querySelector = function(query) {
            return this.template.getRoot().querySelector(query);
        } 

        this.toggleClass = function(classname, value) {
            if (value === undefined) {
                this.classList.toggle(classname);
            }
            else {
                if (value) this.classList.add(classname);
                else this.classList.remove(classname);
            }
        }
        this.reload = function() {
            this.dataSource.reload();
        }

        this.saveData = function() {
            this.dataSource.save();
        }
        this.getModule = function(name) {
            return this.items[name];
        }

        Object.defineProperty(this, 'data', {
            configurable: true,            
            get: function() {
                return this.dataSource.getData();
            },
            //used in Abstract.addModule
            //questo è molto male, controllare come viene usato dall'esterno
            //se voglio settare i data di un module dovrei settarli nel suo dataSource
            set: function(value) {
                this.dataSource.setData(value); 
            }
        });
        Object.defineProperty(this, 'classList', {
            configurable: true,            
            get: function() {
                return this.template.getRoot().classList;
            },
            set: function(value) {
                console.error('cannot set '+this+'classList');
            }
        });
        Object.defineProperty(this, 'root', {
            configurable: true,            
            get: function() {
                return this.template.getRoot();
            },
            set: function(value) {
                console.error('cannot set '+this+'classList');
            }
        });
        
        
});
/**
*   @class ObservableArray
*	@fires _oa_update ObservableArray change event
*	@author Stefano Sergio
*/

Refuel.define('ObservableArray',{inherits: 'Events'}, 
	function ObservableArray() {
		this.config = {};
		var index = 0;
		var data, unFilteredData, lastAppliedFilter;

		this.init = function(myConfig) {
			this.config = Refuel.mix(this.config, myConfig);
			this.set(this.config.value);
			['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'slice'].forEach(handleChange.bind(this));	
		}

		function refreshLength() {
            var e =  {action: 'update', data: data.length, prop: 'length'};
	  		this.notify('_oa_update',e);
		}

		function handleChange(methodName) {
		  	this[methodName] = function () {
				var r = data[methodName].apply(data, arguments);
		  		switch(methodName) {
		  			case 'push': 
		  				var index = data.length-1;
		  				watchElement.call(this, index);
		  				this.length = data.length;
		  				var e =  {action: 'add', index: index, data: this[index]};
		  				this.notify('_oa_update',e);
		  			break;
		  			case 'splice': 
		  				var index = arguments[0];
		  				this.length = data.length;
		  				unWatchElement.call(this, index);
		  				var e =  {action: 'delete', index: index};
		  				this.notify('_oa_update',e);
		  			break;  			
		  		}
		  		return r;
		    };
		}

		this.__defineGetter__('data', function() {
    		return data;
    	});
		
		//XXX Quando viene osservata questi get/set vengono sovrascritti da Observer
		Object.defineProperty(this, 'length', {
		    configurable: true,
			set: function(val) {
				var e =  {action: 'update', data: data.length, prop: 'length'};
	  			this.notify('_oa_update',e);
	           
		    },
			get: function() {
				return data.length;
		    }
		});

    	function watchElement(index) {
    		if(!this.__lookupGetter__(index)) {
	    		(function(context, thisIndex) {
		    		Object.defineProperty(context, thisIndex, {
					    configurable: true,
						set: function(val) {
				            context.setElementAt(thisIndex, val);
					    },
						get: function() {
					        return context.getElementAt(thisIndex);
					    }
					});
	            })(this, index);
	        }
    	}
    	function unWatchElement(index) {
    		if (index) delete this[index];
    		resetWatchers.call(this);
    	}
    	function resetWatchers() {
    		for (var i = 0; i < data.length; i++) {
    			delete this[i];
    			watchElement.call(this, i)
    		};	
    	}

		this.setElementAt = function(index, val) {
			data[index] = val;
		
		}
		this.getElementAt = function(index) {
			return data[index];
		}

		this.filter = function(callback) {
			return data.filter(callback);
		}
		this.clear = function() {
			for (var i = 0; i < data.length; i++) {
    			delete this[i];
    		}
    		data = [];
			data.length = 0;
			this.length = 0;
		}
		this.set = function() {
			data = this.config.value;
			this.length = data.length;
	        resetWatchers.call(this);
	        this.notify('_oa_update',{action: 'set'});
		}
		
});
/**
*   @class Observer
*
*	@fires _oa_update ObservableArray change event
*   @author Stefano Sergio
*/
//TODO rename in Observer and option in 'observe'
Refuel.define('Observer',{require: ['ObservableArray'], inherits: 'Events'}, 
	function Observer() {
    	if (this.observe) return;
		var mountpoint, label;
		var _map = {};
		
	    this.getObservers = function() {
	        return _map;
	    }
	    this.clearObservers = function() {
	    	_map = {};
	    }
	    this.enableAutoUpdate = function(mpDataSource) {
	    	mountpoint = mpDataSource;
	    }

	    function makeObservable(name, value, parent) {  
	        if (name && name != '.') {
				var path = name.split('.');
				var propName = path[path.length-1];
				var resolvedData = Refuel.resolveChain(name, mountpoint, true);
					value = resolvedData.value;
		        	parent = resolvedData.parent;
			}
			else {
	        	parent = this.dataSource; // facciamo mountpoint = ds?
			}
			
			//XXX if _map = {} doesnt work the second time you rebind
			if (Refuel.refuelClass(parent) == 'DataSource') {
				value = parent.data;
				propName = 'data';
			}
			
			//console.log('makeObservable(resolved):',name);
			//Observe an Array
	        if (value && Refuel.isArray(value)) {
				parent[propName] = Refuel.createInstance('ObservableArray', {'value': value});
				makeObservable.call(this, name);
			}
			//Observe (an already) ObservableArray
			else if (value && Refuel.refuelClass(value) == 'ObservableArray') {
				parent[propName].subscribe('_oa_update', function(e) {
					e.observer = _map[name];
					this.notify('_oa_update', e);
			   	}, this);
			}
			//Observe an Object
			else {
				Object.defineProperty(parent, propName, {
				    configurable: true,
					set: function(val) {
						//if (_map[name].value !== val) {
				            _map[name].value = val;
				            notifyChange(_map[name]);
						//}
				    },
					get: function() {
			        	return _map[name].value;
				    }
				});
			}
	        _map[name] = {
	            'name': name
	            ,'value': value
	            ,'owner': parent
	        }
			return _map[name];
	    }

	    function notifyChange(obs) {
	    	var callList = obs['callbackList'];
            if (callList && callList.length) {
            	var len = callList.length;
            	for (var i = 0, call; call = callList[i]; i++) {
            		call.callback.call(call.context, obs, call.params);
            	}
            }
		}
 
	    /**
	    *	this.observe(propName, callback);
	    *	this.observe(propName, data, callback);
	    **/
	    this.observe = function(name, data, callback) {
	    	var context = this;
			if (!callback) {
				callback = data;
				data = null;
			}
	    	if (!mountpoint) {
	    		console.error('Before making',name,'observable you should enableAutoUpdate on',name,'or it\'s parent');
	    		return;
	    	} 
	    	
	    	//XXX shouldnt re-make an already observed property, only add callbacks
	    	//but doing this causes the need to reset _map when  re-rendering
	    	var callbackList = (_map[name] && _map[name].callbackList) ? _map[name].callbackList : [];

	        var obj = makeObservable.call(this, name);	        
	        obj.callbackList = callbackList;
	        _map[name] = obj;

	        // Add Callback
	        if (callback) {
	        	obj.callbackList.push({
		        	'callback': callback,
		        	'context' : this,
		        	'params'  : data
		       	});
	       	}
	       	return obj;
	    }
});

/**
*   @class Template
*	@fires _generic_binder_event An event bound on the markup has been triggered
*	@fires _observe Notifies the module to observe some data marked as "observe" in the template
*	@fires _new_list Notifies the module to create a new List as per rf-list in template
*	@fires _new_listitem Notifies the module to create a new ListItem 
*	@fires parsingComplete 
*
*   @author Stefano Sergio
*/

Refuel.define('Template',{inherits: 'Events'}, function Template() {
		var self = this; //FIXME levare self
		var root, 
			config = {},
			profiler = {},
			bindingTable = {},
			symbolTable = [],
			templateBound = false;
		var refuelModules = Refuel.config.modules;
		var defaultPartsConfig = { strip: false, required: false };

		this.markMissedRefs = false;
		this.bindingsProxy = null;
		var markupPrefix = 'data-rf-';
		var markupActionPrefix = 'data-rf-action-';
		var regExpToMatchName = new RegExp(markupPrefix+'([a-z-]*)');
		var regExpToMatchValue = new RegExp('\\{\\{(.*)\\}\\}');
		var attributeRegExp = new RegExp(markupActionPrefix,'i');
		var datasetRegExp = new RegExp('rfAction', 'i');
		
		this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
           	root = config.root;
        }

		function parseDOMElement(node, symbolTable, regExpToMatchName, regExpToMatchValue, refId,
			 					/* privates */ nodeAttributes, matchedElms, attribute, attributeName, attributeValue) {
			nodeAttributes = node.attributes;
			var parsedAttributes = {};
			//if (node.hasAttribute('debugger')) debugger;
			for (var i = 0; attribute = nodeAttributes[i]; i++) {
				if (!attribute.specified) continue;
				attributeName = attribute.name;
				attributeValue = attribute.value;
				var matchedElms = null;
				var symbol = null;
				//Attribute is like data-rf-*
				if (matchedElms = attributeName.match(regExpToMatchName)) {
					symbol = {
						action: matchedElms[1],
						attribute: attribute,
						attributeName: attributeName,
						domElement: node,
						linkedTo: attributeValue,
						originalSymbol: attributeValue
					};
					if (symbol.action === 'loop') symbol.symbolTable = [];
				}
				//Attribute Value contains {{*}}
				else if (matchedElms = attributeValue.match(regExpToMatchValue)) {
					symbol = {
						action: 'replaceAttributeValue',
						attribute: attribute,
						attributeName: attributeName,
						domElement: node,
						linkedTo: matchedElms[1],
						originalSymbol: matchedElms[0]
					};
				}
				//parse linkedSymbol and options separated with ':'
				if (matchedElms) {
					symbol.originalContent = attributeValue;
					symbol = splitOptions(symbol, symbol.linkedTo);
				}
				if (symbol) {
					parsedAttributes[symbol.action] = symbol; 
				}
			}
			//return a list of actions to the dom parser to know what kind of features that element has
			return parsedAttributes;
		}

		function splitOptions(symbol, data) {
			if (data.indexOf('?') != -1 && data.indexOf(':') != -1) {
				data = data.replace(/\s+/g, '');
				var opts = data.split('?');
				symbol.linkedTo = opts[0];
				symbol.expression = data;
			} 
			else if (data.indexOf('&&') != -1) {
				symbol.expression = data;
			}
			else if (data.indexOf('||') != -1) {
				symbol.expression = data;
			}
			else {
				var opts = data.split(':');
				symbol.linkedTo = opts.length > 1 ? opts[1] : opts[0];
				if (opts.length > 1) symbol.options = opts[0];	
			}
			symbol.linkedTo = symbol.linkedTo.trim();
			if (symbol.options) symbol.options = symbol.options.trim();
			if (symbol.expression) symbol.expression = symbol.expression.trim();
			return symbol;
		}

		//TODO need better factorization
		function evalExpression(exp, data) {
			exp = exp.replace(/\s+/g, '');
			var dataArr = exp.split(/\&\&|\|\||\=\=|\?|\:/),
				map = {},
				solvedExpression = '';
			if (dataArr.length > 1) {
				for (var i = 0, key; key = dataArr[i]; i++) {
					if (!key[0].match(/\'|\"/)) map[key] = Refuel.resolveChain(key, data);	
				}
				solvedExpression = exp;
				for (var key in map) {
					if (typeof map[key] === 'string') map[key] = '\"'+map[key]+'\"'; 
					solvedExpression = solvedExpression.replace(key, map[key]);
				}
				return eval(solvedExpression);
			}
		}

		function normalizePath(path) {
			path = path.replace(config.dataLabel, '');
			if (path.charAt(0) == '.') path = path.substr(1);
			return path || '.';
		}

		function hasDataAction(element, type) {
			for (var i in element.dataset) {
				var action = i.replace(datasetRegExp, '');
				if (action.toLowerCase() === type || action === '') return element; 
			}
			return false;
		}

		function notifyEvent(e) {
 			e.stopPropagation();
			self.bindingsProxy = self.bindingsProxy || self;
			var target = hasDataAction(e.target, e.type) || hasDataAction(e.currentTarget, e.type);
			if (bindingTable[e.type] && target) {
				e.action = (e.type === 'click' || e.type === 'tap' ? 
					target.dataset['rfAction'] || target.dataset['rfActionClick'] : 
					target.getAttribute(markupActionPrefix + e.type)
			    );
			    e = splitOptions(e, e.action);
			   	self.bindingsProxy.notify('_generic_binder_event', e);
			}
		}

		// Per un bug degli eventi del dom, non è possibile associare ad un elemento l'evento doppio click e il click. 
		// Diventa allora difficile agganciare tutti gli eventi alla root del template (TODO add a workaround)
		// Viene richiamato solo una volta per Template.parse
		function templateBinder (rootEl, symbolTable) {
			self.bindingsProxy = self.bindingsProxy || self;
			//if (rootEl.hasAttribute('debugger')) debugger;
			for(var i = 0, symbol;  symbol = symbolTable[i]; i++) {
				var isRoot = symbol.domElement === root;
				if (symbol.action.indexOf('action') == 0) {
					symbol.domAction = true;
					var eventType = (symbol.attributeName === 'data-rf-action' ? 'click' : symbol.attributeName.replace(attributeRegExp, ''));
					if (!bindingTable[eventType]) {
						var gesture;
						if (typeof(Hammer) !== 'undefined') {
							gesture = Hammer(rootEl).on(eventType, notifyEvent);
						}
						else {
							if (rootEl.addEventListener) {
								rootEl.addEventListener(eventType, notifyEvent, false); 
							} else if (el.attachEvent) {
								rootEl.attachEvent('on'+eventType, notifyEvent);
							}
						}
						bindingTable[eventType] = true;
					}
				}
				
				var autoObserveEnabled = config.autoObserve && Refuel.config.autoObserve;
				var observeEnabled = symbol.options && symbol.options === 'observe';

				if (!symbol.domAction && (observeEnabled || autoObserveEnabled)) {
					//console.log('#',this._owner, 'templateBinder->', symbol.action)
					var path = normalizePath(symbol.linkedTo);
					self.notify('_observe', {'linkedTo': path, 'symbol': symbol});
				}
			}
			templateBound = true;
		}

		function getModuleParts(moduleObj) {
			var parts = moduleObj['elements'];
			this.parts = this.parts || {};
			for (var partName in parts) {
				//Takes parts from config or search in dom
				var partObj = parts[partName];
				var selector = partObj['selector'];
				var onlyone = partObj['onlyone'];
				var found;
				if (config['elements'] && config.elements[partName]) {
					found = config.elements[partName];
				}
				else {
					found = root.querySelectorAll(selector);
				}
				if (selector) {
					if (found.length) {
						var child = this.parts[partName] = found.length > 1 && !onlyone ? found : found[0];

						if (partObj['strip']) root.removeChild(child);
						this.notify('_template_element_found', {'name': partName, 'element': child});
					}
				}
			}
		}

		/**
		*	
		*	@param node HTMLDomElement to be processed as root
		*	@param localSymbolTable can be passed to define another scope for the symbiol table (like in loops)
		*/
		this.parse = function(node,
						   /* privates */ nodeValue, matchedElms) {
			var node = node || root;
			if (!node) {
				throw "No root defined";
			}
			nodeValue = node.nodeValue;
			var isRoot = node === root;
			//Sets the style class to the root element
			if (isRoot && config.styleClass) root.classList.add(config.styleClass);

			switch (node.nodeType){
				case 1:
					//FIXME alcuni symbol vengono parsati a doppio, perchè vengono trattati sia nel 
					//	generic che nella root del modulo controllare che non vengano anche agganciati doppi eventi
					var parsedAttributes = parseDOMElement(node, symbolTable, regExpToMatchName, regExpToMatchValue);

					var moduleObj = null;
					for (var key in refuelModules) {
						var attribKey = markupPrefix+key;
						if (node.hasAttribute(attribKey)) {
							moduleObj = refuelModules[key];
							if (!isRoot) {
								this.submodules = this.submodules || {};
								var mName = node.getAttribute(attribKey);
								
								
								this.notify('_new_module_requested', {
									'symbol': parsedAttributes[key],
									'module': moduleObj,
									'config': parsedAttributes
								});
							}
							//find  parts defined inside config.modules 
							//XXX if this is the root of a code-defined module this wont happen. Should be fixed unsing config.className
							else {
								moduleTemplateConfig = moduleObj;
								getModuleParts.call(this, moduleObj);
								for (var key in parsedAttributes) {
									symbolTable.push(parsedAttributes[key]);
								}
							}
						}
					}

					if (parsedAttributes['data-rf-visibility']) {
						symbol.displayStyle = symbol.domElement.style.display;
					}

					if(!moduleObj || isRoot) {
						for (var i=0, childElm; childElm = node.childNodes[i++];) {
							this.parse(childElm, symbolTable);
						}
						for (var key in parsedAttributes) {
							symbolTable.push(parsedAttributes[key]);
						}
					}
				break;
				case 3: //Text Node
					if (matchedElms = nodeValue.match(regExpToMatchValue)) {
						//The nodeContent CAN contain two parameters separed by ':'
						var symbol = {
							action: 'replaceText',
							domElement: node.parentElement,
							textNode: node,
							originalContent: nodeValue,
							originalSymbol: matchedElms[0]
						}
						symbol = splitOptions(symbol, matchedElms[1]);
						symbolTable.push(symbol);
					}
				break;
			}
			return symbolTable;
		}

		this.parseTemplate = function(reparse) {
			symbolTable = this.parse();
			this.notify('parsingComplete', symbolTable);
		}

		/**
		*	@param data array or object of data to insert inside the template 
		*	@tSymbolTable parsed template symbolTable to use, should be generated by the Template.parse action
		**/
		//TODO if !symbolTable should auto-parse
		this.render = function(data) {
			profiler.timestart = new Date().getTime();
			if (!data) console.error('Template::render data argument is null');
			//TODO why we dont notify? check sayt
			if (!symbolTable.length)  this.parseTemplate();
			//if (!templateBound) 
				templateBinder(root, symbolTable);
			self.notify('_template_parsed', {symbolTable: symbolTable});
			
			for(var i = 0, symbol;  symbol = symbolTable[i]; i++) {
				self.renderSymbol(symbol, data)
			}
			profiler.timestop = new Date().getTime();
			if(profiler.enabled) console.log('Template.profiler[render]',root.id, profiler.timestop - profiler.timestart);
		}

		this.renderSymbol = function(symbol, data) {
			//optimize symbol processed: ignore action
			if (symbol.domAction || symbol.action === 'list') return;

			var isRoot = symbol.domElement === root;
			var path = normalizePath(symbol.linkedTo);
			var linkedData = Refuel.resolveChain(path, data);
			if (symbol.expression) linkedData = evalExpression(symbol.expression, data);

			//console.log('renderSymbol',path, symbol.linkedTo, linkedData);
			switch(symbol.action) {
				case 'replaceText': 
					markMissing(symbol, linkedData);
					symbol.textNode.textContent = symbol.originalContent.replace(symbol.originalSymbol, linkedData || '');
				break;
				
				case 'replaceAttributeValue':
					markMissing(symbol);
					switch(symbol.attributeName) {
						case 'checked':
						case 'selected':
							symbol.domElement[symbol.attributeName] = linkedData == true;
						break;
						case 'data-src':
							var src = symbol.originalContent.replace(symbol.originalSymbol, linkedData || '');
							symbol.domElement.removeAttribute('data-src');
							symbol.domElement.setAttribute('src', src);
						break;
						default:
							symbol.attribute.value = symbol.originalContent.replace(symbol.originalSymbol, linkedData);	
					}
				break;
				case 'visibility':
					if (linkedData) symbol.domElement.style.display = symbol.displayStyle;
					else  symbol.domElement.style.display = 'none';
				break;
				case 'loop':
					symbol.elements = [];
					symbol.domElement.innerHTML = '';
					var docFragment = document.createDocumentFragment();
					for (var i = 0; i < linkedData.length; i++) {
						var el = createListElement(linkedData[i], symbol);
						el.setAttribute(markupPrefix+id, i);
						docFragment.appendChild(el);
					};
					symbol.domElement.appendChild(docFragment);
				break;
			}
		}

		/**
			Creates a new Template fragment and append it to the dom, this action is alternative to Template.render()
			
			@param rootElement root to append the newly created template into
			@param template template fragment to render data
			@param data 
			
		**/
		this.create = function(rootElement, template, data) {
			root = template.cloneNode(true);
			this.render(data);
			rootElement.appendChild(root);
		}

		this.remove = function() {
			root.parentNode.removeChild(root);
		}

		this.clear = function() {
			root.innerHTML = '';
		}

		function createListElement(data, parentSymbol) {
			var domClone = parentSymbol.template.cloneNode(true);
			var tmpl = Refuel.newModule('Template', {'root': domClone});
			tmpl.bindingsProxy = self;
			tmpl.render(data);
			parentSymbol.elements.push(tmpl);
			return tmpl.getRoot();
		}

		function markMissing(symbol, linkedData) {
			if (self.markMissedRefs &&  typeof(linkedData) == 'undefined') {
				symbol.domElement.style.border = '1px solid red';
				console.warn('missing', symbol.linkedTo, typeof linkedData);
			}
		}

		this.getSymbolTable = function() {
			return symbolTable;
		}
		this.getSymbolByAction = function(action) {
			for (var i = 0, symbol; symbol = symbolTable[i]; i++) {
				if (symbol.action === action) 
					return symbol;
			};
		}

		this.setRoot = function(r) {
			root = r;
		}
		this.getRoot = function() {
			return root;
		}
		this.getBindings = function() {
			return bindingTable;
		}
});/**
*	@class DataSource
*	@param data direct set data
*	@param key  localStorage key
*	@param url  ajax call url
*	@param dataPath when data are loaded
*   
*	@fires dataAvaiable The class has loaded its data and is ready
*	@fires dataError Some error is occurred during data loading
*	@author Stefano Sergio
*/
Refuel.define('DataSource', {inherits: 'Events'}, 
	function DataSource() {
		var data = {},
			sourceData = {}, 
			lastLoadConfig = null,
			_loadStatus = 'idle',
			currentXHR = null;

		var config = {
				'callerModule': this,
				'defaultDataType': 'Object',
				'dataPath': null,
				'successCallback': successCallback.bind(this),
				'errorCallback': errorCallback.bind(this),
				'timeoutCallback': timeoutCallback.bind(this),
				'autoload': false,
				'_genericCallback': genericCallback.bind(this),
				'mode': 'new',
				'timeout': 1000,
				'retryTimeoutIncrease': 1000, 
				'retryTimes': 4,
				'retryDelay': 500,
				'retryDelayIncrease': 2000
				//,allowedStatus: []
			},
			extLoadingState = {
				requested: 0,
				completed: 0
			};

		this.setLoadComplete = function() {
			_loadStatus = 'complete';
		}
		this.setLoadProgress = function() {
			_loadStatus = 'progress'; 
		}
		this.setLoadIdle = function() {
			_loadStatus = 'idle';
		}
		Object.defineProperty(this, 'loadComplete', {
			get: function() {
		        return _loadStatus == 'complete';
		    }
		});
		Object.defineProperty(this, 'loadProgress', {
			get: function() {
		        return _loadStatus == 'progress';
		    }
		});
		Object.defineProperty(this, 'loadIdle', {
			get: function() {
		        return _loadStatus == 'idle';
		    }
		});
		Object.defineProperty(this, 'loadStatus', {
			get: function() {
		        return _loadStatus;
		    }
		});
		Object.defineProperty(this, 'sourceData', {
			get: function() {
		        return sourceData;
		    }
		});


		Object.defineProperty(this, 'data', {
			configurable: true,				
			get: function() {
		        return data;
		    },
		    set: function(val) {
		    	data = val;
		    }
		});

		this.init = function(myConfig) {
			config = Refuel.mix(config, myConfig);

			//console.log('datasource.init',config.dataLabel,_loadStatus,config.autoload, config.msg );
			refreshInterface.call(this);
			if (this.loadComplete) {
           		this.notify('dataAvailable', {'data': data});
           	}
           	else if (config.data) {
           		setData.call(this, config.data);
           		config.data = null;
			} 
           	else if (config.autoload) {
           		this.load();
           	}
        }

        this.abort = function() {
        	//not implemented yet
        }
        this.clear = function() {
        	//not implemented yet
        }

        this.setConfig = function (myConfig) {
        	config.params = null;
        	config.mode = 'new';
        	config = Refuel.mix(config, myConfig || {});
        	lastLoadConfig = config;
        	refreshInterface.call(this);
        }
        //XXX Really?
        this.getConfig = function() {
        	return config;
        }

		this.setData = function(dataObj) {
			setData.call(this, dataObj);
		}

		function setData (dataObj) {
			//console.log(config.dataLabel,'setData', dataObj);
			this.setLoadProgress();
			if (Refuel.refuelClass(dataObj) == 'DataSource') {
				dataObj = Refuel.resolveChain('data', dataObj);
			}
			if (config.mode === 'new') {
				data = dataObj;
			}
			else if (config.mode === 'add') {
				if (dataObj.hasOwnProperty('length') && data.concat) {
					data = data.concat(dataObj);
				}
				else {
					data = Refuel.mix(data, dataObj);
				}
			} 
			
			this.setConfig(); //reset config before passing on other DS
			extLoadingState.found = extLoadingState.requested = extLoadingState.completed = 0;

			for(var key in data) {
				var prop = data[key];

				if (Refuel.refuelClass(prop) == 'DataSource') {
					extLoadingState.found++;
					if (prop.loadComplete) {
						checkLoadingState.call(this);
					}
					else if (!prop.loadProgress || !prop.loadComplete) {
						extLoadingState.requested++;
						prop.subscribe('dataAvailable', function() {
							extLoadingState.completed++;
							checkLoadingState.call(this);
						}, this);
						prop.setConfig({autoload: config.autoload})
						prop.init();
					}
				}
			}
			if (!extLoadingState.found) checkLoadingState.call(this);
		}

		function checkLoadingState() {
			if (this.loadProgress && extLoadingState.requested == extLoadingState.completed) {
				this.setLoadComplete();
				this.notify('dataAvailable', {'data': data});
			}
		}

		this.getData = function() {
			return data;
		}

		function filterLSData(key, value) {
			if (Refuel.refuelClass(value) == 'ObservableArray') {
				return value.data;
			}
			else {
				return value;
			}
		}

		this.save = function() {
			if (config.key) {
				localStorage.setItem(config.key, JSON.stringify(data, filterLSData));
            }
            else if (config.url) {
            	console.error('Ajax call not yet implemented');
            }

			for(var key in data) {
				var prop = data[key];
				if (Refuel.refuelClass(prop) == 'DataSource') {
					prop.save();
				}	
			}
		}

		this.load = function(myConfig) {
			this.setConfig(myConfig);
			if (this.loadProgress) return;
			//console.log('DataSource start loading data labelled',config.dataLabel,'from',config.url || config.key);
			
			this.setLoadProgress();
			if (config.key) {
				
				var storedData = localStorage.getItem(config.key);
				
				var storedObject = JSON.parse(storedData);
				if (storedObject) {
					sourceData = storedObject;
					var puredata = Refuel.resolveChain(config.dataPath, storedObject);
            		setData.call(this, puredata);
            	}
            	else {
            		var defaultEmptyData = config.defaultDataType == 'Array' ? [] : {};
            		setData.call(this, defaultEmptyData);
            	}
            }
            else if (config.url) {
            	currentXHR = Refuel.ajax.get(config.url, config);
            }

            for(var key in data) {
				var prop = data[key];
				if (Refuel.refuelClass(prop) == 'DataSource') {
					if (!prop.loadComplete) prop.load();
				}	
			}
		}

		this.abort = function() {
			currentXHR.abort();
		}

		this.reload = function() {
			this.load(lastLoadConfig);
		}

		function successCallback(dataObj) {}
		function errorCallback(dataObj) {}
		function timeoutCallback(dataObj) {}

		function genericCallback(response, status, xhr, type) {
			switch(type) {
				case 'success':
					sourceData = response.responseJSON;
					var puredata = Refuel.resolveChain(config.dataPath, response.responseJSON);
					setData.call(this, puredata);	
				break;
				case 'error':
					this.setLoadIdle();
					console.error("datasource error:", config);
					this.notify("dataError", data);
				break;
				case 'timeout':
					this.setLoadIdle();
					console.error("datasource Timed-Out:", config);
					this.notify("dataError", data);
				break;
			}
		}

		function refreshInterface() {
			var facade = {},
				url = config.url,
				key = config.key;

			if (url) {

				facade = {
					"get": function(params, callback) {
						var postconf = Refuel.clone(config);
						if (callback) 
							postconf.successCallback = postconf.errorCallback = postconf.timeoutCallback = callback;
						postconf.params = params;
						Refuel.ajax.get(config.url, postconf);
					},
					"post": function(body, callback) {
						var postconf = Refuel.clone(config);
						if (callback) 
							postconf.successCallback = postconf.errorCallback = postconf.timeoutCallback = callback;
						Refuel.ajax.post(config.url, body, postconf);
					},
					"put": function(body) {
						Refuel.ajax.put(url, body, config);
					},
					"delete": function() {
						Refuel.ajax.delete(url, config);
					}
				}
			 }
			 else if (key) {
				facade = {
					"get": function() {
						return localStorage.getItem(key);
					},
					"set": function(dataObj) {
						localStorage.setItem(key, JSON.stringify(data));


					},
					/*"update": function(dataObj) {
						localstorage.update(config.config.key, dataObj);
					},*/
					"remove": function() {
						localStorage.removeItem(key);
					}
				}
			}
			
			for (var key in facade) {
				if (!this[key]) {
					this[key] = facade[key];
				}
			}
			return facade;
		}
    });
/**
*   @class GenericModule
*
*   @author Stefano Sergio
*/

//XXX this module will be just a concrete implementation of AbstractModule 
Refuel.define('GenericModule',{inherits: 'AbstractModule'}, 
    function GenericModule() {
        var config = {};
        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
            delete config['data'];

            if (config.root) {
                this.template.setRoot(config.root);
                this.template.parseTemplate();
            }
            
            if (this.dataSource) {
                //console.log(config.dataLabel, Refuel.refuelClass(this),'have dataSource and is waiting for data...');
                this.dataSource.subscribe('dataAvailable', function(data) {
                    //console.log(config.dataLabel, Refuel.refuelClass(this),'got all data (dataAvailable), now he can draw()');
                    this.notify('loadComplete');
                    this.draw();
                    //this.notify('drawComplete');
                }, this);
                this.dataSource.init(config);
            }
        }
});
/**
*   @class ListModule
*   @param root: HTMLElement,
*   @param symbol: Parsed template symbol, if this symbol exists, this Module's Template has been already parsed 
*   @param items Array of ListItemModule [read only]
*
*   @author Stefano Sergio
**/
Refuel.define('ListModule',{inherits: 'AbstractModule', require:'ListItemModule'}, 
    function ListModule() {
        var config = {
            maxLength: 0
        };
        this.items = [];
        var filterApplied = null;

        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);  
            delete config['data'];
            this.selectedIndex = -1;

            //XXX shouldnt auto-detect type?   
            this.dataSource.setConfig({defaultDataType: 'Array'});

            this.defineUpdateManager(oa_update.bind(this));
            if (config.root) this.template.setRoot(config.root);


            if (this.dataSource) {
                //console.log(config.dataLabel+' ('+Refuel.refuelClass(this)+') have dataSource and is waiting for data...');
                this.dataSource.subscribe('dataAvailable', function(e) {
                    if (config.maxLength && e.data.length > config.maxLength) this.data = e.data.slice(0, config.maxLength);
                    //console.log(this.dataLabel,'got all data ',this.data,', now can draw()');
                    this.notify('loadComplete');
                    this.draw();
                    set.call(this);
                    //this.notify('drawComplete');
                }, this);
                this.dataSource.init(config);    
            }
        }

        this.haslistener = function() {
            return this.dataSource.isSubscribed('dataAvailable');   
        }

        this.create = function() {
            this.enableAutoUpdate(this.dataSource.getData(), config.dataLabel);
        }

        this.add = function(objData) {
            this.dataSource.data.push(objData);
        }
        
        this.selectChildAt = function(index, selected) {
            selected = selected === undefined ? true : selected;
            if (selected) {
                if (this.selectedIndex > -1) this.items[this.selectedIndex].deselect();
                this.selectedIndex = index;
                this.items[index].select();
            }
        }
        /*
        this.remove = function(objData) {
            var index = this.getItemIndex(objData);
            this.removeAt(index);
        }
        */
        this.removeAt = function(index) {
            this.data.splice(index, 1);    
        }

        this.removeByFilter = function(filterObj) {
            var todelete = this.filterBy(filterObj);
            for (var i=0, item; item = this.data[i]; i++) {
                this.removeAt(this.getItemIndex(item));
            }
        }

        this.update = function(objData) {
            var obj = {};
            obj[config.dataLabel] = objData;
            this.dataSource.setData(obj);
        }

        function oa_update(e) {
            switch(e.action) {
                case 'set':
                    set.call(this);
                break;
                case 'add': 
                    addListItem.call(this,{data: e.data, index:e.index});
                    if(filterApplied) this.filterApply(filterApplied);
                break;
                case 'delete':
                    removeListItem.call(this, {index: e.index});
                break;
            }
        }
        function set(dataToShow) {
            dataToShow = dataToShow || this.data;
            this.selectedIndex = -1;
            //console.log('ListModule.set', this.data.length);
            this.items = [];
            this.template.clear();
            for (var i = 0, item; item = dataToShow[i]; i++) {
                addListItem.call(this,{'data': item, 'index':i});
            }
        }

        //Data change callbacks
        function removeListItem(e) {
            this.items[e.index].destroy();
            this.items.splice(e.index, 1);
        }

        function getElementStyle() {   
            var rowStyle = null;
            if (config.rowStyle) {
                var index = this.items.length;
                var even = (index % 2) == 0 ? 0 : 1;
                rowStyle = config.rowStyle.length == 1 ? config.rowStyle[0] : config.rowStyle[even];                
            }
            return rowStyle;
        }

        function addListItem(obj) {
            var rowStyle = getElementStyle.call(this);
            if (this.elements['template']) this.elements['template'].removeAttribute('data-rf-template');
            var listItem = Refuel.newModule('ListItemModule', { 
                parentRoot: config.root, 
                template: this.elements['template'],
                autoload: false,
                styleClass: rowStyle,
                data: obj.data
            });
            this.addModule(listItem);
        }
       
        this.applyOnItems = function(callback, args) {
            var data = this.items;
            for(var i = 0, item; item = data[i]; i++) {
                var newargs = [].concat(args);
                newargs.unshift(item);
                callback.apply(item, newargs);
            }
        }

        //XXX this returns index of DATA not ITEM
        this.getItemIndex = function(item) {
            for (var i = 0, curItem; curItem = this.data[i]; i++) {
                if (curItem === item) return i;
            };
            return null;
        }

        //XXX this is filtering DATA not ITEM
        this.filterBy = function(filterObj) {
            if (!this.data) return [];
            return this.data.filter(function(item, index, array) {
                var result = true;
                for (var key in filterObj) {
                    result = result && (filterObj[key] == Refuel.resolveChain(key, item));
                }
                return result;
            });
        }

        this.filterApply = function(filterObj) { 
            filterApplied = filterObj;
            var filtered = this.filterBy(filterObj);
            set.call(this, filtered);
            return filtered;
        }

        this.filterClear = function() {
            filterApplied = null;
            set.call(this);
        }

});/**
*   @class ListItemModule
*
*   @param parentRoot: HTMLElement
*   @param template: Refuel.Template instance
*   @author Stefano Sergio
**/

Refuel.define('ListItemModule', {inherits: 'AbstractModule'},  
    function ListItemModule() {
        var config = {};
        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig);
            delete config['data'];
            this.enableAutoUpdate(this.data);
            this.isSelected = false;

            if (this.dataSource) {
                //console.log(Refuel.refuelClass(this),config.dataLabel,'have dataSource and is waiting for data...');
                this.dataSource.subscribe('dataAvailable', function(data) {
                    //console.log(Refuel.refuelClass(this),'got all data (dataAvailable), now he can draw()');
                    this.notify('loadComplete');
                    this.draw();
                    //this.notify('drawComplete');
                }, this);
                this.dataSource.init(config);    
            }
        }
        
        function oa_update(e) {
            //console.log('ListItemModule.oa_update', e);
        }

        this.destroy = function() {
            this.template.remove();
            delete this;
        }

        this.draw = function() {
            if (!config.template) throw "No template found for ListItemModule";
            this.template.create(config.parentRoot, config.template, this.data);
            this.notify('drawComplete');
        }
        this.select = function() {
            this.classList.add('selected');
            this.isSelected = true;
        }
        this.deselect = function() {
            this.classList.remove('selected');
            this.isSelected = false;
        }
});

/**
*	@class SaytModule
*	@param root 
*   
*	@fires dataAvailable The class has loaded its data and is ready
*	@fires dataError Some error is occurred during data loading
*	@author Stefano Sergio
*/
Refuel.define('SaytModule', {inherits: 'GenericModule', require: ['ListModule']},  
    function SaytModule() {
        var config = {
            minChars: 2,
            searchParam: 'q',
            delay: 100,
            primaryField: 'name',
            enableKeySelection: true,
            keySelectionInsideInput: true,
            enterDefaultAction: null
        };
        var lastQuery,
            searchTimeout,
            inputField,
            resultList,
            listItemTemplate,
            theList;

        this.init = function(myConfig) {
            config = Refuel.mix(config, myConfig); 
            delete config['data'];
            
            if (config.root) this.template.setRoot(config.root);
            this.template.subscribe('parsingComplete', create, this);
            this.template.parseTemplate();
            
            if (this.dataSource) {
                this.dataSource.subscribe('dataAvailable', function(data) {
                    this.notify('loadComplete');
                    this.draw();
                    //this.notify('drawComplete');
                }, this);
                this.dataSource.init(config);
            }
            this.currentQuery = null;
        }

        function create(e) {
            var self = this;
            inputField = this.elements['inputField'];
            resultList = this.elements['resultList'];
            listItemTemplate = this.elements['listItemTemplate'];
            inputField.addEventListener('keyup', handleTyping.bind(this));
            inputField.addEventListener('blur', function() { self.hide(); });
            inputField.addEventListener('focus', function() { self.show(); });
            
            if (config.enableKeySelection) {
                inputField.addEventListener('keydown', function(e) {
                    if(!theList.items.length || (e.keyCode != 40 && e.keyCode != 38 && e.keyCode != 13) ) return;
                    switch(e.keyCode) {
                        case 38: //up
                            if (theList.selectedIndex > 0) {
                                theList.selectChildAt(theList.selectedIndex-1);
                            }
                            else {
                                theList.selectChildAt(theList.items.length-1);
                            }
                        break;
                        case 40: //down
                            if (theList.selectedIndex < theList.items.length-1) {
                                theList.selectChildAt(theList.selectedIndex+1);
                            }
                            else {
                                theList.selectChildAt(0);
                            }
                        break;
                        case 13:
                            if(config.enterDefaultAction) {
                                e.preventDefault();
                                e.stopPropagation();
                                e.module = theList.items[theList.selectedIndex];
                                config.enterDefaultAction.call(this, e);
                            }
                        break;
                    }
                    if (config.keySelectionInsideInput && theList.selectedIndex) 
                        inputField.value = theList.items[theList.selectedIndex].data[config.primaryField];

                });
            }
            /*
            if (!resultList) {
                resultList = document.createElement('ul');
                this.template.getRoot().appendChild(resultList);
                this.elements['resultList'] = resultList;
            }
            if (!listItemTemplate) {
                listItemTemplate = document.createElement('li');
                listItemTemplate.innerHTML = '<div class="view">{{name}}</div>';
                resultList.appendChild(listItemTemplate);
                this.elements['listItemTemplate'] = listItemTemplate;
            }
            */
            //if ListModule is defined inside markup
            theList = this.getModulesByClass('ListModule')[0];
            //if ListModule is not already defined
            if (!theList) {
                theList = Refuel.newModule('ListModule', {
                    'root': resultList,
                    'dataLabel': 'list',
                    'elements': {
                        'template': listItemTemplate 
                    }
                });
                this.addModule(theList);
            }
            this.hide();
            //XXX why?
            theList.template.parseTemplate();
        }

        this.draw = function(data) {
            //XXX with super() method we'll be fine
            data = data || this.data;
            this.template.render(data);

            //ignores any dataPath the list may have
            theList.data = data;

            //theList.toggleClass('show', data.length);
            data.length ? this.show() : this.hide();
            this.notify('drawComplete');
        }

        function handleTyping(e) {
            if (e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 13) return;
            var query = inputField.value.trim();
            if (query != this.currentQuery ) {
                if (searchTimeout) window.clearTimeout(searchTimeout);
                searchTimeout = window.setTimeout(startSearch.bind(this, query),config.delay);
            }
            else {
                this.show();
            }
        }

        function cancelSearch() {
            lastQuery = this.currentQuery; //move in currentQuery setter?
            this.currentQuery = null;
        }
        function startSearch(query) {
            //console.log('start sayt search', query);
            if (searchTimeout) window.clearTimeout(searchTimeout);
            lastQuery = this.currentQuery;
            if (query.length === 0) {
                this.hide();
            }
            else if (query.length >= config.minChars) {
                this.currentQuery = query;
                theList.template.clear();
                this.dataSource.load({'params': config.searchParam+'='+query});
            }
        }

        this.hide = function() {
             theList.toggleClass('hide', true);
        }
        this.show = function() {
             theList.toggleClass('hide', false);
        }

        function oa_update(e) {
            //console.log('SaytModule.oa_update', e);
        }

      	
});
/**
* ScrollerModule
* realizza lo scroller verticale con effetto accellerazione e "molla"
*
* @Author: Burgassi Matteo
* @Last Author: Stefano Sergio
*/

Refuel.define('ScrollerModule', {inherits: 'Events'},
    function ScrollerModule() {
    	var self = this;
		var delta = 0, oldDelta = 0, index = 0, newY = 0, point = 0, startTime = 0, duration = 0;
		var isVertSwipe = false;
		var moveArray = [];
		var scrollBar, docHeight,  pagHeight, now, element, rootDOMElement;
		var defaultEvents = ['touchstart','touchmove','touchend','webkitTransitionEnd','msTransitionEnd','oTransitionEnd','transitionend','DOMSubtreeModified','DOMNodeInserted','DOMNodeRemoved','DOMNodeRemovedFromDocument','DOMNodeInsertedIntoDocument','DOMAttrModified','DOMCharacterDataModified'];

		var config = {
			startScroll: 0,
			speed:		1000,
			inertia: 300,
			maxElong: 150,
			scrollBar: false,
			topMargin: 0
		};
		
		this.init = function(myConfig) {
			config = Refuel.mix(config, myConfig);
			rootDOMElement = config.rootDOMElement;
			if (!rootDOMElement && config.rootId) rootDOMElement = document.querySelector("#"+config.rootId); 
			resetElement();
			update();
			//attach events
			defaultEvents.forEach(function(ev) {
				element.addEventListener(ev, handleEvent, false);
			});
			window.addEventListener('resize', handleEvent, false);
		};
		
		this.moveTo = function(y, time) {
			newY = y;
			applyStyle(element, 'transform', 'translate3d(0,' + newY + 'px,0)');
			var tvalue =  time || config.speed + 'ms cubic-bezier(0, 0, 0, 1)';
			applyStyle(element, 'transition',  tvalue);	
		}

		this.reset = function(myConfig) {
			config = Refuel.mix(config, myConfig);
			resetElement();
			scrollBarEnd(0);
			index, newY, oldDelta, delta = 0;
		};
		this.destroy = function() {
			defaultEvents.forEach(function(ev) {
				element.removeEventListener(ev, handleEvent, false);
			});
			window.removeEventListener('resize', handleEvent, false);
			if(scrollBar) scrollBar.parentElement.removeChild(scrollBar);
		}
		
		function handleEvent(e) {

			switch (e.type) {
				case 'touchstart': onTouchStart.call(self, e); break;
				case 'touchmove': onTouchMove.call(self, e); break;
				case 'touchend': onTouchEnd.call(self, e); break;
				case 'webkitTransitionEnd':
				case 'msTransitionEnd':
				case 'oTransitionEnd':
				case 'transitionend': transitionEnd.call(self, e); break;
				case 'resize': 
				case 'DOMSubtreeModified':
				case 'DOMNodeInserted':
				case 'DOMNodeRemoved':
				case 'DOMNodeRemovedFromDocument':
				case 'DOMNodeInsertedIntoDocument':
				case 'DOMAttrModified':
				case 'DOMCharacterDataModified': update.call(self, e);
			}
		};
		
		function createScrollbar() {	
			if (scrollBar) {
				scrollBar.style.height = Math.floor((pagHeight*pagHeight)/docHeight) + "px";
				if (docHeight <= pagHeight) return;
			}
			if (rootDOMElement) {
				if(!scrollBar) {
					scrollBar = document.createElement("div");
					if (element) {
						if (docHeight != 0) {
							scrollBar.style.height = Math.floor((pagHeight*pagHeight)/docHeight) + "px";
						}
					}
					//scrollBar.setAttribute("id", config.divID + "-scrollBar");
					scrollBar.style.width = "5px";
					scrollBar.style.position = "absolute";
					scrollBar.style.top = "0px";
					scrollBar.style.right = "5px";
					scrollBar.style.background = "black";
					scrollBar.style.border = "1px solid white";
					scrollBar.style.opacity = "0.5";
					scrollBar.style.borderRadius = "5px";
					scrollBar.style.display = "none";
					scrollBar.style.zIndex = 1;
					//calcolo altezza della scrollbar
					rootDOMElement.appendChild(scrollBar);
				}
			}
		}
		
		function transitionEnd(e) {
			var height = element.offsetHeight - rootDOMElement.offsetHeight;
			var elementHeight = -height;
			if (newY > 0 || (height < 0)) {
				fixToUpperBound();
			}
			else if ((Math.abs(newY) >= Math.abs(height))) {
				fixToLowerBound(elementHeight);
			}
			else if (scrollBar) {
				scrollBar.style.display = "none";
			}
			this.notify('transitionEnd');
		};
		
		this.setup = function() {
			window.scroll(0,0);
			transitionEnd.call(this);
		};
		
		function update() {
			docHeight = element.getBoundingClientRect().height;
			pagHeight = rootDOMElement.getBoundingClientRect().height - config.topMargin;
			//console.log('docHeight, pagHeight',docHeight, pagHeight);
			if (scrollBar) createScrollbar();
		};
		
		function onTouchStart(e) {
			//retrieve animation start point
			point = e.touches[0].pageY;
			moveArray = [];
			
			//calculate actual delta to stop animation
			var pos = Math.ceil(element.getBoundingClientRect().top - rootDOMElement.getBoundingClientRect().top);
			applyStyle(element, 'transform', 'translate3d(0,' + pos + 'px,0)');
			applyStyle(element, 'transition', '0ms linear');
			applyStyle(element, 'transition', 'none');
			newY = pos;
			index = pos;
			// set initial timestamp of touch sequence
			startTime = Number( new Date() );
			delta = 0;
			e.stopPropagation();
// 			e.preventDefault();
		};
		
		function onTouchMove(e) {
			if (scrollBar) scrollBar.style.display = "block";	
			// ensure scroll with one touch and not pinching
			if (e.touches.length > 1 || e.scale && e.scale !== 1) return;
			//avoid standard behaviour
			e.preventDefault();
			
			//calculate vertical scroll
			delta = e.touches[0].pageY - point;
			newY = index + delta;
			//controllo se si cambia direzione				
			if (Math.abs(oldDelta) >= Math.abs(delta)) {
				startTime = Number( new Date() );
				point = e.touches[0].pageY; 
				index = newY;
			}
			oldDelta = delta;
			// translate immediately 1-to-1
			applyStyle(element, 'transform', 'translate3d(0,' + newY + 'px,0)');			
			scrollBarMove(newY);
			//block event here
			//e.stopPropagation();
			moveArray.push(newY);
		};
		
		function applyStyle(dom, name, value) {
			var atr = Modernizr.prefixed(name);
			dom.style[atr] = value;
		}

		function onTouchEnd(e) {
			now = Number(new Date());
			duration = now - startTime; //durata dello swipe
			var v = delta/duration;
			var dist = Math.abs(delta);
			isVertSwipe =  (Math.abs(moveArray[moveArray.length-1]-moveArray[moveArray.length-2])); //determine if is a vertical swipe
			//determine if is too faster to be a swipe;

			v >= 8? v=4: ""; 
			v < -8? v=-4: "";
			var height = element.offsetHeight - rootDOMElement.offsetHeight;
			var elementHeight = -height;
			var eventType;
			var elong = Math.floor(config.maxElong % (Math.abs(v) * 100)) + 50;
			if (isVertSwipe > 3 && dist > 10) {
				newY += Math.ceil((v)*config.speed/2);
				
				//check upper bound
				if (newY > 0) {
					//console.log('1');
					applyStyle(element, 'transform', 'translate3d(0,' + (elong) + 'px,0)');
					applyStyle(element, 'transition',  elong + 'ms linear');					
					scrollBarEnd(elong);
					
					fixToUpperBound();
					eventType = 'upperBoundReached';
					
				}//check lower bound
				else if ((Math.abs(newY) >= Math.abs(height))) {
					//console.log('2');
					var tvalue = 'translate3d(0,' + (-(height + elong)) + 'px,0)';
					applyStyle(element, 'transform', tvalue);
					applyStyle(element, 'transition',  elong + 'ms linear');	
					scrollBarEnd(-(height + elong));
					
					fixToLowerBound();
					eventType = 'lowerBoundReached';
				}
				else {
					//console.log('3');
					moveTo(newY);
					scrollBarEnd(newY);
					eventType = 'movedTo';
				}
			}
			else {
				if ((newY > 0) || (height < 0)) {
					//console.log('4');
					fixToUpperBound();
					e.stopPropagation();
					return;
				}
				if ((Math.abs(newY) >= Math.abs(height))) {
					//console.log('5');
					fixToLowerBound(elementHeight);
					e.stopPropagation();
					return;
				}
				if (scrollBar) scrollBar.style.display = "none";	
			}
			oldDelta = 0;
			//set the new starting point
			index = newY;
			e.stopPropagation();
			if (eventType) this.notify(eventType, {y: index});
		};
		
		function fixToUpperBound(){
			applyStyle(element, 'transform', 'translate3d(0,0,0)');
			var tvalue = config.inertia + 'ms cubic-bezier(0, 0, 0, 1)';
			applyStyle(element, 'transition', tvalue);
			
			if (scrollBar) {
				scrollBarEnd(0);
				setTimeout(function() {scrollBar.style.display = "none"}, config.inertia);	
			}
			index = 0;
		};
		
		function fixToLowerBound(){
			var elementHeight = -docHeight + pagHeight;
			var tvalue = 'translate3d(0,' + (elementHeight) + 'px,0)'; // - config.topMargin
			applyStyle(element, 'transform', tvalue);
			tvalue = config.inertia + 'ms cubic-bezier(0, 0, 0, 1)';
			applyStyle(element, 'transition', tvalue);			
			
			if (scrollBar) {
				scrollBarEnd(elementHeight);
				setTimeout(function() {scrollBar.style.display = "none"}, config.inertia);	
			}
			index = elementHeight;
		};

		function resetElement() {
			rootDOMElement = config.rootDOMElement;
			if (!rootDOMElement && config.rootId) rootDOMElement = document.querySelector("#"+config.rootId); 

			if (!rootDOMElement) {
				this.error('rootDOMElement not specified'); return;
			}
			element = rootDOMElement.children[0];
			if (!element) {
				this.error('scroll pane not specified'); return;
			}

			rootDOMElement.style.overflow = 'hidden';
			element.style.width = '100%'; 
			element.style.position = 'absolute';
			element.style.margin = 0;
			element.style.listStyle = 'none';
			element.style.MozTransform = element.style.webkitTransform = 'translate3d(0,0,0)';
			element.style.MozTransitionDuration = element.style.webkitTransitionDuration = 0;
		}
		
		function setPosition(y) {
			applyStyle(element, 'transition', 'translate3d(0,' + y + 'px,0)');						
			scrollBarEnd(y);
			oldDelta = 0;
			delta = 0;
			index = y;
			newY = y;
		};	
		
		/*
		this.scrollBy = function(y) {
			setPosition(index + y);
		};	
		
		this.scrollToEnd = function() {
			setPosition(-(element.offsetHeight - rootDOMElement.offsetHeight));
		};	
		*/
		
		function scrollBarMove(x) {
			if (!scrollBar) return;
			//transform x document pixel in x page pixel
			var factor = pagHeight/docHeight;
			var scrollX = Math.floor(x*factor)*(-1);
			applyStyle(scrollBar, 'transform',  'translate3d(0,' + (scrollX) + 'px,0)');
		}
		
		function scrollBarEnd(x) {
			if (!scrollBar) return;
			var factor = pagHeight/docHeight;
			var scrollX = Math.floor(x*factor)*(-1);

			applyStyle(scrollBar, 'transform',  'translate3d(0,' + (scrollX) + 'px,0)');
			applyStyle(scrollBar, 'transition',   config.speed + 'ms cubic-bezier(0, 0, 0, 1)');
		}		
});
