/**
 *
 * Detection of touch usage, because some devices are capable of touches even they are equipped with mouse,
 * so user can change usage of both inputs unexpectedly in time.
 * @module focusBlur
 *
 * @custom-class window-focused
 * @custom-class window-blured
 *
 * @emits windowFocused - Arguments: {Boolean} isFocused
 *
 **/

var
    // Opera does not support document.hasFocus()
    isWindowFocused = document.hasFocus ? document.hasFocus() : TRUE,

    WINDOW_FOCUSED_CLASS = 'window-focused',
    WINDOW_BLURED_CLASS = 'window-blured';

/**
 * Returns if document is in state that everything is loaded.
 * @returns {Boolean}
 * @memberof module:focusBlur
 * @alias JS.Responsive.isDocumentLoaded
 */
$C.isDocumentLoaded = function() {

    return isDocumentLoaded;
};


/**
 * Returns true if user is leaving current page.
 * @returns {Boolean}
 * @memberof module:focusBlur
 * @alias JS.Responsive.isDocumentUnloading
 */
$C.isDocumentUnloading = function() {

    return isDocumentUnloading;
};


/**
 * Returns true if window is focused/active.
 * @returns {Boolean}
 * @memberof module:focusBlur
 * @alias JS.Responsive.isFocused
 */
$C.isFocused = function() {

    return isWindowFocused;
};

$C.features.focusBlur = initFB;

function initFB() {
    bind(window, 'blur', onblurHandler);
    bind(window, 'focus', onfocusHandler);

    if (isWindowFocused)
        onfocusHandler();
    else
        onblurHandler();
}

function onblurHandler( e ) {
    isWindowFocused = FALSE;
    removeClass(WINDOW_FOCUSED_CLASS);
    addClass(WINDOW_BLURED_CLASS);
    $C.emit('windowFocused', FALSE);
}

function onfocusHandler( e ) {
    isWindowFocused = TRUE;
    removeClass(WINDOW_BLURED_CLASS);
    addClass(WINDOW_FOCUSED_CLASS);
    $C.emit('windowFocused', TRUE);
}