/**
 * @license JS.Responsive v2.3
 * (c) 2015 WEZEO http://wezeo.com
 * License: MIT
 *
 * @author Johnny Seyd seyd@wezeo.com
 *
 * @description JS.Responsive is a free tool for responsive styling and responsive javascript coding.
 *
 * @see http://responsive.lab.wezeo.com/
 *
 */
(function() {
	'use strict';

	// base namespace
	if (!window.JS)
		window.JS = {};

	// defines and inicialize only once
	if (JS.Responsive)
		return;

	
	// -------------------------------------------------------------------------------------------------
	// --- CLASS ---------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------
	
	/**
	 * Constructor is PRIVATE, client must use only class methods!!!!!
	 * @class JS.Responsive
	 */
	var $C = JS.Responsive = function() {
		throw new Error("JS.Responsive cannot have instances.");
	};

	/**
	 * @version
	 */
	$C.version = '2.3.1';

	// -------------------------------------------------------------------------------------------------
	// --- OVERVIEW ------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------

	/**
	 * Static part:
	 *
	 *    isMobile()
	 *    isTouch()
	 *    isHiResDisplay()
	 *    isLandscape()
	 *    isPortrait()
	 *    isDocumentLoaded()
	 *    isDocumentUnloading()
	 *    isScrolling()
	 *    isFocused()
	 *
	 *    addHorizontalBreakPoint( name, width )
	 *    removeHorizontalBreakPoint( name )
	 *    getActualHorizontalBreakPoint()
	 *    disableHorizontalBreakPoints( _leaveActualClasses )
	 *    enableHorizontalBreakPoints()
	 *    isDisabledHorizontalBreakPoints()
	 *
	 *    addVerticalBreakPoint( name, height )
	 *    removeVerticalBreakPoint( name )
	 *    getActualVerticalBreakPoint()
	 *    disableVerticalBreakPoints( _leaveActualClasses )
	 *    enableVerticalBreakPoints()
	 *    isDisabledVerticalBreakPoints()
	 *
	 *    is( someState[, orSomeState[, orSomeState, ...])
	 *    watchBrowserVersion( browser, version )
	 *    getPlatformInfo()
	 *
	 *    addOnChangeHadler( fn )
	 *    removeOnChangeHadler( fn )
	 *
	 *    getWindowWidth()
	 *    getWindowHeight()
	 *    getDocumentWidth()
	 *    getDocumentHeight()
	 *
	 *
	 * Backward compatibility:
	 *
	 *    isRetina()  - use new .isHiResDisplay()
	 *
	 */


	 
	// -------------------------------------------------------------------------------------------------
	// --- CONFIG --------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------
	

	// how many miliseconds stays class name 'scroll' after scrolling (and than switch to 'no-scroll' class name)
	$C.AFTER_SCROLL_TIMEOUT = 250;

	// (ms) how offen is checking the document size (not window just window, but content size)
	$C.CHECK_DOCUMENT_SIZE_INTERVAL = 500;
	
	
	
	// -------------------------------------------------------------------------------------------------	
	// --- PUBLIC --------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------
	
	/**
	 * Detects mobile browser - if device is a mobile device.
	 * @todo Find out if mobile is just a phone or tablet also...
	 * @returns {Boolean} The return value is not changing in time.
	 */
	$C.isMobile = function() {

		return this._detectmobilebrowsers_com();
	};


	/**
	 * Detects if current device supports touch events.
	 * @returns {Boolean} The return value is not changing in time.
	 */
	$C.isTouch = function() {

		return 'ontouchstart' in document.documentElement;
	};


	/**
	 * Detects if current device has a high resolution display (such as retina).
	 * @returns {Boolean} The return value is not changing in time.
	 */
	$C.isHiResDisplay = function() {

		return window.devicePixelRatio > 1;
	};


	/**
	 * Returns if current device has display landscape oriented (width is larger than height).
	 * @returns {Boolean}
	 */
	$C.isLandscape = function() {

		return this.getWindowWidth() > this.getWindowHeight();
	};


	/**
	 * Returns if current device has display portrait oriented (height is larger than width).
	 * @returns {Boolean}
	 */
	$C.isPortrait = function() {

		return !this.isLandscape();
	};


	/**
	 * Returns if document is in state that everything is loaded.
	 * @returns {Boolean}
	 */
	$C.isDocumentLoaded = function() {

		return this._isDocumentLoaded;
	};


	/**
	 * Returns true if user is leaving current page.
	 * @returns {Boolean}
	 */
	$C.isDocumentUnloading = function() {

		return this._isDocumentUnloading;
	};


	/**
	 * Returns true if page is just scrolled or in scrolling.
	 * @returns {Boolean}
	 */
	$C.isScrolling = function() {

		return this._isScrolling;
	};


	/**
	 * Returns true if window is focused/active.
	 * @returns {Boolean}
	 */
	$C.isFocused = function() {

		return this._isWindowFocused;
	};

	/**
	 * Returns device orientation "portrait" or "landscape".
	 * @returns {String} "portrait" or "landscape"
	 */
	$C.getDeviceOrientation = function() {

		var angle = this._getDeviceOrientationAngle();
		return angle==0 || angle==180 ? 'portrait' : 'landscape';
	};

	/**
	 * Returns angle of device orientation 0, 90, 180, 270 in degrees cross clock wise.
	 * @returns {Number} 0, 90, 180, 270
	 */
	$C.getDeviceOrientationAngle = function() {

		return this._getDeviceOrientationAngle();
	};
	
	/**
	 * Sets a new horizontal break point for responsive styling.
	 * @param {String} name - Unique name of given break point. Only lower case letters and comma is allowed /[a-z\-]+/
	 * @param {Number} width - Width size in pixels.
	 * @returns {Object} this - for chaining.
	 * @example JS.Responsive.addHorizontalBreakPoint('medium', 960);
	 */
	$C.addHorizontalBreakPoint = function( name, width ) {

		return this._addBreakPoint(name, width, '_horizontalSizes', 'width');
	};

	
	/**
	 * Removes a horizontal break point for responsive styling.
	 * @param {String} name - Existing name of break point.
	 * @returns {Object} this - for chaining.
	 * @example JS.Responsive.removeHorizontalBreakPoint('medium');
	 */
	$C.removeHorizontalBreakPoint = function( name ) {
		
		return this._removeBreakPoint(name, '_horizontalSizes');
	};
	
	
	/**
	 * Returns name of actual horizontal break point.
	 * @returns {String|null} Name of actual horizontal break point or null if no horizontal break point is set.
	 */
	$C.getActualHorizontalBreakPoint = function() {

		return this._actualBreakPoint.horizontal || null;
	};
	
	
	/**
	 * Disable horizontal break points checking and remove all class names from HTML element.
	 * @param {Boolean} [_leaveActualClasses] - If true, leaves (freezes) actual class names in HTML element.
	 * @returns {Object} this - for chaining.
	 */
	$C.disableHorizontalBreakPoints = function( _leaveActualClasses ) {
		
		if (!_leaveActualClasses)
			this._removeAllClassesInDimension( this._horizontalSizes );
		this._isDisabledHorizontalBreakPoints = true;
		return this;
	};
	
	
	/**
	 * Enable horizontal break points checking (if was disabled before).
	 * @returns {Object} this - for chaining.
	 */
	$C.enableHorizontalBreakPoints = function() {
			
		this._isDisabledHorizontalBreakPoints = false;
		this._solveChanges(true);
		return this;
	};
	
	
	/**
	 * Returns if is horizontal break points checking disabled.
	 * @returns {Boolean}
	 */
	$C.isDisabledHorizontalBreakPoints = function() {
		
		return this._isDisabledHorizontalBreakPoints;
	};
	
	
	/**
	 * Sets a new vertical break point for responsive styling.
	 * @param {String} name - Unique name of given break point. Only lower case letters and comma is allowed /[a-z\-]+/
	 * @param {Number} height - Height size in pixels.
	 * @returns {Object} this - for chaining.
	 * @example JS.Responsive.addVerticalBreakPoint('vertical-medium', 960);
	 */
	$C.addVerticalBreakPoint = function( name, height ) {

		return this._addBreakPoint(name, height, '_verticalSizes', 'height');
	};

	
	/**
	 * Removes a vertical break point for responsive styling.
	 * @param {String} name - Existing name of break point.
	 * @returns {Object} this - for chaining.
	 * @example JS.Responsive.removeVerticalBreakPoint('vertical-medium');
	 */
	$C.removeVerticalBreakPoint = function( name ) {
		
		return this._removeBreakPoint(name, '_verticalSizes');
	};


	/**
	 * Returns name of actual vertical break point.
	 * @returns {String|null} Name of actual vertical break point or null if no vertical break point is set.
	 */
	$C.getActualVerticalBreakPoint = function() {

		return this._actualBreakPoint.vertical || null;
	};

	
	/**
	 * Disable vertical break points checking and remove all class names from HTML element.
	 * @param {Boolean} [_leaveActualClasses] - If true, leaves (freezes) actual class names in HTML element.
	 * @returns {Object} this - for chaining.
	 */
	$C.disableVerticalBreakPoints = function( _leaveActualClasses ) {
		
		if (!_leaveActualClasses)
			this._removeAllClassesInDimension( this._verticalSizes );
		this._isDisabledVerticalBreakPoints = true;
		return this;
	};
	
	
	/**
	 * Enable vertical break points checking (if was disabled before).
	 * @returns {Object} this - for chaining.
	 */
	$C.enableVerticalBreakPoints = function() {
			
		this._isDisabledVerticalBreakPoints = false;
		this._solveChanges(true);
		return this;
	};
	
	
	/**
	 * Returns if is vertical break points checking disabled.
	 * @returns {Boolean}
	 */
	$C.isDisabledVerticalBreakPoints = function() {
		
		return this._isDisabledVerticalBreakPoints;
	};

	
	/**
	 * Tests if HTML element contains given class names.
	 * @param {...String} - class names
	 * @returns {Boolean}
	 * @example JS.Responsive('mobile') === true, when HTML contains "mobile" class
	 * @example JS.Responsive('portrait touch') === true, when HTML contains "portrait" and "touch" class
	 * @example JS.Responsive('portrait touch', 'mobile') === true, when HTML contains ("portrait" and "touch" class) OR ('mobile')
	 */
	$C.is = function() {

		for (var i=0; i<arguments.length; i++)
			if (this._hasAllTheseClasses(arguments[i]))
				return true; // if once true then disjunction is true

		return false;
	};

	
	/**
	 * Set watching given browser and its version
	 * @param {String} browser - browser name, see JS.Responsive._getAgentData attribute "identity"
	 * @param {Number} version - browser version number
	 * @returns {Object} this - for chaining.
	 * @example JS.Responsive.watchBrowserVersion('Webkit', 530);
	 * @example JS.Responsive.watchBrowserVersion('Chrome', 47);
	 * @example JS.Responsive.watchBrowserVersion('MSIE', 10);
	 * @example JS.Responsive.watchBrowserVersion('Edge', 12);
	 */
	$C.watchBrowserVersion = function( browser, version ) {

		var foundVersion,
			agentData = this._findAgentDataByBrowserName( browser );
			
		if (agentData)
			foundVersion = this._addBrowserVersionClasses( agentData, version );
		else
			throw new Error("Browser '" + browser + "' was not found.");

		if (!foundVersion)
			throw new Error("Parameter '" + browser + "' doesn't support version search.");

		return this;
	};
	

	/**
	 * Returns information about platform, browser and its version
	 * @returns {Object} containing "platform" as array, "browser" as string and "version" as number.
	 * @example JS.Responsive.getPlatformInfo() returns 
	 *   {
	 *		platform: Array["webkit", "windows", "chrome"],
	 *		browser: "chrome",
	 *		version: 43.5
	 *   }
	 */
	$C.getPlatformInfo = function() {

		return this._detectAgentPlatform(true);
	};

	
	/**
	 * Register event listener for all responsive changes.
	 * @returns {Object} this - for chaining.
	 * @example JS.Responsive.addOnChangeHadler(function(e) {
	 *          	if (e.changedBreakPointHorizontal) {
	 *          		...
	 *          	}
	 *          }
	 * Event objects contains members:
	 *       changedWindowSize: {Boolean}
	 *       changedDocumentSize: {Boolean}
	 *       changedOrientation: {Boolean}
	 *       changedBreakPointHorizontal: {Boolean}
	 *       actualBreakPointHorizontal: {String}
	 *       lastBreakPointHorizontal: {String}
	 *       changedBreakPointVertical: {Boolean}
	 *       actualBreakPointVertical: {String}
	 *       lastBreakPointvertical: {String}
	 *       changedDocumentState: {Boolean}
	 *       isDocumentUnloading: {Boolean}
	 *       changedWindowFocus: {Boolean}
	 *       changedScrolling: {Boolean}
	 */
	$C.addOnChangeHadler = function( fn ) {
		
		this._onChangeHandlers.push(fn);
		return this;
	};

	
	/**
	 * Unregister event listener for all responsive changes.
	 * @returns {Object} this - for chaining.
	 */
	$C.removeOnChangeHadler = function( fn ) {
		
		for (var i=this._onChangeHandlers.length-1; i>=0; i--)
			if (this._onChangeHandlers[i]===fn)
				this._onChangeHandlers.splice(i,1);
		return this;
	};
	
	
	/**
	 * Returns current window width in pixels.
	 * @returns {Number}.
	 * @example if (JS.Responsive.getWindowWidth()>JS.Responsive.getWindowHeight()) ...
	 */
	$C.getWindowWidth = function() {

		return this._getWindowSize('Width');
	};

	
	/**
	 * Returns current window height in pixels.
	 * @returns {Number}.
	 * @example if (JS.Responsive.getWindowWidth()>JS.Responsive.getWindowHeight()) ...
	 */
	$C.getWindowHeight = function() {

		return this._getWindowSize('Height');
	};

	
	/**
	 * Returns current document width in pixels (can be smaller than window size because scrollbar reduces it).
	 * returns {Number}.
	 * @example if (JS.Responsive.getDocumentWidth()>JS.Responsive.getDocumentHeight()) ...
	 */
	$C.getDocumentWidth = function() {
		
		return this._getDocumentSize('Width');
	};


	/**
	 * Returns current document height in pixels (can be smaller than window size because scrollbar reduces it).
	 * @returns {Number}.
	 * @example if (JS.Responsive.getDocumentWidth()>JS.Responsive.getWindowHeight()) ...
	 */	
	$C.getDocumentHeight = function() {
		
		return this._getDocumentSize('Height');
	};
	
	
	// -------------------------------------------------------------------------------------------------	
	// --- BACKWARD COMPATIBILITY ----------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------	
		
	
	/**
	 * Obsolete methods - name was changed. This method exists due to backward compatibility with version 1.0
	 * $C.oldOneMethod = $C.newOneMethod;
	 */
	$C.isRetina = $C.isHiResDisplay;
	$C.watchVersion = $C.watchBrowserVersion;
	
	// adds duplicate methods for all methods containing "BreakPoint" in name - to "SizePoint" due to backward compatibility with version 1.0
	// creates: addHorizontalSizePoint, removeHorizontalSizePoint, getActualHorizontalSizePoint, disableHorizontalSizePoints, enableHorizontalSizePoints, isDisabledHorizontalSizePoints,
	//          addVerticalSizePoint, removeVerticalSizePoint, getActualVerticalSizePoint, disableVerticalSizePoints, enableVerticalSizePoints, isDisabledVerticalSizePoints
	for (var prop in $C)
		if (prop.indexOf('BreakPoint')>0)
			$C[prop.replace('Break','Size')] = $C[prop];
	
	
	
	// -------------------------------------------------------------------------------------------------
	// --- PRIVATE -------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------

	
	$C._getHTML = function() {
		if (!this._htmlElement)
			this._htmlElement = document.getElementsByTagName('html')[0];
		return this._htmlElement;
	};

	$C._getBODY = function() {
		if (!this._bodyElement)
			this._bodyElement = document.getElementsByTagName('body')[0];
		return this._bodyElement;
	};


	$C._arrayIndex = function(array, value, _exactMatch) {
		for (var i = 0; i < array.length; i++)
			if ((_exactMatch && array[i] === value) || (!_exactMatch && array[i] == value))
				return i;
		return -1;
	};


	$C._arrayContains = function(array, item, _exactMatch) {
		return this._arrayIndex(array, item, _exactMatch) >= 0;
	};


	$C._on = function(el, eventType, handlerFn) {

		var $this = this,
			fn = function(e) {
				handlerFn.call($this, e || event);
			};
		if (el.addEventListener)
			el.addEventListener(eventType, fn, false);
		else if (el.attachEvent)
			el.attachEvent('on' + eventType, fn);

		return this;
	};


	$C._addClass = function(name) {
		var html = this._getHTML();
		if (html) {
			if (!this._isInTransactionClass()) {
				var className = html.className;
				// remove double spaces and trim
				var classes = className == '' ? [] : className.replace(/ +/g, ' ').replace(/^\s*|\s*$/g, '').split(' ');
				if (!this._arrayContains(classes, name)) {
					classes.push(name);
					html.className = classes.join(' ');
				}
			}
			else
				this._addTransactionClass(name);
		}
		return this;
	};

	$C._removeClass = function(name) {
		var html = this._getHTML();
		if (html) {
			if (!this._isInTransactionClass()) {
				var className = html.className;
				var classes = className == '' ? [] : className.split(' ');
				if (this._arrayContains(classes, name)) {
					classes.splice(this._arrayIndex(classes, name), 1);
					html.className = classes.join(' ');
				}
			}
			else
				this._removeTransactionClass(name);
		}
		return this;
	};

	$C._hasClass = function(name) {
		var html = this._getHTML();
		if (html) {
			var classes = html.className.split(' ');
			return this._arrayContains(classes, name);
		}
		return false;
	};


	$C._isInTransactionClassMode = false;
	$C._addedClasses = [];
	$C._removedClasses = [];

	$C._isInTransactionClass = function() {
		return this._isInTransactionClassMode;
	};

	$C._startTransactionClass = function() {
		this._isInTransactionClassMode = true;
		this._addedClasses = [];
		this._removedClasses = [];
		return this;
	};

	$C._addTransactionClass = function(name) {
		// if was removed, undo this state
		if (this._arrayContains(this._removedClasses, name))
			this._removedClasses.splice(this._arrayIndex(this._removedClasses, name), 1);
		// else adds if not already added
		else if (!this._hasClass(name) && !this._arrayContains(this._addedClasses, name))
			this._addedClasses.push(name);
		return this;
	};

	$C._removeTransactionClass = function(name) {
		// if was added, undo this state
		if (this._arrayContains(this._addedClasses, name))
			this._addedClasses.splice(this._arrayIndex(this._addedClasses, name), 1);
		// else adds if not already added
		else if (this._hasClass(name) && !this._arrayContains(this._removedClasses, name))
			this._removedClasses.push(name);
		return this;
	};

	$C._commitTransactionClass = function() {
		this._isInTransactionClassMode = false;
		for (var i = 0; i < this._removedClasses.length; i++)
			this._removeClass(this._removedClasses[i]);
		// adding in one punch
		if (this._addedClasses.length)
			this._addClass(this._addedClasses.join(' '));  //.replace(/^\s*|\s*$/g, '')
		this._addedClasses = [];
		this._removedClasses = [];
		return this;
	};

	$C._rollbackTransactionClass = function() {
		this._isInTransactionClassMode = false;
		this._addedClasses = [];
		this._removedClasses = [];
		return this;
	};


	// @param (String) sizeType - 'Width' or 'Height'
	$C._getWindowSize = function(sizeType) {

		return window['inner' + sizeType] ?
			window['inner' + sizeType] :
			(document.documentElement && document.documentElement['offset' + sizeType] ?
				document.documentElement['client' + sizeType] :
				screen[sizeType.toLowerCase()]);
	};

	$C._isIE = function() {
		return navigator.appName == 'Microsoft Internet Explorer';
	};

	// @param (String) sizeType - 'Width' or 'Height'
	$C._getDocumentSize = function(sizeType) {
		var el = !this._isIE() ? this._getHTML() : this._getBODY();
		return el ? el['offset' + sizeType] : 0;
	};


	// adds "mobile" or "desktop" class (once)
	$C._detectMobile = function() {

		this._addClass(this.isMobile() ? 'mobile' : 'desktop');
	};

	// adds "touch" or "no-touch" class (once)
	$C._detectTouch = function() {

		this._addClass(this.isTouch() ? 'touch' : 'no-touch');
	};


	// adds "hires-display" or "normal-display" class (once)
	$C._detectHiResDisplay = function() {
		var ratio = window.devicePixelRatio;
		this._addClass(ratio>1 ? 'hires-display' : 'normal-display');
		this._addClass('display-pixel-ratio-'+ratio);
	};


	// adds "portrait" or "landscape" class
	$C._detectOrientation = function() {
		var landscape = this.isLandscape();
		if (landscape && (this._hasClass('portrait') || !this._hasClass('landscape'))) {
			this._removeClass('portrait');
			this._addClass('landscape');
			return true;
		}
		if (!landscape && (this._hasClass('landscape') || !this._hasClass('portrait'))) {
			this._removeClass('landscape');
			this._addClass('portrait');
			return true;
		}
		return false;
	};

	$C._lastWinWidth = 0;
	$C._lastWinHeight = 0;

	$C._lastDocWidth = 0;
	$C._lastDocHeight = 0;

	$C._lastBreakPoint = {horizontal: '', vertical: ''};
	$C._actualBreakPoint = {horizontal: '', vertical: ''};

	$C._lastFocusedState = null;

	$C._solveChanges = function( _forceRecalculate ) {
		var change = false,
			changedOrientation = this._detectOrientation();
		change = change || changedOrientation;

		var changedDeviceOrientation = this._detectDeviceOrientation();
		change = change || changedDeviceOrientation;
		
		var ww = this.getWindowWidth(),
			wh = this.getWindowHeight(),
			changedWinSize = (ww != this._lastWinWidth || wh != this._lastWinHeight);
		change = change || changedWinSize;

		var dw = this.getDocumentWidth(),
			dh = this.getDocumentHeight(),
			changedDocSize = (dw != this._lastDocWidth || dh != this._lastDocHeight);
		change = change || changedDocSize;

		var changedBreakPoint = false;
		if (changedWinSize || _forceRecalculate)
			changedBreakPoint = this._solveSizes();
		change = change || changedBreakPoint;

		var actualState = this.getDocumentState(),
			changedDocumentState = (actualState != this._lastDocumentState);
		change = change || changedDocumentState;

		// also unload
		var isUnloading = this.isDocumentUnloading();
		change = change || isUnloading;

		var actualFocusState = this.isFocused(),
			changedFocusedState = (actualFocusState != this._lastFocusedState);
		this._lastFocusedState = actualFocusState;
		change = change || changedFocusedState;

		var isScrolling = this.isScrolling(),
			changedIsScrolling = (isScrolling != this._lastWasScrolling);
		this._lastWasScrolling = isScrolling;
		change = change || changedIsScrolling;

		var changedBreakPointHorizontal = changedBreakPoint && this._lastBreakPoint.horizontal != this._actualBreakPoint.horizontal,
			changedBreakPointVertical   = changedBreakPoint && this._lastBreakPoint.vertical != this._actualBreakPoint.vertical;

		this._lastWinWidth = ww;
		this._lastWinHeight = wh;

		this._lastDocWidth = dw;
		this._lastDocHeight = dh;

		this._lastDocumentState = actualState;
		
		if (change) {
			var e = {
				changedWindowSize: changedWinSize,
				changedDocumentSize: changedDocSize,
				changedOrientation: changedOrientation,
				changedDeviceOrientation: changedDeviceOrientation,
				
				changedBreakPointHorizontal: changedBreakPointHorizontal,
				changedSizePointHorizontal: changedBreakPointHorizontal,  // due to backward compatibility with v1.0
				
				actualBreakPointHorizontal: this._actualBreakPoint.horizontal,
				actualSizePointHorizontal: this._actualBreakPoint.horizontal,  // due to backward compatibility with v1.0
				
				changedBreakPointVertical: changedBreakPointVertical,
				changedSizePointVertical: changedBreakPointVertical,   // due to backward compatibility with v1.0
				
				actualBreakPointVertical: this._actualBreakPoint.vertical,
				actualSizePointVertical: this._actualBreakPoint.vertical,   // due to backward compatibility with v1.0
				
				changedDocumentState: changedDocumentState,
				isDocumentUnloading: isUnloading,
				changedWindowFocus: changedFocusedState,
				changedScrolling: changedIsScrolling
			};
			
			if (changedBreakPoint && this._lastBreakPoint.horizontal != this._actualBreakPoint.horizontal)
				e.lastBreakPointHorizontal = this._lastBreakPoint.horizontal;
			
			if (changedBreakPoint && this._lastBreakPoint.vertical != this._actualBreakPoint.vertical)
				e.lastBreakPointVertical = this._lastBreakPoint.vertical;
			
			this._onchangeHandler(e);
		}		
	};

	// on mobile devices is window size changing while scrolling content - because some panels are hiding
	$C._checkWindowOrDocumentResize = function() {
		if (this.getWindowWidth() != this._lastWinWidth || this.getWindowHeight() != this._lastWinHeight ||
			this.getDocumentWidth() != this._lastDocWidth || this.getDocumentHeight() != this._lastDocHeight)
			this._solveChanges();
	};


	$C._isScrolling = false;
	$C._lastWasScrolling = $C._isScrolling;


	$C._onscrollHandler = function() {
// -----------------------------------------------------TODO: if IE8 and less - return;  --- no support of "scroll | no-scroll" ----------------------------------
		//if (this._isIE() --- need version detection --------------
		this._checkWindowOrDocumentResize();
		clearTimeout(this._timeoutedNoScrollProcess);
		this._removeClass('no-scrolling')._addClass('scrolling');
		this._timeoutedNoScrollProcess = setTimeout(this._timeoutedNoScrollBindedFn, this.AFTER_SCROLL_TIMEOUT);
		this._isScrolling = true;
		this._solveChanges();
	};

	$C._timeoutedNoScroll = function() {
		this._setNoScrollingClass();
		this._isScrolling = false;
		this._solveChanges();
	};
	$C._setNoScrollingClass = function() {
		this._removeClass('scrolling')._addClass('no-scrolling');
	};

	$C._timeoutedNoScrollBindedFn = function() {
		$C._timeoutedNoScroll()
	};

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
		this._removeClass('state-uninitialized')._removeClass('state-loading')._removeClass('state-interactive');
		// 'state-complete' sa nebude odstranovat
		var newState = this.getDocumentState();
		this._addClass('state-' + newState);
		if (newState == 'loaded')
			this._onceLoaded = true;
		//alert(this.getDocumentState());
		this._solveChanges();
	};

	$C._isDocumentLoaded = false;


	$C._onloadHandler = function() {
		this._isDocumentLoaded = true;
		this._onreadyStateChangeHandler();
	};

	$C._isDocumentUnloading = false;

	$C._onunloadHandler = function() {
		this._addClass('state-unloading');
		this._isDocumentUnloading = false;
		this._solveChanges();
	};


	// Opera does not support document.hasFocus()
	$C._isWindowFocused = document.hasFocus ? document.hasFocus() : true;

	$C._onblurHandler = function( e ) {
		this._isWindowFocused = false;
		this._removeClass('window-focused')._addClass('window-blured');
		this._solveChanges();
	};

	$C._onfocusHandler = function( e ) {
		this._isWindowFocused = true;
		this._removeClass('window-blured')._addClass('window-focused');
		this._solveChanges();
	};

	/*
	// Normal form of this function without Error handling...
	$C._onchangeHandler = function( e ) {
		for (var i = 0; i < this._onChangeHandlers.length; i++)
			this._onChangeHandlers[i].call(this, e);
	};
	*/
	
	// upper function with error handling (because if some error ocures in any handler, it ended cycle and did not run all event listeners)
	$C._onchangeHandler = function(e, _startIndex, _errors) {
		var errors = _errors || [];
		for (var i = _startIndex || 0; i < this._onChangeHandlers.length; i++) {

			try {
				this._onChangeHandlers[i].call(this, e);
			}

			catch(error) {
				errors.push(error);
				if (i+1<this._onChangeHandlers.length) {
					this._onchangeHandler( e, i+1, errors );
				}
			}
		}
		if (errors.length) {
			// if more errors, we want to print all to console
			if (errors.length>1)
				console.log('All errors in JS.Responsive._onchangeHandler:', errors);
			throw errors[0];
		}
	};

	
	$C._onChangeHandlers = [];

	$C._horizontalSizes = [];
	$C._verticalSizes = [];

	$C._sortSizes = function( a, b ) {
		return a.width - b.width;
	};

	$C._arrayGetIndexOfName = function( array, name ) {
		for (var i = 0; i < array.length; i++)
			if (array[i].name == name)
				return i;
		return -1;
	};

	
	$C._addBreakPoint = function(name, size, propertyName, sizeAttr) {
		
		var sizes = this[propertyName],
			index = this._arrayGetIndexOfName(sizes, name);
		// if does not exists this name
		if (index==-1) {
			var sizeObj = {name: name};
			sizeObj[sizeAttr] = parseInt(size, 10);
			sizes.push(sizeObj);
			sizes.sort(this._sortSizes);
			this._solveChanges(true);
		}
		return this;
	};
	
	$C._removeBreakPoint = function(name, propertyName) {
		
		var sizes = this[propertyName],
			index = this._arrayGetIndexOfName(sizes, name);
		// if does exists this name
		if (index>=0) {
			sizes.splice(index,1);
			this._removeAllClasses(name);
			this._solveChanges(true);
		}
		return this;
	};
	
	
	$C._lessAppendix = '-less';
	
	$C._moreAppendix = '-more';

	
	$C._removeAllClasses = function( sizeAttributeName ) {
		
		return this._removeClass(sizeAttributeName + this._lessAppendix)
		           ._removeClass(sizeAttributeName)
		           ._removeClass(sizeAttributeName + this._moreAppendix);
	};
	
	
	$C._isDisabledHorizontalBreakPoints = false;
	$C._isDisabledVerticalBreakPoints = false;
	
	$C._removeAllClassesInDimension = function( sizesArray ) {
		for (var i = 0; i < sizesArray.length; i++)
			this._removeAllClasses( sizesArray[i].name );		
	};
	
	$C._solveSizes = function() {
		var beforeClass = this._getHTML().className;
		
		this._startTransactionClass();
		
		var arrays = [],
			sizes = [],
			sizeAttributes = [],
			dimensions = [];
			
		if (!this._isDisabledHorizontalBreakPoints) {
			arrays.push( this._horizontalSizes );
			sizes.push( this.getWindowWidth() );
			sizeAttributes.push( 'width' );
			dimensions.push( 'horizontal' );
		}
		
		if (!this._isDisabledVerticalBreakPoints) {
			arrays.push( this._verticalSizes );
			sizes.push( this.getWindowHeight() );
			sizeAttributes.push( 'height' );
			dimensions.push( 'vertical' );
		}

		this._lastBreakPoint.horizontal = this._actualBreakPoint.horizontal;
		this._actualBreakPoint.horizontal = '';
		this._lastBreakPoint.vertical = this._actualBreakPoint.vertical;
		this._actualBreakPoint.vertical = '';

		

		var size,
			nextSize,
			sizeIsEqualToCurrentBreakPoint,
			sizeIsGreaterThanCurrentBreakPoint,
			sizeIsGreaterOrEqualToCurrentBreakPoint,
			thisBreakPointIsLastOne,
			isSmallerThanNextBreakPoint;
		
		// for all dimensions, both 'horizontal' and 'vertical
		for (var k = 0; k < arrays.length; k++) {

			var actualSize = sizes[k],
				firstIn = false,
				a = arrays[k],
				sizeAttributeName = sizeAttributes[k];

			// for all break points in current dimension
			for (var i = 0; i < a.length; i++) {
				size = a[i];
				nextSize = a[i + 1];
				this._removeAllClasses(size.name);

				sizeIsEqualToCurrentBreakPoint = (size[sizeAttributeName] == actualSize);
				sizeIsGreaterThanCurrentBreakPoint = (size[sizeAttributeName] < actualSize);
				sizeIsGreaterOrEqualToCurrentBreakPoint = (size[sizeAttributeName] <= actualSize);
				thisBreakPointIsLastOne = (i == a.length - 1);
				isSmallerThanNextBreakPoint = nextSize && nextSize[sizeAttributeName] > actualSize;
				
				if (sizeIsGreaterOrEqualToCurrentBreakPoint)
					this._addClass(size.name + this._moreAppendix);
				
				if (!firstIn) {
					if (sizeIsEqualToCurrentBreakPoint || (sizeIsGreaterThanCurrentBreakPoint && (thisBreakPointIsLastOne || isSmallerThanNextBreakPoint))) {
						this._addClass(size.name);
						this._actualBreakPoint[dimensions[k]] = size.name;
						firstIn = true;
					}
				}

				if (!sizeIsGreaterOrEqualToCurrentBreakPoint)
					this._addClass(size.name + this._lessAppendix);
			}
		}

		this._commitTransactionClass();

		// returns true if something has changed or false if nothing has changed
		return this._lastBreakPoint.horizontal != this._actualBreakPoint.horizontal || 
		       this._lastBreakPoint.vertical   != this._actualBreakPoint.vertical;
	};
	

	// SOURCE: http://www.quirksmode.org/js/detect.html
	// no longer supported / updated
	// @todo update/test on new browsers
	$C._getAgentData = function() {
		var nua = navigator.userAgent,
			np = navigator.platform,
			nv = navigator.vendor,
			nall = nua + ' ' + np + ' ' + nv;
		return [
			{
				identity: "Edge",
				string: nua,
				subString: "Edge",
				versionSearch: "Edge/"
			},
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

	$C._getAgentTags = function() {
		for (var i = 0, data = this._getAgentData(), tags = []; i < data.length; i++)
			tags.push(data[i].identity.toLowerCase());
		return tags;
	};

	$C._detectAgentPlatform = function(_justReturnValue) {

		var data = this._getAgentData(),
			foundBrowser = false,
			returnValue = {
				platform: [],
				browser: [],
				version: null
			};

		for (var i = 0; i < data.length; i++) {

			var dataString = data[i].string,
				dataProp = data[i].prop;

			if ((dataString || dataProp) && (!foundBrowser || !data[i].versionSearch)) {
				if (dataProp || dataString.indexOf(data[i].subString) != -1) {
					var clsName = data[i].identity.toLowerCase();
					if (_justReturnValue)
						returnValue.platform.push(clsName);
					else
						this._addClass(clsName);
					if (data[i].versionSearch) {
						var version = parseFloat(navigator.userAgent.split(data[i].versionSearch || data[i].identity)[1], 10);

						if (clsName != 'webkit') foundBrowser = true; // this is exception for webkit
						if (!isNaN(version)) {
							if (_justReturnValue)
								returnValue.version = version;
							else
								this._addClass(clsName + '-v' + parseInt(version));
							if (version != parseInt(version) && !_justReturnValue)
								this._addClass(clsName + '-v' + version.toString().replace('.', '-'));
						}
					}
				}
			}
		}
		if (_justReturnValue) {
			returnValue.browser = returnValue.platform[returnValue.platform.length - 1];
			return returnValue;
		}
	};
	

	/**
	 * Returns true if HTML element contains all given class names (space separated)
	 * @returns {Boolean}
	 */
	$C._hasAllTheseClasses = function( classNames ) {

		var classes = classNames.split(' ');
		for (var i=0; i<classes.length; i++) {
			if (classes[i] != '' && !this._hasClass(classes[i]))
					return false;
		}
		return true;
	};


	$C._detectmobilebrowsers_com = function() {
		// from http://detectmobilebrowsers.com/
		// last update 2015-12-29 --- IMPORTANT: new version redirects page to 'http://detectmobilebrowser.com/mobile', so I replaced it by return 'window.location = MOBILE_WEBSITE' with ';'
		return (function( a ) {
			return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)));
		})(navigator.userAgent || navigator.vendor || window.opera);
	};

	
	$C._findAgentDataByBrowserName = function( browser ) {

		var data = this._getAgentData();
		browser = browser.toLowerCase();
		for (var i = 0; i < data.length; i++) {
			if (browser == data[i].identity.toLowerCase())
				return data[i];
		}
		return null;
	};


	$C._addBrowserVersionClasses = function( agentData, version ) {

		if (agentData.versionSearch) {
			var browser = agentData.identity.toLowerCase(),
				actualVersion = parseFloat(navigator.userAgent.split(agentData.versionSearch || agentData.identity)[1], 10);
			if ((version + '').indexOf('.') == -1)
				actualVersion = parseInt(actualVersion);

			if (!isNaN(actualVersion)) {

				if (version == actualVersion) {
					this._addClass(browser + '-v' + version + '-le');
					this._addClass(browser + '-v' + version + '-ge');
				}

				if (version > actualVersion)
					this._addClass(browser + '-v' + version + '-l');
				
				if (version < actualVersion)
					this._addClass(browser + '-v' + version + '-g');

				return true;
			}
		}
		return false;
	};
	
	
	// returns device orientation 0, 90, 180, 270 (degrees cross clock wise)
	$C._getDeviceOrientationAngle = function() {
		var orientation = 0;
		// window.orientation is deprecated (https://developer.mozilla.org/en-US/docs/Web/API/Window/orientation)
		if (typeof window.orientation == 'number') {
			orientation = window.orientation;			
		}
		else {
			var screenOrientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
			if (typeof screenOrientation == 'string') {
				// is commented because zero is default
				//if (screenOrientation == 'portrait-primary')
					//orientation = 0;
				if (screenOrientation == 'landscape-primary')
					orientation = 90;
				if (screenOrientation == 'portrait-secondary')
					orientation = 180;
				if (screenOrientation == 'landscape-secondary')
					orientation = 270;
			}
			else if (screenOrientation.angle) {
				orientation = screenOrientation.angle;
			}		
		}
		if (orientation==-90)
			orientation = 270;
		return orientation;
	};
	
	// adds "device-orientation-portrait" or "device-orientation-landscape" class  and  "device-orientation-0", "device-orientation-90", "device-orientation-180" or "device-orientation-270" class
	$C._detectDeviceOrientation = function() {
		var angle = this._getDeviceOrientationAngle(),
			retVal = false,
			dO = 'device-orientation';
		if (angle==0 || angle==180) {			
			if (this._hasClass(dO+'-landscape')) {
				this._removeClass(dO+'-landscape')._removeClass(dO+'-90')._removeClass(dO+'-270');
				retVal = true;
			}
			if (!this._hasClass(dO+'-portrait'))
				this._addClass(dO+'-portrait');
			
			if (angle==0 && this._hasClass(dO+'-180')) {
				this._removeClass(dO+'-180');
				retVal = true;
			}
			if (angle==180 && this._hasClass(dO+'-0')) {
				this._removeClass(dO+'-0');
				retVal = true;
			}
		}
		if (angle==90 || angle==270) {			
			if (this._hasClass(dO+'-portrait')) {
				this._removeClass(dO+'-portrait')._removeClass(dO+'-0')._removeClass(dO+'-180');
				retVal = true;
			}
			
			if (!this._hasClass(dO+'-landscape'))
				this._addClass(dO+'-landscape');
			
			if (angle==90 && this._hasClass(dO+'-270')) {
				this._removeClass(dO+'-270');
				retVal = true;
			}
			if (angle==270 && this._hasClass(dO+'-90')) {
				this._removeClass(dO+'-90');
				retVal = true;
			}
		}
		
		this._addClass(dO+'-'+angle);
		return retVal;
	};

	
	$C._init = function() {

		// runs only once
		if (this._init.wasExecuted)
			return;

		this._init.wasExecuted = true;


		this._detectAgentPlatform();

		// adds "mobile" or "desktop"
		this._detectMobile();

		// adds "touch" or "no-touch"
		this._detectTouch();

		// adds "retina-display" or "normal-display"
		this._detectHiResDisplay();

		// adds "portrait" or "landscape"
		this._detectOrientation();
		
		// adds "device-orientation-portrait" or "device-orientation-landscape" class  and  "device-orientation-0", "device-orientation-90", "device-orientation-180" or "device-orientation-270" class
		this._detectDeviceOrientation();

		// register onresizeHandler
		this._on(window, 'resize', this._solveChanges)
			._on(window, 'orientationchange', this._solveChanges)
			._on(window, 'scroll', this._onscrollHandler)

			// for mobiles - on mobile devices is window size changing while scrolling content - because some panels are hiding
			._on(document, 'touchmove', this._checkWindowOrDocumentResize)
			._on(document, 'touchend', this._checkWindowOrDocumentResize)

			._on(document, 'readystatechange', this._onreadyStateChangeHandler)
			._on(window, 'load', this._onloadHandler)
			._on(window, 'unload', this._onunloadHandler)
			._on(window, 'onbeforeunload', this._onunloadHandler)

			._on(window, 'blur', this._onblurHandler)
			._on(window, 'focus', this._onfocusHandler);

		if (this._isWindowFocused)
			this._onfocusHandler();
		else
			this._onblurHandler();

		setInterval(this._checkWindowOrDocumentResize.bind(this), this.CHECK_DOCUMENT_SIZE_INTERVAL);

		this._setNoScrollingClass();

		// and run it once
		this._solveChanges();

	};

	
	// -------------------------------------------------------------------------------------------------
	// --- INITIALIZATION ------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------
	
	$C._init();

})();
