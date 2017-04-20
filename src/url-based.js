/**
 *
 * Url related classes representing url path.
 * @module url-based
 * @since 3.2.0
 * @pretty-name Url related classes
 * @teaser Classes representing url path.
 *
 * @custom-class page---$pathItem--$pathItem... - 'page-' is class name base identificator and then every '/item' is represented as '--item' in class
 * @custom-class hash---$pathItem--$pathItem... - same like page but for hash part of url
 *
 * @emits changedUrl - Arguments: {String} newUrl, {String} lastUrl
 *
 **/

var actualUrlClasses = {};

/**
 * Method for use cases of SPA routers which dynamically changes url via js. If your router uses # before
 * navigation urls, like mypage.com/#/my/router/url. Then you don't need to use this method, as library is
 * listening on window hashchange event. And generates `hash-` classes accordingly.
 * @memberof module:url-based
 * @alias JS.Responsive.urlChanged
 * @since 3.2.0
 * @example JS.Responsive.urlChanged( '/my/router/url' );
 */
$C.urlChanged = checkUrlChanges;

$C._features.urlBased = initUrlBased;

// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################

function initUrlBased() {

	bind( win, 'popstate', checkUrlChanges );
	bind( win, 'hashchange', checkUrlChanges );
	checkUrlChanges();
}

function checkUrlChanges() {

	_checkUrlChanges( 'pathname', 'page-', 'pageUrlChanged' );
	_checkUrlChanges( 'hash', 'hash-', 'hashUrlChanged' );
}

function _checkUrlChanges( prop, prefix, evtName ) {

	var converted = parseUrlItems( win.location[ prop ] ),
		newClass = prefix + converted;

	if ( !converted || newClass == actualUrlClasses[ prop ] ) return;

	removeClass( actualUrlClasses[ prop ] );
	addClass( newClass );

	$C.emit( evtName, newClass, actualUrlClasses[ prop ] );
	actualUrlClasses[ prop ] = newClass;
}

function parseUrlItems( path ) {

	if ( path == '/' ) return FALSE;

	var parsed = path.split( '/' );

	parsed.shift(); // remove first item ""

	return parsed.reduce( function ( result, item ) {

		return result += '--' + item;
	}, '');
}