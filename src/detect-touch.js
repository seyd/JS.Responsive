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
 * */

/**
 * Detects if current device supports touch events.
 * @returns {Boolean} The return value is not changing in time.
 * @memberof module:detect-touch
 * @alias JS.Responsive.isTouch
 * @since 3.0.0
 */
$C.isTouch = function() {

    return 'ontouchstart' in window ||      // works on most browsers 
			navigator.maxTouchPoints;       // works on IE10/11 and Surface
};

$C.features.detectTouch = detectTouch;

// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################

// adds "touch" or "no-touch" class (once)
function detectTouch() {
    addClass($C.isTouch() ? 'touch' : 'no-touch');
}