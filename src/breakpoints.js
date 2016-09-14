
var
    // (ms) how offen is checking the document size (not just window, but content size)
    CHECK_DOCUMENT_SIZE_INTERVAL = 500,

    horizontalSizes = [],
    verticalSizes = [],

    lastWinWidth = 0,
    lastWinHeight = 0,

    lastDocWidth = 0,
    lastDocHeight = 0,

    lastHorizontalBreakPoint = EMPTY_STRING,
    lastVerticalBreakPoint = EMPTY_STRING,

    actualHorizontalBreakPoint = EMPTY_STRING,
    actualVerticalBreakPoint = EMPTY_STRING,

    lastFocusedState = NULL,

    isDisabledHorizontalBreakPoints = FALSE,
    isDisabledVerticalBreakPoints = FALSE,

    LESS_APPENDIX = '-less',
    MORE_APPENDIX = '-more';


/**
 * Sets a new horizontal break point for responsive styling.
 * @param {String} name - Unique name of given break point. Only lower case letters and comma is allowed /[a-z\-]+/
 * @param {Number} width - Width size in pixels.
 * @returns {Object} this - for chaining.
 * @example JS.Responsive.addHorizontalBreakPoint('medium', 960);
 */
$C.addHorizontalBreakPoint = function( name, width ) {
    addBreakPoint(name, width, horizontalSizes, WIDTH_STRING);
    return this;
};


/**
 * Removes a horizontal break point for responsive styling.
 * @param {String} name - Existing name of break point.
 * @returns {Object} this - for chaining.
 * @example JS.Responsive.removeHorizontalBreakPoint('medium');
 */
$C.removeHorizontalBreakPoint = function( name ) {
    removeBreakPoint(name, horizontalSizes);
    return this;
};


/**
 * Returns name of actual horizontal break point.
 * @returns {String|null} Name of actual horizontal break point or null if no horizontal break point is set.
 */
$C.getActualHorizontalBreakPoint = function() {

    return actualHorizontalBreakPoint || NULL;
};


/**
 * Disable horizontal break points checking and remove all class names from HTML element.
 * @param {Boolean} [_leaveActualClasses] - If true, leaves (freezes) actual class names in HTML element.
 * @returns {Object} this - for chaining.
 */
$C.disableHorizontalBreakPoints = function( _leaveActualClasses ) {

    if (!_leaveActualClasses)
        removeAllClassesInDimension( horizontalSizes );
    isDisabledHorizontalBreakPoints = TRUE;
    return this;
};


/**
 * Enable horizontal break points checking (if was disabled before).
 * @returns {Object} this - for chaining.
 */
$C.enableHorizontalBreakPoints = function() {

    isDisabledHorizontalBreakPoints = FALSE;
    solveSizes();
    return this;
};


/**
 * Returns if is horizontal break points checking disabled.
 * @returns {Boolean}
 */
$C.isDisabledHorizontalBreakPoints = function() {

    return isDisabledHorizontalBreakPoints;
};


/**
 * Sets a new vertical break point for responsive styling.
 * @param {String} name - Unique name of given break point. Only lower case letters and comma is allowed /[a-z\-]+/
 * @param {Number} height - Height size in pixels.
 * @returns {Object} this - for chaining.
 * @example JS.Responsive.addVerticalBreakPoint('vertical-medium', 960);
 */
$C.addVerticalBreakPoint = function( name, height ) {

    addBreakPoint(name, height, verticalSizes, HEIGHT_STRING);
    return this;
};


/**
 * Removes a vertical break point for responsive styling.
 * @param {String} name - Existing name of break point.
 * @returns {Object} this - for chaining.
 * @example JS.Responsive.removeVerticalBreakPoint('vertical-medium');
 */
$C.removeVerticalBreakPoint = function( name ) {

    removeBreakPoint(name, verticalSizes);
    return this;
};


