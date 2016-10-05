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
$C.isTouch = function() {

    return 'ontouchstart' in document.documentElement;
};

$C.features.detectTouch = detectTouch;

// adds "touch" or "no-touch" class (once)
function detectTouch() {
    addClass($C.isTouch() ? 'touch' : 'no-touch');
}