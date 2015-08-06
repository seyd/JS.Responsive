/* 
 * JS.Responsive is a free tool for responsive styling and javascript coding. 
 *
 * Author: Johnny Seyd (seyd@wezeo.com)
 *
 * Documentation: http://responsive.lab.wezeo.com/
 *
 */
(function () {
	
	if (!window.JS)
		window.JS = {};
	
	// constructor is PRIVATE, client must use only class methods!!!!!
	var $C = JS.Responsive = function( element ) 
	{
		throw new Error("JS.Responsive can't have instances.");
	};
	
	$C.getHTML = function() {
		if (!this._htmlElement)
			this._htmlElement = document.getElementsByTagName('html')[0];
		return this._htmlElement;
	};
	
	$C.arrayIndex = function( array, value, _exactMatch )
	{
		for (var i=0; i<array.length; i++)
			if ((_exactMatch && array[i]===value) || (!_exactMatch && array[i]==value))
				return i;			
		return -1;
	};
	
	$C.arrayContains = function( array, item, _exactMatch ) {
		return this.arrayIndex(array, item, _exactMatch)>=0;	
	};
		
	$C.addListener = function( el, eventType, handlerFn )
	{	
		if (el.addEventListener)
			el.addEventListener( eventType, handlerFn, false );
		else if (el.attachEvent)
			el.attachEvent( 'on'+eventType, handlerFn );
	};
	
	$C.addClass = function( name ) {
		var html = this.getHTML();
		if (html) {
			if (!this.isInTransactionClass()) {
				var className = html.className;
				// remove double spaces and trim
				var classes = className=='' ? [] : className.replace(/ +/g, ' ').replace(/^\s*|\s*$/g, '').split(' ');
				if (!this.arrayContains(classes, name)) {				
					classes.push( name );
					html.className = classes.join(' ');
				}
			}
			else
				this.addTransactionClass(name);
		}
		return this;
	};
	
	$C.removeClass = function( name ) {
		var html = this.getHTML();
		if (html) {
			if (!this.isInTransactionClass()) {
				var className = html.className;
				var classes = className=='' ? [] : className.split(' ');
				if (this.arrayContains(classes, name)) {
					classes.splice( this.arrayIndex(classes, name), 1 );
					html.className = classes.join(' ');
				}
			}
			else
				this.removeTransactionClass(name);
		}
		return this;
	};
	
	$C.hasClass = function( name ) {
		var html = this.getHTML();
		if (html) {
			var classes = html.className.split(' ');
			return this.arrayContains(classes, name);
		}
		return false;
	};
	
	
	$C._isInTransactionClass = false;
	$C._addedClasses = [];
	$C._removedClasses = [];
		
	$C.isInTransactionClass = function() {
		return this._isInTransactionClass;
	};
	
	$C.startTransactionClass = function() { 
		this._isInTransactionClass = true;
		this._addedClasses = [];
		this._removedClasses = [];
		return this;
	};
	
	$C.addTransactionClass = function( name ) {	
		// if was removed, undo this state
		if (this.arrayContains( this._removedClasses, name))
			this._removedClasses.splice( this.arrayIndex(this._removedClasses, name), 1 );
		// else adds if not already added
		else if (!this.hasClass(name) && !this.arrayContains( this._addedClasses, name))
			this._addedClasses.push(name);
		return this;
	};
	
	$C.removeTransactionClass = function( name ) {	
		// if was added, undo this state
		if (this.arrayContains( this._addedClasses, name))
			this._addedClasses.splice( this.arrayIndex(this._addedClasses, name), 1 );
		// else adds if not already added
		else if (this.hasClass(name) && !this.arrayContains( this._removedClasses, name))
			this._removedClasses.push(name);
		return this;
	};
	
	$C.commitTransactionClass = function() {
		this._isInTransactionClass = false;
		for (var i=0; i<this._removedClasses.length; i++)
			this.removeClass( this._removedClasses[i] );
		// adding in one punch
		if (this._addedClasses.length)
			this.addClass( this._addedClasses.join(' ') );  //.replace(/^\s*|\s*$/g, '')
		//console.log('removedClasses: '+this._removedClasses);
		//console.log('addedClasses: '+this._addedClasses);
		this._addedClasses = [];
		this._removedClasses = [];
		return this;
	};
	
	$C.rollbackTransactionClass = function() {
		this._isInTransactionClass = false;
		this._addedClasses = [];
		this._removedClasses = [];
		return this;
	};
	
	$C.getWindowWidth = function() {
		return window.innerWidth ? window.innerWidth : (document.documentElement && document.documentElement.offsetWidth ? document.documentElement.clientWidth : screen.width);
		//return (window.innerWidth ? window.innerWidth : (document.body && document.body.offsetWidth) ? document.body.offsetWidth : 
		//	   ((document.compatMode=='CSS1Compat' && document.documentElement && document.documentElement.offsetWidth) ? document.documentElement.offsetWidth : 630));
	};
	
	$C.getWindowHeight = function() {
		return window.innerHeight ? window.innerHeight : (document.documentElement && document.documentElement.offsetHeight ? document.documentElement.clientHeight : screen.height);
		//return (window.innerHeight ? window.innerHeight : (document.body && document.body.offsetHeight) ? document.body.offsetHeight : 
		//	   ((document.compatMode=='CSS1Compat' && document.documentElement && document.documentElement.offsetHeight) ? document.documentElement.offsetHeight : 460));
	};
	
	$C._isIE = function() {
		return navigator.appName == 'Microsoft Internet Explorer';
	};
	
	$C.getDocumentWidth = function() {
		var el = !this._isIE() ? this.getHTML() : document.getElementsByTagName('body')[0];
		return el ? el.offsetWidth : 0;
	};
	
	$C.getDocumentHeight = function() {
		var el = !this._isIE() ? this.getHTML() : document.getElementsByTagName('body')[0];
		return el ? el.offsetHeight : 0;
	};

	
	// adds "mobile" or "desktop"
	$C.detectMobile = function() {
		this.addClass(this.isMobile() ? 'mobile' : 'desktop');
	};
	
	$C.isMobile = function() {
		// from http://detectmobilebrowsers.com/   
		// last update 2013-06-11
		return (function(a,b){return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))})(navigator.userAgent||navigator.vendor||window.opera);
	};
	
	// adds "touch" or "no-touch"
	$C.detectTouch = function() {
		this.addClass(this.isTouch() ? 'touch' : 'no-touch');
	};
	
	$C.isTouch = function() {
		return 'ontouchstart' in document.documentElement;
	};
	
	// iPhone 4	 960x640 (480x320)	 3:2
	// iPhone 5	1136x640 (568x320)	16:9    478x320
	$C.isRetina = function() {
		return window.devicePixelRatio > 1;
	};
	
	// adds "retina-display" or "normal-display"
	$C.detectRetina = function() {
		this.addClass(this.isRetina() ? 'retina-display' : 'normal-display');
	};
	
	$C.isLandscape = function() {
		return this.getWindowWidth() > this.getWindowHeight();
	};
	
	$C.isPortrait = function() {
		return !this.isLandscape();
	};
	
	// adds "portrait" or "landscape"
	$C.detectOrientation = function() {
		var landscape = this.isLandscape();
		if (landscape && (this.hasClass('portrait') || !this.hasClass('landscape'))) {			
			this.removeClass('portrait');
			this.addClass('landscape');
			return true;
		}
		if (!landscape && (this.hasClass('landscape') || !this.hasClass('portrait'))) {
			this.removeClass('landscape');
			this.addClass('portrait');
			return true;
		}
		return false;
	};
	
	$C._lastWinWidth = 0;
	$C._lastWinHeight = 0;
	
	$C._lastDocWidth = 0;
	$C._lastDocHeight = 0;
	
	$C._lastSizePoint = { horizontal: '', vertical: ''};
	$C._actualSizePoint = { horizontal: '', vertical: ''};
	
	$C._lastFocusedState = null;
	
	$C._solveChanges = function( _forceRecalculate ) {
		var change = false;
		var changedOrientation = this.detectOrientation();
		change = change || changedOrientation;
		
		var ww = this.getWindowWidth();
		var wh = this.getWindowHeight();
		var changedWinSize = (ww!=this._lastWinWidth || wh!=this._lastWinHeight);
		change = change || changedWinSize;
		
		var dw = this.getDocumentWidth();
		var dh = this.getDocumentHeight();
		var changedDocSize = (dw!=this._lastDocWidth || dh!=this._lastDocHeight);
		change = change || changedDocSize;
		
		var changedSizePoint = false;
		if (changedWinSize || _forceRecalculate)
			changedSizePoint = this._solveSizes();
		change = change || changedSizePoint;
		
		var actualState = this.getDocumentState();
		var changedDocumentState = (actualState != this._lastDocumentState);
		change = change || changedDocumentState;
		// also unload
		var isUnloading = this.isUnloading();
		change = change || isUnloading;		
		
		var actualFocusState = this.isFocused();
		var changedFocusedState = (actualFocusState != this._lastFocusedState);
		this._lastFocusedState = actualFocusState;
		change = change || changedFocusedState;
		
		var isScrolling = this.isScrolling();
		var changedIsScrolling = (isScrolling != this._lastWasScrolling);
		this._lastWasScrolling = isScrolling;
		change = change || changedIsScrolling;
		
		
		if (change) {
			e = {
				changedWindowSize: 			changedWinSize,
				changedDocumentSize: 		changedDocSize,
				changedOrientation:			changedOrientation,
				changedSizePointHorizontal:	changedSizePoint && this._lastSizePoint.horizontal!=this._actualSizePoint.horizontal,
				actualSizePointHorizontal:	this._actualSizePoint.horizontal,
				changedSizePointVertical:	changedSizePoint && this._lastSizePoint.vertical!=this._actualSizePoint.vertical,
				actualSizePointVertical:	this._actualSizePoint.vertical,
				changedDocumentState:		changedDocumentState,
				isUnloading:				isUnloading,
				changedWindowFocus:			changedFocusedState,
				changedScrolling:			changedIsScrolling
			};
			if (changedSizePoint && this._lastSizePoint.horizontal!=this._actualSizePoint.horizontal)
				e.lastSizePointHorizontal = this._lastSizePoint.horizontal;
			if (changedSizePoint && this._lastSizePoint.vertical!=this._actualSizePoint.vertical)
				e.lastSizePointVertical = this._lastSizePoint.vertical;
			this._onchangeHandler(e);
			//console.log(e);
		}
		this._lastWinWidth = ww;
		this._lastWinHeight = wh;
		
		this._lastDocWidth = dw;
		this._lastDocHeight = dh;
		
		this._lastDocumentState = actualState;			
	};
	
	// on mobile devices is window size changing while scrolling content - because some panels are hiding
	$C._checkWindowOrDocumentResize = function() {
		if (this.getWindowWidth()!=this._lastWinWidth || this.getWindowHeight()!=this._lastWinHeight ||
			this.getDocumentWidth()!=this._lastDocWidth || this.getDocumentHeight()!=this._lastDocHeight)
			this._solveChanges();
	};
	
	$C.AFTER_SCROLL_TIMEOUT = 250;
	
	$C._isScrolling = false;
	$C._lastWasScrolling = $C._isScrolling;
	
	$C.isScrolling = function() {
		return this._isScrolling;
	};
	
	$C._onscrollHandler = function() {
// -----------------------------------------------------TODO: if IE8 and less - return;  --- no support of "scroll | no-scroll" ----------------------------------
		//if (this._isIE() --- need version detection --------------
		this._checkWindowOrDocumentResize();
		clearTimeout(this._timeoutedNoScrollProcess);
		this.removeClass('no-scrolling').addClass('scrolling');
		this._timeoutedNoScrollProcess = setTimeout( this._timeoutedNoScrollBindedFn, this.AFTER_SCROLL_TIMEOUT );
		this._isScrolling = true;
		this._solveChanges();		
		//console.log('start scrolling');
	};
	
	$C._timeoutedNoScroll = function() { 
		this._setNoScrollingClass();
		this._isScrolling = false;
		this._solveChanges();
		//console.log('end scrolling');
	};
	$C._setNoScrollingClass = function() {
		this.removeClass('scrolling').addClass('no-scrolling');
	};
	
	$C._timeoutedNoScrollBindedFn = function() { $C._timeoutedNoScroll() };
	
	$C._lastDocumentState = 'uninitialized';
	
	$C.getDocumentState = function() {
		return this.isDocumentLoaded() ? 'loaded' : document.readyState;
	};
	
	$C._onceLoaded = false;
	
	$C._onreadyStateChangeHandler = function() {
		if (this._onceLoaded)
			return;
		/*
		---uncommnon states----------------------------------------------------------------
		   uninitialized - Has not started loading yet
		   loading - Is loading
		---common states-------------------------------------------------------------------
		   interactive - Has loaded enough and the user can interact with it
		   complete - Fully loaded
		---custom state--------------------------------------------------------------------
		   loaded - when document is loaded (including all images)
		   state-unloading - when document is unloading
		*/
		this.removeClass('state-uninitialized').removeClass('state-loading').removeClass('state-interactive'); //.removeClass('state-complete'); // toto sa nebude odstanovat
		var newState = this.getDocumentState();
		this.addClass('state-'+newState)
		if (newState=='loaded')
			this._onceLoaded = true;
		//alert(this.getDocumentState());	
		this._solveChanges();
	};
	
	$C._isDocumentLoaded = false;
	
	$C.isDocumentLoaded = function() {
		return this._isDocumentLoaded;
	};
	
	$C._onloadHandler = function() {
		this._isDocumentLoaded = true;
		this._onreadyStateChangeHandler();
	};
	$C._isUnloading = false;
	$C._onunloadHandler = function() {
		this.addClass('state-unloading');
		this._isUnloading = false;
		this._solveChanges();
	};
	$C.isUnloading = function() {
		return this._isUnloading;
	};
	
	// Opera does not support document.hasFocus()
	$C._isWindowFocused = document.hasFocus ? document.hasFocus() : true;
	
	$C._onblurHandler = function(e) {
		//console.log('blur');
		this._isWindowFocused = false;
		this.removeClass('window-focused').addClass('window-blured');
		this._solveChanges();
	};
	
	$C._onfocusHandler = function(e) {
		//console.log('focus');
		this._isWindowFocused = true;
		this.removeClass('window-blured').addClass('window-focused');
		this._solveChanges();
	};
	
	$C.isFocused = function() {
		return this._isWindowFocused;
	};
	
	$C._onchangeHandler = function(e) {
		for (var i=0; i<this._onChangeHandlers.length; i++)
			this._onChangeHandlers[i].call(this, e);
	};
	
	$C._onChangeHandlers = [];
	
	$C.addOnChangeHadler = function( fn ) {
		this._onChangeHandlers.push(fn);
		// calls once
		fn.call( this, {} );
	};
	
	$C._horizontalSizes = [];
	$C._verticalSizes = [];
	
	$C._sortSizes = function(a,b) {
		return a.width-b.width;
	};
	
	// e.g. addHorizontalSizePoint('medium', 960)
	$C.addHorizontalSizePoint = function( name, width ) {
		this._horizontalSizes.push( { name: name, width: parseInt(width,10) } );
		this._horizontalSizes.sort( this._sortSizes );
		this._solveChanges( true );
		return this;
	};
	
	// e.g. addVerticalSizePoint('vertical-medium', 960)
	$C.addVerticalSizePoint = function( name, height ) {
		this._verticalSizes.push( { name: name, height: parseInt(height,10) } );
		this._verticalSizes.sort( this._sortSizes );
		this._solveChanges( true );
		return this;
	};
	
	$C.getActualSizePointHorizontal = function() {
		return this._actualSizePoint.horizontal;
	};
	
	$C.getActualSizePointVertical = function() {
		return this._actualSizePoint.vertical;
	};
	
	$C._solveSizes = function() {
		var beforeClass = this.getHTML().className;

		var arrays = [ this._horizontalSizes, this._verticalSizes ],
			sizes = [ this.getWindowWidth(), this.getWindowHeight() ],
			sizeNames = ['width', 'height'],
			dimensions = ['horizontal', 'vertical'];
		
		this._lastSizePoint.horizontal		= this._actualSizePoint.horizontal;
		this._actualSizePoint.horizontal	= '';
		this._lastSizePoint.vertical   		= this._actualSizePoint.vertical;
		this._actualSizePoint.vertical		= '';
		
		this.startTransactionClass();
		
		for (var k=0; k<arrays.length; k++) {
		
			var size,
				actualSize = sizes[k],
				firstIn = false,
				a = arrays[k],
				sizeName = sizeNames[k],
				c = a.length;
				
			for (var i=0; i<c; i++) {
				size = a[i];
				this.removeClass( size.name+'-less' );
				this.removeClass( size.name );
				this.removeClass( size.name+'-more' );
				
				if (size[sizeName]<=actualSize)
					this.addClass( size.name+'-more' );
					
				if (!firstIn && (size[sizeName]==actualSize /*|| (i==0 && size[sizeName]>actualSize)*/ || (/*i!=0 &&*/ i!=c-1 && size[sizeName]<actualSize && a[i+1][sizeName]>actualSize))) {
					this.addClass( size.name );
					this._actualSizePoint[dimensions[k]] = size.name;
					firstIn = true;
				} else if (!firstIn && i==c-1 && size[sizeName]<actualSize) {				
					this.addClass( size.name );
					this._actualSizePoint[dimensions[k]] = size.name;
				}
					
				if (size[sizeName]>actualSize)
					this.addClass( size.name+'-less' );
			}
		}
		
		this.commitTransactionClass();
		
		var afterClass = this.getHTML().className;
		return this._lastSizePoint.horizontal!=this._actualSizePoint.horizontal || this._lastSizePoint.vertical!=this._actualSizePoint.vertical;
		//return beforeClass!=afterClass;
	};

	// SOURCE: http://www.quirksmode.org/js/detect.html	
	$C._getAgentData = function() {
		var nua  = navigator.userAgent,
			np   = navigator.platform,
			nv   = navigator.vendor,
			nall = nua+' '+np+' '+nv;
		return [
			{
				identity: "Webkit",
					string: nua,
					subString: "WebKit",
					versionSearch: "WebKit/"
			},
			{
				identity: "Android",
					string: nall,
					subString: "Android"
			},
			{
				identity: "CoreMedia",
					string: nall,
					subString: "CoreMedia"
			},
			{
				identity: "QuickTime",
					string: nall,
					subString: "QuickTime"
			},
			{
				identity: "BlackBerry",
					string: nall,
					subString: "BlackBerry"
			},
			{
				identity: "Windows",
					string: np,
					subString: "Win"
			},
			{
				identity: "Mac",
					string: np,
					subString: "Mac"
			},
			{
				identity: "MacOSX",
					string: nua,
					subString: "Intel Mac OS X"  // because on iPhone is "like Mac OS X"
			},
			{
				identity: "iPhone",
					string: nua,
					subString: "iPhone"
			},
			{
				identity: "iOS",
					string: nua,
					subString: "iPhone"
			},
			{
				identity: "iPad",
					string: nall,
					subString: "iPad"
			},
			{
				identity: "iOS",
					string: nall,
					subString: "iPad"
			},
			{
				identity: "iPod",
					string: nall,
					subString: "iPod"
			},
			{
				identity: "iOS",
					string: nall,
					subString: "iPod"
			},
			{
				identity: "PSP",  //PlayStation Portable
					string: nall,
					subString: "PSP"
			},
			{
				identity: "Kindle",
					string: nall,
					subString: "Kindle"
			},
			{
				identity: "Linux",
					string: np,
					subString: "Linux"
			},
			{
				identity: "Maxthon",
					string: navigator.userAgent,
					subString: "Maxthon",
					versionSearch: "Maxthon/"
			},
			{
				identity: "Chrome",
					string: navigator.userAgent,
					subString: "Chrome",
					versionSearch: "Chrome/"
			},
			{
				identity: "OmniWeb",
					string: nua,
					subString: "OmniWeb",
					versionSearch: "OmniWeb/"
			},
			{
				identity: "Safari",
					string: nv,
					subString: "Apple",
					versionSearch: "Version/"
			},
			{
				identity: "Opera",
					prop: window.opera,
					versionSearch: "Version/"
			},
			{
				identity: "OperaMini",
					string: nall,
					subString: "Opera Mini"
			},
			{
				identity: "iCab",
					string: nv,
					subString: "iCab"
			},
			{
				identity: "Konqueror",
					string: nv,
					subString: "KDE"
			},
			{
				identity: "Firefox",
					string: nua,
					subString: "Firefox",
					versionSearch: "Firefox/"
			},
			{
				identity: "Camino",
					string: nv,
					subString: "Camino"
			},
			{	// for newer Netscapes (6+)
				identity: "Netscape",
					string: nua,
					subString: "Netscape"
			},
			{
				identity: "MSIE",
					string: nua,
					subString: "MSIE",
					versionSearch: "MSIE"
			},
			{
				identity: "MSIE",
					string: nua,
					subString: "WOW64",
					versionSearch: "rv:"
			},
			{
				identity: "Mozilla",
					string: nua,
					subString: "Gecko",
					versionSearch: "rv"
			},
			{ 	// for older Netscapes (4-)
				identity: "Netscape",
					string: nua,
					subString: "Mozilla",
					versionSearch: "Mozilla"
			}
		];
	};
	
	$C.getAgentTags = function() {
		for (var i=0, data = this._getAgentData(), tags = []; i<data.length; i++)
			tags.push( data[i].identity.toLowerCase() );
		return tags;
	};
	
	$C.detectAgentPlatform = function( _justReturnValue ) {
		
		var	data = this._getAgentData(),
			foundBrowser = false,
			returnValue = {
				platform: [],
				browser: [],
				version: null
			};
		
		for (var i=0; i<data.length; i++) {
		
			var dataString = data[i].string,
				dataProp = data[i].prop;
				
			if ((dataString || dataProp) && (!foundBrowser || !data[i].versionSearch)) {
				if (dataProp || dataString.indexOf(data[i].subString) != -1) {
					var clsName = data[i].identity.toLowerCase();
					if (_justReturnValue)
						returnValue.platform.push(clsName);
					else
						this.addClass( clsName );
					if (data[i].versionSearch) {
						var version = parseFloat(navigator.userAgent.split(data[i].versionSearch || data[i].identity)[1], 10);
						
						if (clsName != 'webkit') foundBrowser = true; // this is exception for webkit
						if (!isNaN(version)) { 
							if (_justReturnValue)
								returnValue.version = version;
							else
								this.addClass( clsName+'-v'+parseInt(version) )
							if (version!=parseInt(version) && !_justReturnValue)
								this.addClass( clsName+'-v'+version.toString().replace('.','-') );
						}
					}
				}
			}
		}
		if (_justReturnValue) {
			returnValue.browser = returnValue.platform[returnValue.platform.length-1];
			return returnValue;
		}
	};
	
	// vrati info o platforme ako:
	// {
	// 		platform: Array["webkit", "windows", "chrome"],
	//		browser: "chrome",
	//		version: 43.5
	// }
	$C.getPlatformInfo = function() {
		return this.detectAgentPlatform(true);
	};
	
	$C._getConjuctionFromStr = function(str) {
		var params = str.split(" ");
		for (var i=0; i < params.length; i++) {
			if (params[i] != "") 
				if (!this.hasClass(params[i])) return false; // if once false , than conjuction is false
		}
		return true;
			
	};
	
	$C.is = function() {
		var args = Array.prototype.slice.call(arguments);
		
		for (var i=0; i < args.length; i++) {
			if (this._getConjuctionFromStr(args[i])) return true; // if once true , than disjunction is true
		}
		
		return false;
	};
	
	
	$C.watchVersion = function (browser,version) {
		var	data = this._getAgentData(),
			foundIdentity = false, foundVersion = false;
		
		for (var i=0; i<data.length; i++) {
		
			var dataString = data[i].string,
				dataProp = data[i].prop;
				
			
					var clsName = data[i].identity.toLowerCase();
					if (clsName == browser) {
						
						foundIdentity= true;
						if (data[i].versionSearch) {
							foundVersion = true;
							var actualVersion = parseFloat(navigator.userAgent.split(data[i].versionSearch || data[i].identity)[1], 10);
							if ((version+"").indexOf('.') == -1)actualVersion = parseInt(actualVersion);							
							
							if (!isNaN(actualVersion)) {
								
								if (version == actualVersion) { 
									this.addClass( clsName+'-v'+version + '-le');
									this.addClass( clsName+'-v'+version + '-ge');
								} else if (version > actualVersion ){
									this.addClass( clsName+'-v'+version + '-l');
									this.addClass( clsName+'-v'+version + '-le');	
								} else {
									this.addClass( clsName+'-v'+version + '-g');
									this.addClass( clsName+'-v'+version + '-ge');
								}
								
								return this;
							}
						}
					}
			
		};
		
		
		
		if (!foundIdentity)throw new Error("browser '" + browser + "' was not found")
		else if (!foundVersion) throw new Error("parameter '" + browser + "' doesn't support version search")
			else return this;
		
		
	}
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// -----------------------------------------------------------------------------------------------------------------------------
	// -----------------------------------------------------------------------------------------------------------------------------
	// -----------------------------------------------------------------------------------------------------------------------------
	
	$C.detectAgentPlatform();
	
	// adds "mobile" or "desktop"
	$C.detectMobile();
	
	// adds "touch" or "no-touch"
	$C.detectTouch();

	// adds "retina-display" or "normal-display"
	$C.detectRetina();
	
	// adds "portrait" or "landscape"
	$C.detectOrientation();
		
	// register onresizeHandler
	$C.addListener( window, 'resize', function() { $C._solveChanges(); } );
	
	// for mobiles - on mobile devices is window size changing while scrolling content - because some panels are hiding
	function checkResize() { $C._checkWindowOrDocumentResize(); };
	function _onScrollFn() { $C._onscrollHandler(); };
	
	$C.addListener( window, 'scroll', _onScrollFn );
	$C.addListener( document, 'touchmove', checkResize );
	$C.addListener( document, 'touchend', checkResize );
	
	$C.addListener( document, 'readystatechange', function(){ $C._onreadyStateChangeHandler(); });
	$C.addListener( window, 'load', function(e){ $C._onloadHandler(e); });
	$C.addListener( window, 'unload', function(e){ $C._onunloadHandler(e); });
	$C.addListener( window, 'onbeforeunload', function(e){ $C._onunloadHandler(e); });
	
	$C.addListener( window, 'blur', function(e){ $C._onblurHandler(e); });
	$C.addListener( window, 'focus', function(e){ $C._onfocusHandler(e); });
	if ($C._isWindowFocused)
		$C._onfocusHandler();
	else
		$C._onblurHandler();

	setInterval( checkResize, 500 );
	
	$C._setNoScrollingClass();

	// and run it once
	$C._solveChanges();
	
})();
