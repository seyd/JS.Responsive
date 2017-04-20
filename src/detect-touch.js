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
 * @custom-class touch-points-$$ - touches count
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

	return 'ontouchstart' in document.documentElement
		|| navigator.maxTouchPoints > 0
		|| navigator.msMaxTouchPoints > 0;
};

$C._features.detectTouch = detectTouch;

// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################

// adds "touch" or "no-touch" class (once)
function detectTouch() {

	bind( document, 'touchstart', setNumberOfTouches );
	bind( document, 'touchend', setNumberOfTouches );

	addClass( $C.isTouch() ? 'touch' : 'no-touch' );
}

function setNumberOfTouches( e ) {

	var newCount = e.touches.length,
		newClass = TOUCH_POINTS_TEXT + newCount;

	if ( newCount != actualTouchCount ){

		removeClass( actualTouchClass );

		if ( newCount ){

			addClass( newClass );
			actualTouchClass = newClass;
		}

		$C.emit( 'touchPointsChanged', newCount, actualTouchCount );
		actualTouchCount = newCount;
	}


}