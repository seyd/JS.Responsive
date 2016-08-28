# JS.Responsive

JS.Responsive is a tool for responsive styling and javascript coding. It generates many usefull class names to HTML element which can be used in styling. **It is replacement of media queries.** In compare to media queries, you can use same tests in javascript and thus improve responsivness of your website.

## Instalation

Just include to HEAD element into your document:

```html
<script type="text/javascript" src="path/to/scripts/JS.Responsive.js"></script>
```

For proper functionality use:

```html
<meta name="viewport" content="width=device-width" />
 ```

Also available via bower package manager
```
bower install js-responsive
```

or npm

```
npm install js-responsive
```

## Documentation

### desktop or mobile


This test uses algorithm of [detectmobilebrowsers.com](http://detectmobilebrowsers.com/) - Open source mobile phone detection.

HTML element class names (disjunctive):

*   **mobile** - if mobile phone is detected
*   **desktop** - else this class name

Example in SASS:

```sass
header
    background-color: white
    width: 960px
    height: 100px
    html.mobile &
        position: fixed
        left: 0
        top: 0
        width: 100%
        height: 36px
```

Javascript methods:

*   `JS.Responsive.isMobile()` - <var>(Boolean)</var> if mobile returns _true_ else _false_.



### touch or no-touch


TODO DOCUMENTATION

HTML element class names (disjunctive):

*   **touch** - if touch device is detected
*   **no-touch** - else this class name

Javascript methods:

*   `JS.Responsive.isTouch()` - <var>(Boolean)</var> if touch device returns _true_ else _false_.



### normal-display or retina-display


TODO DOCUMENTATION

HTML element class names (disjunctive):

*   **retina-display** - if retina display is detected
*   **normal-display** - else this class name

Javascript methods:

*   `JS.Responsive.isRetina()` - <var>(Boolean)</var> if retina display returns _true_ else _false_.



### landscape or portrait


TODO DOCUMENTATION (based only on viewport width and height). See also _device-orientation-portrait_ and _device-orientation-landscape_.

Javascript methods:

*   `JS.Responsive.isLandscape()` - <var>(Boolean)</var> if landscape orientation returns _true_ else _false_.
*   `JS.Responsive.isPortrait()` - <var>(Boolean)</var> if portrait orientation returns _true_ else _false_.



### device-orientation-portrait or device-orientation-landscape and device-orientation-0 or device-orientation-90 or device-orientation-180 or device-orientation-270


By the device orientation adds "_device-orientation-portrait_" or "_device-orientation-landscape_" class
and "_device-orientation-0_", "_device-orientation-90_", "_device-orientation-180_" or "_device-orientation-270_" class.

Javascript methods:

*   `JS.Responsive.getDeviceOrientation()` - <var>(String)</var> Returns device orientation "_portrait_" or "_landscape_".
*   `JS.Responsive.getDeviceOrientationAngle()` - <var>(Number)</var> Returns angle of device orientation _0_, _90_, _180_, _270_ in degrees cross clock wise.



### window-focused or window-blured


TODO DOCUMENTATION

Javascript methods:

*   `JS.Responsive.isFocused()` - <var>(Boolean)</var> if browser window is focused returns _true_ else _false_.



### scrolling or no-scrolling


TODO DOCUMENTATION

Javascript methods:

*   `JS.Responsive.isScrolling()` - <var>(Boolean)</var> if document is scrolled returns _true_ else _false_.
*   `JS.Responsive.AFTER_SCROLL_TIMEOUT` - <var>(Number)</var> timeout for end of scroll (in ms). Default value is _250_.



<dt id="horizontal-sizes">Custom window horizontal sizes (width)


This is the way how we can get around CSS Media queries. We can use javascript to setup custom window size breakpoints.

Javascript methods:

*   `JS.Responsive.addHorizontalSizePoint( name, width )` - <var>(self)</var> adds horizontal size breakpoint.
    *   @**_name_** - <var>(String)</var> name of your size point - whatever but must be css class name compatible
    *   @**_width_** - <var>(Number)</var> size breakpoint in pixels

Example:

```js
JS.Responsive.addHorizontalSizePoint( 'small', 480 ).addHorizontalSizePoint( 'medium', 960 );
```

Common used values:

```
'x-small',  320
'small',    480
'medium',   960
```

Complete recommended values:

```
'x-small',  320
'small',    480
'medium',   960
'large',   1280
'x-large', 1920
```

Maybe better practice:

```
'size-mobile',    0
'size-tablet',  480
'size-desktop', 960
```
```js
JS.Responsive.addHorizontalSizePoint( 'size-mobile', 0 ).addHorizontalSizePoint( 'size-tablet', 481 ).addHorizontalSizePoint( 'size-desktop', 960 );
```
```
0+         size-mobile-more
0..960     size-desktop-less
0..480     size-mobile
481+       size-tablet-more
481..960   size-tablet
960+       size-desktop (default)
```
<dt id="vertical-sizes">Custom window vertical sizes (height)


This is the same like horizontal, but vertical ;)

