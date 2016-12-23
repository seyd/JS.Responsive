/**
 *
 * Detection of scroll usage
 * @module isScrolling
 * @pretty-name Scroll usage
 * @teaser Is user scrolling?
 *
 * @custom-class scrolling
 * @custom-class no-scrolling
 *
 * @emits scrollStart
 * @emits scrolling
 * @emits scrollStop
 *
 **/

var
    // how many miliseconds stays class name 'scroll' after scrolling
    // (and than switch to 'no-scroll' class name)
    AFTER_SCROLL_TIMEOUT = 250,

    isScrolling = FALSE,

    SCROLLING_CLASS = 'scrolling',
    NO_SCROLLING_CLASS = 'no-'+SCROLLING_CLASS,

    timeoutedNoScrollProcess;


/**
 * Returns true if page is just scrolled or in scrolling.
 * @returns {Boolean}
 * @memberof module:isScrolling
 * @alias JS.Responsive.isScrolling
 * @since 3.0.0
 */
$C.isScrolling = function() {

    return isScrolling;
};


$C.features.isScrolling = initIsScrolling;

// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################

function initIsScrolling() {
    bind(window, 'scroll', onscrollHandler);
    setNoScrollingClass();
}

function onscrollHandler() {
// -----------------------------------------------------TODO: if IE8 and less - return;  --- no support of "scroll | no-scroll" ----------------------------------
    //if (isIE() --- need version detection --------------
    checkWindowOrDocumentResize();
    clearTimeout(timeoutedNoScrollProcess);
    timeoutedNoScrollProcess = setTimeout(timeoutedNoScroll, AFTER_SCROLL_TIMEOUT);

    if(!isScrolling){
        removeClass(NO_SCROLLING_CLASS);
        addClass(SCROLLING_CLASS);
        $C.emit('scrollStart');
        isScrolling = TRUE;
    }

    $C.emit('scrolling');
}

function timeoutedNoScroll() {
    setNoScrollingClass();
    isScrolling = FALSE;
    checkWindowOrDocumentResize();
    $C.emit('scrollStop');
}

function setNoScrollingClass() {
    removeClass(SCROLLING_CLASS);
    addClass(NO_SCROLLING_CLASS);
}