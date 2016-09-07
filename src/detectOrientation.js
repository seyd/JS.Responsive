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

$C.features.detectOrientation = detectOrientation;


// adds "portrait" or "landscape" class
function detectOrientation() {
    var landscape = $C.isLandscape();
    if (landscape && (hasClass(PORTRAIT_STRING) || !hasClass(LANDSCAPE_STRING))) {
        removeClass(PORTRAIT_STRING);
        addClass(LANDSCAPE_STRING);
        return TRUE;
    }
    if (!landscape && (hasClass(LANDSCAPE_STRING) || !hasClass(PORTRAIT_STRING))) {
        removeClass(LANDSCAPE_STRING);
        addClass(PORTRAIT_STRING);
        return TRUE;
    }
    return FALSE;
}