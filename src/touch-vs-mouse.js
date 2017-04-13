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

$C.features.isScrolling = initTouchVsMouse;

// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################

function initTouchVsMouse() {
	bind( document, 'touchstart', function () {
		touchVsMouseLastTime = Date.now();
		if ( touchVsMouseUsingTouch )
			return;

		touchVsMouseUsingTouch = TRUE;
		addClass( 'user-is-using-touch' );
		removeClass( 'user-is-using-mouse' );
		$C.emit( 'changedUsingTouch', TRUE );
	} );

	bind( document, 'mousemove', mouseHandler );
	bind( document, 'mousedown', mouseHandler );
}

function mouseHandler() {
	if ( touchVsMouseUsingTouch === FALSE || Date.now() - touchVsMouseLastTime < 1000 )
		return;

	touchVsMouseUsingTouch = FALSE;
	addClass( 'user-is-using-mouse' );
	removeClass( 'user-is-using-touch' );
	$C.emit( 'changedUsingTouch', FALSE );
}