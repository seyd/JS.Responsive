/**
 *
 * Time related classes and custom time breakpoints from document loaded event.
 * @module time-based
 * @since 3.0.0
 * @pretty-name Time breakpoints and time related classes
 * @teaser Time related classes, day period, year seasson.
 *
 * @custom-class day-time-$$h - day time class where $$ is actual hour (non zero-padded)
 * @custom-class day-period-$periodName$ - day pariod class where name can be one of morning, afternoon, evening or night
 * @custom-class year-period-$periodName$ - year pariod class where name can be one of spring, summer, autumn or winter
 * @custom-class $timeBreakpointName$ - where name is custom name provided via setTimeBreakPoints
 * @custom-class daylight-true - value of calculated daylight after location is provided by setLocation( lat, lng )
 * @custom-class daylight-false - value of calculated daylight after location is provided by setLocation( lat, lng )
 *
 * @emits changedDayTime - Arguments: {String} dayTimeCurrent, {String} lastDayTime, both have same syntax as classes (day-time-$$h)
 * @emits changedDayPeriod - Arguments: {String} dayTimePeriod, {String} lastDayTimePeriod, both have same syntax as classes (day-period-$periodName$)
 * @emits changedYearPeriod - Arguments: {String} yearPeriod, {String} lastYearPeriod, both have same syntax as classes (year-period-$periodName$)
 * @emits timeBreakpointReached - Arguments: {String} timeBreakPointReached - name provided via setTimeBreakPoints, {String|Undefined} timeBreakPointPrevious - if any
 *
 **/

var timeBreakPointTimeout,
	timeBreakPointCurrentName,
	timeBreakPointsInit,
	dayTimeCurrent,
	dayTimePeriod,
	yearPeriod,
	lastDayTime,
	lastDayTimePeriod,
	lastYearPeriod,
	positionLat,
	positionLng,
	daylightTimeout,
	DAYLIGHT = 'daylight',
	MORNING = 'morning',
	AFTERNOON = 'afternoon',
	EVENING = 'evening',
	NIGHT = 'night',
	DAYPERIODS = {
		0: NIGHT,
		1: NIGHT,
		2: NIGHT,
		3: NIGHT,
		4: NIGHT,
		5: NIGHT,
		6: MORNING,
		7: MORNING,
		8: MORNING,
		9: MORNING,
		10: MORNING,
		11: MORNING,
		12: AFTERNOON,
		13: AFTERNOON,
		14: AFTERNOON,
		15: AFTERNOON,
		16: AFTERNOON,
		17: EVENING,
		18: EVENING,
		19: EVENING,
		20: NIGHT,
		21: NIGHT,
		22: NIGHT,
		23: NIGHT,
	};

/**
 * Returns actual day time period. One of morning, afternoon, evening or night.
 * @returns {String} Name of actual day time period.
 * @memberof module:time-based
 * @alias JS.Responsive.getDayTimePeriod
 * @since 3.0.0
 */
$C.getDayTimePeriod = function () {

	return dayTimePeriod;
};

/**
 * Returns actual year period. One of Spring, Summer, Autumn or Winter.
 * @returns {String} Name of actual day time period.
 * @memberof module:time-based
 * @alias JS.Responsive.getYearPeriod
 * @since 3.0.0
 */
$C.getYearPeriod = function () {

	return yearPeriod;
};

/**
 * Sets time brakepoints with classnames and start time value.
 * @param {Object[]} breakpoints - The employees who are responsible for the project.
 * @param {string} breakpoints[].name - The name of a breakpoint, this name will be used as className!
 * @param {Number} breakpoints[].time - The time after document load in [ms], breakpoint name will be applied.
 * @param {Number|Boolean} [breakpoints[].remains] - The time in [ms], breakpoint name will be removed (optional). Or TRUE value to prevent replacing with next breakpoint.
 * @example JS.Responsive.setTimeBreakPoints( config )
 * @memberof module:time-based
 * @alias JS.Responsive.setTimeBreakPoints
 * @since 3.0.0
 */
$C.setTimeBreakPoints = function ( breakpoints ) {
	var sinceReady;
	if ( docReadyTime )
		_initTimeBased();
	else
		timeBreakPointsInit = _initTimeBased;

	// fn declarations
	function _initTimeBased() {
		var now = +(new Date()),
			i = 0;
		sinceReady = now - docReadyTime;

		// sort by time
		breakpoints.sort( function ( a, b ) {
			return +(a.time > b.time) || +(a.time === b.time) - 1;
		} );

		// clear passed times
		while ( breakpoints[ i ] && breakpoints[ i ].time < sinceReady )
			breakpoints.shift();

		// clear running timeout if any
		if ( timeBreakPointTimeout )
			clearTimeout( timeBreakPointTimeout );

		// set new timeout for first breakpoint
		activateNext();
	}

	function activateNext() {
		if ( !breakpoints[ 0 ] ) // no more breakpoints
			return;

		timeBreakPointTimeout = setTimeout( function () {

			// remove current breakpoint name
			removeClass( timeBreakPointCurrentName );

			// apply new breakpoint
			var bp = breakpoints.shift();
			addClass( bp.name );

			$C.emit( 'timeBreakpointReached', bp.name, timeBreakPointCurrentName );
			timeBreakPointCurrentName = UNDEFINED;

			if ( !bp.remains ) {
				// next breakpoint will clear this one
				timeBreakPointCurrentName = bp.name;
			}

			if ( bp.remains && bp.remains !== TRUE )
				setTimeout( thenRemoveClass( bp.name ), bp.remains );

			activateNext();

		}, breakpoints[ 0 ].time - sinceReady );
	}
};

