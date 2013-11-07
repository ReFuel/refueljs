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
			moveArray.push(newY);
		};
		
		function applyStyle(dom, name, value) {
			var atr = Modernizr.prefixed(name);
			
			if (Modernizr.Detectizr.device.browser == 'firefox') {
				name = cap(name)
				atr = 'Moz'+name
			}
			
			dom.style[atr] = value;
			
		}
		function cap(string)
		{
		    return string.charAt(0).toUpperCase() + string.slice(1);
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
					applyStyle(element, 'transform', 'translate3d(0,' + (elong) + 'px,0)');
					applyStyle(element, 'transition',  elong + 'ms linear');					
					scrollBarEnd(elong);
					
					fixToUpperBound();
					eventType = 'upperBoundReached';
					
				}//check lower bound
				else if ((Math.abs(newY) >= Math.abs(height))) {
					var tvalue = 'translate3d(0,' + (-(height + elong)) + 'px,0)';
					applyStyle(element, 'transform', tvalue);
					applyStyle(element, 'transition',  elong + 'ms linear');	
					scrollBarEnd(-(height + elong));
					
					fixToLowerBound();
					eventType = 'lowerBoundReached';
				}
				else {
					moveTo(newY);
					scrollBarEnd(newY);
					eventType = 'movedTo';
				}
			}
			else {
				if ((newY > 0) || (height < 0)) {
					fixToUpperBound();
					//e.stopPropagation();
					return;
				}
				if ((Math.abs(newY) >= Math.abs(height))) {
					fixToLowerBound(elementHeight);
					//e.stopPropagation();
					return;
				}
				if (scrollBar) scrollBar.style.display = "none";	
			}
			oldDelta = 0;
			//set the new starting point
			index = newY;
			//e.stopPropagation();
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
