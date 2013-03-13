define(function() {
	var ajaxCounter = 0;

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

	function ajax(url, options){
		var xhr = setProvider();
		var method = options.method ? options.method : "GET";
		var headers;

		if(!checkURL(url)){
			// @TODO - maybe - CORS requests
			return false;
		}

		xhr.onreadystatechange = function() {
			var status, ct, resp;
			if (xhr.readyState === 1){
				ajaxCounter++;
			}
			if (xhr.readyState === 4){
				ajaxCounter--;
				try {
					status = xhr.status;
				} catch (e){
					status = 0;
				}
				ct = xhr.getResponseHeader("Content-Type");
				if (ct === 'application/json' && xhr.responseText){
					resp = JSON.parse(xhr.responseText) || {};
				} else if (ct === 'application/xml') {
					resp = xhr.responseXML;
				} else {
					resp = xhr.responseText;
				}
				if (status >= 200 && status < 400 || status === 1224){
					options.ok(resp, status, xhr);
				} else if (status >= 400){
					options.ko(resp, status, xhr);
				} else if (status === 0){
					// @TODO timeout implementation!
					options.timeout(xhr);
				}
			}
		};

		xhr.open(method, url);

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