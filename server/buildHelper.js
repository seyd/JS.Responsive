var customBuild = require( __dirname + '/customBuild.js' );

customBuild( false, 'default', function () {
	customBuild( false, 'full', function () {
		console.log( 'BUILD IS DONE!' );
	} );
} );