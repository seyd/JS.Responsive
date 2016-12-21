/**
 *
 * User agent detection for precise fixes.
 * @module detectAgent
 *
 * @custom-class $browserName$-v$version$-le - applied when browser is lower or equal version
 * @custom-class $browserName$-v$version$-ge - applied when browser is higher or equal version
 * @custom-class $browserName$-v$version$-l - applied when browser is lower version
 * @custom-class $browserName$-v$version$-g - applied when browser is higher version
 *
 * */

/** Set watching given browser and its version
 * @param {String} browser - browser name, see function getAgentData() attribute "identity"
 * @param {Number} version - browser version number
 * @returns {Object} this - for chaining.
 * @example JS.Responsive.watchBrowserVersion('Webkit', 530);
 * @example JS.Responsive.watchBrowserVersion('Chrome', 47);
 * @example JS.Responsive.watchBrowserVersion('MSIE', 10);
 * @example JS.Responsive.watchBrowserVersion('Edge', 12);
 * @memberof module:detectAgent
 * @alias JS.Responsive.watchBrowserVersion
 */
$C.watchBrowserVersion = function( browser, version ) {

    var agentData = findAgentDataByBrowserName( browser );

    if (agentData)
        addBrowserVersionClasses( agentData, version );
    else
        throw new Error("Browser '" + browser + "' was not found.");

    if (agentData && !agentData.versionSearch)
        throw new Error("Parameter '" + browser + "' doesn't support version search.");

    return this;
};

/**
 * Returns information about platform, browser and its version
 * @returns {Object} containing "platform" as array, "browser" as string and "version" as number.
 * @example JS.Responsive.getPlatformInfo() returns
 *   {
	 *		platform: Array["webkit", "windows", "chrome"],
	 *		browser: "chrome",
	 *		version: 43.5
	 *   }
 * @memberof module:detectAgent
 * @alias JS.Responsive.getPlatformInfo
 */
$C.getPlatformInfo = function() {

    return detectAgentPlatform(TRUE);
};
/**
 * Returns browser tags
 * @returns {Array} all browser tags strings in Array.
 * @method
 * @memberof module:detectAgent
 * @alias JS.Responsive.getAgentTags
 **/

$C.getAgentTags = getAgentTags;

$C.features.detectAgent = detectAgentPlatform;

// Function definitions: ######################### ######################### ######################### ######################### ######################### ######################### #########################

function findAgentDataByBrowserName( browser ) {

    var data = getAgentData();
    browser = browser.toLowerCase();
    for (var i = 0; i < data.length; i++) {
        if (browser == data[i].identity.toLowerCase())
            return data[i];
    }
    return NULL;
}

function addBrowserVersionClasses( agentData, version ) {

    if (agentData.versionSearch) {
        var browser = agentData.identity.toLowerCase(),
            actualVersion = parseFloat(navigator.userAgent.split(agentData.versionSearch || agentData.identity)[1]);
        if ((version + EMPTY_STRING).indexOf('.') == -1)
            actualVersion = parseInt(actualVersion);

        if (!isNaN(actualVersion)) {

            if (version == actualVersion) {
                addClass(browser + '-v' + version + '-le');
                addClass(browser + '-v' + version + '-ge');
            }

            if (version > actualVersion)
                addClass(browser + '-v' + version + '-l');

            if (version < actualVersion)
                addClass(browser + '-v' + version + '-g');

            return TRUE;
        }
    }
    return FALSE;
}

function detectAgentPlatform(_justReturnValue) {

    var data = getAgentData(),
        foundBrowser = FALSE,
        returnValue = {
            platform: [],
            browser: [],
            version: NULL
        };

    for (var i = 0; i < data.length; i++) {

        var dataString = data[i].string,
            dataProp = data[i].prop;

        if ((dataString || dataProp) && (!foundBrowser || !data[i].versionSearch)) {
            if (dataProp || dataString.indexOf(data[i].subString) != -1) {
                var clsName = data[i].identity.toLowerCase();
                if (_justReturnValue)
                    returnValue.platform.push(clsName);
                else
                    addClass(clsName);
                if (data[i].versionSearch) {
                    var version = parseFloat(navigator.userAgent.split(data[i].versionSearch || data[i].identity)[1]);

                    if (clsName != 'webkit')
                        foundBrowser = TRUE; // this is exception for webkit

                    if (!isNaN(version)) {
                        if (_justReturnValue)
                            returnValue.version = version;
                        else
                        // if more classes with spaces, adds versions to all classes
                        // (e.g. msie-v11 wow-v11)
                            addClass(clsName.replace(/( |$)/g, '-v' + parseInt(version)+' ').trim() );
                        if (version != parseInt(version) && !_justReturnValue)
                        // if more classes with spaces, adds versions to all classes
                            addClass(clsName.replace(/( |$)/g, '-v' + version.toString().replace('.', '-')+' ').trim() );
                    }
                }
            }
        }
    }
    if (_justReturnValue) {
        returnValue.browser = returnValue.platform[returnValue.platform.length - 1];
        return returnValue;
    }
}

// SOURCE: http://www.quirksmode.org/js/detect.html
// no longer supported / updated
// @todo update/test on new browsers
function getAgentData() {
    var nua = navigator.userAgent,
        np = navigator.platform,
        nv = navigator.vendor,
        nall = nua + SPACE_CHAR + np + SPACE_CHAR + nv,
        agentList = [];

    function add(identity, string, subString, versionSearch, prop) {
        agentList.push({
            identity: identity,
            string: string,
            subString: subString==UNDEFINED ? identity : subString,
            versionSearch: versionSearch!==TRUE ? versionSearch : identity+'/',
            prop: prop
        });
    }
    add("Edge", nua, NULL, TRUE);
    add("Webkit", nua, NULL, TRUE);
    add("Android", nall);
    add("CoreMedia", nall);
    add("QuickTime", nall);
    add("BlackBerry", nall);
    add("Windows", np, "Win");
    add("Mac", np);
    add("MacOSX", nua, "Intel Mac OS X"); // because on iPhone is "like Mac OS X"
    add("iPhone", nua);
    add("iOS", nua, "iPhone");
    add("iPad", nall);
    add("iOS", nall, "iPad");
    add("iPod", nall);
    add("iOS", nall, "iPod");
    add("PSP", nall); //PlayStation Portable
    add("Kindle", nall);
    add("Linux", np);
    add("Maxthon", nua, NULL, TRUE);
    add("Chrome", nua, NULL, TRUE);
    add("OmniWeb", nua, NULL, TRUE);
    add("Safari", nv, "Apple", "Version/");
    add("Opera", UNDEFINED, NULL, "Version/", win.opera);
    add("OperaMini", nall, "Opera Mini");
    add("iCab", nv);
    add("Konqueror", nv, "KDE");
    add("Firefox", nua, NULL, TRUE);
    add("Camino", nv);
    add("Netscape", nua); // for newer Netscapes (6+)
    add("MSIE", nua, NULL, "MSIE");
    add("MSIE WOW", nua, "WOW64", "rv:");
    add("Mozilla", nua, "Gecko", "rv");
    add("Mozilla", nua, NULL, "Mozilla"); // for older Netscapes (4-)

    return agentList;

}


 function getAgentTags() {
     for (var i = 0, data = getAgentData(), tags = []; i < data.length; i++)
     tags.push(data[i].identity.toLowerCase());
     return tags;
 }
