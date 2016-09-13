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
	 */


	 
	// -------------------------------------------------------------------------------------------------
	// --- CONFIG --------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------
	
	var
		// how many miliseconds stays class name 'scroll' after scrolling
		// (and than switch to 'no-scroll' class name)
		AFTER_SCROLL_TIMEOUT = 250,

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
		 * Storing listeners types and callback functions
		 * structure:
		 * {
		 * 	eventTypeName: [callbackFn, ...],
		 * 	eventTypeName: [callbackFn, ...],
		 * 	...
		 * 	eventTypeName: [callbackFn, ...]
		 * }
		 */
		listeners = {};
	
	// -------------------------------------------------------------------------------------------------	
	// --- PUBLIC --------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------

	/**
	 * Register callback to referenced event type
	 * @param {String} type - type of an event callback will be registered to
	 * @param {Function} fn - callback function called after event occurred
	 */
	$C.on = function (type, fn) {
		if(!listeners[type])
			listeners[type] = [];
		listeners[type].push(fn);
	};

	/**
	 * Unregister callback of referenced event type
	 * @param {String} type - type of an event callback where callback is registered
	 * @param {Function} fn - callback function to be unregistered
	 */
	$C.off = function (type, fn) {
		if(!listeners[type])
			return;
		var typeListeners = listeners[type],
			index = typeListeners.indexOf(fn);
		if(index != -1)
			typeListeners.splice(index,1);
	};


	/**
	 * Emit event, can be used for emitting custom events too, just register them via JS.Responsive.on method.
	 * @param {String} type - type of an event callback will be registered to
	 * @param {...*} arguments - used when calling callbacks
	 */
	$C.emit = function (type) {

		// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments
		var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)),
			errors = [];

		args.unshift(); // first argument is event type

		if(listeners[type])
			listeners[type].forEach(applyEach);
		if(listeners['all']) // listeners to all event types
			listeners['all'].forEach(applyEach);

		if (errors.length) {
			// if more errors, we want to print all to console
			if (errors.length>1)
				console.log('All errors in JS.Responsive onchangeHandler:', errors);
			throw errors[0];
		}

		function applyEach(listener) {
			try {
				listener.apply(listener, args);
			}
			catch(error) {
				errors.push(error);
			}
		}

	};

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
	
	// -------------------------------------------------------------------------------------------------
	// --- PRIVATE -------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------

	function forEach( array, fn ) {
		if(Array.prototype.forEach)
			array.forEach(fn);
		else
			for (var i = 0; i < array.length; i++)
				// calls on array (this == array) and
				// first argument is current array item,
				// second argument is current index
				fn.call(array, array[i], i, array);
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

		if (el.addEventListener)
			el.addEventListener(eventType, fn, FALSE);
		else if (el.attachEvent)
			el.attachEvent('on' + eventType, fn);

		function fn(e) {
			handlerFn.call(NULL, e || event);
		}
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

	function isIE() {
		return navigator.appName == 'Microsoft Internet Explorer';
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
		// solveChanges();
	}

	function timeoutedNoScroll() {
		setNoScrollingClass();
		isScrolling = FALSE;
		// solveChanges();
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
			// solveChanges();
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
	}


	// Opera does not support document.hasFocus()
	var isWindowFocused = document.hasFocus ? document.hasFocus() : TRUE;

	var WINDOW_FOCUSED_CLASS = 'window-focused',
		WINDOW_BLURED_CLASS = 'window-blured';

	function onblurHandler( e ) {
		isWindowFocused = FALSE;
		removeClass(WINDOW_FOCUSED_CLASS);
		addClass(WINDOW_BLURED_CLASS);
		// solveChanges();
	}

	function onfocusHandler( e ) {
		isWindowFocused = TRUE;
		removeClass(WINDOW_BLURED_CLASS);
		addClass(WINDOW_FOCUSED_CLASS);
		// solveChanges();
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
					if ($C.features[prop]) 
						$C.features[prop](prop);
					else  missingMethod(prop)();
				}
			}
		else // init all available features

			for (prop in $C.features) {
				$C.features[prop].call($C);
			}

		// register onresizeHandler
		// bind(window, 'resize', solveChanges);
		bind(window, 'scroll', onscrollHandler);

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

		setNoScrollingClass();
	}

	// -------------------------------------------------------------------------------------------------
	// --- INITIALIZATION ------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------

    if(typeof module != 'undefined')
        module.exports = window.JS.Responsive;

})();
