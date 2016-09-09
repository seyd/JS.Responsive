var timeBreakPointTimeout,
    timeBreakPointCurrentName,
    timeBreakPointsInit,
    dayTimeCurrent,
    dayTimePeriod,
    yearPeriod,
    lastDayTime,
    lastDayTimePeriod,
    lastYearPeriod;

/**
 * Returns actual day time period. One of morning, afternoon, evening or night.
 * @returns {String} Name of actual day time period.
 */
$C.getDayTimePeriod = function() {

    return dayTimePeriod;
};

/**
 * Returns actual year period. One of Spring, Summer, Autumn or Winter.
 * @returns {String} Name of actual day time period.
 */
$C.getYearPeriod = function() {

    return yearPeriod;
};

/**
 * Sets time brakepoints with classnames and start time value.
 * @param {Object[]} breakpoints - The employees who are responsible for the project.
 * @param {string} breakpoints[].name - The name of a breakpoint, this name will be used as className!
 * @param {Number} breakpoints[].time - The time after document load in [ms], breakpoint name will be applied.
 * @param {Number|Boolean} [breakpoints[].remains] - The time in [ms], breakpoint name will be removed (optional). Or TRUE value to prevent replacing with next breakpoint.
 * @example JS.Responsive.setTimeBreakPoints( config )
 */
$C.setTimeBreakPoints = function(breakpoints) {
    var sinceReady;
    if (docReadyTime)
        initBreakpoints();
    else
        timeBreakPointsInit = initBreakpoints;

    // fn declarations
    function initBreakpoints() {
        var now = +(new Date());
        sinceReady = now - docReadyTime;

        // sort by time
        breakpoints.sort(function (a, b) {
            return +(a.time > b.time) || +(a.time === b.time) - 1;
        });

        // clear passed times
        while(breakpoints[0].time < sinceReady)
            breakpoints[0].shift();

        // clear running timeout if any
        if(timeBreakPointTimeout)
            clearTimeout(timeBreakPointTimeout);

        // set new timeout for first breakpoint
        activateNext();
    }

    function activateNext() {
        if(!breakpoints[0]) // no more breakpoints
            return;

        timeBreakPointTimeout = setTimeout(function () {

            // remove current breakpoint name
            removeClass(timeBreakPointCurrentName);
            timeBreakPointCurrentName = UNDEFINED;

            // apply new breakpoint
            var bp = breakpoints.shift();
            addClass(bp.name);

            if(!bp.remains){
                // next breakpoint will clear the current one
                timeBreakPointCurrentName = bp.name;
            }

            if(bp.remains && bp.remains !== TRUE)
                setTimeout(function () {
                    removeClass(bp.name);
                }, bp.remains);

            activateNext();

        }, breakpoints[0].time - sinceReady);
    }
};

$C.features.timeBased = initTimeBased;

// DECLARATIONS:

function initTimeBased() {
    if (docReadyTime){
        timeBreakPointsInit();
        realInitTimeBased();
    }else{
        $C.on('documentReady', function () {
            timeBreakPointsInit();
            realInitTimeBased();
        });
    }
}

function realInitTimeBased(){
    var now = new Date();
    setClasses();
    if (timeBreakPointsInit)
        timeBreakPointsInit();

    setInterval(function () {
        setClasses();
    }, 60*60*1000 - (now.getMilliseconds() + now.getSeconds() + now.getMinutes()));
}

// fn definitions
function setClasses(){

    var now = new Date(),
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

    dayTimeCurrent = 'day-time-' + now.getHours() + 'h';
    dayTimePeriod = DAYPERIODS[now.getHours()];
    yearPeriod = getYearPeriod(now);

    if(lastDayTime != dayTimeCurrent){
        removeClass(lastDayTime);
        addClass(dayTimeCurrent);
        $C.emit('changedDayTime', dayTimeCurrent, lastDayTime);
        lastDayTime = dayTimeCurrent;

    }
    if(lastDayTimePeriod != dayTimePeriod){
        removeClass(lastDayTimePeriod);
        addClass(dayTimePeriod);
        $C.emit('changedDayPeriod', dayTimePeriod, lastDayTimePeriod);
        lastDayTimePeriod = dayTimePeriod;

    }
    if(lastYearPeriod != yearPeriod){
        removeClass(lastYearPeriod);
        addClass(yearPeriod);
        $C.emit('changedYearPeriod', yearPeriod, lastYearPeriod);
        lastYearPeriod = yearPeriod;

    }
}

function getYearPeriod(date) {
    var year = date.getFullYear(),
        firstDates = [
            {date: new Date(year, 2, 20), name: 'Spring'},
            {date: new Date(year, 5, 21), name: 'Summer'},
            {date: new Date(year, 8, 23), name: 'Autumn'},
            {date: new Date(year, 11, 21), name: 'Winter'}
        ];

    return testPeriod(0);

    function testPeriod(index) {
        if(date < firstDates[index].date)
            if(!index) // index === 0
                return firstDates[3].name;
            else
                return firstDates[index-1].name;
        else
        if(firstDates[++index])
            return testPeriod(index);
        else
            return firstDates[0].name;
    }
}