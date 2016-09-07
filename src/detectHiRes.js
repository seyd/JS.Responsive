/**
 * Detects if current device has a high resolution display (such as retina).
 * @returns {Boolean} The return value is not changing in time.
 */
$C.isHiResDisplay = function() {

    return win.devicePixelRatio > 1;
};

$C.features.detectHiRes = detectHiResDisplay;

// adds "hires-display" or "normal-display" class (once)
function detectHiResDisplay() {
    var ratio = win.devicePixelRatio;
    addClass(ratio>1 ? 'hires-display' : 'normal-display');
    addClass('display-pixel-ratio-'+ratio);
}