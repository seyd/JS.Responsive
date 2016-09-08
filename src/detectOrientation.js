/**
 * Returns if current device has display landscape oriented (width is larger than height).
 * @returns {Boolean}
 */
$C.isLandscape = function() {

    return getWindowWidth() > getWindowHeight();
};


/**
 * Returns if current device has display portrait oriented (height is larger than width).
 * @returns {Boolean}
 */
$C.isPortrait = function() {

    return !this.isLandscape();
};

$C.features.detectOrientation = initDetectOrientation;


// init detection
function initDetectOrientation() {
    detectOrientation();
    bind(window, 'orientationchange', detectOrientation);
}

// adds "portrait" or "landscape" class
function detectOrientation() {
    var landscape = $C.isLandscape(),
        newValue = landscape ? LANDSCAPE_STRING : PORTRAIT_STRING,
        oldValue = landscape ? PORTRAIT_STRING : LANDSCAPE_STRING;

    $C.emit('changedOrientation', newValue, oldValue);

    if(!hasClass(newValue)){
        addClass(newValue);
        removeClass(oldValue);
    }

    return newValue;
}