# CHANGELOG

## 3.4.0 Whitescreen
- configurations can be passed to modules
- added configurable ad-block module classes, it fixes the problem when whole page goes white. Caused when you use ad-block addon in browser ( because it detects ad-block class as advertisment and will remove whole html ). *It is highly recommended to set classes not including the word "ad"* in next major release they will be renamed following way:
```
ad-block --> blocker-detected
no-ad-block --> no-blocker
```

## 3.3.0 Sunshine
- new daylight-true and daylight-false classes ( time-based module ), and some methods related ( setLocation, isDaylight, dayOfYear, getSunrise, getSunset )

## 3.2.4
- fixed detect orientation

## 3.2.3
- fixed device-orientation not fired

## 3.2.2
- removed autoInit on documentReady
- fixed #1
- fixed build paths

## 3.2.0 Pathfinder
- added new feature url-based
- detect-touch module now detects also number of touches
- some minor fixes

## 3.1.0 Inactivity
- added new feature inactive
- autoInit on documentReady
- fixed breakpoints ( bug: started before init, when addHorizontalBreakPoint method used )
- fixed time-based ( bug: shift is not a function )

## 3.0.0 Early Bird
- library custom builds with missing method warnings
- new build-in event system (.on, .off, .emit)
- added new feature AdBlock detection
- added timeBasedBreakpoints
- ! method `addOnChangeHandler` removed
- ! method `removeOnChangeHandler` removed

## 2.4.0 Timeless

- time breakpoints since document load
- day time classes (day-time-5h, day-time-17h, ...)
- day period (day-period-morning, day-period-evening, ...)
- year period (year-period-summer, year-period-winter, ...)
- complete refactor (to functions) because minification

## 2.3.4 Newborn

- initial changelog record
- added standard file structure and workflow automatization