/**
 * Set location to activate daylight detection classes
 * @returns {Boolean} true for daylight time span
 * @memberof module:time-based
 * @param {Number} lat - input latitude
 * @param {Number} lng - input longitude
 * @example JS.Responsive.setLocation( 48.136609, 17.107228 ); // Bratislava
 * @alias JS.Responsive.setLocation
 * @since 3.3.0
 */
$C.setLocation = function ( lat, lng ) {

	positionLat = lat;
	positionLng = lng;
	return $C.isDaylight();
};

/**
 * Returns actual daylight state
 * @returns {Boolean} true for daylight time span
 * @memberof module:time-based
 * @alias JS.Responsive.isDaylight
 * @since 3.3.0
 */
$C.isDaylight = function () {

	if ( !positionLat )
		throw new Error( 'Location not provided! You need to provide location, via setLocation( lan, lng ) method first!' );

	if ( daylightTimeout )
		clearTimeout( daylightTimeout );

	var day = $C.dayOfYear();
	var now = Date.now();
	var sunrise = computeSunrise( day );
	var sunset = computeSunset( day );
	// console.log( 'sunrise < now', sunrise < now, sunrise, now );
	// console.log( 'now < sunset', now < sunset, now, sunset );
	var daylight = sunrise < now && now < sunset;

	if ( daylight )
	//                                               time to sunset + 10ms reserve
		daylightTimeout = setTimeout( $C.isDaylight, sunset - now + 10 );
	else if ( now < sunrise )
	//                                               time to sunrise + 10ms reserve
		daylightTimeout = setTimeout( $C.isDaylight, sunrise - now + 10 );
	else
	//                                               time to midnight + 10ms reserve
		daylightTimeout = setTimeout( $C.isDaylight, new Date( now ).setHours( 24, 0, 0, 10 ) - now );

	removeClass( DAYLIGHT + '-' + (!daylight).toString() );
	addClass( DAYLIGHT + '-' + daylight.toString() );

	return daylight;
};

/**
 * @returns {Number} day of the year
 * @param {Date} [date] - input Date instance, dafault is new Date()
 * @memberof module:time-based
 * @alias JS.Responsive.dayOfYear
 * @since 3.3.0
 */
$C.dayOfYear = function ( date ) {

	date = date || new Date();
	var start = new Date( date.getFullYear(), 0, 0 );
	var diff = date - start;
	var oneDay = 1000 * 60 * 60 * 24;
	return Math.floor( diff / oneDay );
};

/**
 * @returns {Date} date object of sunrise calculated from provided date
 * @param {Date} [date] - input Date instance, dafault is new Date()
 * @memberof module:time-based
 * @alias JS.Responsive.getSunrise
 * @since 3.3.0
 */
$C.getSunrise = function ( date ) {

	return new Date( computeSunrise( $C.dayOfYear( date ) ) );
};

/**
 * @returns {Date} date object of sunrise calculated from provided date
 * @param {Date} [date] - input Date instance, dafault is new Date()
 * @memberof module:time-based
 * @alias JS.Responsive.getSunrise
 * @since 3.3.0
 */
$C.getSunset = function ( date ) {

	return new Date( computeSunset( $C.dayOfYear( date ) ) );
};

$C._features.timeBased = initTimeBased;

// Function declarations: ######################### ######################### ######################### ######################### ######################### ######################### #########################

function initTimeBased() {

	var now = new Date();
	dayTimeCurrent = 'day-time-' + now.getHours() + 'h';
	dayTimePeriod = DAYPERIODS[ now.getHours() ];
	yearPeriod = getYearPeriod( now );

	if ( docReadyTime ) {
		timeBreakPointsInit();
		realInitTimeBased();
	} else {
		$C.on( 'documentReady', function () {
			if ( timeBreakPointsInit )
				timeBreakPointsInit();
			realInitTimeBased();
		} );
	}
}

function realInitTimeBased() {

	var now = new Date();
	setClasses();
	if ( timeBreakPointsInit )
		timeBreakPointsInit();

	setInterval( function () {
		setClasses();
	}, 60 * 60 * 1000 - (now.getMilliseconds() + now.getSeconds() + now.getMinutes()) );
}

