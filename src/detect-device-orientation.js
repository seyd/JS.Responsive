/**
 *
 * Detection of device orientation (not orientation of viewport aka width/height ration)
 * @module detect-device-orientation
 * @pretty-name Device orientation
 * @teaser Mobile devices detection.
 *
 * @custom-class device-orientation-portrait
 * @custom-class device-orientation-landscape
 * @custom-class device-orientation-0 - most common state (default for device)
 * @custom-class device-orientation-90 - device is left side down
 * @custom-class device-orientation-180 - upside down
 * @custom-class device-orientation-270 - device is right side down
 *
 * @emits changedDeviceOrientationAngle
 * @emits changedDeviceOrientation
 *
 * */

var ORIENTATION_STRING = 'orientation',
    UC_ORIENTATION_STRING = ucFirst(ORIENTATION_STRING),
    DEVICE_ORIENTATION_CLASS = 'device-'+ORIENTATION_STRING,
    LANDSCAPE_APPENDIX = '-'+LANDSCAPE_STRING,
    PORTRAIT_APPENDIX = '-'+PORTRAIT_STRING,
    PRIMARY_APPENDIX = '-primary',
    SECONDARY_APPENDIX = '-secondary',
    ANGLE_0_APPENDIX = '-0',
    ANGLE_90_APPENDIX = '-90',
    ANGLE_180_APPENDIX = '-180',
    ANGLE_270_APPENDIX = '-270',
    ORIENTATION_CLASSES = {
        0: DEVICE_ORIENTATION_CLASS + ANGLE_0_APPENDIX,
        90: DEVICE_ORIENTATION_CLASS + ANGLE_90_APPENDIX,
        180: DEVICE_ORIENTATION_CLASS + ANGLE_180_APPENDIX,
        270: DEVICE_ORIENTATION_CLASS + ANGLE_270_APPENDIX,
    },
    previousAngle,
    previousOrientationClass;

/**
 * Returns device orientation "portrait" or "landscape".
 * @returns {String} "portrait" or "landscape"
 * @memberof module:detect-device-orientation
 * @alias JS.Responsive.getDeviceOrientation
 * @since 3.0.0
 */
$C.getDeviceOrientation = function() {

    var angle = getDeviceOrientationAngle();
    return angle==0 || angle==180 ? PORTRAIT_STRING : LANDSCAPE_STRING;
};

/**
 * Returns angle of device orientation 0, 90, 180, 270 in degrees cross clock wise.
 * @returns {Number} 0, 90, 180, 270
 * @memberof module:detect-device-orientation
 * @alias JS.Responsive.getDeviceOrientationAngle
 * @since 3.0.0
 */
$C.getDeviceOrientationAngle = function() {

    return getDeviceOrientationAngle();
};

$C.features.detectDeviceOrientation = initDetectDeviceOrientation;


// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################

// init detection
function initDetectDeviceOrientation() {
    detectDeviceOrientation();
    $C.on('update', detectDeviceOrientation);
}

// adds "device-orientation-portrait" or "device-orientation-landscape" class  and  "device-orientation-0", "device-orientation-90", "device-orientation-180" or "device-orientation-270" class
function detectDeviceOrientation() {
    var angle = getDeviceOrientationAngle();

    if(angle === previousAngle) // no change!
        return;

    var newClass = DEVICE_ORIENTATION_CLASS + (angle==0 || angle==180 ? PORTRAIT_APPENDIX : LANDSCAPE_APPENDIX),
        newAngleClass = ORIENTATION_CLASSES[angle],
        previousAngleClass = ORIENTATION_CLASSES[previousAngle];

    removeClass(previousAngleClass);
    addClass(newAngleClass);

    previousAngle = angle;

    if(newClass != previousOrientationClass){
        removeClass(previousOrientationClass);
        addClass(newClass);

        previousOrientationClass = newClass;

        $C.emit('changedDeviceOrientation', newClass, previousOrientationClass, newAngleClass, previousAngleClass);
    }


    $C.emit('changedDeviceOrientationAngle', newAngleClass, previousAngleClass, newClass, previousOrientationClass);

    return newAngleClass;
}


// returns device orientation 0, 90, 180, 270 (degrees cross clock wise)
function getDeviceOrientationAngle() {
    var orientation = 0;
    // win.orientation is deprecated (https://developer.mozilla.org/en-US/docs/Web/API/Window/orientation)
    if (typeof win.orientation == 'number') {
        orientation = win.orientation;
    }
    else {
        var //screenOrientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
            // minification to form:  n=F[We]||F[$+Ee]||F[Z+Ee];
            // in compare to:         n=screen.orientation||screen.mozOrientation||screen.msOrientation;
            screenOrientation = screen[ORIENTATION_STRING] ||
                screen[MOZ_PREFIX + UC_ORIENTATION_STRING] ||
                screen[MS_PREFIX + UC_ORIENTATION_STRING];
        if (screenOrientation) {
            if (typeof screenOrientation == 'string') {
                // is commented because zero is default
                //if (screenOrientation == PORTRAIT_STRING + PRIMARY_APPENDIX)
                //orientation = 0;
                if (screenOrientation == LANDSCAPE_STRING + PRIMARY_APPENDIX)
                    orientation = 90;
                if (screenOrientation == PORTRAIT_STRING + SECONDARY_APPENDIX)
                    orientation = 180;
                if (screenOrientation == LANDSCAPE_STRING + SECONDARY_APPENDIX)
                    orientation = 270;
            }
            else if (screenOrientation.angle) {
                orientation = screenOrientation.angle;
            }
        }
    }
    if (orientation==-90)
        orientation = 270;
    return orientation;
}