/**
 * Returns name of actual vertical break point.
 * @returns {String|null} Name of actual vertical break point or null if no vertical break point is set.
 */
$C.getActualVerticalBreakPoint = function() {

    return actualVerticalBreakPoint || NULL;
};


/**
 * Disable vertical break points checking and remove all class names from HTML element.
 * @param {Boolean} [_leaveActualClasses] - If true, leaves (freezes) actual class names in HTML element.
 * @returns {Object} this - for chaining.
 */
$C.disableVerticalBreakPoints = function( _leaveActualClasses ) {

    if (!_leaveActualClasses)
        removeAllClassesInDimension( verticalSizes );
    isDisabledVerticalBreakPoints = TRUE;
    return this;
};


/**
 * Enable vertical break points checking (if was disabled before).
 * @returns {Object} this - for chaining.
 */
$C.enableVerticalBreakPoints = function() {

    isDisabledVerticalBreakPoints = FALSE;
    solveSizes();
    return this;
};


/**
 * Returns if is vertical break points checking disabled.
 * @returns {Boolean}
 */
$C.isDisabledVerticalBreakPoints = function() {

    return isDisabledVerticalBreakPoints;
};


/**
 * Returns current window width in pixels.
 * @function
 * @returns {Number}
 * @example if (JS.Responsive.getWindowWidth()>JS.Responsive.getWindowHeight()) ...
 */
$C.getWindowWidth = getWindowWidth;



/**
 * Returns current window height in pixels.
 * @function
 * @returns {Number}
 * @example if (JS.Responsive.getWindowWidth()>JS.Responsive.getWindowHeight()) ...
 */
$C.getWindowHeight = getWindowHeight;


/**
 * Returns current document width in pixels (can be smaller than window size because scrollbar reduces it).
 * @function
 * @returns {Number}
 * @example if (JS.Responsive.getDocumentWidth()>JS.Responsive.getDocumentHeight()) ...
 */
$C.getDocumentWidth = getDocumentWidth;


/**
 * Returns current document height in pixels (can be smaller than window size because scrollbar reduces it).
 * @function
 * @returns {Number}
 * @example if (JS.Responsive.getDocumentWidth()>JS.Responsive.getWindowHeight()) ...
 */
$C.getDocumentHeight = getDocumentHeight;

$C.features.breakpoints = initBreakpoints;

// Function definitions:

function initBreakpoints(){
    setInterval(checkWindowOrDocumentResize, CHECK_DOCUMENT_SIZE_INTERVAL);

    bind(window, 'resize', solveSizes);

    // for mobiles - on mobile devices is window size changing while scrolling content - because some panels are hiding
    bind(document, 'touchmove', checkWindowOrDocumentResize);
    bind(document, 'touchend', checkWindowOrDocumentResize);
}

// on mobile devices is window size changing while scrolling content - because some panels are hiding
function checkWindowOrDocumentResize() {
    if (getWindowWidth() != lastWinWidth || getWindowHeight() != lastWinHeight ||
        getDocumentWidth() != lastDocWidth || getDocumentHeight() != lastDocHeight)
        solveSizes();
}

function arrayGetIndexOfName( array, name ) {
    for (var i = 0; i < array.length; i++)
        if (array[i].name == name)
            return i;
    return -1;
}


function addBreakPoint(name, size, sizesArray, sizeAttr) {

    var index = arrayGetIndexOfName(sizesArray, name);
    // if does not exists this name
    if (index==-1) {
        var sizeObj = {name: name};
        sizeObj[sizeAttr] = parseInt(size, 10);
        sizesArray.push(sizeObj);
        sizesArray.sort(function( a, b ) { return a[sizeAttr] - b[sizeAttr]; });
        solveSizes();
    }
}

function removeBreakPoint(name, sizesArray) {

    var index = arrayGetIndexOfName(sizesArray, name);
    // if does exists this name
    if (index>=0) {
        sizesArray.splice(index,1);
        removeAllClasses(name);
        solveSizes();
    }
}

