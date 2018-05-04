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

	/**
	 * @license JS.Responsive
	 * (c) 2015 WEZEO http://wezeo.com
	 * License: MIT
	 *
	 * @version 3.4.0
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
	
		// Polyfill
	
		if (!Date.now) {
			Date.now = function now() {
				return new Date().getTime();
			};
		}
	
		// Simple version of polyfill Array.prototype.forEach()
		if (![].forEach) {
			Array.prototype.forEach = function (callback, thisArg) {
				var len = this.length;
				for (var i = 0; i < len; i++) {
					callback.call(thisArg, this[i], i, this);
				}
			};
		}
	
		// base namespace
		if (!window.JS) window.JS = {};
	
		// defines and inicialize only once
		if (JS.Responsive) return;
	
		// -------------------------------------------------------------------------------------------------
		// --- CLASS ---------------------------------------------------------------------------------------
		// -------------------------------------------------------------------------------------------------
	
		/**
	  * Constructor is PRIVATE, client must use only class methods!!!!!
	  * @constructor
	  * @alias JS.Responsive
	  *
	  * @emit documentReady - when document becomes ready
	  *
	  */
		var $C = JS.Responsive = function () {
			throw new Error("JS.Responsive cannot have instances.");
		};
	
		/**
	  * Library version
	  * @const {String}
	  */
		$C.version = '3.3.0';
	
		// -------------------------------------------------------------------------------------------------
		// --- CONFIG --------------------------------------------------------------------------------------
		// -------------------------------------------------------------------------------------------------
	
		var
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
		    VERTICAL_STRING = 'vertical',
	
	
		/**
	  * @param {Object}
	  * Storing _listeners types and callback functions
	  * structure:
	  * {
	  * 	eventTypeName: [callbackFn, ...],
	  * 	eventTypeName: [callbackFn, ...],
	  * 	...
	  * 	eventTypeName: [callbackFn, ...]
	  * }
	  * @private
	  */
		_listeners = {};
	
		// -------------------------------------------------------------------------------------------------
		// --- CORE LISTENER  ------------------------------------------------------------------------------
		// -------------------------------------------------------------------------------------------------
	
		if (document.readyState === "complete") {
			winLoaded();
		} else bind(win, 'load', winLoaded);
	
		// -------------------------------------------------------------------------------------------------
		// --- PUBLIC --------------------------------------------------------------------------------------
		// -------------------------------------------------------------------------------------------------
	
		/**
	  * Register callback to referenced event type
	  * @param {String} type - type of an event callback will be registered to
	  * @param {Function} fn - callback function called after event occurred
	  * @returns {Object} JS.Responsive - for chaining
	  */
		$C.on = function (type, fn) {
	
			if (!_listeners[type]) _listeners[type] = [];
			_listeners[type].push(fn);
			return $C;
		};
	
		/**
	  * Unregister callback of referenced event type
	  * @param {String} type - type of an event callback where callback is registered
	  * @param {Function} fn - callback function to be unregistered
	  * @returns {Object} JS.Responsive - for chaining
	  */
		$C.off = function (type, fn) {
	
			if (!_listeners[type]) return;
			var typeListeners = _listeners[type],
			    index = typeListeners.indexOf(fn);
			if (index != -1) typeListeners.splice(index, 1);
			return $C;
		};
	
		/**
	  * Emit event, can be used for emitting custom events too, just register them via JS.Responsive.on method.
	  * @param {String} type - type of an event callback will be registered to
	  * @param {...*} arguments - used when calling callbacks
	  * @returns {Object} JS.Responsive - for chaining
	  */
		$C.emit = function (type) {
	
			// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments
			var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments),
			    errors = [];
	
			args.shift(); // first argument is event type, we temporary remove it
			if (_listeners[type]) _listeners[type].forEach(applyEach);
	
			args.unshift(type); // type added back
			if (_listeners['all']) // _listeners to all event types
				_listeners['all'].forEach(applyEach);
	
			if (errors.length) {
				// if more errors, we want to print all to console
				if (errors.length > 1) console.log('All errors in JS.Responsive onchangeHandler:', errors);
				throw errors[0];
			}
	
			function applyEach(listener) {
				try {
					listener.apply(listener, args);
				} catch (error) {
					errors.push(error);
				}
			}
	
			return $C;
		};
	
		/**
	  * @prop {object} - List of included features in current bundle, each property represent one feature and value is initialisation
	  * function of the feature, so it can be initialised later
	  * @private
	  */
	
		$C._features = {};
	
		/**
	  * Initialise JS.Responsive
	  * @param {Object} [config] - Object with key value pairs of features which will be initialised, where key is the
	  * camelCased module name and value is optionally a configuration to the module, it can be of any type. If not
	  * provided, all features will be initialised with default configuration. If you provide empty object, none of
	  * features will be initialised.
	  *
	 	 * @example JS.Responsive.init({
	  * 	detectAdblock: {
	  * 		adblockDetectedClass: 'blocker-detected',
	  * 		noAdblockClass: 'no-blocker',
	  * 	},
	  * 	timeBased: true
	  * });
	  *
	  * You can use special config property `all` to initialise all other available
	  * modules with their default configurations.
	  *
	 	 * @example JS.Responsive.init({
	  * 	detectAdblock: {
	  * 		adblockDetectedClass: 'blocker-detected',
	  * 		noAdblockClass: 'no-blocker',
	  * 	},
	  * 	all: true
	  * });
	  */
	
		$C.init = function (config) {
	
			init(config);
			return this;
		};
	
		/**
	  * Tests if HTML element contains given class names.
	  * @param {...String} classNames - class names
	  * @returns {Boolean}
	  * @example JS.Responsive.is('mobile') === true, when HTML contains "mobile" class
	  * @example JS.Responsive.is('portrait touch') === true, when HTML contains "portrait" and "touch" class
	  * @example JS.Responsive.is('portrait touch', 'mobile') === true, when HTML contains ("portrait" and "touch" class) OR ('mobile')
	  */
		$C.is = function () {
	
			for (var i = 0; i < arguments.length; i++) if (hasAllTheseClasses(arguments[i])) return TRUE; // if once true then disjunction is true
	
			return FALSE;
		};
	
		// -------------------------------------------------------------------------------------------------
		// --- OPTIONAL CONTENT ----------------------------------------------------------------------------
		// -------------------------------------------------------------------------------------------------
	
		/**
	 *
	 * Adding horizontal and vertical breakpoints, similar use case to media queries, but with js API.
	 * @module breakpoints
	 * @pretty-name Size breakpoints
	 * @teaser Similar to media queries (width, height).
	 *
	 * @custom-class $breakpointName$-more - applied when display size is higher or equal to provided size for the name DEMO: http://codepen.io/WEZEO/pen/PbZMmq
	 * @custom-class $breakpointName$-less - applied when display size is smaller than provided size for the name DEMO: http://codepen.io/WEZEO/pen/PbZMmq
	 * @custom-class $breakpointName$ - applied when display size is higher or equal to provided size and less then next breakpoint size if any DEMO: http://codepen.io/WEZEO/pen/PbZMmq
	 *
	 * @emits changedBreakPointHorizontal - fires when new horizontal breakpoint is reached
	 * @emits changedBreakPointVertical - fires when new vertical breakpoint is reached
	 *
	 * @example <caption>Example usage of module</caption>
	 *
	 * // JS:
	 * JS.Responsive
	 *     .init()
	 *     .addHorizontalBreakPoint('micro', 420)
	 *     .addHorizontalBreakPoint('tiny', 478)
	 *     .addHorizontalBreakPoint('small', 768)
	 *     .addHorizontalBreakPoint('medium', 992)
	 *     .addHorizontalBreakPoint('large', 1230);
	 *
	 * // CSS:
	 * #github-ribbon {
	 *	    position: absolute;
	 *	    top: -(5/$font-size)+rem;
	 *      ...
	 *
	 *      html.medium-less & {
	 *		    height: (88/$font-size)+rem;
	 *		    padding: 0;
	 *		    border: 0;
	 *		    background-color: transparent;
	 *	    }
	 *
	 *      html.small-less & {
	 *		    display: none;
	 *	    }
	 * }
	 * */
	
		var
		// (ms) how offen is checking the document size (not just window, but content size)
		CHECK_DOCUMENT_SIZE_INTERVAL = 500,
		    horizontalSizes = [],
		    verticalSizes = [],
		    lastWinWidth = 0,
		    lastWinHeight = 0,
		    lastDocWidth = 0,
		    lastDocHeight = 0,
		    lastHorizontalBreakPoint = EMPTY_STRING,
		    lastVerticalBreakPoint = EMPTY_STRING,
		    actualHorizontalBreakPoint = EMPTY_STRING,
		    actualVerticalBreakPoint = EMPTY_STRING,
		    isDisabledHorizontalBreakPoints = FALSE,
		    isDisabledVerticalBreakPoints = FALSE,
		    LESS_APPENDIX = '-less',
		    MORE_APPENDIX = '-more',
		    _breakpointsInitialized;
	
		/**
	  * Sets a new horizontal break point for responsive styling.
	  * @param {String} name - Unique name of given break point. Only lower case letters and comma is allowed /[a-z\-]+/
	  * @param {Number} width - Width size in pixels.
	  * @returns {Object} this - for chaining.
	  * @example JS.Responsive.addHorizontalBreakPoint('medium', 960);
	  * @memberof module:breakpoints
	  * @alias JS.Responsive.addHorizontalBreakPoint
	  * @since 3.0.0
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
	  * @memberof module:breakpoints
	  * @alias JS.Responsive.removeHorizontalBreakPoint
	  * @since 3.0.0
	  */
		$C.removeHorizontalBreakPoint = function (name) {
			removeBreakPoint(name, horizontalSizes);
			return this;
		};
	
		/**
	  * Returns name of actual horizontal break point.
	  * @returns {String|null} Name of actual horizontal break point or null if no horizontal break point is set.
	  * @memberof module:breakpoints
	  * @alias JS.Responsive.getActualHorizontalBreakPoint
	  * @since 3.0.0
	  */
		$C.getActualHorizontalBreakPoint = function () {
	
			return actualHorizontalBreakPoint || NULL;
		};
	
		/**
	  * Disable horizontal break points checking and remove all class names from HTML element.
	  * @param {Boolean} [_keepActualClasses] - If true, keeps (freezes) actual class names in HTML element.
	  * @returns {Object} this - for chaining.
	  * @memberof module:breakpoints
	  * @alias JS.Responsive.disableHorizontalBreakPoints
	  * @since 3.0.0
	  */
		$C.disableHorizontalBreakPoints = function (_keepActualClasses) {
	
			if (!_keepActualClasses) removeAllClassesInDimension(horizontalSizes);
			isDisabledHorizontalBreakPoints = TRUE;
			return this;
		};
	
		/**
	  * Enable horizontal break points checking (if was disabled before).
	  * @returns {Object} this - for chaining.
	  * @memberof module:breakpoints
	  * @alias JS.Responsive.enableHorizontalBreakPoints
	  * @since 3.0.0
	  */
		$C.enableHorizontalBreakPoints = function () {
	
			isDisabledHorizontalBreakPoints = FALSE;
			solveSizes();
			return this;
		};
	
		/**
	  * Returns if is horizontal break points checking disabled.
	  * @returns {Boolean}
	  * @memberof module:breakpoints
	  * @alias JS.Responsive.isDisabledHorizontalBreakPoints
	  * @since 3.0.0
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
	  * @memberof module:breakpoints
	  * @alias JS.Responsive.addVerticalBreakPoint
	  * @since 3.0.0
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
	  * @memberof module:breakpoints
	  * @alias JS.Responsive.removeVerticalBreakPoint
	  * @since 3.0.0
	  */
		$C.removeVerticalBreakPoint = function (name) {
	
			removeBreakPoint(name, verticalSizes);
			return this;
		};
	
		/**
	  * Returns name of actual vertical break point.
	  * @returns {String|null} Name of actual vertical break point or null if no vertical break point is set.
	  * @memberof module:breakpoints
	  * @alias JS.Responsive.getActualVerticalBreakPoint
	  * @since 3.0.0
	  */
		$C.getActualVerticalBreakPoint = function () {
	
			return actualVerticalBreakPoint || NULL;
		};
	
		/**
	  * Disable vertical break points checking and remove all class names from HTML element.
	  * @param {Boolean} [_keepActualClasses] - If true, keeps (freezes) actual class names in HTML element.
	  * @returns {Object} this - for chaining.
	  * @memberof module:breakpoints
	  * @alias JS.Responsive.disableVerticalBreakPoints
	  * @since 3.0.0
	  */
		$C.disableVerticalBreakPoints = function (_keepActualClasses) {
	
			if (!_keepActualClasses) removeAllClassesInDimension(verticalSizes);
			isDisabledVerticalBreakPoints = TRUE;
			return this;
		};
	
		/**
	  * Enable vertical break points checking (if was disabled before).
	  * @returns {Object} this - for chaining.
	  * @memberof module:breakpoints
	  * @alias JS.Responsive.enableVerticalBreakPoints
	  * @since 3.0.0
	  */
		$C.enableVerticalBreakPoints = function () {
	
			isDisabledVerticalBreakPoints = FALSE;
			solveSizes();
			return this;
		};
	
		/**
	  * Returns if is vertical break points checking disabled.
	  * @returns {Boolean}
	  * @memberof module:breakpoints
	  * @alias JS.Responsive.isDisabledVerticalBreakPoints
	  * @since 3.0.0
	  */
		$C.isDisabledVerticalBreakPoints = function () {
	
			return isDisabledVerticalBreakPoints;
		};
	
		/**
	  * Returns current window width in pixels.
	  * @function
	  * @returns {Number}
	  * @example if (JS.Responsive.getWindowWidth()>JS.Responsive.getWindowHeight()) ...
	  * @memberof module:breakpoints
	  * @alias JS.Responsive.getWindowWidth
	  * @since 3.0.0
	  */
		$C.getWindowWidth = getWindowWidth;
	
		/**
	  * Returns current window height in pixels.
	  * @function
	  * @returns {Number}
	  * @example if (JS.Responsive.getWindowWidth()>JS.Responsive.getWindowHeight()) ...
	  * @memberof module:breakpoints
	  * @alias JS.Responsive.getWindowHeight
	  * @since 3.0.0
	  */
		$C.getWindowHeight = getWindowHeight;
	
		/**
	  * Returns current document width in pixels (can be smaller than window size because scrollbar reduces it).
	  * @function
	  * @returns {Number}
	  * @example if (JS.Responsive.getDocumentWidth()>JS.Responsive.getDocumentHeight()) ...
	  * @memberof module:breakpoints
	  * @alias JS.Responsive.getDocumentWidth
	  * @since 3.0.0
	  */
		$C.getDocumentWidth = getDocumentWidth;
	
		/**
	  * Returns current document height in pixels (can be smaller than window size because scrollbar reduces it).
	  * @function
	  * @returns {Number}
	  * @example if (JS.Responsive.getDocumentWidth()>JS.Responsive.getWindowHeight()) ...
	  * @memberof module:breakpoints
	  * @alias JS.Responsive.getDocumentHeight
	  * @since 3.0.0
	  */
		$C.getDocumentHeight = getDocumentHeight;
	
		$C._features.breakpoints = initBreakpoints;
	
		// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################
	
		function initBreakpoints() {
	
			setInterval(checkWindowOrDocumentResize, CHECK_DOCUMENT_SIZE_INTERVAL);
	
			bind(window, 'resize', solveSizes);
	
			// for mobiles - on mobile devices is window size changing while scrolling content - because some panels are hiding
			bind(document, 'touchmove', checkWindowOrDocumentResize);
			bind(document, 'touchend', checkWindowOrDocumentResize);
	
			_breakpointsInitialized = TRUE;
		}
	
		// on mobile devices is window size changing while scrolling content - because some panels are hiding
		function checkWindowOrDocumentResize() {
	
			if (getWindowWidth() != lastWinWidth || getWindowHeight() != lastWinHeight || getDocumentWidth() != lastDocWidth || getDocumentHeight() != lastDocHeight) solveSizes();
		}
	
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
				solveSizes();
			}
		}
	
		function removeBreakPoint(name, sizesArray) {
	
			var index = arrayGetIndexOfName(sizesArray, name);
			// if does exists this name
			if (index >= 0) {
				sizesArray.splice(index, 1);
				removeAllClasses(name);
				solveSizes();
			}
		}
	
		function removeAllClassesInDimension(sizesArray) {
	
			sizesArray.forEach(function (size) {
				removeAllClasses(size.name);
			});
		}
	
		function removeAllClasses(sizeAttributeName) {
	
			removeClass(sizeAttributeName + LESS_APPENDIX);
			removeClass(sizeAttributeName);
			removeClass(sizeAttributeName + MORE_APPENDIX);
		}
	
		function solveSizes() {
	
			if (!_breakpointsInitialized) {
				return;
			}
	
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
	
			if (lastHorizontalBreakPoint != actualHorizontalBreakPoint) $C.emit('changedBreakPointHorizontal', actualHorizontalBreakPoint, lastHorizontalBreakPoint);
			if (lastVerticalBreakPoint != actualVerticalBreakPoint) $C.emit('changedBreakPointVertical', actualVerticalBreakPoint, lastVerticalBreakPoint);
		}
	
		/**
	  *
	  * Detection whether device is touch capable
	  * @module detect-touch
	  * @pretty-name Touch capability
	  * @teaser Touch capability detection.
	  *
	  * @custom-class touch - is touch capable
	  * @custom-class no-touch - is not
	  *
	  * @custom-class touch-points-$ - touches count
	  *
	  * @emits touchPointsChanged - fires with number of touches, and previous number of touches as parameters
	  *
	  * */
	
		var TOUCH_POINTS_TEXT = 'touch-points-',
		    actualTouchClass,
		    actualTouchCount = 0;
	
		/**
	  * Detects if current device supports touch events.
	  * @returns {Boolean} The return value is not changing in time.
	  * @memberof module:detect-touch
	  * @alias JS.Responsive.isTouch
	  * @since 3.0.0
	  */
		$C.isTouch = function () {
	
			return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
		};
	
		$C._features.detectTouch = detectTouch;
	
		// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################
	
		// adds "touch" or "no-touch" class (once)
		function detectTouch() {
	
			bind(document, 'touchstart', setNumberOfTouches);
			bind(document, 'touchend', setNumberOfTouches);
	
			addClass($C.isTouch() ? 'touch' : 'no-touch');
		}
	
		function setNumberOfTouches(e) {
	
			var newCount = e.touches.length,
			    newClass = TOUCH_POINTS_TEXT + newCount;
	
			if (newCount != actualTouchCount) {
	
				removeClass(actualTouchClass);
	
				if (newCount) {
	
					addClass(newClass);
					actualTouchClass = newClass;
				}
	
				$C.emit('touchPointsChanged', newCount, actualTouchCount);
				actualTouchCount = newCount;
			}
		}
		/**
	  *
	  * Detection of document loading state.
	  * @module document-state
	  * @pretty-name Document loading
	  * @teaser Document loading states detection.
	  *
	  * @custom-class state-uninitialized - has not started loading yet
	  * @custom-class state-loading - is loading
	  * @custom-class state-interactive - Has loaded enough and the user can interact with it
	  * @custom-class state-complete - fully loaded
	  * @custom-class state-loaded - when document is loaded (including all images)
	  * @custom-class state-unloading - when document is unloading
	  *
	  * @emits changedDocumentState - Arguments: {String} - new-state, {String} - old-state, both are states strings like classes but without "state-" prefix
	  *
	  **/
	
		var isDocumentUnloading = FALSE,
		    lastDocumentState = 'uninitialized',
		    onceLoaded = FALSE;
	
		/**
	  * Returns if document is in state that everything is loaded.
	  * @returns {Boolean}
	  * @memberof module:document-state
	  * @alias JS.Responsive.isDocumentLoaded
	  * @since 3.0.0
	  */
		$C.isDocumentLoaded = function () {
	
			return isDocumentLoaded;
		};
	
		/**
	  * Returns true if user is leaving current page.
	  * @returns {Boolean}
	  * @memberof module:document-state
	  * @alias JS.Responsive.isDocumentUnloading
	  * @since 3.0.0
	  */
		$C.isDocumentUnloading = function () {
	
			return isDocumentUnloading;
		};
	
		$C._features.documentState = initDocState;
	
		// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################
	
		function initDocState() {
			bind(document, 'readystatechange', onreadyStateChangeHandler);
			bind(window, 'load', onreadyStateChangeHandler);
			bind(window, 'unload', onunloadHandler);
			bind(window, 'onbeforeunload', onunloadHandler);
		}
	
		function getDocumentState() {
			return isDocumentLoaded ? 'loaded' : document.readyState;
		}
	
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
	    unloading - when document is unloading
	    */
				removeClass('state-uninitialized');
				removeClass('state-loading');
				removeClass('state-interactive');
				// 'state-complete' sa nebude odstranovat
				var newState = getDocumentState();
				addClass('state-' + newState);
				if (newState == 'loaded') onceLoaded = TRUE;
	
				if (newState != lastDocumentState) {
					$C.emit('changedDocumentState', newState, lastDocumentState);
					lastDocumentState = newState;
				}
			}
		}
	
		function onunloadHandler() {
			addClass('state-unloading');
			isDocumentUnloading = TRUE;
			$C.emit('documentUnloading');
		}
	
		/**
	  *
	  * Detection of window focus
	  * @module focus-blur
	  * @pretty-name Window focus detection
	  * @teaser Is window focused or not?
	  *
	  * @custom-class window-focused
	  * @custom-class window-blured
	  *
	  * @emits windowFocused - Arguments: {Boolean} isFocused
	  *
	  **/
	
		var
		// Opera does not support document.hasFocus()
		isWindowFocused = document.hasFocus ? document.hasFocus() : TRUE,
		    WINDOW_FOCUSED_CLASS = 'window-focused',
		    WINDOW_BLURED_CLASS = 'window-blured';
	
		/**
	  * Returns if document is in state that everything is loaded.
	  * @returns {Boolean}
	  * @memberof module:focus-blur
	  * @alias JS.Responsive.isDocumentLoaded
	  * @since 3.0.0
	  */
		$C.isDocumentLoaded = function () {
	
			return isDocumentLoaded;
		};
	
		/**
	  * Returns true if user is leaving current page.
	  * @returns {Boolean}
	  * @memberof module:focus-blur
	  * @alias JS.Responsive.isDocumentUnloading
	  * @since 3.0.0
	  */
		$C.isDocumentUnloading = function () {
	
			return isDocumentUnloading;
		};
	
		/**
	  * Returns true if window is focused/active.
	  * @returns {Boolean}
	  * @memberof module:focus-blur
	  * @alias JS.Responsive.isFocused
	  * @since 3.0.0
	  */
		$C.isFocused = function () {
	
			return isWindowFocused;
		};
	
		$C._features.focusBlur = initFB;
	
		// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################
	
		function initFB() {
			bind(window, 'blur', onblurHandler);
			bind(window, 'focus', onfocusHandler);
	
			if (isWindowFocused) onfocusHandler();else onblurHandler();
		}
	
		function onblurHandler(e) {
			isWindowFocused = FALSE;
			removeClass(WINDOW_FOCUSED_CLASS);
			addClass(WINDOW_BLURED_CLASS);
			$C.emit('windowFocused', FALSE);
		}
	
		function onfocusHandler(e) {
			isWindowFocused = TRUE;
			removeClass(WINDOW_BLURED_CLASS);
			addClass(WINDOW_FOCUSED_CLASS);
			$C.emit('windowFocused', TRUE);
		}
		/**
	  *
	  * Detection of touch usage, because some devices are capable of touches even they are equipped with mouse,
	  * so user can change usage of both inputs unexpectedly in time.
	  * @module touch-vs-mouse
	  * @pretty-name Touch usage detection
	  * @teaser Is currently used mouse or touch?
	  *
	  * @custom-class user-is-using-touch
	  * @custom-class user-is-using-mouse
	  *
	  * @emits changedUsingTouch - Arguments: {Boolean} isUsingTouch
	  *
	  **/
	
		/**
	  * Returns information if is actually using touches.
	  * @returns {Boolean|undefined} Returns true if using touches, false if using mouse, undefined if no use detected yet
	  * @memberof module:touch-vs-mouse
	  * @alias JS.Responsive.isUsingTouches
	  * @since 3.0.0
	  */
	
		$C.isUsingTouches = function () {
			return touchVsMouseUsingTouch;
		};
	
		var touchVsMouseLastTime = 0,
		    touchVsMouseUsingTouch;
	
		$C._features.isScrolling = initTouchVsMouse;
	
		// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################
	
		function initTouchVsMouse() {
			bind(document, 'touchstart', function () {
				touchVsMouseLastTime = Date.now();
				if (touchVsMouseUsingTouch) return;
	
				touchVsMouseUsingTouch = TRUE;
				addClass('user-is-using-touch');
				removeClass('user-is-using-mouse');
				$C.emit('changedUsingTouch', TRUE);
			});
	
			bind(document, 'mousemove', mouseHandler);
			bind(document, 'mousedown', mouseHandler);
		}
	
		function mouseHandler() {
			if (touchVsMouseUsingTouch === FALSE || Date.now() - touchVsMouseLastTime < 1000) return;
	
			touchVsMouseUsingTouch = FALSE;
			addClass('user-is-using-mouse');
			removeClass('user-is-using-touch');
			$C.emit('changedUsingTouch', FALSE);
		}
		$C.isAdblock = missingMethod("isAdblock");
		$C.watchBrowserVersion = missingMethod("watchBrowserVersion");
		$C.getPlatformInfo = missingMethod("getPlatformInfo");
		$C.getAgentTags = missingMethod("getAgentTags");
		$C.getDeviceOrientation = missingMethod("getDeviceOrientation");
		$C.getDeviceOrientationAngle = missingMethod("getDeviceOrientationAngle");
		$C.isHiResDisplay = missingMethod("isHiResDisplay");
		$C.isLandscape = missingMethod("isLandscape");
		$C.isPortrait = missingMethod("isPortrait");
		$C.setInactiveTimeLimit = missingMethod("setInactiveTimeLimit");
		$C.getInactiveTimeLimit = missingMethod("getInactiveTimeLimit");
		$C.removeInactiveTimeLimit = missingMethod("removeInactiveTimeLimit");
		$C.isMobile = missingMethod("isMobile");
		$C.isScrolling = missingMethod("isScrolling");
		$C.getDayTimePeriod = missingMethod("getDayTimePeriod");
		$C.getYearPeriod = missingMethod("getYearPeriod");
		$C.setTimeBreakPoints = missingMethod("setTimeBreakPoints");
		$C.setLocation = missingMethod("setLocation");
		$C.isDaylight = missingMethod("isDaylight");
		$C.dayOfYear = missingMethod("dayOfYear");
		$C.getSunrise = missingMethod("getSunrise");
		$C.getSunset = missingMethod("getSunset");
		$C.urlChanged = missingMethod("urlChanged");
	
		// -------------------------------------------------------------------------------------------------
		// --- PRIVATE -------------------------------------------------------------------------------------
		// -------------------------------------------------------------------------------------------------
	
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
		}
	
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
	
		// @param (String) sizeType - 'width' or 'height'
		function getDocumentSize(sizeType) {
	
			var el = !isIE() ? getHtmlElement() : getBodyElement();
			return el ? el['offset' + ucFirst(sizeType)] : 0;
		}
	
		// @param (String) sizeType - 'width' or 'height'
		function getWindowSize(sizeType) {
	
			var ucSizeType = ucFirst(sizeType),
			    size = win['inner' + ucSizeType],
			    docEl = document.documentElement;
			return size || (docEl && docEl['offset' + ucSizeType] ? docEl['client' + ucSizeType] : screen[sizeType]);
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
		}
	
		function arrayContains(array, item, _exactMatch) {
	
			return arrayIndex(array, item, _exactMatch) >= 0;
		}
	
		function arrayRemoveItemsStartingWith(array, startingWith) {
	
			var reg = new RegExp('^' + startingWith);
			for (var i = 0; i < array.length; i++) if (array[i].match(reg)) {
				array.splice(i, 1);
				i--; // because of splice
			}
		}
	
		function bind(el, eventType, handlerFn) {
	
			if (el.addEventListener) el.addEventListener(eventType, fn, FALSE);else if (el.attachEvent) el.attachEvent('on' + eventType, fn);
	
			function fn(e) {
				handlerFn.call(NULL, e || event);
			}
	
			return fn;
		}
	
		function unbind(el, eventType, handlerFn) {
	
			if (el.removeEventListener) el.removeEventListener(eventType, handlerFn, FALSE);else if (el.detachEvent) el.detachEvent('on' + eventType, handlerFn);
		}
	
		function addClass(name) {
	
			var html = getHtmlElement();
			if (!html) return FALSE;
	
			if (!isInTransactionClassMode) {
				var className = html.className;
				// remove double spaces and trim
				var classes = className == EMPTY_STRING ? [] : className.replace(/ +/g, SPACE_CHAR).replace(/^\s*|\s*$/g, EMPTY_STRING).split(SPACE_CHAR);
	
				if (!arrayContains(classes, name)) {
					classes.push(name);
					html.className = classes.join(SPACE_CHAR);
				} else return FALSE;
			} else addTransactionClass(name);
	
			return TRUE; // class added
		}
	
		function removeClass(name, startsWith) {
	
			var html = getHtmlElement();
			if (html && name) {
				if (!isInTransactionClassMode) {
					var className = html.className,
					    classes = className == EMPTY_STRING ? [] : className.split(SPACE_CHAR);
	
					if (startsWith) {
						if (className.indexOf(name) == -1) return;
						arrayRemoveItemsStartingWith(classes, name);
						html.className = classes.join(SPACE_CHAR);
					} else if (arrayContains(classes, name)) {
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
	
		function isIE() {
			return navigator.appName == 'Microsoft Internet Explorer';
		}
	
		var isDocumentLoaded = FALSE,
		    docReadyTime;
	
		function winLoaded() {
	
			isDocumentLoaded = TRUE;
			docReadyTime = +new Date();
	
			$C.emit('documentReady', docReadyTime);
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
		}
	
		function missingMethod(method) {
			return function () {
				throw Error('Method "' + method + '" is not available in this bundle!');
			};
		}
	
		function init(cfg) {
	
			var prop;
			if (cfg) {
				// init features by config
	
				var processAll = false;
				for (prop in cfg) {
	
					if (!cfg.hasOwnProperty(prop)) return;
	
					if ($C._features[prop]) $C._features[prop](cfg[prop]);else if (prop == 'all') processAll = true;else missingMethod(prop)();
	
					if (processAll) {
						// init also all other available features
						for (prop in $C._features) {
							if (!cfg[prop]) // has not been inited already
								$C._features[prop].call($C);
						}
					}
				}
			} else // init all available features
	
				for (prop in $C._features) {
					$C._features[prop].call($C);
				}
		}
	
		// -------------------------------------------------------------------------------------------------
		// --- INITIALIZATION ------------------------------------------------------------------------------
		// -------------------------------------------------------------------------------------------------
	
		if (true) module.exports = $C;
	})();

/***/ }
/******/ ])
});
;
//# sourceMappingURL=JS.Responsive.js.map