
var isDocumentUnloading = FALSE,

    // Opera does not support document.hasFocus()
    isWindowFocused = document.hasFocus ? document.hasFocus() : TRUE,

    WINDOW_FOCUSED_CLASS = 'window-focused',
    WINDOW_BLURED_CLASS = 'window-blured',

    lastDocumentState = 'uninitialized',
    onceLoaded = FALSE;

/**
 * Returns if document is in state that everything is loaded.
 * @returns {Boolean}
 */
$C.isDocumentLoaded = function() {

    return isDocumentLoaded;
};


/**
 * Returns true if user is leaving current page.
 * @returns {Boolean}
 */
$C.isDocumentUnloading = function() {

    return isDocumentUnloading;
};


/**
 * Returns true if window is focused/active.
 * @returns {Boolean}
 */
$C.isFocused = function() {

    return isWindowFocused;
};

$C.features.loadFocusBlur = initLFB;

function initLFB() {
    bind(document, 'readystatechange', onreadyStateChangeHandler);
    bind(window, 'load', onreadyStateChangeHandler);
    bind(window, 'unload', onunloadHandler);
    bind(window, 'onbeforeunload', onunloadHandler);
    bind(window, 'blur', onblurHandler);
    bind(window, 'focus', onfocusHandler);

    if (isWindowFocused)
        onfocusHandler();
    else
        onblurHandler();
}

function getDocumentState() {
    return isDocumentLoaded ? 'loaded' : document.readyState;
}

function onreadyStateChangeHandler() {
    if (!onceLoaded) {
        /*
         ---uncommnon states----------------------------------------------------------------
         uninitialized - Has not started loading yet
         loading - Is loading
         ---common states-------------------------------------------------------------------
         interactive - Has loaded enough and the user can interact with it
         complete - Fully loaded
         ---custom state--------------------------------------------------------------------
         loaded - when document is loaded (including all images)
         state-unloading - when document is unloading
         */
        removeClass('state-uninitialized');
        removeClass('state-loading');
        removeClass('state-interactive');
        // 'state-complete' sa nebude odstranovat
        var newState = getDocumentState();
        addClass('state-' + newState);
        if (newState == 'loaded')
            onceLoaded = TRUE;

        if (newState != lastDocumentState){
            $C.emit('documentState', newState, lastDocumentState);
            lastDocumentState = newState;
        }
    }
}

function onunloadHandler() {
    addClass('state-unloading');
    isDocumentUnloading = TRUE;
    $C.emit('documentUnloading');
}

function onblurHandler( e ) {
    isWindowFocused = FALSE;
    removeClass(WINDOW_FOCUSED_CLASS);
    addClass(WINDOW_BLURED_CLASS);
    $C.emit('windowBlur');
}

function onfocusHandler( e ) {
    isWindowFocused = TRUE;
    removeClass(WINDOW_BLURED_CLASS);
    addClass(WINDOW_FOCUSED_CLASS);
    $C.emit('windowFocus');
}