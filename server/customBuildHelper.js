var customJson =            require( __dirname + '/customBuild.json' ),
	featureNumbersList =    require( __dirname + '/featuresList.json' ),
	customBuild =           require( __dirname + '/customBuild.js' ),
	cfg = '1';


if ( require.main === module ) {
	// called directly
	customBuildStart();
} else {
	// required as a module
	module.exports = customBuildStart;
}

function customBuildStart( callback, version ) {
	"use strict";
	featureNumbersList.forEach( function ( feature ) {
		console.log('feature.file:', feature.file);
		if ( customJson.indexOf( feature.file ) != -1 ) {
			cfg += '1';
		} else {
			cfg += '0';
		}
	} );

	customBuild( parseInt( cfg, 2 ), 'custom', function () {
		console.log( 'Custom build DONE!' );

		if ( callback )
			callback();
	}, version );
}