function removeAllClassesInDimension( sizesArray ) {

    forEach(sizesArray, function( size ){
        removeAllClasses( size.name );
    });

}

function removeAllClasses( sizeAttributeName ) {

    removeClass(sizeAttributeName + LESS_APPENDIX);
    removeClass(sizeAttributeName);
    removeClass(sizeAttributeName + MORE_APPENDIX);
}

function solveSizes() {

    startTransactionClass();

    var arrays = [],
        sizes = [],
        sizeAttributes = [],
        dimensions = [];

    if (!isDisabledHorizontalBreakPoints) {
        arrays.push( horizontalSizes );
        sizes.push( getWindowWidth() );
        sizeAttributes.push( WIDTH_STRING );
        dimensions.push( HORIZONTAL_STRING );
    }

    if (!isDisabledVerticalBreakPoints) {
        arrays.push( verticalSizes );
        sizes.push( getWindowHeight() );
        sizeAttributes.push( HEIGHT_STRING );
        dimensions.push( VERTICAL_STRING );
    }

    lastHorizontalBreakPoint = actualHorizontalBreakPoint;
    actualHorizontalBreakPoint = EMPTY_STRING;
    lastVerticalBreakPoint = actualVerticalBreakPoint;
    actualVerticalBreakPoint = EMPTY_STRING;



    var size,
        nextSize,
        sizeIsEqualToCurrentBreakPoint,
        sizeIsGreaterThanCurrentBreakPoint,
        sizeIsGreaterOrEqualToCurrentBreakPoint,
        thisBreakPointIsLastOne,
        isSmallerThanNextBreakPoint;

    // for all dimensions, both 'horizontal' and 'vertical'
    for (var k = 0; k < arrays.length; k++) {

        var actualSize = sizes[k],
            firstIn = FALSE,
            a = arrays[k],
            sizeAttributeName = sizeAttributes[k];

        // for all break points in current dimension
        for (var i = 0; i < a.length; i++) {
            size = a[i];
            nextSize = a[i + 1];
            removeAllClasses(size.name);

            sizeIsEqualToCurrentBreakPoint = (size[sizeAttributeName] == actualSize);
            sizeIsGreaterThanCurrentBreakPoint = (size[sizeAttributeName] < actualSize);
            sizeIsGreaterOrEqualToCurrentBreakPoint = (size[sizeAttributeName] <= actualSize);
            thisBreakPointIsLastOne = (i == a.length - 1);
            isSmallerThanNextBreakPoint = nextSize && nextSize[sizeAttributeName] > actualSize;

            if (sizeIsGreaterOrEqualToCurrentBreakPoint)
                addClass(size.name + MORE_APPENDIX);

            if (!firstIn) {
                if (sizeIsEqualToCurrentBreakPoint || (sizeIsGreaterThanCurrentBreakPoint && (thisBreakPointIsLastOne || isSmallerThanNextBreakPoint))) {
                    addClass(size.name);
                    if (dimensions[k]==HORIZONTAL_STRING)
                        actualHorizontalBreakPoint = size.name;
                    if (dimensions[k]==VERTICAL_STRING)
                        actualVerticalBreakPoint = size.name;
                    firstIn = TRUE;
                }
            }

            if (!sizeIsGreaterOrEqualToCurrentBreakPoint)
                addClass(size.name + LESS_APPENDIX);
        }
    }

    commitTransactionClass();

    if(lastHorizontalBreakPoint != actualHorizontalBreakPoint)
        $C.emit('changedBreakPointHorizontal', actualHorizontalBreakPoint, lastHorizontalBreakPoint);
    if(lastVerticalBreakPoint != actualVerticalBreakPoint)
        $C.emit('changedBreakPointVertical', actualVerticalBreakPoint, lastVerticalBreakPoint);

}
