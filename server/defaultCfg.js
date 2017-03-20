var featureList = require(__dirname + '/featuresList.json');
var defaultList = [

	'breakpoints',
	'detect-touch',
	'document-state',
	'focus-blur',
	'touch-vs-mouse',

];
var cfg = '1'; // first '1' is protection  against loosing leading zeros, every next '1's or '0's are flags



featureList.forEach( function ( feature ) {

	cfg += defaultList.indexOf( feature.file ) > -1 ? 1 : 0;

});


module.exports = parseInt( cfg, 2 );