Javascript methods:

*   `JS.Responsive.addVerticalSizePoint( name, height )` - <var>(self)</var> adds vertical size breakpoint.
    *   @**_name_** - <var>(String)</var> name of your size point - whatever but must be css class name compatible
    *   @**_height_** - <var>(Number)</var> size breakpoint in pixels

Example:

```js
JS.Responsive.addHorizontalSizePoint( 'vertical-medium', 600 );
```

### Window size


How to read window size - in real time - that ean on mobile browsers also when some pannel went away (hides) when scrolling content.

Javascript methods:

*   `JS.Responsive.getWindowWidth()` - <var>(Number)</var> returns window width
*   `JS.Responsive.getWindowHeight()` - <var>(Number)</var> returns window height

Change of window size can be handled via method [addOnChangeHandler](#addOnChangeHandler).



### Document size


How to read document size. When scrolling, document size is greater than window size, but scrollbar reduce size in document a little.

Javascript methods:

*   `JS.Responsive.getDocumentWidth()` - <var>(Number)</var> returns document width
*   `JS.Responsive.getDocumentHeight()` - <var>(Number)</var> returns document height

Change of window size can be handled via method [addOnChangeHandler](#addOnChangeHandler).



<dt id="addOnChangeHandler">Handling realtime changes - _addOnChangeHandler_


TODO DOCUMENTATION

Javascript methods:

*   `JS.Responsive.addOnChangeHandler( handlerFn )` - <var>(void)</var> adds listener to watch changes

Example:

```js
JS.Responsive.addOnChangeHandler( function(e){

} );
```

<dt id="isMethod">Testing class names - is


Insert class names to function parameter as one argument(separed by space) or add as separate parameters. Values in parameter are processed as conjuction, and paramaters as disjunction. Conjuction has priority

Javascript methods:

*   `JS.Responsive.is( classNames, classNames, ... )` - <var>(boolean)</var> tests if classNames are obtained

Example:

```js
JS.Responsive.is( "small landscape", "medium portrait" );// procesed as (small AND landscape) OR (medium AND portrait)
````

<dt id="watchVersion">Version watching - watchVersion


Provides classes for filtering actual browser version compared to specified version, e.g. class is specifying if the curtent browser version is less (-l), less-equal (-le), greater (-g) or greater-equal (-ge) than the specified version

Javascript methods:

*   `JS.Responsive.watchVersion( browserName, browserVersion )` - <var></var>filtering rules for browser version

Example:

```js
JS.Responsive.watchVersion( "webkit", 500 );
```

*   `JS.Responsive.getPlatformInfo()` - <var>(object)</var> filtering rules for browser version

*   platform - <var>(Array)</var> e.g. ["webkit", "windows", "chrome"]
*   browser - <var>(String)</var> e.g. "chrome"
*   version - <var>(Number)</var> e.g. 43.5



</dl>