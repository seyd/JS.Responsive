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
	 * @license JS.Responsive v3.0.0
	 * (c) 2015 WEZEO http://wezeo.com
	 * License: MIT
	 *
	 * @version 3.0.0
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
	     * @constructor
	     * @alias JS.Responsive
	     */
	    var $C = JS.Responsive = function () {
	        throw new Error("JS.Responsive cannot have instances.");
	    };
	
	    /**
	     * Library version
	     * @const {String}
	     */
	    $C.version = '3.0.0';
	
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
	     * @returns {Object} JS.Responsive - for chaining
	     */
	    $C.on = function (type, fn) {
	        if (!listeners[type]) listeners[type] = [];
	        listeners[type].push(fn);
	        return $C;
	    };
	
	    /**
	     * Unregister callback of referenced event type
	     * @param {String} type - type of an event callback where callback is registered
	     * @param {Function} fn - callback function to be unregistered
	     * @returns {Object} JS.Responsive - for chaining
	     */
	    $C.off = function (type, fn) {
	        if (!listeners[type]) return;
	        var typeListeners = listeners[type],
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
	
	        args.unshift(); // first argument is event type
	
	        if (listeners[type]) forEach(listeners[type], applyEach);
	        if (listeners['all']) // listeners to all event types
	            forEach('all', applyEach);
	
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
	     * @property {object} - List of included features in current bundle, each property represent one feature and value is initialisation
	     * function of the feature, so it can be initialised later
	     */
	
	    $C.features = {};
	
	    /**
	    *
	    * @module isMobile
	    *
	    * */
	
	    /**
	     * Detects mobile browser - if device is a mobile device.
	     * @todo Find out if mobile is just a phone or tablet also...
	     * @returns {Boolean} The return value is not changing in time.
	     * @memberof module:isMobile
	     * @alias JS.Responsive.addHorizontalBreakPoint
	     */
	
	    function www_detectmobilebrowsers_com() {
	        // from http://detectmobilebrowsers.com/
	        // last update 2015-12-29 --- IMPORTANT: new version redirects page to 'http://detectmobilebrowser.com/mobile', so I replaced it by return 'window.location = MOBILE_WEBSITE' with ';'
	        return function (a) {
	            return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
	            );
	        }(navigator.userAgent || navigator.vendor || window.opera);
	    }
	
	    $C.features.isMobile = detectMobile;
	
	    // adds "mobile" or "desktop" class (once)
	    function detectMobile() {
	
	        addClass(www_detectmobilebrowsers_com() ? 'mobile' : 'desktop');
	    }
	    /**
	     *
	     * @module isScrolling
	     *
	     * */
	
	    var
	    // how many miliseconds stays class name 'scroll' after scrolling
	    // (and than switch to 'no-scroll' class name)
	    AFTER_SCROLL_TIMEOUT = 250,
	        isScrolling = FALSE,
	        SCROLLING_CLASS = 'scrolling',
	        NO_SCROLLING_CLASS = 'no-' + SCROLLING_CLASS,
	        timeoutedNoScrollProcess;
	
	    /**
	     * Returns true if page is just scrolled or in scrolling.
	     * @returns {Boolean}
	     * @memberof module:isScrolling
	     * @alias JS.Responsive.isScrolling
	     */
	    $C.isScrolling = function () {
	
	        return isScrolling;
	    };
	
	    $C.features.isScrolling = initIsScrolling;
	
	    function initIsScrolling() {
	        bind(window, 'scroll', onscrollHandler);
	        setNoScrollingClass();
	    }
	
	    function onscrollHandler() {
	        // -----------------------------------------------------TODO: if IE8 and less - return;  --- no support of "scroll | no-scroll" ----------------------------------
	        //if (isIE() --- need version detection --------------
	        checkWindowOrDocumentResize();
	        clearTimeout(timeoutedNoScrollProcess);
	        timeoutedNoScrollProcess = setTimeout(timeoutedNoScroll, AFTER_SCROLL_TIMEOUT);
	
	        if (!isScrolling) {
	            removeClass(NO_SCROLLING_CLASS);
	            addClass(SCROLLING_CLASS);
	            $C.emit('scrollStart');
	            isScrolling = TRUE;
	        }
	
	        $C.emit('scrolling');
	    }
	
	    function timeoutedNoScroll() {
	        setNoScrollingClass();
	        isScrolling = FALSE;
	        checkWindowOrDocumentResize();
	        $C.emit('scrollStop');
	    }
	
	    function setNoScrollingClass() {
	        removeClass(SCROLLING_CLASS);
	        addClass(NO_SCROLLING_CLASS);
	    }
	    /**
	     *
	     * @module loadFocusBlur
	     *
	     * */
	
	    var isDocumentUnloading = FALSE,
	
	
	    // Opera does not support document.hasFocus()
	    isWindowFocused = document.hasFocus ? document.hasFocus() : TRUE,
	        WINDOW_FOCUSED_CLASS = 'window-focused',
	        WINDOW_BLURED_CLASS = 'window-blured',
	        lastDocumentState = 'uninitialized',
	        onceLoaded = FALSE;
	
	    /**
	     * Returns if document is in state that everything is loaded.
	     * @returns {Boolean}
	     * @memberof module:loadFocusBlur
	     * @alias JS.Responsive.addHorizontalBreakPoint
	     */
	    $C.isDocumentLoaded = function () {
	
	        return isDocumentLoaded;
	    };
	
	    /**
	     * Returns true if user is leaving current page.
	     * @returns {Boolean}
	     * @memberof module:loadFocusBlur
	     * @alias JS.Responsive.addHorizontalBreakPoint
	     */
	    $C.isDocumentUnloading = function () {
	
	        return isDocumentUnloading;
	    };
	
	    /**
	     * Returns true if window is focused/active.
	     * @returns {Boolean}
	     * @memberof module:loadFocusBlur
	     * @alias JS.Responsive.addHorizontalBreakPoint
	     */
	    $C.isFocused = function () {
	
	        return isWindowFocused;
	    };
	
	    $C.features.loadFocusBlur = initLFB;
	
	    function initLFB() {
	        bind(document, 'readystatechange', onreadyStateChangeHandler);
	        bind(window, 'load', onreadyStateChangeHandler);
	        bind(window, 'unload', onunloadHandler);
	        bind(window, 'onbeforeunload', onunloadHandler);
	        bind(window, 'blur', onblurHandler);
	        bind(window, 'focus', onfocusHandler);
	
	        if (isWindowFocused) onfocusHandler();else onblurHandler();
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
	             state-unloading - when document is unloading
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
	
	    function onblurHandler(e) {
	        isWindowFocused = FALSE;
	        removeClass(WINDOW_FOCUSED_CLASS);
	        addClass(WINDOW_BLURED_CLASS);
	        $C.emit('windowBlur');
	    }
	
	    function onfocusHandler(e) {
	        isWindowFocused = TRUE;
	        removeClass(WINDOW_BLURED_CLASS);
	        addClass(WINDOW_FOCUSED_CLASS);
	        $C.emit('windowFocus');
	    }
	    /**
	     *
	     * @module detectAgent
	     *
	     */
	
	    /** Set watching given browser and its version
	     * @param {String} browser - browser name, see function getAgentData() attribute "identity"
	     * @param {Number} version - browser version number
	     * @returns {Object} this - for chaining.
	     * @example JS.Responsive.watchBrowserVersion('Webkit', 530);
	     * @example JS.Responsive.watchBrowserVersion('Chrome', 47);
	     * @example JS.Responsive.watchBrowserVersion('MSIE', 10);
	     * @example JS.Responsive.watchBrowserVersion('Edge', 12);
	     * @memberof module:detectAgent
	     * @alias JS.Responsive.watchBrowserVersion
	     */
	    $C.watchBrowserVersion = function (browser, version) {
	
	        var agentData = findAgentDataByBrowserName(browser);
	
	        if (agentData) addBrowserVersionClasses(agentData, version);else throw new Error("Browser '" + browser + "' was not found.");
	
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
	     * @memberof module:detectAgent
	     * @alias JS.Responsive.getPlatformInfo
	     */
	    $C.getPlatformInfo = function () {
	
	        return detectAgentPlatform(TRUE);
	    };
	    /**
	     * Returns browser tags
	     * @returns {Array} all browser tags strings in Array.
	     * @method
	     * @memberof module:detectAgent
	     * @alias JS.Responsive.getAgentTags
	     **/
	
	    $C.getAgentTags = getAgentTags;
	
	    $C.features.detectAgent = detectAgentPlatform;
	
	    // Declarations:
	
	    function findAgentDataByBrowserName(browser) {
	
	        var data = getAgentData();
	        browser = browser.toLowerCase();
	        for (var i = 0; i < data.length; i++) {
	            if (browser == data[i].identity.toLowerCase()) return data[i];
	        }
	        return NULL;
	    }
	
	    function addBrowserVersionClasses(agentData, version) {
	
	        if (agentData.versionSearch) {
	            var browser = agentData.identity.toLowerCase(),
	                actualVersion = parseFloat(navigator.userAgent.split(agentData.versionSearch || agentData.identity)[1]);
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
	    }
	
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
	                        var version = parseFloat(navigator.userAgent.split(data[i].versionSearch || data[i].identity)[1]);
	
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
	    }
	
	    function getAgentTags() {
	        for (var i = 0, data = getAgentData(), tags = []; i < data.length; i++) tags.push(data[i].identity.toLowerCase());
	        return tags;
	    }
	
	    /**
	     *
	     * @module detectTouch
	     *
	     * */
	
	    /**
	     * Detects if current device supports touch events.
	     * @returns {Boolean} The return value is not changing in time.
	     * @memberof module:detectTouch
	     * @alias JS.Responsive.addHorizontalBreakPoint
	     */
	    $C.isTouch = function () {
	
	        return 'ontouchstart' in document.documentElement;
	    };
	
	    $C.features.detectTouch = detectTouch;
	
	    // adds "touch" or "no-touch" class (once)
	    function detectTouch() {
	        addClass($C.isTouch() ? 'touch' : 'no-touch');
	    }
	    /**
	     *
	     * @module detectHiRes
	     *
	     * */
	
	    /**
	     * Detects if current device has a high resolution display (such as retina).
	     * @returns {Boolean} The return value is not changing in time.
	     * @memberof module:detectHiRes
	     * @alias JS.Responsive.isHiResDisplay
	     */
	    $C.isHiResDisplay = function () {
	
	        return win.devicePixelRatio > 1;
	    };
	
	    $C.features.detectHiRes = detectHiResDisplay;
	
	    // adds "hires-display" or "normal-display" class (once)
	    function detectHiResDisplay() {
	        var ratio = win.devicePixelRatio;
	        addClass(ratio > 1 ? 'hires-display' : 'normal-display');
	        addClass('display-pixel-ratio-' + ratio);
	    }
	    /**
	     *
	     * @module detectOrientation
	     *
	     * */
	
	    /**
	     * Returns if current device has display landscape oriented (width is larger than height).
	     * @returns {Boolean}
	     * @memberof module:detectOrientation
	     * @alias JS.Responsive.addHorizontalBreakPoint
	     */
	    $C.isLandscape = function () {
	
	        return getWindowWidth() > getWindowHeight();
	    };
	
	    /**
	     * Returns if current device has display portrait oriented (height is larger than width).
	     * @returns {Boolean}
	     * @memberof module:detectOrientation
	     * @alias JS.Responsive.addHorizontalBreakPoint
	     */
	    $C.isPortrait = function () {
	
	        return !this.isLandscape();
	    };
	
	    $C.features.detectOrientation = initDetectOrientation;
	
	    // init detection
	    function initDetectOrientation() {
	        detectOrientation();
	        bind(window, 'orientationchange', detectOrientation);
	    }
	
	    // adds "portrait" or "landscape" class
	    function detectOrientation() {
	        var landscape = $C.isLandscape(),
	            newValue = landscape ? LANDSCAPE_STRING : PORTRAIT_STRING,
	            oldValue = landscape ? PORTRAIT_STRING : LANDSCAPE_STRING;
	
	        if (!hasClass(newValue)) {
	            addClass(newValue);
	            removeClass(oldValue);
	        }
	
	        $C.emit('changedOrientation', newValue, oldValue);
	
	        return newValue;
	    }
	    /**
	     *
	     * @module detectDeviceOrientation
	     *
	     * */
	
	    var ORIENTATION_STRING = 'orientation',
	        UC_ORIENTATION_STRING = ucFirst(ORIENTATION_STRING),
	        DEVICE_ORIENTATION_CLASS = 'device-' + ORIENTATION_STRING,
	        LANDSCAPE_APPENDIX = '-' + LANDSCAPE_STRING,
	        PORTRAIT_APPENDIX = '-' + PORTRAIT_STRING,
	        PRIMARY_APPENDIX = '-primary',
	        SECONDARY_APPENDIX = '-secondary',
	        ANGLE_0_APPENDIX = '-0',
	        ANGLE_90_APPENDIX = '-90',
	        ANGLE_180_APPENDIX = '-180',
	        ANGLE_270_APPENDIX = '-270',
	        ORIENTATION_CLASSES = {
	        0: DEVICE_ORIENTATION_CLASS + ANGLE_0_APPENDIX,
	        90: DEVICE_ORIENTATION_CLASS + ANGLE_90_APPENDIX,
	        180: DEVICE_ORIENTATION_CLASS + ANGLE_180_APPENDIX,
	        270: DEVICE_ORIENTATION_CLASS + ANGLE_270_APPENDIX
	    },
	        previousAngle,
	        previousOrientationClass;
	
	    /**
	     * Returns device orientation "portrait" or "landscape".
	     * @returns {String} "portrait" or "landscape"
	     * @memberof module:detectDeviceOrientation
	     * @alias JS.Responsive.getDeviceOrientation
	     */
	    $C.getDeviceOrientation = function () {
	
	        var angle = getDeviceOrientationAngle();
	        return angle == 0 || angle == 180 ? PORTRAIT_STRING : LANDSCAPE_STRING;
	    };
	
	    /**
	     * Returns angle of device orientation 0, 90, 180, 270 in degrees cross clock wise.
	     * @returns {Number} 0, 90, 180, 270
	     * @memberof module:detectDeviceOrientation
	     * @alias JS.Responsive.getDeviceOrientationAngle
	     */
	    $C.getDeviceOrientationAngle = function () {
	
	        return getDeviceOrientationAngle();
	    };
	
	    $C.features.detectDeviceOrientation = initDetectDeviceOrientation;
	
	    // init detection
	    function initDetectDeviceOrientation() {
	        detectDeviceOrientation();
	        $C.on('update', detectDeviceOrientation);
	    }
	
	    // adds "device-orientation-portrait" or "device-orientation-landscape" class  and  "device-orientation-0", "device-orientation-90", "device-orientation-180" or "device-orientation-270" class
	    function detectDeviceOrientation() {
	        var angle = getDeviceOrientationAngle();
	
	        if (angle === previousAngle) // no change!
	            return;
	
	        var newClass = DEVICE_ORIENTATION_CLASS + (angle == 0 || angle == 180 ? PORTRAIT_APPENDIX : LANDSCAPE_APPENDIX),
	            newAngleClass = ORIENTATION_CLASSES[angle],
	            previousAngleClass = ORIENTATION_CLASSES[previousAngle];
	
	        removeClass(previousAngleClass);
	        addClass(newAngleClass);
	
	        previousAngle = angle;
	
	        if (newClass != previousOrientationClass) {
	            removeClass(previousOrientationClass);
	            addClass(newClass);
	
	            previousOrientationClass = newClass;
	
	            $C.emit('changedDeviceOrientation', newClass, previousOrientationClass, newAngleClass, previousAngleClass);
	        }
	
	        $C.emit('changedDeviceOrientationAngle', newAngleClass, previousAngleClass, newClass, previousOrientationClass);
	
	        return newAngleClass;
	    }
	
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
	    }
	
	    /**
	     *
	     * @module timeBased
	     *
	     * */
	
	    var timeBreakPointTimeout, timeBreakPointCurrentName, timeBreakPointsInit, dayTimeCurrent, dayTimePeriod, yearPeriod, lastDayTime, lastDayTimePeriod, lastYearPeriod;
	
	    /**
	     * Returns actual day time period. One of morning, afternoon, evening or night.
	     * @returns {String} Name of actual day time period.
	     * @memberof module:timeBased
	     * @alias JS.Responsive.addHorizontalBreakPoint
	     */
	    $C.getDayTimePeriod = function () {
	
	        return dayTimePeriod;
	    };
	
	    /**
	     * Returns actual year period. One of Spring, Summer, Autumn or Winter.
	     * @returns {String} Name of actual day time period.
	     * @memberof module:timeBased
	     * @alias JS.Responsive.addHorizontalBreakPoint
	     */
	    $C.getYearPeriod = function () {
	
	        return yearPeriod;
	    };
	
	    /**
	     * Sets time brakepoints with classnames and start time value.
	     * @param {Object[]} breakpoints - The employees who are responsible for the project.
	     * @param {string} breakpoints[].name - The name of a breakpoint, this name will be used as className!
	     * @param {Number} breakpoints[].time - The time after document load in [ms], breakpoint name will be applied.
	     * @param {Number|Boolean} [breakpoints[].remains] - The time in [ms], breakpoint name will be removed (optional). Or TRUE value to prevent replacing with next breakpoint.
	     * @example JS.Responsive.setTimeBreakPoints( config )
	     * @memberof module:timeBased
	     * @alias JS.Responsive.addHorizontalBreakPoint
	     */
	    $C.setTimeBreakPoints = function (breakpoints) {
	        var sinceReady;
	        if (docReadyTime) initBreakpoints();else timeBreakPointsInit = initBreakpoints;
	
	        // fn declarations
	        function initBreakpoints() {
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
	
	    $C.features.timeBased = initTimeBased;
	
	    // DECLARATIONS:
	
	    function initTimeBased() {
	        if (docReadyTime) {
	            timeBreakPointsInit();
	            realInitTimeBased();
	        } else {
	            $C.on('documentReady', function () {
	                if (timeBreakPointsInit) timeBreakPointsInit();
	                realInitTimeBased();
	            });
	        }
	    }
	
	    function realInitTimeBased() {
	        var now = new Date();
	        setClasses();
	        if (timeBreakPointsInit) timeBreakPointsInit();
	
	        setInterval(function () {
	            setClasses();
	        }, 60 * 60 * 1000 - (now.getMilliseconds() + now.getSeconds() + now.getMinutes()));
	    }
	
	    // fn definitions
	    function setClasses() {
	
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
	        };
	
	        dayTimeCurrent = 'day-time-' + now.getHours() + 'h';
	        dayTimePeriod = DAYPERIODS[now.getHours()];
	        yearPeriod = getYearPeriod(now);
	
	        if (lastDayTime != dayTimeCurrent) {
	            removeClass(lastDayTime);
	            addClass(dayTimeCurrent);
	            $C.emit('changedDayTime', dayTimeCurrent, lastDayTime);
	            lastDayTime = dayTimeCurrent;
	        }
	        if (lastDayTimePeriod != dayTimePeriod) {
	            removeClass(lastDayTimePeriod);
	            addClass(dayTimePeriod);
	            $C.emit('changedDayPeriod', dayTimePeriod, lastDayTimePeriod);
	            lastDayTimePeriod = dayTimePeriod;
	        }
	        if (lastYearPeriod != yearPeriod) {
	            removeClass(lastYearPeriod);
	            addClass(yearPeriod);
	            $C.emit('changedYearPeriod', yearPeriod, lastYearPeriod);
	            lastYearPeriod = yearPeriod;
	        }
	    }
	
	    function getYearPeriod(date) {
	        var year = date.getFullYear(),
	            firstDates = [{ date: new Date(year, 2, 20), name: 'Spring' }, { date: new Date(year, 5, 21), name: 'Summer' }, { date: new Date(year, 8, 23), name: 'Autumn' }, { date: new Date(year, 11, 21), name: 'Winter' }];
	
	        return testPeriod(0);
	
	        function testPeriod(index) {
	            if (date < firstDates[index].date) {
	                if (!index) // index === 0
	                    return firstDates[3].name;else return firstDates[index - 1].name;
	            } else if (firstDates[++index]) return testPeriod(index);else return firstDates[0].name;
	        }
	    }
	    /**
	     *
	     * @module breakpoints
	     *
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
	        MORE_APPENDIX = '-more';
	
	    /**
	     * Sets a new horizontal break point for responsive styling.
	     * @param {String} name - Unique name of given break point. Only lower case letters and comma is allowed /[a-z\-]+/
	     * @param {Number} width - Width size in pixels.
	     * @returns {Object} this - for chaining.
	     * @example JS.Responsive.addHorizontalBreakPoint('medium', 960);
	     * @memberof module:breakpoints
	     * @alias JS.Responsive.addHorizontalBreakPoint
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
	     */
	    $C.getActualHorizontalBreakPoint = function () {
	
	        return actualHorizontalBreakPoint || NULL;
	    };
	
	    /**
	     * Disable horizontal break points checking and remove all class names from HTML element.
	     * @param {Boolean} [_leaveActualClasses] - If true, leaves (freezes) actual class names in HTML element.
	     * @returns {Object} this - for chaining.
	     * @memberof module:breakpoints
	     * @alias JS.Responsive.disableHorizontalBreakPoints
	     */
	    $C.disableHorizontalBreakPoints = function (_leaveActualClasses) {
	
	        if (!_leaveActualClasses) removeAllClassesInDimension(horizontalSizes);
	        isDisabledHorizontalBreakPoints = TRUE;
	        return this;
	    };
	
	    /**
	     * Enable horizontal break points checking (if was disabled before).
	     * @returns {Object} this - for chaining.
	     * @memberof module:breakpoints
	     * @alias JS.Responsive.enableHorizontalBreakPoints
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
	     */
	    $C.getActualVerticalBreakPoint = function () {
	
	        return actualVerticalBreakPoint || NULL;
	    };
	
	    /**
	     * Disable vertical break points checking and remove all class names from HTML element.
	     * @param {Boolean} [_leaveActualClasses] - If true, leaves (freezes) actual class names in HTML element.
	     * @returns {Object} this - for chaining.
	     * @memberof module:breakpoints
	     * @alias JS.Responsive.disableVerticalBreakPoints
	     */
	    $C.disableVerticalBreakPoints = function (_leaveActualClasses) {
	
	        if (!_leaveActualClasses) removeAllClassesInDimension(verticalSizes);
	        isDisabledVerticalBreakPoints = TRUE;
	        return this;
	    };
	
	    /**
	     * Enable vertical break points checking (if was disabled before).
	     * @returns {Object} this - for chaining.
	     * @memberof module:breakpoints
	     * @alias JS.Responsive.enableVerticalBreakPoints
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
	     */
	    $C.getWindowWidth = getWindowWidth;
	
	    /**
	     * Returns current window height in pixels.
	     * @function
	     * @returns {Number}
	     * @example if (JS.Responsive.getWindowWidth()>JS.Responsive.getWindowHeight()) ...
	     * @memberof module:breakpoints
	     * @alias JS.Responsive.getWindowHeight
	     */
	    $C.getWindowHeight = getWindowHeight;
	
	    /**
	     * Returns current document width in pixels (can be smaller than window size because scrollbar reduces it).
	     * @function
	     * @returns {Number}
	     * @example if (JS.Responsive.getDocumentWidth()>JS.Responsive.getDocumentHeight()) ...
	     * @memberof module:breakpoints
	     * @alias JS.Responsive.getDocumentWidth
	     */
	    $C.getDocumentWidth = getDocumentWidth;
	
	    /**
	     * Returns current document height in pixels (can be smaller than window size because scrollbar reduces it).
	     * @function
	     * @returns {Number}
	     * @example if (JS.Responsive.getDocumentWidth()>JS.Responsive.getWindowHeight()) ...
	     * @memberof module:breakpoints
	     * @alias JS.Responsive.getDocumentHeight
	     */
	    $C.getDocumentHeight = getDocumentHeight;
	
	    $C.features.breakpoints = initBreakpoints;
	
	    // Function definitions:
	
	    function initBreakpoints() {
	        setInterval(checkWindowOrDocumentResize, CHECK_DOCUMENT_SIZE_INTERVAL);
	
	        bind(window, 'resize', solveSizes);
	
	        // for mobiles - on mobile devices is window size changing while scrolling content - because some panels are hiding
	        bind(document, 'touchmove', checkWindowOrDocumentResize);
	        bind(document, 'touchend', checkWindowOrDocumentResize);
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
	
	        forEach(sizesArray, function (size) {
	            removeAllClasses(size.name);
	        });
	    }
	
	    function removeAllClasses(sizeAttributeName) {
	
	        removeClass(sizeAttributeName + LESS_APPENDIX);
	        removeClass(sizeAttributeName);
	        removeClass(sizeAttributeName + MORE_APPENDIX);
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
	
	        if (lastHorizontalBreakPoint != actualHorizontalBreakPoint) $C.emit('changedBreakPointHorizontal', actualHorizontalBreakPoint, lastHorizontalBreakPoint);
	        if (lastVerticalBreakPoint != actualVerticalBreakPoint) $C.emit('changedBreakPointVertical', actualVerticalBreakPoint, lastVerticalBreakPoint);
	    }
	
	    /**
	     * Initialise JS.Responsive
	     * @param {Object} [config] - Object with key value pairs of features which will be initialised, if not
	     * provided, all features will be initialised. If you provide empty object, none of features will be initialised.
	     */
	
	    $C.init = function (config) {
	        init(config);
	        return this;
	    };
	
	    /**
	     * Tests if HTML element contains given class names.
	     * @param {...String} - class names
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
	    // --- PRIVATE -------------------------------------------------------------------------------------
	    // -------------------------------------------------------------------------------------------------
	
	    function forEach(array, fn) {
	        if (Array.prototype.forEach) array.forEach(fn);else for (var i = 0; i < array.length; i++)
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
	
	    function bind(el, eventType, handlerFn) {
	
	        if (el.addEventListener) el.addEventListener(eventType, fn, FALSE);else if (el.attachEvent) el.attachEvent('on' + eventType, fn);
	
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
	
	    function isIE() {
	        return navigator.appName == 'Microsoft Internet Explorer';
	    }
	
	    var isDocumentLoaded = FALSE,
	        docReadyTime;
	
	    function onloadHandler() {
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
	
	    function missingMethod(feat) {
	        return function () {
	            throw Error('Method "' + feat + '" is not available in this bundle!');
	        };
	    }
	
	    var initWasExecuted;
	
	    function init(cfg) {
	
	        // runs only once
	        if (initWasExecuted) return;
	
	        initWasExecuted = TRUE;
	
	        var prop;
	        if (cfg) // init features by config
	
	            for (prop in cfg) {
	                if (cfg.hasOwnProperty(prop)) {
	                    if ($C.features[prop]) $C.features[prop](prop);else missingMethod(prop)();
	                }
	            } else // init all available features
	
	            for (prop in $C.features) {
	                $C.features[prop].call($C);
	            }
	
	        bind(window, 'load', onloadHandler);
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
//# sourceMappingURL=JS.Responsive.full.js.map