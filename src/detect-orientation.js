/**
 *
 * Detection of viewport orientation (not device physical orientation)
 * @module detect-orientation
 * @pretty-name Viewport orientation
 * @teaser Viewport orientation detection.
 *
 * @custom-class portrait
 * @custom-class landscape
 *
 * @emits changedOrientation
 *
 * */

/**
 * Returns true if current device has display landscape oriented (width is larger than height).
 * @returns {Boolean}
 * @memberof module:detect-orientation
 * @alias JS.Responsive.isLandscape
 * @since 3.0.0
 */
$C.isLandscape = function () {

	return getWindowWidth() > getWindowHeight();
};

/**
 * Returns true if current device has display portrait oriented (height is larger than width).
 * @returns {Boolean}
 * @memberof module:detect-orientation
 * @alias JS.Responsive.isPortrait
 * @since 3.0.0
 */
$C.isPortrait = function () {

	return !this.isLandscape();
};

$C._features.detectOrientation = initDetectOrientation;

// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################

// init detection
function initDetectOrientation() {
	detectOrientation();
	bind( window, 'orientationchange', detectOrientation );
}

// adds "portrait" or "landscape" class
function detectOrientation() {
	var landscape = $C.isLandscape(),
		newValue = landscape ? LANDSCAPE_STRING : PORTRAIT_STRING,
		oldValue = landscape ? PORTRAIT_STRING : LANDSCAPE_STRING;

	if ( !hasClass( newValue ) ) {
		addClass( newValue );
		removeClass( oldValue );
	}

	$C.emit( 'changedOrientation', newValue, oldValue );

	return newValue;
}