// fn definitions
function setClasses() {

	if ( lastDayTime != dayTimeCurrent ) {
		removeClass( lastDayTime );
		addClass( dayTimeCurrent );
		$C.emit( 'changedDayTime', dayTimeCurrent, lastDayTime );
		lastDayTime = dayTimeCurrent;

	}
	if ( lastDayTimePeriod != dayTimePeriod ) {
		removeClass( lastDayTimePeriod );
		addClass( dayTimePeriod );
		$C.emit( 'changedDayPeriod', dayTimePeriod, lastDayTimePeriod );
		lastDayTimePeriod = dayTimePeriod;

	}
	if ( lastYearPeriod != yearPeriod ) {
		removeClass( lastYearPeriod );
		addClass( yearPeriod );
		$C.emit( 'changedYearPeriod', yearPeriod, lastYearPeriod );
		lastYearPeriod = yearPeriod;

	}
}

function getYearPeriod( date ) {

	var year = date.getFullYear(),
		firstDates = [
			{ date: new Date( year, 2, 20 ), name: 'spring' },
			{ date: new Date( year, 5, 21 ), name: 'summer' },
			{ date: new Date( year, 8, 23 ), name: 'autumn' },
			{ date: new Date( year, 11, 21 ), name: 'winter' }
		];

	return testPeriod( 0 );

	function testPeriod( index ) {

		if ( date < firstDates[ index ].date )
			if ( !index ) // index === 0
				return firstDates[ 3 ].name;
			else
				return firstDates[ index - 1 ].name;
		else if ( firstDates[ ++index ] )
			return testPeriod( index );
		else
			return firstDates[ 0 ].name;
	}
}

function thenRemoveClass( className ) {

	return function () {
		removeClass( className );
	}
}

// Taken from https://gist.github.com/Tafkas/4742250
// and fixed some things
function computeSunrise( day, sunset ) {

	if ( !positionLat ) return;

	/*Sunrise/Sunset Algorithm taken from
	 http://williams.best.vwh.net/sunrise_sunset_algorithm.htm
	 inputs:
	 day = day of the year
	 sunset = true for sunset, false for sunrise
	 output:
	 unix time of sunrise/sunset in ms */

	//lat, lon for Berlin, Germany
	var longitude = positionLng;
	var latitude = positionLat;
	var zenith = 90.83333333333333;
	var D2R = Math.PI / 180;
	var R2D = 180 / Math.PI;

	// convert the longitude to hour value and calculate an approximate time
	var lnHour = longitude / 15;
	var t;
	if ( sunset ) {
		t = day + ((18 - lnHour) / 24);
	} else {
		t = day + ((6 - lnHour) / 24);
	}

	//calculate the Sun's mean anomaly
	var M = (0.9856 * t) - 3.289;

	//calculate the Sun's true longitude
	var L = M + (1.916 * Math.sin( M * D2R )) + (0.020 * Math.sin( 2 * M * D2R )) + 282.634;
	if ( L > 360 ) {
		L = L - 360;
	} else if ( L < 0 ) {
		L = L + 360;
	}

	//calculate the Sun's right ascension
	var RA = R2D * Math.atan( 0.91764 * Math.tan( L * D2R ) );
	if ( RA > 360 ) {
		RA = RA - 360;
	} else if ( RA < 0 ) {
		RA = RA + 360;
	}

	//right ascension value needs to be in the same qua
	var Lquadrant = (Math.floor( L / (90) )) * 90;
	var RAquadrant = (Math.floor( RA / 90 )) * 90;
	RA = RA + (Lquadrant - RAquadrant);

	//right ascension value needs to be converted into hours
	RA = RA / 15;

	//calculate the Sun's declination
	var sinDec = 0.39782 * Math.sin( L * D2R );
	var cosDec = Math.cos( Math.asin( sinDec ) );

	//calculate the Sun's local hour angle
	var cosH = (Math.cos( zenith * D2R ) - (sinDec * Math.sin( latitude * D2R ))) / (cosDec * Math.cos( latitude * D2R ));
	var H;
	if ( sunset ) {
		H = R2D * Math.acos( cosH );
	} else {
		H = 360 - R2D * Math.acos( cosH );
	}

	H = H / 15;

	//calculate local mean time of rising/setting
	var T = H + RA - (0.06571 * t) - 6.622;

	//adjust back to UTC
	var UT = T - lnHour;
	if ( UT > 24 ) {
		UT = UT - 24;
	} else if ( UT < 0 ) {
		UT = UT + 24;
	}

	//convert to Milliseconds
	var now = new Date();
	return new Date( now.getFullYear(), now.getMonth(), now.getDate() ).getTime() + ( UT * 3600 * 1000 );
}

function computeSunset( day ) {

	return computeSunrise( day, true );
}