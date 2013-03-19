define(function() {
	var ajaxCounter = 0;
	var callLog = {};

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

	function checkURL(url){
		var urlElm = document.createElement("A");
		urlElm.href = url;

		return urlElm.protocol + "//" + urlElm.host === window.location.protocol + "//" + window.location.host;
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
		if (callLog[url] <= 2){
			options.msTimeout *= 1.5;
			ajax(url, options);
		} else {
			callLog[url].counter = 0;
			options[options.timeout ? 'timeout' : 'ko'](resp, 0, xhr);
		}
	}

	function ajax(url, options){
		if(!checkURL(url)){
			// @TODO - maybe - CORS requests
			return false;
		}

		var xhr = setProvider();
		var method = options.method ? options.method : "GET";
		var headers, timeout;
		options.msTimeout = options.msTimeout || 2500;

		timeout = setTimeout(function(xhr, url, options){
			return function timeoutHandler(){
				killAjaxCall(xhr, url, options);
			}
		}(xhr, url, options), options.msTimeout);
		callLog[url] = {
			counter: callLog[url] ? callLog[url].counter + 1 : 1,
			timeoutId: timeout
		};
		xhr.onreadystatechange = function() {
			var status, resp = {};

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
				if (xhr.getResponseHeader("Content-Type") === 'application/json' && resp.responseText){
					resp.responseJSON = JSON.parse(resp.responseText) || {};
				}
				if (status >= 200 && status < 400 || status === 1224){
					options.ok(resp, status, xhr);
				} else if (status >= 400){
					options.ko(resp, status, xhr);
				}
			}
		};
		xhr.open(method, url);
		ajaxCounter++;

		if (headers = options.headers){
			for (var h in headers){
				if (headers.hasOwnProperty(h)){
					xhr.setRequestHeader(h, headers[h]);
				}
			}
		}

		xhr.send(method.match(/POST|PUT/) && options.body ? options.body : null);
	}

	return {
		haveActiveConnections: function(){
			return ajaxCounter > 0;
		},
		"get": function(url, options){
			options.method = "GET";
			ajax(url, options);
		},
		"post": function(url, body, options){
			options.method = "POST";
			options.body = body;
			ajax(url, options);
		},
		"put": function(url, body, options){
			options.method = "PUT";
			options.body = body;
			ajax(url, options);
		},
		"delete": function(url, options){
			options.method = "DELETE";
			ajax(url, options);
		}
	}
});
