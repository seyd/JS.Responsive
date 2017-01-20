/**
 *
 * Detection of window focus
 * @module focus-blur
 * @pretty-name Window focus detection
 * @teaser Is window focused or not?
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
 * @since 3.0.0
 */
$C.isDocumentLoaded = function() {

    return isDocumentLoaded;
};


/**
 * Returns true if user is leaving current page.
 * @returns {Boolean}
 * @memberof module:focusBlur
 * @alias JS.Responsive.isDocumentUnloading
 * @since 3.0.0
 */
$C.isDocumentUnloading = function() {

    return isDocumentUnloading;
};


/**
 * Returns true if window is focused/active.
 * @returns {Boolean}
 * @memberof module:focusBlur
 * @alias JS.Responsive.isFocused
 * @since 3.0.0
 */
$C.isFocused = function() {

    return isWindowFocused;
};

$C.features.focusBlur = initFB;

// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################

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