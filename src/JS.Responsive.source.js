/**
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
	$C.version = '2.4.0';

	// -------------------------------------------------------------------------------------------------
	// --- OVERVIEW ------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------

	/**
	 * Public functions (methods):
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
	 * @property {object} - List of included features in current bundle, each property represent one feature and value is initialisation
	 * function of the feature, so it can be initialised later
	 */

	$C.features = {};

	/* Optional files content goes here! */

	/**
	 * Initialise JS.Responsive
	 * @param {Object} [config] - Object with key value pairs of features which will be initialised, if not
	 * provided, all features will be initialised. If you provide empty object, none of features will be initialised.
	 */

	$C.init = function(config) {
		init(config);
	};


	/**
	 * Returns if document is in state that everything is loaded.
	 * @returns {Boolean}
	 */
	$C.isDocumentLoaded = function() {

		return isDocumentLoaded;
	};


	/**
	 * Returns true if user is leaving current page.
	 * @returns {Boolean}
	 */
	$C.isDocumentUnloading = function() {

		return isDocumentUnloading;
	};


	/**
	 * Returns true if page is just scrolled or in scrolling.
	 * @returns {Boolean}
	 */
	$C.isScrolling = function() {

		return isScrolling;
	};


	/**
	 * Returns true if window is focused/active.
	 * @returns {Boolean}
	 */
	$C.isFocused = function() {

		return isWindowFocused;
	};
	
	/**
	 * Sets a new horizontal break point for responsive styling.
	 * @param {String} name - Unique name of given break point. Only lower case letters and comma is allowed /[a-z\-]+/
	 * @param {Number} width - Width size in pixels.
	 * @returns {Object} this - for chaining.
	 * @example JS.Responsive.addHorizontalBreakPoint('medium', 960);
	 */
	$C.addHorizontalBreakPoint = function( name, width ) {
		addBreakPoint(name, width, horizontalSizes, WIDTH_STRING);
		return this;
	};

	
	/**
	 * Removes a horizontal break point for responsive styling.
	 * @param {String} name - Existing name of break point.
	 * @returns {Object} this - for chaining.
	 * @example JS.Responsive.removeHorizontalBreakPoint('medium');
	 */
	$C.removeHorizontalBreakPoint = function( name ) {
		removeBreakPoint(name, horizontalSizes);
		return this;
	};
	
	
	/**
	 * Returns name of actual horizontal break point.
	 * @returns {String|null} Name of actual horizontal break point or null if no horizontal break point is set.
	 */
	$C.getActualHorizontalBreakPoint = function() {

		return actualHorizontalBreakPoint || NULL;
	};
	
	
	/**
	 * Disable horizontal break points checking and remove all class names from HTML element.
	 * @param {Boolean} [_leaveActualClasses] - If true, leaves (freezes) actual class names in HTML element.
	 * @returns {Object} this - for chaining.
	 */
	$C.disableHorizontalBreakPoints = function( _leaveActualClasses ) {
		
		if (!_leaveActualClasses)
			removeAllClassesInDimension( horizontalSizes );
		isDisabledHorizontalBreakPoints = TRUE;
		return this;
	};
	
	
	/**
	 * Enable horizontal break points checking (if was disabled before).
	 * @returns {Object} this - for chaining.
	 */
	$C.enableHorizontalBreakPoints = function() {
			
		isDisabledHorizontalBreakPoints = FALSE;
		solveChanges(TRUE);
		return this;
	};
	
	
	/**
	 * Returns if is horizontal break points checking disabled.
	 * @returns {Boolean}
	 */
	$C.isDisabledHorizontalBreakPoints = function() {
		
		return isDisabledHorizontalBreakPoints;
	};
	
	
	/**
	 * Sets a new vertical break point for responsive styling.
	 * @param {String} name - Unique name of given break point. Only lower case letters and comma is allowed /[a-z\-]+/
	 * @param {Number} height - Height size in pixels.
	 * @returns {Object} this - for chaining.
	 * @example JS.Responsive.addVerticalBreakPoint('vertical-medium', 960);
	 */
	$C.addVerticalBreakPoint = function( name, height ) {

		addBreakPoint(name, height, verticalSizes, HEIGHT_STRING);
		return this;
	};

	
	/**
	 * Removes a vertical break point for responsive styling.
	 * @param {String} name - Existing name of break point.
	 * @returns {Object} this - for chaining.
	 * @example JS.Responsive.removeVerticalBreakPoint('vertical-medium');
	 */
	$C.removeVerticalBreakPoint = function( name ) {
		
		removeBreakPoint(name, verticalSizes);
		return this;
	};


	/**
	 * Returns name of actual vertical break point.
	 * @returns {String|null} Name of actual vertical break point or null if no vertical break point is set.
	 */
	$C.getActualVerticalBreakPoint = function() {

		return actualVerticalBreakPoint || NULL;
	};

	
	/**
	 * Disable vertical break points checking and remove all class names from HTML element.
	 * @param {Boolean} [_leaveActualClasses] - If true, leaves (freezes) actual class names in HTML element.
	 * @returns {Object} this - for chaining.
	 */
	$C.disableVerticalBreakPoints = function( _leaveActualClasses ) {
		
		if (!_leaveActualClasses)
			removeAllClassesInDimension( verticalSizes );
		isDisabledVerticalBreakPoints = TRUE;
		return this;
	};
	
	
	/**
	 * Enable vertical break points checking (if was disabled before).
	 * @returns {Object} this - for chaining.
	 */
	$C.enableVerticalBreakPoints = function() {
			
		isDisabledVerticalBreakPoints = FALSE;
		solveChanges(TRUE);
		return this;
	};
	
	
	/**
	 * Returns if is vertical break points checking disabled.
	 * @returns {Boolean}
	 */
	$C.isDisabledVerticalBreakPoints = function() {
		
		return isDisabledVerticalBreakPoints;
	};

	
	/**
	 * Tests if HTML element contains given class names.
	 * @param {...String} - class names
	 * @returns {Boolean}
	 * @example JS.Responsive.is('mobile') === true, when HTML contains "mobile" class
	 * @example JS.Responsive.is('portrait touch') === true, when HTML contains "portrait" and "touch" class
	 * @example JS.Responsive.is('portrait touch', 'mobile') === true, when HTML contains ("portrait" and "touch" class) OR ('mobile')
	 */
	$C.is = function() {

		for (var i=0; i<arguments.length; i++)
			if (hasAllTheseClasses(arguments[i]))
				return TRUE; // if once true then disjunction is true

		return FALSE;
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
	$C.addOnChangeHandler = function( fn ) {
		
		onChangeListeners.push(fn);
		return this;
	};

	
	/**
	 * Unregister event listener for all responsive changes.
	 * @returns {Object} this - for chaining.
	 */
	$C.removeOnChangeHadler = function( fn ) {
		
		for (var i=onChangeListeners.length-1; i>=0; i--)
			if (onChangeListeners[i]===fn)
				onChangeListeners.splice(i,1);
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

	function forEach( array, fn ) {
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

	var htmlElement,
		bodyElement;

	function getElementByTagName( tagName ) {
		return document.getElementsByTagName(tagName)[0];
	}

	function getHtmlElement() {
		if (!htmlElement)
			htmlElement = getElementByTagName('html');
		return htmlElement;
	}

	function getBodyElement() {
		if (!bodyElement)
			bodyElement = getElementByTagName('body');
		return bodyElement;
	}


	function arrayIndex(array, value, _exactMatch) {
		for (var i = 0; i < array.length; i++)
			if ((_exactMatch && array[i] === value) || (!_exactMatch && array[i] == value))
				return i;
		return -1;
	}


	function arrayContains(array, item, _exactMatch) {
		return arrayIndex(array, item, _exactMatch) >= 0;
	}


	function bind(el, eventType, handlerFn) {

		var $this = this,
			fn = function(e) {
				handlerFn.call($this, e || event);
			};
		if (el.addEventListener)
			el.addEventListener(eventType, fn, FALSE);
		else if (el.attachEvent)
			el.attachEvent('on' + eventType, fn);
	}


	function addClass(name) {
		var html = getHtmlElement();
		if (html) {
			if (!isInTransactionClassMode) {
				var className = html.className;
				// remove double spaces and trim
				var classes = className == EMPTY_STRING ?
								[] :
								className
									.replace(/ +/g, SPACE_CHAR)
									.replace(/^\s*|\s*$/g, EMPTY_STRING)
									.split(SPACE_CHAR);

				if (!arrayContains(classes, name)) {
					classes.push(name);
					html.className = classes.join(SPACE_CHAR);
				}
			}
			else
				addTransactionClass(name);
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
			}
			else
				removeTransactionClass(name);
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
		if (arrayContains(removedClasses, name))
			removedClasses.splice(arrayIndex(removedClasses, name), 1);
		// else adds if not already added
		else if (!hasClass(name) && !arrayContains(addedClasses, name))
			addedClasses.push(name);
	}

	function removeTransactionClass(name) {
		// if was added, undo this state
		if (arrayContains(addedClasses, name))
			addedClasses.splice(arrayIndex(addedClasses, name), 1);
		// else adds if not already added
		else if (hasClass(name) && !arrayContains(removedClasses, name))
			removedClasses.push(name);
	}

	function commitTransactionClass() {
		isInTransactionClassMode = FALSE;
		for (var i = 0; i < removedClasses.length; i++)
			removeClass(removedClasses[i]);
		// adding in one punch
		if (addedClasses.length)
			addClass(addedClasses.join(SPACE_CHAR));  //.replace(/^\s*|\s*$/g, EMPTY_STRING)
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
	}

	function isIE() {
		return navigator.appName == 'Microsoft Internet Explorer';
	}

	// @param (String) sizeType - 'width' or 'height'
	function getDocumentSize(sizeType) {
		var el = !isIE() ? getHtmlElement() : getBodyElement();
		return el ? el['offset' + ucFirst(sizeType)] : 0;
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


	function solveChanges( _forceRecalculate ) {

		var change = FALSE;
		
		var ww = getWindowWidth(),
			wh = getWindowHeight(),
			changedWinSize = (ww != lastWinWidth || wh != lastWinHeight);
		change = change || changedWinSize;

		var dw = getDocumentWidth(),
			dh = getDocumentHeight(),
			changedDocSize = (dw != lastDocWidth || dh != lastDocHeight);
		change = change || changedDocSize;

		var changedBreakPoint = FALSE;
		if (changedWinSize || _forceRecalculate)
			changedBreakPoint = solveSizes();
		change = change || changedBreakPoint;

		var actualState = getDocumentState(),
			changedDocumentState = (actualState != lastDocumentState);
		change = change || changedDocumentState;

		// also unload
		var isUnloading = isDocumentUnloading;
		change = change || isUnloading;

		var changedFocusedState = (isWindowFocused != lastFocusedState);
		lastFocusedState = isWindowFocused;
		change = change || changedFocusedState;

		var changedIsScrolling = (isScrolling != lastWasScrolling);
		lastWasScrolling = isScrolling;
		change = change || changedIsScrolling;

		var changedBreakPointHorizontal = changedBreakPoint && lastHorizontalBreakPoint != actualHorizontalBreakPoint,
			changedBreakPointVertical   = changedBreakPoint && lastVerticalBreakPoint != actualVerticalBreakPoint;

		lastWinWidth = ww;
		lastWinHeight = wh;

		lastDocWidth = dw;
		lastDocHeight = dh;

		lastDocumentState = actualState;
		
		if (change) {
			var e = {
				changedWindowSize: changedWinSize,
				changedDocumentSize: changedDocSize,
				
				changedBreakPointHorizontal: changedBreakPointHorizontal,
				changedSizePointHorizontal: changedBreakPointHorizontal,  // due to backward compatibility with v1.0
				
				actualBreakPointHorizontal: actualHorizontalBreakPoint,
				actualSizePointHorizontal: actualHorizontalBreakPoint,  // due to backward compatibility with v1.0
				
				changedBreakPointVertical: changedBreakPointVertical,
				changedSizePointVertical: changedBreakPointVertical,   // due to backward compatibility with v1.0
				
				actualBreakPointVertical: actualVerticalBreakPoint,
				actualSizePointVertical: actualVerticalBreakPoint,   // due to backward compatibility with v1.0
				
				changedDocumentState: changedDocumentState,
				isDocumentUnloading: isUnloading,
				changedWindowFocus: changedFocusedState,
				changedScrolling: changedIsScrolling
			};
			
			if (changedBreakPoint && lastHorizontalBreakPoint != actualHorizontalBreakPoint)
				e.lastBreakPointHorizontal = lastHorizontalBreakPoint;
			
			if (changedBreakPoint && lastVerticalBreakPoint != actualVerticalBreakPoint)
				e.lastBreakPointVertical = lastVerticalBreakPoint;
			
			onchangeHandler(e);
		}		
	}

	// on mobile devices is window size changing while scrolling content - because some panels are hiding
	function checkWindowOrDocumentResize() {
		if (getWindowWidth() != lastWinWidth || getWindowHeight() != lastWinHeight ||
			getDocumentWidth() != lastDocWidth || getDocumentHeight() != lastDocHeight)
			solveChanges();
	}


	var isScrolling = FALSE,
		lastWasScrolling = isScrolling,

		SCROLLING_CLASS = 'scrolling',
		NO_SCROLLING_CLASS = 'no-'+SCROLLING_CLASS,

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
	}

	function timeoutedNoScroll() {
		setNoScrollingClass();
		isScrolling = FALSE;
		solveChanges();
	}

	function setNoScrollingClass() {
		removeClass(SCROLLING_CLASS);
		addClass(NO_SCROLLING_CLASS);
	}

	var lastDocumentState = 'uninitialized';

	function getDocumentState() {
		return isDocumentLoaded ? 'loaded' : document.readyState;
	}

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
			if (newState == 'loaded')
				onceLoaded = TRUE;
			solveChanges();
		}
	}

	var isDocumentLoaded = FALSE,
		docReadyTime;


	function onloadHandler() {
		isDocumentLoaded = TRUE;
		docReadyTime = +(new Date());
		$C.emit('documentReady', docReadyTime);
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

	function onblurHandler( e ) {
		isWindowFocused = FALSE;
		removeClass(WINDOW_FOCUSED_CLASS);
		addClass(WINDOW_BLURED_CLASS);
		solveChanges();
	}

	function onfocusHandler( e ) {
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
			}

			catch(error) {
				errors.push(error);
				if (i+1<onChangeListeners.length) {
					onchangeHandler( e, i+1, errors );
				}
			}
		}
		if (errors.length) {
			// if more errors, we want to print all to console
			if (errors.length>1)
				console.log('All errors in JS.Responsive onchangeHandler:', errors);
			throw errors[0];
		}
	}

	
	var onChangeListeners = [],

		horizontalSizes = [],
		verticalSizes = [];


	function arrayGetIndexOfName( array, name ) {
		for (var i = 0; i < array.length; i++)
			if (array[i].name == name)
				return i;
		return -1;
	}

	
	function addBreakPoint(name, size, sizesArray, sizeAttr) {
		
		var index = arrayGetIndexOfName(sizesArray, name);
		// if does not exists this name
		if (index==-1) {
			var sizeObj = {name: name};
			sizeObj[sizeAttr] = parseInt(size, 10);
			sizesArray.push(sizeObj);
			sizesArray.sort(function( a, b ) { return a[sizeAttr] - b[sizeAttr]; });
			solveChanges(TRUE);
		}
	}
	
	function removeBreakPoint(name, sizesArray) {
		
		var index = arrayGetIndexOfName(sizesArray, name);
		// if does exists this name
		if (index>=0) {
			sizesArray.splice(index,1);
			removeAllClasses(name);
			solveChanges(TRUE);
		}
	}
	
	
	var LESS_APPENDIX = '-less',
		MORE_APPENDIX = '-more';
	
	function removeAllClasses( sizeAttributeName ) {

		removeClass(sizeAttributeName + LESS_APPENDIX);
		removeClass(sizeAttributeName);
		removeClass(sizeAttributeName + MORE_APPENDIX);
	}


	var isDisabledHorizontalBreakPoints = FALSE,
		isDisabledVerticalBreakPoints = FALSE;

	function removeAllClassesInDimension( sizesArray ) {

		forEach(sizesArray, function( size ){
			removeAllClasses( size.name );
		});

	}



	function solveSizes() {

		startTransactionClass();
		
		var arrays = [],
			sizes = [],
			sizeAttributes = [],
			dimensions = [];
			
		if (!isDisabledHorizontalBreakPoints) {
			arrays.push( horizontalSizes );
			sizes.push( getWindowWidth() );
			sizeAttributes.push( WIDTH_STRING );
			dimensions.push( HORIZONTAL_STRING );
		}
		
		if (!isDisabledVerticalBreakPoints) {
			arrays.push( verticalSizes );
			sizes.push( getWindowHeight() );
			sizeAttributes.push( HEIGHT_STRING );
			dimensions.push( VERTICAL_STRING );
		}

		lastHorizontalBreakPoint = actualHorizontalBreakPoint;
		actualHorizontalBreakPoint = EMPTY_STRING;
		lastVerticalBreakPoint = actualVerticalBreakPoint;
		actualVerticalBreakPoint = EMPTY_STRING;

		

		var size,
			nextSize,
			sizeIsEqualToCurrentBreakPoint,
			sizeIsGreaterThanCurrentBreakPoint,
			sizeIsGreaterOrEqualToCurrentBreakPoint,
			thisBreakPointIsLastOne,
			isSmallerThanNextBreakPoint;
		
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

				sizeIsEqualToCurrentBreakPoint = (size[sizeAttributeName] == actualSize);
				sizeIsGreaterThanCurrentBreakPoint = (size[sizeAttributeName] < actualSize);
				sizeIsGreaterOrEqualToCurrentBreakPoint = (size[sizeAttributeName] <= actualSize);
				thisBreakPointIsLastOne = (i == a.length - 1);
				isSmallerThanNextBreakPoint = nextSize && nextSize[sizeAttributeName] > actualSize;
				
				if (sizeIsGreaterOrEqualToCurrentBreakPoint)
					addClass(size.name + MORE_APPENDIX);
				
				if (!firstIn) {
					if (sizeIsEqualToCurrentBreakPoint || (sizeIsGreaterThanCurrentBreakPoint && (thisBreakPointIsLastOne || isSmallerThanNextBreakPoint))) {
						addClass(size.name);
						if (dimensions[k]==HORIZONTAL_STRING)
							actualHorizontalBreakPoint = size.name;
						if (dimensions[k]==VERTICAL_STRING)
							actualVerticalBreakPoint = size.name;
						firstIn = TRUE;
					}
				}

				if (!sizeIsGreaterOrEqualToCurrentBreakPoint)
					addClass(size.name + LESS_APPENDIX);
			}
		}

		commitTransactionClass();

		// returns true if something has changed or false if nothing has changed
		return lastHorizontalBreakPoint != actualHorizontalBreakPoint ||
		       lastVerticalBreakPoint   != actualVerticalBreakPoint;
	}

	/**
	 * Returns true if HTML element contains all given class names (space separated)
	 * @returns {Boolean}
	 */
	function hasAllTheseClasses( classNames ) {

		var classes = classNames.split(SPACE_CHAR);
		for (var i=0; i<classes.length; i++) {
			if (classes[i] != EMPTY_STRING && !hasClass(classes[i]))
					return FALSE;
		}
		return TRUE;
	}

	var listeners = [];

	$C.on = function (type, fn) {
		if(!listeners[type])
			listeners[type] = [];
		listeners[type].push(fn);
	};

	$C.off = function (type, fn) {
		if(!listeners[type])
			return;
		var typeListeners = listeners[type],
			index = typeListeners.indexOf(fn);
		if(index != -1)
			typeListeners.splice(index,1);
	};

	$C.emit = function (type) {

		// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments
		var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
			args.unshift(); // first argument is event type

		if(listeners[type])
			listeners[type].forEach(applyEach);
		if(listeners['all']) // listeners to all event types
			listeners['all'].forEach(applyEach);

		function applyEach(listener) {
			listener.apply(listener, args);
		}

	};

    function missingMethod(feat) {
    	return function(){
			throw Error('Method "' + feat + '" is not available in this bundle!');
		}
    }

	var initWasExecuted;

	function init(cfg) {

		// runs only once
		if (initWasExecuted)
			return;

		initWasExecuted = TRUE;

		var prop;
		if (cfg) // init features by config

			for (prop in cfg) {
				if (cfg.hasOwnProperty(prop)) {
					if ($C.features[prop])  $C.features[prop]();
					else  missingMethod(prop)();
				}
			}
		else // init all available features

			for (prop in $C.features) {
				$C.features[prop].call($C);
			}

		// register onresizeHandler
		bind(window, 'resize', solveChanges);
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

		if (isWindowFocused)
			onfocusHandler();
		else
			onblurHandler();

		setInterval(checkWindowOrDocumentResize, CHECK_DOCUMENT_SIZE_INTERVAL);

		setNoScrollingClass();

		// and run it once
		solveChanges();
	}

	// -------------------------------------------------------------------------------------------------
	// --- INITIALIZATION ------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------

    if(typeof module != 'undefined')
        module.exports = window.JS.Responsive;

})();
