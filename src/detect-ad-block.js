/**
 *
 * Detection of Adblock or kind of ads blocking programs/apps
 * @module detect-ad-block
 * @since 3.0.0
 * @pretty-name Adblock detection
 * @teaser Detect weather user has Adblock enabled.
 *
 * @custom-class ad-block - ad-block detected ( will be changed in next major release to blocker-detected )
 * @custom-class no-ad-block - ad-block not detected ( will be changed in next major release to no-blocker )
 *
 * You can future-proof your code using config on init:
 * @example JS.Responsive.init({
 * 	detectAdblock: {
 * 		adblockDetectedClass: 'blocker-detected',
 * 		noAdblockClass: 'no-blocker',
 * 	},
 * 	all: true
 * });
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
function initDetectAdblock( cfg ) {
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