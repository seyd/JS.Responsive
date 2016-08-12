(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("JS.Responsive", [], factory);
	else if(typeof exports === 'object')
		exports["JS.Responsive"] = factory();
	else
		root["JS.Responsive"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/**
	 * @license JS.Responsive v2.3.3
	 * (c) 2015 WEZEO http://wezeo.com
	 * License: MIT
	 *
	 * @author Johnny Seyd <seyd@wezeo.com>, Ctibor Laky <laky@wezeo.com>
	 *
	 * @description JS.Responsive is a free tool for responsive styling and responsive javascript coding.
	 *
	 * @see http://responsive.lab.wezeo.com/
	 *
	 */
	(function () {
		'use strict';
	
		// base namespace
	
		if (!window.JS) window.JS = {};
	
		// defines and inicialize only once
		if (JS.Responsive) return;
	
		// -------------------------------------------------------------------------------------------------
		// --- CLASS ---------------------------------------------------------------------------------------
		// -------------------------------------------------------------------------------------------------
	
		/**
	  * Constructor is PRIVATE, client must use only class methods!!!!!
	  * @class JS.Responsive
	  */
		var $C = JS.Responsive = function () {
			throw new Error("JS.Responsive cannot have instances.");
		};
	
		/**
	  * @version
	  */
		$C.version = '2.3.6';
	
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
	  *    addOnChangeHandler( fn )
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
	
		var
		// how many miliseconds stays class name 'scroll' after scrolling 
		// (and than switch to 'no-scroll' class name)
		AFTER_SCROLL_TIMEOUT = 250,
	
	
		// (ms) how offen is checking the document size (not just window, but content size)
		CHECK_DOCUMENT_SIZE_INTERVAL = 500,
	
	
		// substitution because minimalization (internal variables are shorten in minimizing process)
		win = window,
		    document = win.document,
		    navigator = win.navigator,
		    screen = win.screen,
		    parseInt = win.parseInt,
		    parseFloat = win.parseFloat,
		    TRUE = true,
		    FALSE = false,
		    NULL = null,
		    UNDEFINED = undefined,
		    EMPTY_STRING = '',
		    SPACE_CHAR = ' ',
		    WIDTH_STRING = 'width',
		    HEIGHT_STRING = 'height',
		    MOZ_PREFIX = 'moz',
		    MS_PREFIX = 'ms',
		    PORTRAIT_STRING = 'portrait',
		    LANDSCAPE_STRING = 'landscape',
		    HORIZONTAL_STRING = 'horizontal',
		    VERTICAL_STRING = 'vertical';
	
		// -------------------------------------------------------------------------------------------------	
		// --- PUBLIC --------------------------------------------------------------------------------------
		// -------------------------------------------------------------------------------------------------
	
		/**
	  * Detects mobile browser - if device is a mobile device.
	  * @todo Find out if mobile is just a phone or tablet also...
	  * @returns {Boolean} The return value is not changing in time.
	  */
		$C.isMobile = function () {
	
			return www_detectmobilebrowsers_com();
		};
	
		/**
	  * Detects if current device supports touch events.
	  * @returns {Boolean} The return value is not changing in time.
	  */
		$C.isTouch = function () {
	
			return 'ontouchstart' in document.documentElement;
		};
	
		/**
	  * Detects if current device has a high resolution display (such as retina).
	  * @returns {Boolean} The return value is not changing in time.
	  */
		$C.isHiResDisplay = function () {
	
			return win.devicePixelRatio > 1;
		};
	
		/**
	  * Returns if current device has display landscape oriented (width is larger than height).
	  * @returns {Boolean}
	  */
		$C.isLandscape = function () {
	
			return getWindowWidth() > getWindowHeight();
		};
	
		/**
	  * Returns if current device has display portrait oriented (height is larger than width).
	  * @returns {Boolean}
	  */
		$C.isPortrait = function () {
	
			return !this.isLandscape();
		};
	
		/**
	  * Returns if document is in state that everything is loaded.
	  * @returns {Boolean}
	  */
		$C.isDocumentLoaded = function () {
	
			return isDocumentLoaded;
		};
	
		/**
	  * Returns true if user is leaving current page.
	  * @returns {Boolean}
	  */
		$C.isDocumentUnloading = function () {
	
			return isDocumentUnloading;
		};
	
		/**
	  * Returns true if page is just scrolled or in scrolling.
	  * @returns {Boolean}
	  */
		$C.isScrolling = function () {
	
			return isScrolling;
		};
	
		/**
	  * Returns true if window is focused/active.
	  * @returns {Boolean}
	  */
		$C.isFocused = function () {
	
			return isWindowFocused;
		};
	
		/**
	  * Returns device orientation "portrait" or "landscape".
	  * @returns {String} "portrait" or "landscape"
	  */
		$C.getDeviceOrientation = function () {
	
			var angle = getDeviceOrientationAngle();
			return angle == 0 || angle == 180 ? PORTRAIT_STRING : LANDSCAPE_STRING;
		};
	
		/**
	  * Returns angle of device orientation 0, 90, 180, 270 in degrees cross clock wise.
	  * @returns {Number} 0, 90, 180, 270
	  */
		$C.getDeviceOrientationAngle = function () {
	
			return getDeviceOrientationAngle();
		};
	
		/**
	  * Sets a new horizontal break point for responsive styling.
	  * @param {String} name - Unique name of given break point. Only lower case letters and comma is allowed /[a-z\-]+/
	  * @param {Number} width - Width size in pixels.
	  * @returns {Object} this - for chaining.
	  * @example JS.Responsive.addHorizontalBreakPoint('medium', 960);
	  */
		$C.addHorizontalBreakPoint = function (name, width) {
			addBreakPoint(name, width, horizontalSizes, WIDTH_STRING);
			return this;
		};
	
		/**
	  * Removes a horizontal break point for responsive styling.
	  * @param {String} name - Existing name of break point.
	  * @returns {Object} this - for chaining.
	  * @example JS.Responsive.removeHorizontalBreakPoint('medium');
	  */
		$C.removeHorizontalBreakPoint = function (name) {
			removeBreakPoint(name, horizontalSizes);
			return this;
		};
	
		/**
	  * Returns name of actual horizontal break point.
	  * @returns {String|null} Name of actual horizontal break point or null if no horizontal break point is set.
	  */
		$C.getActualHorizontalBreakPoint = function () {
	
			return actualHorizontalBreakPoint || NULL;
		};
	
		/**
	  * Disable horizontal break points checking and remove all class names from HTML element.
	  * @param {Boolean} [_leaveActualClasses] - If true, leaves (freezes) actual class names in HTML element.
	  * @returns {Object} this - for chaining.
	  */
		$C.disableHorizontalBreakPoints = function (_leaveActualClasses) {
	
			if (!_leaveActualClasses) removeAllClassesInDimension(horizontalSizes);
			isDisabledHorizontalBreakPoints = TRUE;
			return this;
		};
	
		/**
	  * Enable horizontal break points checking (if was disabled before).
	  * @returns {Object} this - for chaining.
	  */
		$C.enableHorizontalBreakPoints = function () {
	
			isDisabledHorizontalBreakPoints = FALSE;
			solveChanges(TRUE);
			return this;
		};
	
		/**
	  * Returns if is horizontal break points checking disabled.
	  * @returns {Boolean}
	  */
		$C.isDisabledHorizontalBreakPoints = function () {
	
			return isDisabledHorizontalBreakPoints;
		};
	
		/**
	  * Sets a new vertical break point for responsive styling.
	  * @param {String} name - Unique name of given break point. Only lower case letters and comma is allowed /[a-z\-]+/
	  * @param {Number} height - Height size in pixels.
	  * @returns {Object} this - for chaining.
	  * @example JS.Responsive.addVerticalBreakPoint('vertical-medium', 960);
	  */
		$C.addVerticalBreakPoint = function (name, height) {
	
			addBreakPoint(name, height, verticalSizes, HEIGHT_STRING);
			return this;
		};
	
		/**
	  * Removes a vertical break point for responsive styling.
	  * @param {String} name - Existing name of break point.
	  * @returns {Object} this - for chaining.
	  * @example JS.Responsive.removeVerticalBreakPoint('vertical-medium');
	  */
		$C.removeVerticalBreakPoint = function (name) {
	
			removeBreakPoint(name, verticalSizes);
			return this;
		};
	
		/**
	  * Returns name of actual vertical break point.
	  * @returns {String|null} Name of actual vertical break point or null if no vertical break point is set.
	  */
		$C.getActualVerticalBreakPoint = function () {
	
			return actualVerticalBreakPoint || NULL;
		};
	
		/**
	  * Disable vertical break points checking and remove all class names from HTML element.
	  * @param {Boolean} [_leaveActualClasses] - If true, leaves (freezes) actual class names in HTML element.
	  * @returns {Object} this - for chaining.
	  */
		$C.disableVerticalBreakPoints = function (_leaveActualClasses) {
	
			if (!_leaveActualClasses) removeAllClassesInDimension(verticalSizes);
			isDisabledVerticalBreakPoints = TRUE;
			return this;
		};
	
		/**
	  * Enable vertical break points checking (if was disabled before).
	  * @returns {Object} this - for chaining.
	  */
		$C.enableVerticalBreakPoints = function () {
	
			isDisabledVerticalBreakPoints = FALSE;
			solveChanges(TRUE);
			return this;
		};
	
		/**
	  * Returns if is vertical break points checking disabled.
	  * @returns {Boolean}
	  */
		$C.isDisabledVerticalBreakPoints = function () {
	
			return isDisabledVerticalBreakPoints;
		};
	
		/**
	  * Tests if HTML element contains given class names.
	  * @param {...String} - class names
	  * @returns {Boolean}
	  * @example JS.Responsive('mobile') === true, when HTML contains "mobile" class
	  * @example JS.Responsive('portrait touch') === true, when HTML contains "portrait" and "touch" class
	  * @example JS.Responsive('portrait touch', 'mobile') === true, when HTML contains ("portrait" and "touch" class) OR ('mobile')
	  */
		$C.is = function () {
	
			for (var i = 0; i < arguments.length; i++) if (hasAllTheseClasses(arguments[i])) return TRUE; // if once true then disjunction is true
	
			return FALSE;
		};
	
		/**
	  * Set watching given browser and its version
	  * @param {String} browser - browser name, see function getAgentData() attribute "identity"
	  * @param {Number} version - browser version number
	  * @returns {Object} this - for chaining.
	  * @example JS.Responsive.watchBrowserVersion('Webkit', 530);
	  * @example JS.Responsive.watchBrowserVersion('Chrome', 47);
	  * @example JS.Responsive.watchBrowserVersion('MSIE', 10);
	  * @example JS.Responsive.watchBrowserVersion('Edge', 12);
	  */
		$C.watchBrowserVersion = function (browser, version) {
	
			var foundVersion,
			    agentData = findAgentDataByBrowserName(browser);
	
			if (agentData) foundVersion = addBrowserVersionClasses(agentData, version);else throw new Error("Browser '" + browser + "' was not found.");
	
			if (agentData && !agentData.versionSearch) throw new Error("Parameter '" + browser + "' doesn't support version search.");
	
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
		$C.getPlatformInfo = function () {
	
			return detectAgentPlatform(TRUE);
		};
	
		/**
	  * Register event listener for all responsive changes.
	  * @returns {Object} this - for chaining.
	  * @example JS.Responsive.addOnChangeHandler(function(e) {
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
		$C.addOnChangeHandler = function (fn) {
	
			onChangeListeners.push(fn);
			return this;
		};
	
		/**
	  * Unregister event listener for all responsive changes.
	  * @returns {Object} this - for chaining.
	  */
		$C.removeOnChangeHadler = function (fn) {
	
			for (var i = onChangeListeners.length - 1; i >= 0; i--) if (onChangeListeners[i] === fn) onChangeListeners.splice(i, 1);
			return this;
		};
	
		/**
	  * Returns current window width in pixels.
	  * @function 
	  * @returns {Number}
	  * @example if (JS.Responsive.getWindowWidth()>JS.Responsive.getWindowHeight()) ...
	  */
		$C.getWindowWidth = getWindowWidth;
	
		/**
	  * Returns current window height in pixels.
	  * @function 
	  * @returns {Number}
	  * @example if (JS.Responsive.getWindowWidth()>JS.Responsive.getWindowHeight()) ...
	  */
		$C.getWindowHeight = getWindowHeight;
	
		/**
	  * Returns current document width in pixels (can be smaller than window size because scrollbar reduces it).
	  * @function
	  * @returns {Number}
	  * @example if (JS.Responsive.getDocumentWidth()>JS.Responsive.getDocumentHeight()) ...
	  */
		$C.getDocumentWidth = getDocumentWidth;
	
		/**
	  * Returns current document height in pixels (can be smaller than window size because scrollbar reduces it).
	  * @function
	  * @returns {Number}
	  * @example if (JS.Responsive.getDocumentWidth()>JS.Responsive.getWindowHeight()) ...
	  */
		$C.getDocumentHeight = getDocumentHeight;
	
		/**
	  * Sets time brakepoints with classnames and start time value.
	  * @param {Object[]} breakpoints - The employees who are responsible for the project.
	  * @param {string} breakpoints[].name - The name of a breakpoint, this name will be used as className!
	  * @param {Number} breakpoints[].time - The time after document load in [ms], breakpoint name will be applied.
	  * @param {Number|Boolean} [breakpoints[].remains] - The time in [ms], breakpoint name will be removed (optional). Or TRUE value to prevent replacing with next breakpoint.
	  * @example JS.Responsive.setTimeBreakPoints( config )
	  */
		$C.setTimeBreakPoints = function (breakpoints) {
			var sinceReady;
			if (docReadyTime) init();else timeBreakPointsInit = init;
	
			return this;
	
			// fn declarations
			function init() {
				var now = +new Date();
				sinceReady = now - docReadyTime;
	
				// sort by time
				breakpoints.sort(function (a, b) {
					return +(a.time > b.time) || +(a.time === b.time) - 1;
				});
	
				// clear passed times
				while (breakpoints[0].time < sinceReady) breakpoints[0].shift();
	
				// clear running timeout if any
				if (timeBreakPointTimeout) clearTimeout(timeBreakPointTimeout);
	
				// set new timeout for first breakpoint
				activateNext();
			}
	
			function activateNext() {
				if (!breakpoints[0]) // no more breakpoints
					return;
	
				timeBreakPointTimeout = setTimeout(function () {
	
					// remove current breakpoint name
					removeClass(timeBreakPointCurrentName);
					timeBreakPointCurrentName = UNDEFINED;
	
					// apply new breakpoint
					var bp = breakpoints.shift();
					addClass(bp.name);
	
					if (!bp.remains) {
						// next breakpoint will clear the current one
						timeBreakPointCurrentName = bp.name;
					}
	
					if (bp.remains && bp.remains !== TRUE) setTimeout(function () {
						removeClass(bp.name);
					}, bp.remains);
	
					activateNext();
				}, breakpoints[0].time - sinceReady);
			}
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
		for (var prop in $C) if (prop.indexOf('BreakPoint') > 0) $C[prop.replace('Break', 'Size')] = $C[prop];
	
		// -------------------------------------------------------------------------------------------------
		// --- PRIVATE -------------------------------------------------------------------------------------
		// -------------------------------------------------------------------------------------------------
	
		function forEach(array, fn) {
			for (var i = 0; i < array.length; i++)
			// calls on array (this == array) and 
			// first argument is current array item, 
			// second argument is current index
			fn.call(array, array[i], i);
		}
	
		/**
	  * Returns current window width in pixels.
	  * @returns {Number}.
	  */
		function getWindowWidth() {
			return getWindowSize(WIDTH_STRING);
		}
	
		/**
	  * Returns current window height in pixels.
	  * @returns {Number}.
	  */
		function getWindowHeight() {
	
			return getWindowSize(HEIGHT_STRING);
		};
	
		/**
	  * Returns current document width in pixels (can be smaller than window size because scrollbar reduces it).
	  * @returns {Number}
	  */
		function getDocumentWidth() {
	
			return getDocumentSize(WIDTH_STRING);
		}
	
		/**
	  * Returns current document height in pixels (can be smaller than window size because scrollbar reduces it).
	  * @returns {Number}
	  */
		function getDocumentHeight() {
	
			return getDocumentSize(HEIGHT_STRING);
		}
	
		var htmlElement, bodyElement;
	
		function getElementByTagName(tagName) {
			return document.getElementsByTagName(tagName)[0];
		}
	
		function getHtmlElement() {
			if (!htmlElement) htmlElement = getElementByTagName('html');
			return htmlElement;
		}
	
		function getBodyElement() {
			if (!bodyElement) bodyElement = getElementByTagName('body');
			return bodyElement;
		}
	
		function arrayIndex(array, value, _exactMatch) {
			for (var i = 0; i < array.length; i++) if (_exactMatch && array[i] === value || !_exactMatch && array[i] == value) return i;
			return -1;
		};
	
		function arrayContains(array, item, _exactMatch) {
			return arrayIndex(array, item, _exactMatch) >= 0;
		};
	
		function bind(el, eventType, handlerFn) {
	
			var $this = this,
			    fn = function (e) {
				handlerFn.call($this, e || event);
			};
			if (el.addEventListener) el.addEventListener(eventType, fn, FALSE);else if (el.attachEvent) el.attachEvent('on' + eventType, fn);
		}
	
		function addClass(name) {
			var html = getHtmlElement();
			if (html) {
				if (!isInTransactionClassMode) {
					var className = html.className;
					// remove double spaces and trim
					var classes = className == EMPTY_STRING ? [] : className.replace(/ +/g, SPACE_CHAR).replace(/^\s*|\s*$/g, EMPTY_STRING).split(SPACE_CHAR);
	
					if (!arrayContains(classes, name)) {
						classes.push(name);
						html.className = classes.join(SPACE_CHAR);
					}
				} else addTransactionClass(name);
			}
		}
	
		function removeClass(name) {
			var html = getHtmlElement();
			if (html && name) {
				if (!isInTransactionClassMode) {
					var className = html.className;
					var classes = className == EMPTY_STRING ? [] : className.split(SPACE_CHAR);
					if (arrayContains(classes, name)) {
						classes.splice(arrayIndex(classes, name), 1);
						html.className = classes.join(SPACE_CHAR);
					}
				} else removeTransactionClass(name);
			}
		}
	
		function hasClass(name) {
			var html = getHtmlElement();
			if (html) {
				var classes = html.className.split(SPACE_CHAR);
				return arrayContains(classes, name);
			}
			return FALSE;
		}
	
		var isInTransactionClassMode = FALSE,
		    addedClasses = [],
		    removedClasses = [];
	
		function startTransactionClass() {
			isInTransactionClassMode = TRUE;
			addedClasses = [];
			removedClasses = [];
		}
	
		function addTransactionClass(name) {
			// if was removed, undo this state
			if (arrayContains(removedClasses, name)) removedClasses.splice(arrayIndex(removedClasses, name), 1);
			// else adds if not already added
			else if (!hasClass(name) && !arrayContains(addedClasses, name)) addedClasses.push(name);
		}
	
		function removeTransactionClass(name) {
			// if was added, undo this state
			if (arrayContains(addedClasses, name)) addedClasses.splice(arrayIndex(addedClasses, name), 1);
			// else adds if not already added
			else if (hasClass(name) && !arrayContains(removedClasses, name)) removedClasses.push(name);
		}
	
		function commitTransactionClass() {
			isInTransactionClassMode = FALSE;
			for (var i = 0; i < removedClasses.length; i++) removeClass(removedClasses[i]);
			// adding in one punch
			if (addedClasses.length) addClass(addedClasses.join(SPACE_CHAR)); //.replace(/^\s*|\s*$/g, EMPTY_STRING)
			addedClasses = [];
			removedClasses = [];
		}
	
		/*
	 // UNUSED
	 function rollbackTransactionClass() {
	 	isInTransactionClassMode = FALSE;
	 	addedClasses = [];
	 	removedClasses = [];
	 }
	 */
	
		// capitalize first letter
		function ucFirst(str) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		}
	
		// @param (String) sizeType - 'width' or 'height'
		function getWindowSize(sizeType) {
			var ucSizeType = ucFirst(sizeType),
			    size = win['inner' + ucSizeType],
			    docEl = document.documentElement;
			return size || (docEl && docEl['offset' + ucSizeType] ? docEl['client' + ucSizeType] : screen[sizeType]);
		};
	
		function isIE() {
			return navigator.appName == 'Microsoft Internet Explorer';
		}
	
		// @param (String) sizeType - 'width' or 'height'
		function getDocumentSize(sizeType) {
			var el = !isIE() ? getHtmlElement() : getBodyElement();
			return el ? el['offset' + ucFirst(sizeType)] : 0;
		}
	
		// adds "mobile" or "desktop" class (once)
		function detectMobile() {
			addClass($C.isMobile() ? 'mobile' : 'desktop');
		}
	
		// adds "touch" or "no-touch" class (once)
		function detectTouch() {
			addClass($C.isTouch() ? 'touch' : 'no-touch');
		}
	
		// adds "hires-display" or "normal-display" class (once)
		function detectHiResDisplay() {
			var ratio = win.devicePixelRatio;
			addClass(ratio > 1 ? 'hires-display' : 'normal-display');
			addClass('display-pixel-ratio-' + ratio);
		}
	
		// adds "portrait" or "landscape" class
		function detectOrientation() {
			var landscape = $C.isLandscape();
			if (landscape && (hasClass(PORTRAIT_STRING) || !hasClass(LANDSCAPE_STRING))) {
				removeClass(PORTRAIT_STRING);
				addClass(LANDSCAPE_STRING);
				return TRUE;
			}
			if (!landscape && (hasClass(LANDSCAPE_STRING) || !hasClass(PORTRAIT_STRING))) {
				removeClass(LANDSCAPE_STRING);
				addClass(PORTRAIT_STRING);
				return TRUE;
			}
			return FALSE;
		}
	
		var lastWinWidth = 0,
		    lastWinHeight = 0,
		    lastDocWidth = 0,
		    lastDocHeight = 0,
		    lastHorizontalBreakPoint = EMPTY_STRING,
		    lastVerticalBreakPoint = EMPTY_STRING,
		    actualHorizontalBreakPoint = EMPTY_STRING,
		    actualVerticalBreakPoint = EMPTY_STRING,
		    lastFocusedState = NULL;
	
		function solveChanges(_forceRecalculate) {
	
			var change = FALSE,
			    changedOrientation = detectOrientation();
			change = change || changedOrientation;
	
			var changedDeviceOrientation = detectDeviceOrientation();
			change = change || changedDeviceOrientation;
	
			var ww = getWindowWidth(),
			    wh = getWindowHeight(),
			    changedWinSize = ww != lastWinWidth || wh != lastWinHeight;
			change = change || changedWinSize;
	
			var dw = getDocumentWidth(),
			    dh = getDocumentHeight(),
			    changedDocSize = dw != lastDocWidth || dh != lastDocHeight;
			change = change || changedDocSize;
	
			var changedBreakPoint = FALSE;
			if (changedWinSize || _forceRecalculate) changedBreakPoint = solveSizes();
			change = change || changedBreakPoint;
	
			var actualState = getDocumentState(),
			    changedDocumentState = actualState != lastDocumentState;
			change = change || changedDocumentState;
	
			// also unload
			var isUnloading = isDocumentUnloading;
			change = change || isUnloading;
	
			var changedFocusedState = isWindowFocused != lastFocusedState;
			lastFocusedState = isWindowFocused;
			change = change || changedFocusedState;
	
			var changedIsScrolling = isScrolling != lastWasScrolling;
			lastWasScrolling = isScrolling;
			change = change || changedIsScrolling;
	
			var changedBreakPointHorizontal = changedBreakPoint && lastHorizontalBreakPoint != actualHorizontalBreakPoint,
			    changedBreakPointVertical = changedBreakPoint && lastVerticalBreakPoint != actualVerticalBreakPoint;
	
			lastWinWidth = ww;
			lastWinHeight = wh;
	
			lastDocWidth = dw;
			lastDocHeight = dh;
	
			lastDocumentState = actualState;
	
			var changedDayTime = lastDayTimeCurrent != dayTimeCurrent;
			var changedDayPeriod = lastDayTimePeriod != dayTimePeriod;
			var changedYearPeriod = lastDayYearPeriod != dayYearPeriod;
			change = change || changedDayTime || changedDayPeriod || changedYearPeriod;
	
			if (change) {
				var e = {
					changedWindowSize: changedWinSize,
					changedDocumentSize: changedDocSize,
					changedOrientation: changedOrientation,
					changedDeviceOrientation: changedDeviceOrientation,
	
					changedBreakPointHorizontal: changedBreakPointHorizontal,
					changedSizePointHorizontal: changedBreakPointHorizontal, // due to backward compatibility with v1.0
	
					actualBreakPointHorizontal: actualHorizontalBreakPoint,
					actualSizePointHorizontal: actualHorizontalBreakPoint, // due to backward compatibility with v1.0
	
					changedBreakPointVertical: changedBreakPointVertical,
					changedSizePointVertical: changedBreakPointVertical, // due to backward compatibility with v1.0
	
					actualBreakPointVertical: actualVerticalBreakPoint,
					actualSizePointVertical: actualVerticalBreakPoint, // due to backward compatibility with v1.0
	
					changedDocumentState: changedDocumentState,
					isDocumentUnloading: isUnloading,
					changedWindowFocus: changedFocusedState,
					changedScrolling: changedIsScrolling,
	
					changedDayTime: changedDayTime,
					changedDayPeriod: changedDayPeriod,
					changedYearPeriod: changedYearPeriod
				};
	
				if (changedBreakPoint && lastHorizontalBreakPoint != actualHorizontalBreakPoint) e.lastBreakPointHorizontal = lastHorizontalBreakPoint;
	
				if (changedBreakPoint && lastVerticalBreakPoint != actualVerticalBreakPoint) e.lastBreakPointVertical = lastVerticalBreakPoint;
	
				onchangeHandler(e);
			}
		};
	
		// on mobile devices is window size changing while scrolling content - because some panels are hiding
		function checkWindowOrDocumentResize() {
			if (getWindowWidth() != lastWinWidth || getWindowHeight() != lastWinHeight || getDocumentWidth() != lastDocWidth || getDocumentHeight() != lastDocHeight) solveChanges();
		};
	
		var isScrolling = FALSE,
		    lastWasScrolling = isScrolling,
		    SCROLLING_CLASS = 'scrolling',
		    NO_SCROLLING_CLASS = 'no-' + SCROLLING_CLASS,
		    timeoutedNoScrollProcess;
	
		function onscrollHandler() {
			// -----------------------------------------------------TODO: if IE8 and less - return;  --- no support of "scroll | no-scroll" ----------------------------------
			//if (isIE() --- need version detection --------------
			checkWindowOrDocumentResize();
			clearTimeout(timeoutedNoScrollProcess);
			removeClass(NO_SCROLLING_CLASS);
			addClass(SCROLLING_CLASS);
			timeoutedNoScrollProcess = setTimeout(timeoutedNoScroll, AFTER_SCROLL_TIMEOUT);
			isScrolling = TRUE;
			solveChanges();
		};
	
		function timeoutedNoScroll() {
			setNoScrollingClass();
			isScrolling = FALSE;
			solveChanges();
		};
	
		function setNoScrollingClass() {
			removeClass(SCROLLING_CLASS);
			addClass(NO_SCROLLING_CLASS);
		};
	
		var lastDocumentState = 'uninitialized';
	
		function getDocumentState() {
			return isDocumentLoaded ? 'loaded' : document.readyState;
		};
	
		var onceLoaded = FALSE;
	
		function onreadyStateChangeHandler() {
			if (!onceLoaded) {
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
				removeClass('state-uninitialized');
				removeClass('state-loading');
				removeClass('state-interactive');
				// 'state-complete' sa nebude odstranovat
				var newState = getDocumentState();
				addClass('state-' + newState);
				if (newState == 'loaded') onceLoaded = TRUE;
				solveChanges();
			}
		}
	
		var isDocumentLoaded = FALSE,
		    docReadyTime;
	
		function onloadHandler() {
			isDocumentLoaded = TRUE;
			docReadyTime = +new Date();
			if (timeBreakPointsInit) timeBreakPointsInit();
			onreadyStateChangeHandler();
		}
	
		var isDocumentUnloading = FALSE;
	
		function onunloadHandler() {
			addClass('state-unloading');
			isDocumentUnloading = FALSE;
			solveChanges();
		}
	
		// Opera does not support document.hasFocus()
		var isWindowFocused = document.hasFocus ? document.hasFocus() : TRUE;
	
		var WINDOW_FOCUSED_CLASS = 'window-focused',
		    WINDOW_BLURED_CLASS = 'window-blured';
	
		function onblurHandler(e) {
			isWindowFocused = FALSE;
			removeClass(WINDOW_FOCUSED_CLASS);
			addClass(WINDOW_BLURED_CLASS);
			solveChanges();
		}
	
		function onfocusHandler(e) {
			isWindowFocused = TRUE;
			removeClass(WINDOW_BLURED_CLASS);
			addClass(WINDOW_FOCUSED_CLASS);
			solveChanges();
		}
	
		/*
	 // Normal form of this function without Error handling...
	 function onchangeHandler( e ) {
	 	for (var i = 0; i < onChangeListeners.length; i++)
	 		onChangeListeners[i].call(this, e);
	 };
	 */
	
		// upper function with error handling (because if some error ocures in any handler, it ended cycle and did not run all event listeners)
		function onchangeHandler(e, _startIndex, _errors) {
			var errors = _errors || [];
			for (var i = _startIndex || 0; i < onChangeListeners.length; i++) {
	
				try {
					onChangeListeners[i].call($C, e);
				} catch (error) {
					errors.push(error);
					if (i + 1 < onChangeListeners.length) {
						onchangeHandler(e, i + 1, errors);
					}
				}
			}
			if (errors.length) {
				// if more errors, we want to print all to console
				if (errors.length > 1) console.log('All errors in JS.Responsive onchangeHandler:', errors);
				throw errors[0];
			}
		};
	
		var onChangeListeners = [],
		    horizontalSizes = [],
		    verticalSizes = [];
	
		function arrayGetIndexOfName(array, name) {
			for (var i = 0; i < array.length; i++) if (array[i].name == name) return i;
			return -1;
		}
	
		function addBreakPoint(name, size, sizesArray, sizeAttr) {
	
			var index = arrayGetIndexOfName(sizesArray, name);
			// if does not exists this name
			if (index == -1) {
				var sizeObj = { name: name };
				sizeObj[sizeAttr] = parseInt(size, 10);
				sizesArray.push(sizeObj);
				sizesArray.sort(function (a, b) {
					return a[sizeAttr] - b[sizeAttr];
				});
				solveChanges(TRUE);
			}
		}
	
		function removeBreakPoint(name, sizesArray) {
	
			var index = arrayGetIndexOfName(sizesArray, name);
			// if does exists this name
			if (index >= 0) {
				sizesArray.splice(index, 1);
				removeAllClasses(name);
				solveChanges(TRUE);
			}
		}
	
		var LESS_APPENDIX = '-less',
		    MORE_APPENDIX = '-more';
	
		function removeAllClasses(sizeAttributeName) {
	
			removeClass(sizeAttributeName + LESS_APPENDIX);
			removeClass(sizeAttributeName);
			removeClass(sizeAttributeName + MORE_APPENDIX);
		}
	
		var isDisabledHorizontalBreakPoints = FALSE,
		    isDisabledVerticalBreakPoints = FALSE;
	
		function removeAllClassesInDimension(sizesArray) {
	
			forEach(sizesArray, function (size) {
				removeAllClasses(size.name);
			});
		}
	
		function solveSizes() {
	
			startTransactionClass();
	
			var arrays = [],
			    sizes = [],
			    sizeAttributes = [],
			    dimensions = [];
	
			if (!isDisabledHorizontalBreakPoints) {
				arrays.push(horizontalSizes);
				sizes.push(getWindowWidth());
				sizeAttributes.push(WIDTH_STRING);
				dimensions.push(HORIZONTAL_STRING);
			}
	
			if (!isDisabledVerticalBreakPoints) {
				arrays.push(verticalSizes);
				sizes.push(getWindowHeight());
				sizeAttributes.push(HEIGHT_STRING);
				dimensions.push(VERTICAL_STRING);
			}
	
			lastHorizontalBreakPoint = actualHorizontalBreakPoint;
			actualHorizontalBreakPoint = EMPTY_STRING;
			lastVerticalBreakPoint = actualVerticalBreakPoint;
			actualVerticalBreakPoint = EMPTY_STRING;
	
			var size, nextSize, sizeIsEqualToCurrentBreakPoint, sizeIsGreaterThanCurrentBreakPoint, sizeIsGreaterOrEqualToCurrentBreakPoint, thisBreakPointIsLastOne, isSmallerThanNextBreakPoint;
	
			// for all dimensions, both 'horizontal' and 'vertical'
			for (var k = 0; k < arrays.length; k++) {
	
				var actualSize = sizes[k],
				    firstIn = FALSE,
				    a = arrays[k],
				    sizeAttributeName = sizeAttributes[k];
	
				// for all break points in current dimension
				for (var i = 0; i < a.length; i++) {
					size = a[i];
					nextSize = a[i + 1];
					removeAllClasses(size.name);
	
					sizeIsEqualToCurrentBreakPoint = size[sizeAttributeName] == actualSize;
					sizeIsGreaterThanCurrentBreakPoint = size[sizeAttributeName] < actualSize;
					sizeIsGreaterOrEqualToCurrentBreakPoint = size[sizeAttributeName] <= actualSize;
					thisBreakPointIsLastOne = i == a.length - 1;
					isSmallerThanNextBreakPoint = nextSize && nextSize[sizeAttributeName] > actualSize;
	
					if (sizeIsGreaterOrEqualToCurrentBreakPoint) addClass(size.name + MORE_APPENDIX);
	
					if (!firstIn) {
						if (sizeIsEqualToCurrentBreakPoint || sizeIsGreaterThanCurrentBreakPoint && (thisBreakPointIsLastOne || isSmallerThanNextBreakPoint)) {
							addClass(size.name);
							if (dimensions[k] == HORIZONTAL_STRING) actualHorizontalBreakPoint = size.name;
							if (dimensions[k] == VERTICAL_STRING) actualVerticalBreakPoint = size.name;
							firstIn = TRUE;
						}
					}
	
					if (!sizeIsGreaterOrEqualToCurrentBreakPoint) addClass(size.name + LESS_APPENDIX);
				}
			}
	
			commitTransactionClass();
	
			// returns true if something has changed or false if nothing has changed
			return lastHorizontalBreakPoint != actualHorizontalBreakPoint || lastVerticalBreakPoint != actualVerticalBreakPoint;
		};
	
		// SOURCE: http://www.quirksmode.org/js/detect.html
		// no longer supported / updated
		// @todo update/test on new browsers
		function getAgentData() {
			var nua = navigator.userAgent,
			    np = navigator.platform,
			    nv = navigator.vendor,
			    nall = nua + SPACE_CHAR + np + SPACE_CHAR + nv,
			    agentList = [];
	
			function add(identity, string, subString, versionSearch, prop) {
				agentList.push({
					identity: identity,
					string: string,
					subString: subString == UNDEFINED ? identity : subString,
					versionSearch: versionSearch !== TRUE ? versionSearch : identity + '/',
					prop: prop
				});
			}
			add("Edge", nua, NULL, TRUE);
			add("Webkit", nua, NULL, TRUE);
			add("Android", nall);
			add("CoreMedia", nall);
			add("QuickTime", nall);
			add("BlackBerry", nall);
			add("Windows", np, "Win");
			add("Mac", np);
			add("MacOSX", nua, "Intel Mac OS X"); // because on iPhone is "like Mac OS X"
			add("iPhone", nua);
			add("iOS", nua, "iPhone");
			add("iPad", nall);
			add("iOS", nall, "iPad");
			add("iPod", nall);
			add("iOS", nall, "iPod");
			add("PSP", nall); //PlayStation Portable
			add("Kindle", nall);
			add("Linux", np);
			add("Maxthon", nua, NULL, TRUE);
			add("Chrome", nua, NULL, TRUE);
			add("OmniWeb", nua, NULL, TRUE);
			add("Safari", nv, "Apple", "Version/");
			add("Opera", UNDEFINED, NULL, "Version/", win.opera);
			add("OperaMini", nall, "Opera Mini");
			add("iCab", nv);
			add("Konqueror", nv, "KDE");
			add("Firefox", nua, NULL, TRUE);
			add("Camino", nv);
			add("Netscape", nua); // for newer Netscapes (6+)
			add("MSIE", nua, NULL, "MSIE");
			add("MSIE WOW", nua, "WOW64", "rv:");
			add("Mozilla", nua, "Gecko", "rv");
			add("Mozilla", nua, NULL, "Mozilla"); // for older Netscapes (4-)
	
			return agentList;
		};
	
		/*
	 // unused function
	 function getAgentTags() {
	 	for (var i = 0, data = getAgentData(), tags = []; i < data.length; i++)
	 		tags.push(data[i].identity.toLowerCase());
	 	return tags;
	 };
	 */
	
		function detectAgentPlatform(_justReturnValue) {
	
			var data = getAgentData(),
			    foundBrowser = FALSE,
			    returnValue = {
				platform: [],
				browser: [],
				version: NULL
			};
	
			for (var i = 0; i < data.length; i++) {
	
				var dataString = data[i].string,
				    dataProp = data[i].prop;
	
				if ((dataString || dataProp) && (!foundBrowser || !data[i].versionSearch)) {
					if (dataProp || dataString.indexOf(data[i].subString) != -1) {
						var clsName = data[i].identity.toLowerCase();
						if (_justReturnValue) returnValue.platform.push(clsName);else addClass(clsName);
						if (data[i].versionSearch) {
							var version = parseFloat(navigator.userAgent.split(data[i].versionSearch || data[i].identity)[1], 10);
	
							if (clsName != 'webkit') foundBrowser = TRUE; // this is exception for webkit
	
							if (!isNaN(version)) {
								if (_justReturnValue) returnValue.version = version;else
									// if more classes with spaces, adds versions to all classes 
									// (e.g. msie-v11 wow-v11)
									addClass(clsName.replace(/( |$)/g, '-v' + parseInt(version) + ' ').trim());
								if (version != parseInt(version) && !_justReturnValue)
									// if more classes with spaces, adds versions to all classes 
									addClass(clsName.replace(/( |$)/g, '-v' + version.toString().replace('.', '-') + ' ').trim());
							}
						}
					}
				}
			}
			if (_justReturnValue) {
				returnValue.browser = returnValue.platform[returnValue.platform.length - 1];
				return returnValue;
			}
		}
	
		/**
	  * Returns true if HTML element contains all given class names (space separated)
	  * @returns {Boolean}
	  */
		function hasAllTheseClasses(classNames) {
	
			var classes = classNames.split(SPACE_CHAR);
			for (var i = 0; i < classes.length; i++) {
				if (classes[i] != EMPTY_STRING && !hasClass(classes[i])) return FALSE;
			}
			return TRUE;
		};
	
		function www_detectmobilebrowsers_com() {
			// from http://detectmobilebrowsers.com/
			// last update 2015-12-29 --- IMPORTANT: new version redirects page to 'http://detectmobilebrowser.com/mobile', 
			// so I replaced it by return 'window.location = MOBILE_WEBSITE' with ';'
			return function (a) {
				return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
				);
			}(navigator.userAgent || navigator.vendor || win.opera);
		};
	
		function findAgentDataByBrowserName(browser) {
	
			var data = getAgentData();
			browser = browser.toLowerCase();
			for (var i = 0; i < data.length; i++) {
				if (browser == data[i].identity.toLowerCase()) return data[i];
			}
			return NULL;
		};
	
		function addBrowserVersionClasses(agentData, version) {
	
			if (agentData.versionSearch) {
				var browser = agentData.identity.toLowerCase(),
				    actualVersion = parseFloat(navigator.userAgent.split(agentData.versionSearch || agentData.identity)[1], 10);
				if ((version + EMPTY_STRING).indexOf('.') == -1) actualVersion = parseInt(actualVersion);
	
				if (!isNaN(actualVersion)) {
	
					if (version == actualVersion) {
						addClass(browser + '-v' + version + '-le');
						addClass(browser + '-v' + version + '-ge');
					}
	
					if (version > actualVersion) addClass(browser + '-v' + version + '-l');
	
					if (version < actualVersion) addClass(browser + '-v' + version + '-g');
	
					return TRUE;
				}
			}
			return FALSE;
		};
	
		// returns device orientation 0, 90, 180, 270 (degrees cross clock wise)
		function getDeviceOrientationAngle() {
			var orientation = 0;
			// win.orientation is deprecated (https://developer.mozilla.org/en-US/docs/Web/API/Window/orientation)
			if (typeof win.orientation == 'number') {
				orientation = win.orientation;
			} else {
				var //screenOrientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
				// minification to form:  n=F[We]||F[$+Ee]||F[Z+Ee];
				// in compare to:         n=screen.orientation||screen.mozOrientation||screen.msOrientation;
				screenOrientation = screen[ORIENTATION_STRING] || screen[MOZ_PREFIX + UC_ORIENTATION_STRING] || screen[MS_PREFIX + UC_ORIENTATION_STRING];
				if (screenOrientation) {
					if (typeof screenOrientation == 'string') {
						// is commented because zero is default
						//if (screenOrientation == PORTRAIT_STRING + PRIMARY_APPENDIX)
						//orientation = 0;
						if (screenOrientation == LANDSCAPE_STRING + PRIMARY_APPENDIX) orientation = 90;
						if (screenOrientation == PORTRAIT_STRING + SECONDARY_APPENDIX) orientation = 180;
						if (screenOrientation == LANDSCAPE_STRING + SECONDARY_APPENDIX) orientation = 270;
					} else if (screenOrientation.angle) {
						orientation = screenOrientation.angle;
					}
				}
			}
			if (orientation == -90) orientation = 270;
			return orientation;
		};
	
		var ORIENTATION_STRING = 'orientation',
		    UC_ORIENTATION_STRING = ucFirst(ORIENTATION_STRING),
		    DEVICE_ORIENTATION_CLASS = 'device-orientation',
		    LANDSCAPE_APPENDIX = '-' + LANDSCAPE_STRING,
		    PORTRAIT_APPENDIX = '-' + PORTRAIT_STRING,
		    PRIMARY_APPENDIX = '-primary',
		    SECONDARY_APPENDIX = '-secondary',
		    ANGLE_0_APPENDIX = '-0',
		    ANGLE_90_APPENDIX = '-90',
		    ANGLE_180_APPENDIX = '-180',
		    ANGLE_270_APPENDIX = '-270';
	
		// adds "device-orientation-portrait" or "device-orientation-landscape" class  and  "device-orientation-0", "device-orientation-90", "device-orientation-180" or "device-orientation-270" class
		function detectDeviceOrientation() {
			var angle = getDeviceOrientationAngle(),
			    retVal = FALSE;
			if (angle == 0 || angle == 180) {
				if (hasClass(DEVICE_ORIENTATION_CLASS + LANDSCAPE_APPENDIX)) {
					removeClass(DEVICE_ORIENTATION_CLASS + LANDSCAPE_APPENDIX);
					removeClass(DEVICE_ORIENTATION_CLASS + ANGLE_90_APPENDIX);
					removeClass(DEVICE_ORIENTATION_CLASS + ANGLE_270_APPENDIX);
					retVal = TRUE;
				}
				// unnecessary to check if has already class, addClass adds it just once
				//if (!hasClass(DEVICE_ORIENTATION_CLASS + PORTRAIT_APPENDIX))
				addClass(DEVICE_ORIENTATION_CLASS + PORTRAIT_APPENDIX);
	
				if (angle == 0 && hasClass(DEVICE_ORIENTATION_CLASS + ANGLE_180_APPENDIX)) {
					removeClass(DEVICE_ORIENTATION_CLASS + ANGLE_180_APPENDIX);
					retVal = TRUE;
				}
				if (angle == 180 && hasClass(DEVICE_ORIENTATION_CLASS + ANGLE_0_APPENDIX)) {
					removeClass(DEVICE_ORIENTATION_CLASS + ANGLE_0_APPENDIX);
					retVal = TRUE;
				}
			}
			if (angle == 90 || angle == 270) {
				if (hasClass(DEVICE_ORIENTATION_CLASS + PORTRAIT_APPENDIX)) {
					removeClass(DEVICE_ORIENTATION_CLASS + PORTRAIT_APPENDIX);
					removeClass(DEVICE_ORIENTATION_CLASS + ANGLE_0_APPENDIX);
					removeClass(DEVICE_ORIENTATION_CLASS + ANGLE_180_APPENDIX);
					retVal = TRUE;
				}
	
				// unnecessary to check if has already class, addClass adds it just once
				//if (!hasClass(DEVICE_ORIENTATION_CLASS + LANDSCAPE_APPENDIX))
				addClass(DEVICE_ORIENTATION_CLASS + LANDSCAPE_APPENDIX);
	
				if (angle == 90 && hasClass(DEVICE_ORIENTATION_CLASS + ANGLE_270_APPENDIX)) {
					removeClass(DEVICE_ORIENTATION_CLASS + ANGLE_270_APPENDIX);
					retVal = TRUE;
				}
				if (angle == 270 && hasClass(DEVICE_ORIENTATION_CLASS + ANGLE_90_APPENDIX)) {
					removeClass(DEVICE_ORIENTATION_CLASS + ANGLE_90_APPENDIX);
					retVal = TRUE;
				}
			}
	
			addClass(DEVICE_ORIENTATION_CLASS + '-' + angle);
			return retVal;
		};
	
		var timeBreakPointTimeout, timeBreakPointCurrentName, timeBreakPointsInit,
		//lastTimeBreakPoints = 0,
		dayTimeCurrent, dayTimePeriod, dayYearPeriod, lastDayTimeCurrent, lastDayTimePeriod, lastDayYearPeriod;
	
		function handleTimeBasedClasses() {
			setClasses();
	
			// fn definitions
			function setClasses() {
				lastDayTimeCurrent = dayTimeCurrent;
				lastDayTimePeriod = dayTimePeriod;
				lastDayYearPeriod = dayYearPeriod;
				removeClass(dayTimeCurrent);
				removeClass(dayTimePeriod);
				removeClass(dayYearPeriod);
	
				var now = new Date(),
				    MORNING = 'morning',
				    AFTERNOON = 'afternoon',
				    EVENING = 'evening',
				    NIGHT = 'night',
				    DAYPERIODS = {
					0: NIGHT,
					1: NIGHT,
					2: NIGHT,
					3: NIGHT,
					4: NIGHT,
					5: NIGHT,
					6: MORNING,
					7: MORNING,
					8: MORNING,
					9: MORNING,
					10: MORNING,
					11: MORNING,
					12: AFTERNOON,
					13: AFTERNOON,
					14: AFTERNOON,
					15: AFTERNOON,
					16: AFTERNOON,
					17: EVENING,
					18: EVENING,
					19: EVENING,
					20: NIGHT,
					21: NIGHT,
					22: NIGHT,
					23: NIGHT
				},
				    classNameDayTime = 'day-time-' + now.getHours() + 'h',
				    classNameDayPeriod = DAYPERIODS[now.getHours()],
				    classNameYearPeriod = getYearPeriod(now);
	
				// console.log('classNames', classNameDayTime, classNameDayPeriod, classNameYearPeriod);
	
				addClass(classNameDayTime);
				addClass(classNameDayPeriod);
				addClass(classNameYearPeriod);
	
				dayTimeCurrent = classNameDayTime;
	
				setTimeout(function () {
					setClasses();
				}, 60 * 60 * 1000 - now.getMilliseconds());
	
				solveChanges();
			}
	
			function getYearPeriod(date) {
				var year = date.getFullYear(),
				    firstDates = [{ date: new Date(year, 2, 20), name: 'Spring' }, { date: new Date(year, 5, 21), name: 'Summer' }, { date: new Date(year, 8, 23), name: 'Autumn' }, { date: new Date(year, 11, 21), name: 'Winter' }];
	
				return testPeriod(0);
	
				function testPeriod(index) {
					if (date < firstDates[index].date) {
						if (!index) // index === 0
							return firstDates[3].name;else return firstDates[index - 1].name;
					} else if (firstDates[++index]) return testPeriod(index);else return firstDates[0].name;;
				}
			}
		}
	
		var initWasExecuted;
	
		function init() {
	
			// runs only once
			if (initWasExecuted) return;
	
			initWasExecuted = TRUE;
	
			detectAgentPlatform();
	
			// adds "mobile" or "desktop"
			detectMobile();
	
			// adds "touch" or "no-touch"
			detectTouch();
	
			// adds "retina-display" or "normal-display"
			detectHiResDisplay();
	
			// adds "portrait" or "landscape"
			detectOrientation();
	
			// adds "device-orientation-portrait" or "device-orientation-landscape" class  and  "device-orientation-0", "device-orientation-90", "device-orientation-180" or "device-orientation-270" class
			detectDeviceOrientation();
	
			// register onresizeHandler
			bind(window, 'resize', solveChanges);
			bind(window, 'orientationchange', solveChanges);
			bind(window, 'scroll', onscrollHandler);
	
			// for mobiles - on mobile devices is window size changing while scrolling content - because some panels are hiding
			bind(document, 'touchmove', checkWindowOrDocumentResize);
			bind(document, 'touchend', checkWindowOrDocumentResize);
	
			bind(document, 'readystatechange', onreadyStateChangeHandler);
			bind(window, 'load', onloadHandler);
			bind(window, 'unload', onunloadHandler);
			bind(window, 'onbeforeunload', onunloadHandler);
	
			bind(window, 'blur', onblurHandler);
			bind(window, 'focus', onfocusHandler);
	
			if (isWindowFocused) onfocusHandler();else onblurHandler();
	
			// start handling time based classes
			handleTimeBasedClasses();
	
			setInterval(checkWindowOrDocumentResize, CHECK_DOCUMENT_SIZE_INTERVAL);
	
			setNoScrollingClass();
	
			// and run it once
			solveChanges();
		}
	
		// -------------------------------------------------------------------------------------------------
		// --- INITIALIZATION ------------------------------------------------------------------------------
		// -------------------------------------------------------------------------------------------------
	
		init();
	})();
	
	if (module) module.exports = window.JS.Responsive;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
/******/ ])
});
;
//# sourceMappingURL=JS.Responsive.js.map