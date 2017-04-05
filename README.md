# JS.Responsive

JS.Responsive is a tool for responsive styling and javascript coding. It generates many usefull class names to HTML element which can be used in styling. **It is the replacement of media queries.** In compare to media queries, you can use same tests in javascript and thus improve responsivness of your website.

## Installation

npm

```
npm install js-responsive
```

or download release from [github page](https://github.com/seyd/JS.Responsive/releases)

`!!! CAUTION !!!` Be careful to download directly source files, may consist of NOT-READY version (release candidade, etc..), risky for production environment! Do download published releases instead ;)


Include lib into HEAD element in your document:

```html
<script type="text/javascript" src="path/to/scripts/JS.Responsive.js"></script>
```

Or include it as [UMD](http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/#umd-universal-module-definition) component
```javascript
import JSResponsive from ('JS.Responsive');
```
```javascript
var JSResponsive = require('JS.Responsive');
```

And at the end, init JS.Responsive whenever you want
```javascript
JS.Responsive.init();
```
you can init modules individually refer to [documentation](https://jsresponsive.wezeo.com/documentation/JS.Responsive/#.init)

For proper functionality use:

```html
<meta name="viewport" content="width=device-width" />
 ```


## Documentation

Please visit dokumentation [webpage](https://jsresponsive.wezeo.com/documentation/)

### Building procedure
- download source files from ['github page'](https://github.com/seyd/JS.Responsive/archive/master.zip), or clone it via git.
```
git clone https://github.com/seyd/JS.Responsive.git
```
- run npm command to download dependencies
```
npm install
```
- to build default (JS.Responsive.js) and full build (JS.Responsive.full.js = all features included)
```
npm run build
```
- to build your custom build edit JSON config file in `server/customBuild.json`
```
["isScrolling", "detectTouch"]
```
- each string represent name of a feature, full list of available features is in `server/featuresList.json`
- when customBuild.json is ready run custom build command
```
npm run custom
```
- build will finish with statement in console
```
Custom build DONE!
```
- built files are in `dist/` directory (`JS.Responsive.custom.js`, `JS.Responsive.custom.min.js`, etc..)
