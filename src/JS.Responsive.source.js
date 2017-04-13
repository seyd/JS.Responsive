/**
 * @license JS.Responsive
 * (c) 2015 WEZEO http://wezeo.com
 * License: MIT
 *
 * @version 3.1.0
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
	if ( !Date.now ) {
		Date.now = function now() {
			return new Date().getTime();
		};
	}

	// Simple version of polyfill Array.prototype.forEach()
	if ( ![].forEach ) {
		Array.prototype.forEach = function ( callback, thisArg ) {
			var len = this.length;
			for ( var i = 0; i < len; i++ ) {
				callback.call( thisArg, this[ i ], i, this )
			}
		};
	}

	// base namespace
	if ( !window.JS )
		window.JS = {};

	// defines and inicialize only once
	if ( JS.Responsive )
		return;


	// -------------------------------------------------------------------------------------------------
	// --- CLASS ---------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------

	/**
	 * Constructor is PRIVATE, client must use only class methods!!!!!
	 * @constructor
	 * @alias JS.Responsive
	 * @since 3.0.0
	 *
	 * @emit documentReady - when document becomes ready
	 *
	 */
	var $C = JS.Responsive = function () {
		throw new Error( "JS.Responsive cannot have instances." );
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
		 * @param {String} autoInit=true
		 * Library auto initialization flag
		 * @private
		 */
		_autoInit = TRUE,

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

	if (document.readyState === "complete") { winLoaded(); }
	else bind( win, 'load', winLoaded );

	// -------------------------------------------------------------------------------------------------	
	// --- PUBLIC --------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------

	/**
	 * Register callback to referenced event type
	 * @param {String} type - type of an event callback will be registered to
	 * @param {Function} fn - callback function called after event occurred
	 * @returns {Object} JS.Responsive - for chaining
	 */
	$C.on = function ( type, fn ) {

		if ( !_listeners[ type ] )
			_listeners[ type ] = [];
		_listeners[ type ].push( fn );
		return $C;

	};

	/**
	 * Unregister callback of referenced event type
	 * @param {String} type - type of an event callback where callback is registered
	 * @param {Function} fn - callback function to be unregistered
	 * @returns {Object} JS.Responsive - for chaining
	 */
	$C.off = function ( type, fn ) {

		if ( !_listeners[ type ] )
			return;
		var typeListeners = _listeners[ type ],
			index = typeListeners.indexOf( fn );
		if ( index != -1 )
			typeListeners.splice( index, 1 );
		return $C;

	};


	/**
	 * Emit event, can be used for emitting custom events too, just register them via JS.Responsive.on method.
	 * @param {String} type - type of an event callback will be registered to
	 * @param {...*} arguments - used when calling callbacks
	 * @returns {Object} JS.Responsive - for chaining
	 */
	$C.emit = function ( type ) {

		// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments
		var args = (arguments.length === 1 ? [ arguments[ 0 ] ] : Array.apply( null, arguments )),
			errors = [];

		args.shift(); // first argument is event type, we temporary remove it
		if ( _listeners[ type ] )
			_listeners[ type ].forEach( applyEach );

		args.unshift( type ); // type added back
		if ( _listeners[ 'all' ] ) // _listeners to all event types
			_listeners[ 'all' ].forEach( applyEach );

		if ( errors.length ) {
			// if more errors, we want to print all to console
			if ( errors.length > 1 )
				console.log( 'All errors in JS.Responsive onchangeHandler:', errors );
			throw errors[ 0 ];
		}

		function applyEach( listener ) {
			try {
				listener.apply( listener, args );
			}
			catch ( error ) {
				errors.push( error );
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
	 * Initialise JS.Responsive, called automatically on document load event, if not prevented by calling `JS.Responsive,disableAutoInit()` in advance
	 * @param {Object} [config] - Object with key value pairs of features which will be initialised, if not
	 * provided, all features will be initialised. If you provide empty object, none of features will be initialised.
	 */

	$C.init = function ( config ) {

		init( config );
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

		for ( var i = 0; i < arguments.length; i++ )
			if ( hasAllTheseClasses( arguments[ i ] ) )
				return TRUE; // if once true then disjunction is true

		return FALSE;

	};

	/**
	 * Disables auto initialization of library, if not called before document load event, the library initialize it selves automatically
	 */
	$C.disableAutoInit = function () {

		_autoInit = FALSE;

	};

	// -------------------------------------------------------------------------------------------------
	// --- OPTIONAL CONTENT ----------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------

	/* Optional files content goes here! */

	// -------------------------------------------------------------------------------------------------
	// --- PRIVATE -------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------

	/**
	 * Returns current window width in pixels.
	 * @returns {Number}.
	 */
	function getWindowWidth() {

		return getWindowSize( WIDTH_STRING );

	}

	/**
	 * Returns current window height in pixels.
	 * @returns {Number}.
	 */
	function getWindowHeight() {

		return getWindowSize( HEIGHT_STRING );

	}

	/**
	 * Returns current document width in pixels (can be smaller than window size because scrollbar reduces it).
	 * @returns {Number}
	 */
	function getDocumentWidth() {

		return getDocumentSize( WIDTH_STRING );

	}

	/**
	 * Returns current document height in pixels (can be smaller than window size because scrollbar reduces it).
	 * @returns {Number}
	 */
	function getDocumentHeight() {

		return getDocumentSize( HEIGHT_STRING );

	}


	// @param (String) sizeType - 'width' or 'height'
	function getDocumentSize( sizeType ) {

		var el = !isIE() ? getHtmlElement() : getBodyElement();
		return el ? el[ 'offset' + ucFirst( sizeType ) ] : 0;

	}

	// @param (String) sizeType - 'width' or 'height'
	function getWindowSize( sizeType ) {

		var ucSizeType = ucFirst( sizeType ),
			size = win[ 'inner' + ucSizeType ],
			docEl = document.documentElement;
		return size || (docEl && docEl[ 'offset' + ucSizeType ] ? docEl[ 'client' + ucSizeType ] : screen[ sizeType ]);

	}

	var htmlElement,
		bodyElement;

	function getElementByTagName( tagName ) {

		return document.getElementsByTagName( tagName )[ 0 ];

	}

	function getHtmlElement() {

		if ( !htmlElement )
			htmlElement = getElementByTagName( 'html' );
		return htmlElement;

	}

	function getBodyElement() {

		if ( !bodyElement )
			bodyElement = getElementByTagName( 'body' );
		return bodyElement;

	}


	function arrayIndex( array, value, _exactMatch ) {

		for ( var i = 0; i < array.length; i++ )
			if ( (_exactMatch && array[ i ] === value) || (!_exactMatch && array[ i ] == value) )
				return i;
		return -1;

	}


	function arrayContains( array, item, _exactMatch ) {

		return arrayIndex( array, item, _exactMatch ) >= 0;

	}


	function arrayRemoveItemsStartingWith( array, startingWith ) {

		var reg = new RegExp( '^' + startingWith );
		for ( var i = 0; i < array.length; i++ )
			if ( array[ i ].match( reg ) ) {
				array.splice( i, 1 );
				i--; // because of splice
			}

	}


	function bind( el, eventType, handlerFn ) {

		if ( el.addEventListener )
			el.addEventListener( eventType, fn, FALSE );
		else if ( el.attachEvent )
			el.attachEvent( 'on' + eventType, fn );

		function fn( e ) {
			handlerFn.call( NULL, e || event );
		}

		return fn;

	}


	function unbind( el, eventType, handlerFn ) {

		if ( el.removeEventListener )
			el.removeEventListener( eventType, handlerFn, FALSE );
		else if ( el.detachEvent )
			el.detachEvent( 'on' + eventType, handlerFn );

	}


	function addClass( name ) {

		var html = getHtmlElement();
		if ( !html ) return FALSE;

		if ( !isInTransactionClassMode ) {
			var className = html.className;
			// remove double spaces and trim
			var classes = className == EMPTY_STRING ?
				[] :
				className
					.replace( / +/g, SPACE_CHAR )
					.replace( /^\s*|\s*$/g, EMPTY_STRING )
					.split( SPACE_CHAR );

			if ( !arrayContains( classes, name ) ) {
				classes.push( name );
				html.className = classes.join( SPACE_CHAR );
			}
			else
				return FALSE;
		}
		else
			addTransactionClass( name );

		return TRUE; // class added
	}

	function removeClass( name, startsWith ) {

		var html = getHtmlElement();
		if ( html && name ) {
			if ( !isInTransactionClassMode ) {
				var className = html.className,
					classes = className == EMPTY_STRING ? [] : className.split( SPACE_CHAR );

				if ( startsWith ) {
					if ( className.indexOf( name ) == -1 )
						return;
					arrayRemoveItemsStartingWith( classes, name );
					html.className = classes.join( SPACE_CHAR );
				} else if ( arrayContains( classes, name ) ) {
					classes.splice( arrayIndex( classes, name ), 1 );
					html.className = classes.join( SPACE_CHAR );
				}
			}
			else
				removeTransactionClass( name );
		}

	}

	function hasClass( name ) {

		var html = getHtmlElement();
		if ( html ) {
			var classes = html.className.split( SPACE_CHAR );
			return arrayContains( classes, name );
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

	function addTransactionClass( name ) {
		// if was removed, undo this state
		if ( arrayContains( removedClasses, name ) )
			removedClasses.splice( arrayIndex( removedClasses, name ), 1 );
		// else adds if not already added
		else if ( !hasClass( name ) && !arrayContains( addedClasses, name ) )
			addedClasses.push( name );
	}

	function removeTransactionClass( name ) {
		// if was added, undo this state
		if ( arrayContains( addedClasses, name ) )
			addedClasses.splice( arrayIndex( addedClasses, name ), 1 );
		// else adds if not already added
		else if ( hasClass( name ) && !arrayContains( removedClasses, name ) )
			removedClasses.push( name );
	}

	function commitTransactionClass() {
		isInTransactionClassMode = FALSE;
		for ( var i = 0; i < removedClasses.length; i++ )
			removeClass( removedClasses[ i ] );
		// adding in one punch
		if ( addedClasses.length )
			addClass( addedClasses.join( SPACE_CHAR ) );  //.replace(/^\s*|\s*$/g, EMPTY_STRING)
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
	function ucFirst( str ) {
		return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
	}

	function isIE() {
		return navigator.appName == 'Microsoft Internet Explorer';
	}

	var isDocumentLoaded = FALSE,
		docReadyTime;


	function winLoaded() {

		isDocumentLoaded = TRUE;
		docReadyTime = +(new Date());

		if (!initWasExecuted && _autoInit)
			init();
		
		$C.emit( 'documentReady', docReadyTime );
	}


	/**
	 * Returns true if HTML element contains all given class names (space separated)
	 * @returns {Boolean}
	 */
	function hasAllTheseClasses( classNames ) {

		var classes = classNames.split( SPACE_CHAR );
		for ( var i = 0; i < classes.length; i++ ) {
			if ( classes[ i ] != EMPTY_STRING && !hasClass( classes[ i ] ) )
				return FALSE;
		}
		return TRUE;
	}

	function missingMethod( method ) {
		return function () {
			throw Error( 'Method "' + method + '" is not available in this bundle!' );
		}
	}

	var initWasExecuted;

	function init( cfg ) {

		// runs only once
		if ( initWasExecuted )
			return;

		initWasExecuted = TRUE;

		var prop;
		if ( cfg ) // init features by config

			for ( prop in cfg ) {
				if ( cfg.hasOwnProperty( prop ) ) {
					if ( $C._features[ prop ] )
						$C._features[ prop ]( prop );
					else  missingMethod( prop )();
				}
			}
		else // init all available features

			for ( prop in $C._features ) {
				$C._features[ prop ].call( $C );
			}

	}

	// -------------------------------------------------------------------------------------------------
	// --- INITIALIZATION ------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------

	if ( typeof module != 'undefined' )
		module.exports = $C;

})();
