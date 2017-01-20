/**
 *
 * Detection of document loading state.
 * @module document-state
 * @pretty-name Document loading
 * @teaser Document loading states detection.
 *
 * @custom-class state-uninitialized - has not started loading yet
 * @custom-class state-loading - is loading
 * @custom-class state-interactive - Has loaded enough and the user can interact with it
 * @custom-class state-complete - fully loaded
 * @custom-class state-loaded - when document is loaded (including all images)
 * @custom-class state-unloading - when document is unloading
 *
 * @emits changedDocumentState - Arguments: {String} - new-state, {String} - old-state, both are states strings like classes but without "state-" prefix
 *
 **/

var isDocumentUnloading = FALSE,

    lastDocumentState = 'uninitialized',
    onceLoaded = FALSE;

/**
 * Returns if document is in state that everything is loaded.
 * @returns {Boolean}
 * @memberof module:document-state
 * @alias JS.Responsive.isDocumentLoaded
 * @since 3.0.0
 */
$C.isDocumentLoaded = function() {

    return isDocumentLoaded;
};


/**
 * Returns true if user is leaving current page.
 * @returns {Boolean}
 * @memberof module:document-state
 * @alias JS.Responsive.isDocumentUnloading
 * @since 3.0.0
 */
$C.isDocumentUnloading = function() {

    return isDocumentUnloading;
};

$C.features.documentState = initDocState;

// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################

function initDocState() {
    bind(document, 'readystatechange', onreadyStateChangeHandler);
    bind(window, 'load', onreadyStateChangeHandler);
    bind(window, 'unload', onunloadHandler);
    bind(window, 'onbeforeunload', onunloadHandler);
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
         unloading - when document is unloading
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
            $C.emit('changedDocumentState', newState, lastDocumentState);
            lastDocumentState = newState;
        }
    }
}

function onunloadHandler() {
    addClass('state-unloading');
    isDocumentUnloading = TRUE;
    $C.emit('documentUnloading');
}
