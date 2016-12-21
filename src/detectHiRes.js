/**
 *
 * Detection of high resolution display
 * @module detectHiRes
 *
 * @custom-class hires-display - applied when display is high resolution DEMO: http://codepen.io/WEZEO/pen/gLEgar
 * @custom-class normal-display - applied when display is lower resolution DEMO: http://codepen.io/WEZEO/pen/gLEgar
 * @custom-class display-pixel-ratio-$$ - current display pixel ratio
 * @example <caption>Example usage of module</caption>
 * #logo {
 *      background-image: url('wezeologo.jpg');
 *
 *      html.hires-display & {
 *        background-image: url('wezeologo-hires.jpg');
 *      }
 *    }
 *
 * */

/**
 * Detects if current device has a high resolution display (such as retina).
 * @returns {Boolean} The return value is not changing in time.
 * @memberof module:detectHiRes
 * @alias JS.Responsive.isHiResDisplay
 * @since 3.0.0
 */
$C.isHiResDisplay = function() {

    return win.devicePixelRatio > 1;
};

$C.features.detectHiRes = detectHiResDisplay;

// Function definitions: ######################### ######################### ######################### ######################### ######################### ######################### #########################

// adds "hires-display" or "normal-display" class (once)
function detectHiResDisplay() {
    var ratio = win.devicePixelRatio;
    addClass(ratio>1 ? 'hires-display' : 'normal-display');
    if(typeof ratio != 'undefined')
        addClass('display-pixel-ratio-'+ratio);
}