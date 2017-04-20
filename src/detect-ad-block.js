/**
 *
 * Detection of Adblock or kind of ads blocking programs/apps
 * @module detect-ad-block
 * @since 3.0.0
 * @pretty-name Adblock detection
 * @teaser Detect weather user has Adblock enabled.
 *
 * @custom-class ad-block - ad-block detected
 * @custom-class no-ad-block - ad-block not detected
 *
 * @emits changedAdblock
 *
 * */

var isAdblockDetected = false,
	testDivCreated,

	ADBLOCK_STRING = 'ad-block',
	NO_ADBLOCK_STRING = 'no-ad-block';

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
function initDetectAdblock() {
	setTimeout( detectAdblock, 500 );
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
	if ( typeof getComputedStyle !== 'undefined' ) {
		return getComputedStyle( el, null ).getPropertyValue( prop );
	} else {
		return el.currentStyle[ prop ]; // IE < 9
	}
}