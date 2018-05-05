/**
 *
 * Detection of Adblock or kind of ads blocking programs/apps
 * @module detect-ad-block
 * @since 3.0.0
 * @pretty-name Adblock detection
 * @teaser Detect weather user has Adblock enabled.
 *
 * @custom-class blocker-detected - ad-block detected
 * @custom-class no-blocker - ad-block not detected
 *
 * You can set custom classes via config on init:
 * @example JS.Responsive.init({
 * 	detectAdblock: {
 * 		adblockDetectedClass: 'my-custom-blocker-detected',
 * 		noAdblockClass: 'my-custom-no-blocker',
 * 	},
 * 	all: true
 * });
 *
 * @emits changedAdblock
 *
 * */

var isAdblockDetected = false,
	testDivCreated,

	ADBLOCK_STRING = 'blocker-detected',
	NO_ADBLOCK_STRING = 'no-blocker';

/**
 * Returns true if current device has Adblock or similar blocking app installed.
 * @returns {Boolean}
 * @memberof module:detect-ad-block
 * @alias JS.Responsive.isAdblock
 * @since 3.0.0
 */
$C.isAdblock = function () {
	return detectAdblock();
};

$C._features.detectAdblock = initDetectAdblock;

// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################

// init detection
function initDetectAdblock( cfg ) {
	cfg = cfg || {};
	if ( cfg.adblockDetectedClass )
		ADBLOCK_STRING = cfg.adblockDetectedClass
	if ( cfg.noAdblockClass )
		NO_ADBLOCK_STRING = cfg.noAdblockClass
	window.addEventListener('load', detectAdblock );
}

function detectAdblock() {
	createTestDiv();

	// console.log('dingdong', getStyle(testDivCreated, 'display') == 'none', getStyle(testDivCreated, 'width') != '1px', getStyle(testDivCreated, 'height') != '1px');
	isAdblockDetected = getStyle( testDivCreated, 'display' ) == 'none' || getStyle( testDivCreated, 'width' ) != '1px' || getStyle( testDivCreated, 'height' ) != '1px';

	var newValue = isAdblockDetected ? ADBLOCK_STRING : NO_ADBLOCK_STRING,
		oldValue = isAdblockDetected ? NO_ADBLOCK_STRING : ADBLOCK_STRING;

	if ( !hasClass( newValue ) ) {
		addClass( newValue );
		removeClass( oldValue );

		$C.emit( 'changedAdblock', newValue, oldValue );
	}

	return isAdblockDetected;
}

function createTestDiv() {
	if ( testDivCreated ) return;
	testDivCreated = document.createElement( 'div' );
	testDivCreated.style.width = '1px';
	testDivCreated.style.height = '1px';
	testDivCreated.className = 'ad-banner';
	testDivCreated.id = 'ad-banner';
	document.body.appendChild( testDivCreated );
}

function getStyle( el, prop ) {
	// https://stackoverflow.com/questions/46127213/how-to-fix-typeerror-window-getcomputedstyle-is-null-in-firefox?rq=1
	if ( typeof getComputedStyle !== 'undefined' && getComputedStyle( el, null )) {
		return getComputedStyle( el, null ).getPropertyValue( prop );
	} else if ( el.currentStyle ) {
		return el.currentStyle[ prop ]; // IE < 9
	} else {
        return element.style[ prop ];
    }
}