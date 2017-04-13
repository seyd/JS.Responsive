/**
 *
 * Detection of window focus
 * @module inactivity
 * @pretty-name Inactivity detection
 * @teaser Be notified that user is inactive
 *
 * @custom-class inactive
 * @custom-class inactive-$timeLimitName$
 *
 * @emits inactive - Arguments: {Number} time in seconds of inactivity
 *
 **/

var
	INACTIVE = 'inactive',
	WATCH_MOUSEMOVE = 5, // time of inactivity in seconds to start watching mouse move as user activity

	inactiveSoonestLimit = { limit: 60 * 1000, name: INACTIVE }, // default 1 min
	inactiveLimits = [ inactiveSoonestLimit ],
	inactiveLimitsMap = { inactive: inactiveSoonestLimit },
	addedInactiveClasses = [],
	inactiveTimeout,
	inactiveMouseTimeout,
	lastActivity,
	mouseMoveWatcher;

/**
 * Set time limit in seconds for considering window as inactive and optionally applying name of a limit if provided.
 * @param {Number} timeLimit - in seconds.
 * @param {String} [name=inactivity] - name of the limit, will be applied as className to window when user reaches the
 * time limit of inactivity. NOTE: The className will be applied with 'inactive-' prefix!, if no name provided, default
 * className 'inactive' will be applied instead.
 * @param {Function} callback - called when timeLimit is reached, `callback(timeLimit, name)`
 *
 * @memberof module:inactivity
 * @alias JS.Responsive.setInactiveTimeLimit
 * @since 3.1.0
 */
$C.setInactiveTimeLimit = function ( timeLimit, name, cb ) {

	var newLimit;

	timeLimit *= 1000;
	name = name || INACTIVE;

	if ( inactiveLimitsMap[ name ] ) {

		inactiveLimitsMap[ name ].limit = timeLimit;
		inactiveLimitsMap[ name ].cb = cb;
	}
	else {

		newLimit = { limit: timeLimit, name: name, cb: cb };
		inactiveLimitsMap[ name ] = newLimit;
		inactiveLimits.push( newLimit );
	}

	sortInactiveLimits();

	inactiveSoonestLimit = inactiveLimits[ 0 ];

};

/**
 * Returns time limit object which is plain object with `limit` property with seconds for time limit asked
 * via optional `name` parameter, if no name is provided, the default 'inactive' object will be returned.
 * @returns {{limit: Number, name: String, cb:Function}}
 *
 * @memberof module:inactivity
 * @alias JS.Responsive.setInactiveTimeLimit
 * @since 3.1.0
 */
$C.getInactiveTimeLimit = function ( name ) {

	name = name || INACTIVE;
	return inactiveLimitsMap[ name ];

};

/**
 * Deletes timeLimit object based on optional `name` parameter, if no name is provided, the default 'inactive' object will be deleted.
 *
 * @memberof module:inactivity
 * @alias JS.Responsive.setInactiveTimeLimit
 * @since 3.1.0
 */
$C.removeInactiveTimeLimit = function ( name ) {

	name = name || INACTIVE;
	inactiveLimits.splice( inactiveLimits.indexOf( inactiveLimitsMap[ name ] ), 1 );
	delete inactiveLimitsMap[ name ];

};

$C.features.inactivity = initInactivity;

// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################

function initInactivity() {

	var baseGroupActivity = [ 'touchstart', 'touchend', 'touchmove', 'mousedown', 'mouseup', 'mousewheel', 'keydown' ];
	baseGroupActivity.forEach( function ( eventName ) {

		bind( document, eventName, onActivityHandler );

	} );

	lastActivity = Date.now();
	$C.setInactiveTimeLimit( WATCH_MOUSEMOVE, 'mouseWatch', inactivityWatchMouseMove );
	sortInactiveLimits();
	inactiveSoonestLimit = inactiveLimits[ 0 ];
	inactiveTimeout = setTimeout( checkIncativity, inactiveSoonestLimit.limit );
}

function inactivityWatchMouseMove() {

	mouseMoveWatcher = bind( document, 'mousemove', onActivityHandler );
}

function checkIncativity() {

	var timeFromLastActivity = Date.now() - lastActivity,
		className;

	if ( timeFromLastActivity >= inactiveSoonestLimit.limit ) {

		className = inactiveSoonestLimit.name == INACTIVE ? INACTIVE : INACTIVE + '-' + inactiveSoonestLimit.name;

		if ( addClass( className ) ) {

			addedInactiveClasses.push( className );
			$C.emit( className );
		}

		if ( inactiveSoonestLimit.cb )
			inactiveSoonestLimit.cb( inactiveSoonestLimit.limit, inactiveSoonestLimit.name )

		sortInactiveLimits();
		inactiveSoonestLimit = inactiveLimits[ inactiveLimits.indexOf( inactiveSoonestLimit ) + 1 ];

		if ( inactiveSoonestLimit )
			inactiveTimeout = setTimeout( checkIncativity, inactiveSoonestLimit.limit - timeFromLastActivity );
		else {
			inactiveSoonestLimit = inactiveLimits[ 0 ];
			inactiveTimeout = null;
		}
	}
	else {

		inactiveTimeout = setTimeout( checkIncativity, inactiveSoonestLimit.limit - timeFromLastActivity );
	}
}

function onActivityHandler() {

	lastActivity = Date.now();

	if ( !inactiveTimeout && inactiveSoonestLimit )
		inactiveTimeout = setTimeout( checkIncativity, inactiveSoonestLimit.limit );

	if ( mouseMoveWatcher )
		mouseMoveWatcher = unbind( document, 'mousemove', mouseMoveWatcher );

	dismissInactivity();

}

function dismissInactivity() {

	if ( !addedInactiveClasses.length ) return;

	addedInactiveClasses.forEach( function ( className ) {

		removeClass( className );

	} );

	$C.emit( 'userActiveAgain', addedInactiveClasses );
	addedInactiveClasses.length = 0;

	sortInactiveLimits();
	inactiveSoonestLimit = inactiveLimits[ 0 ];

	if ( inactiveSoonestLimit )
		inactiveTimeout = setTimeout( checkIncativity, inactiveSoonestLimit.limit );

}

function sortInactiveLimits() {

	inactiveLimits.sort( compareLimits );

}

function compareLimits( a, b ) {

	if ( a.limit < b.limit )
		return -1;
	else if ( a.limit > b.limit )
		return 1;
	return 0;

}