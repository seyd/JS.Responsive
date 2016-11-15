/**
*
* @module touchVsMouse
*
**/

/**
 * Returns information if is actually using touches.
 * @returns {Boolean|undefined} Returns true if using touches, false if using mouse, undefined if no use detected yet
 * @memberof module:touchVsMouse
 * @alias JS.Responsive.isUsingTouches
 */


$C.isUsingTouches = function() {
    return touchVsMouseUsingTouch;
};

var touchVsMouseUsingTouch;

bind(document, 'touchstart', function(){
    if(touchVsMouseUsingTouch)
        return;

    touchVsMouseUsingTouch = TRUE;
    addClass('user-is-using-touch');
    removeClass('user-is-using-mouse');
    $C.emit('changedUsingTouch', TRUE, FALSE);
});

bind(document, 'mousemove', mouseHandler);
bind(document, 'mousedown', mouseHandler);

function mouseHandler() {
    if (touchVsMouseUsingTouch === FALSE)
        return;

    touchVsMouseUsingTouch = FALSE;
    addClass('user-is-using-mouse');
    removeClass('user-is-using-touch');
    $C.emit('changedUsingTouch', FALSE, TRUE);
}