// Author: johnnyseyd@gmail.com (jseyd.com)

// you have to set STYLESHEET_NAMES

// uncomment this line in Drupal (on the end of this file is another closing line to uncomment)
//(function ($, Drupal, window, document, undefined) {


// Ctrl+Enter Dynamic Style refresh (reload)
$( function () {

	// styly musia byt zadane v takom poradi, ako su vlozene do dokumentu html (v opacnom pripade sa mozu pravidla prejavit inak)
	var STYLESHEET_NAMES = [ 'index.style.css' ];
	var AUTOMATIC_REFRESH_INTERVAL = 1000;

	// --------------------------------------------------------------------------------------------------------------------------------------------

	var lastMessage = 0;
	var overlayCounter = 1;

	function showMessageInfo( styleName ) {
		var now = new Date();
		var hour = now.getHours();
		if ( hour < 10 ) hour = '0' + hour;
		var minute = now.getMinutes();
		if ( minute < 10 ) minute = '0' + minute;
		var second = now.getSeconds();
		if ( second < 10 ) second = '0' + second;
		var t = 800;
		var m = 4;
		var path = styleName.split( '/' );
		var file = path[ path.length - 1 ].split( '?' );
		var box = $( '<div><strong>' + file[ 0 ] + '</strong> was refreshed at ' + hour + ':' + minute + ':' + second + '</div>' );
		var highDensity = now.getTime() - lastMessage < 10;
		box.css( {
			background: 'black',
			color: 'white',
			fontFamily: 'arial, helvetica, sans-serif',
			fontSize: '12px',
			textAlign: 'center',
			position: 'absolute',
			zIndex: 100000,
			marginTop: ((highDensity ? (overlayCounter * 60) : 0) + $( 'body' ).scrollTop()) + 'px',
			left: '50%',
			top: (50 + m) + '%',
			padding: '0.8em 1.2em',
			opacity: 0,
			borderRadius: '10px'
		} );
		box.appendTo( $( 'body' ) );
		var w = box.width();
		box.css( { marginLeft: parseInt( -w / 2 ) + 'px' } );
		box.animate( {
			opacity: 0.5,
			top: (50 + m / 3) + '%'
		}, t, 'linear', function () {
			box.animate( {
				top: (50 - m / 3) + '%'
			}, t, 'linear', function () {
				box.animate( {
					opacity: 0,
					top: (50 - m) + '%'
				}, t, 'linear', function () {
					box.detach();
				} );
			} );
		} );
		lastMessage = now.getTime();
		if ( highDensity )
			overlayCounter++;
		else
			overlayCounter = 1;
	};


	/*
	 *	CSSrefresh v1.0.1
	 *
	 *	Copyright (c) 2012 Fred Heusschen
	 *	www.frebsite.nl
	 *
	 *	Dual licensed under the MIT and GPL licenses.
	 *	http://en.wikipedia.org/wiki/MIT_License
	 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
	 */
	var phpjs = {

		array_filter: function ( arr, func ) {
			var retObj = {};
			for ( var k in arr ) {
				if ( func( arr[ k ] ) ) {
					retObj[ k ] = arr[ k ];
				}
			}
			return retObj;
		},
		filemtime: function ( file, callback ) {
			this.get_headers( file, 1, function ( headers ) {
				callback(
					( headers && headers[ 'Last-Modified' ] && Date.parse( headers[ 'Last-Modified' ] ) / 1000 ) || false
				);
			} );
		},
		get_headers: function ( url, format, callback ) {
			var req = window.ActiveXObject ? new ActiveXObject( 'Microsoft.XMLHTTP' ) : new XMLHttpRequest();
			if ( !req ) {
				throw new Error( 'XMLHttpRequest not supported.' );
			}

			var tmp, headers, pair, i, j = 0;
			var $this = this;
			try {
				req.open( 'HEAD', url, true );
				req.onreadystatechange = function () {
					if ( req.readyState < 3 )
						return false;
					if ( req.getAllResponseHeaders ) {
						tmp = req.getAllResponseHeaders();
						tmp = tmp.split( '\n' );
						tmp = $this.array_filter( tmp, function ( value ) {
							return value.toString().substring( 1 ) !== '';
						} );
						headers = format ? {} : [];

						for ( i in tmp ) {
							if ( format ) {
								pair = tmp[ i ].toString().split( ':' );
								headers[ pair.splice( 0, 1 ) ] = pair.join( ':' ).substring( 1 );
							}
							else {
								headers[ j++ ] = tmp[ i ];
							}
						}
						callback( headers );
					}
				};
				req.send( null );
			}
			catch ( err ) {
				return false;
			}
		}
	};

	/*
	 * end of CSSrefresh v1.0.1
	 */


	function printObj( obj ) {
		var txt = '';
		for ( prop in obj ) {
			try {
				//if (typeof(obj[prop])=='object')
				txt += prop + ' = ' + obj[ prop ] + '\n';
			}
			catch ( e ) {
				txt += prop + ' = ERROR \n';
			}
		}
		alert( txt );
	};

	function watchThisStyle( STYLESHEET_NAME ) {
		// select vsetky styly, ktore obsahuju v href STYLESHEET_NAME
		var style = $( 'link[href*="' + STYLESHEET_NAME + '"]' )[ 0 ];
		var refreshStyleFn = null;
		var styleUrl = '';
		// if style is included via <link> element
		if ( style ) {
			refreshStyleFn = function () {
				var styleHref = style.href.split( '?' )[ 0 ];
				var styleParam = new Date().getTime();
				style.href = styleHref + '?' + styleParam;
				showMessageInfo( styleHref );
			}
			styleUrl = style.href;
		}
		// is style is included via <style> element and @import
		else {
			var styles = $( 'style' );
			var reg = new RegExp( '(@import url\\([\'"]?.*\/)' + STYLESHEET_NAME + '((\\?.*)?[\'"]?\\);)', 'g' );
			for ( var i = 0; i < styles.length; i++ ) {
				var sheet = styles[ i ].sheet ? styles[ i ].sheet : styles[ i ].styleSheet
				//printObj( sheet );
				var media = sheet.media.mediaText != undefined ? sheet.media.mediaText : sheet.media;
				var rules = sheet.cssRules ? sheet.cssRules : sheet.rules;

				// prehlada css kod @import-y
				// POZOR: ale len do prvej prvej urovne (@import moze obsahovat @import atd...)
				if ( rules )
					for ( var j = 0; j < rules.length; j++ ) {
						var rule = rules[ j ].cssText;  // "@import url("css/style2.css");"
						var href = rules[ j ].href; // "css/style2.css"
						// ak nasiel, tak ho vyjme pred ako samostatny element link
						if ( href && href.indexOf( STYLESHEET_NAME ) >= 0 ) {
							// vytvori ho ako link element, lebo jeho styl vieme menit dynamicky
							var newLinkElement = $( '<link rel="stylesheet" href="' + href + '" media="' + media + '" />' ).insertBefore( styles[ i ] );
							// odstranime) @import styl
							styles[ i ].textContent = styles[ i ].textContent.replace( reg, '\/* $1' + STYLESHEET_NAME + '$2 *\/' );
							// a zavolame sami seba este raz, nech uz najde <link> element
							watchThisStyle( STYLESHEET_NAME );
							return;
						}
					}
				//console.log(sheet);
				/*
				 // STARY STYL, KEDY PREPISOVAL cely <style> obsah aj s @import prikazom;

				 // ak obsahuje @import url('STYLESHEET_NAME')
				 if (styles[i].textContent.indexOf( reg )!==false)
				 {
				 var stylesheet = styles[i];
				 refreshStyleFn = function()
				 {
				 // tak ho nahradi novym stringom
				 var styleParam = new Date().getTime();
				 stylesheet.textContent = stylesheet.textContent.replace( reg, '$1'+STYLESHEET_NAME+'?'+styleParam+'$2');
				 }
				 var match = stylesheet.textContent.match( new RegExp('(?:@import url\\([\'"]?)(.*\/'+STYLESHEET_NAME+')(?:(\\?.*)?[\'"]?\\))') );
				 if (match && match[1])
				 styleUrl = match[1];
				 }
				 */
			}
		}
		if ( refreshStyleFn ) {
			$( document ).bind( 'keypress', function ( event ) {
				// Ctrl + Enter
				if ( event.ctrlKey && (event.which == 10 || event.which == 13) )  // 13 in Mozilla, 10 in other browsers
					refreshStyleFn();
			} );

			phpjs.filemtime( styleUrl, function ( lastModifyTime ) {
				if ( lastModifyTime ) {
					setInterval( function () {
						phpjs.filemtime( styleUrl + '?' + new Date().getTime(), function ( currentModifyTime ) {
							if ( currentModifyTime != lastModifyTime ) {
								refreshStyleFn();
								lastModifyTime = currentModifyTime;
							}
						} );
					}, AUTOMATIC_REFRESH_INTERVAL );
				}
			} );
		}
	};

	// start watching
	for ( var i = 0; i < STYLESHEET_NAMES.length; i++ )
		watchThisStyle( STYLESHEET_NAMES[ i ] );
} );

// uncomment this line in Drupal
//})(jQuery, Drupal, this, this.document);