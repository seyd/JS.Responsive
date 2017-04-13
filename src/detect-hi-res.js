/**
 *
 * Detection of high resolution display
 * @module detect-hi-res
 * @pretty-name Display resolution
 * @teaser Display resolution detection.
 *
 * @custom-class hires-display - applied when display is high resolution DEMO: http://codepen.io/WEZEO/pen/gLEgar
 * @custom-class normal-display - applied when display is lower resolution DEMO: http://codepen.io/WEZEO/pen/gLEgar
 * @custom-class display-pixel-ratio-$$-more - current display pixel ratio is higher then $$ value
 * @custom-class display-pixel-ratio-$$-less - current display pixel ratio is lower or equal then $$ value
 * @example <caption>Example usage of module</caption>
 * #logo {
 *      background-image: url('wezeologo.jpg');
 *
 *      html.hires-display & {
 *        background-image: url('wezeologo-hires.jpg');
 *      }
 *    }
 *
 * */

/**
 * Detects if current device has a high resolution display (such as retina).
 * @returns {Boolean} The return value is not changing in time.
 * @memberof module:detect-hi-res
 * @alias JS.Responsive.isHiResDisplay
 * @since 3.0.0
 */

$C.isHiResDisplay = function () {

	return win.devicePixelRatio > 1;
};

$C._features.detectHiRes = initHiResDisplayDetection;

// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################

// adds "hires-display" or "normal-display" class (once)
function initHiResDisplayDetection() {
	detectHiResDisplay();
	bind( window, 'resize', detectHiResDisplay ); // also zoom and moving to another display triggers this
}

function detectHiResDisplay() {
	// clear previous state
	removeClass( 'display-pixel-ratio-', TRUE ); // remove all classes starting with display-pixel-ratio-
	removeClass( 'normal-display' );
	removeClass( 'hires-display' );

	var ratio = win.devicePixelRatio,
		ratioCeil,
		i;

	addClass( ratio > 1 ? 'hires-display' : 'normal-display' );

	if ( typeof ratio != 'undefined' ) {
		ratioCeil = Math.ceil( ratio );

		for ( i = 0; i <= ratioCeil; i++ ) {
			if ( ratio > i )
				addClass( 'display-pixel-ratio-' + i + '-more' );
			else if ( ratio <= i )
				addClass( 'display-pixel-ratio-' + i + '-less' );

		}
	}
}