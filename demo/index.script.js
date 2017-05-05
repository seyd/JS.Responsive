$( function () {
	var jsr = JS.Responsive;

	jsr.on( 'all', function () {

		console.log.apply( this, arguments );

		var htmlElement = document.getElementsByTagName( 'html' )[ 0 ],
			classes = htmlElement.className.split( ' ' ),
			html = '<br />',
			tags = JS.Responsive.getAgentTags();

		for ( var i = 0, special; i < classes.length; i++ ) {
			special = '';
			if ( classes[ i ].match( /^(desktop|mobile|no-touch|touch|normal-display|retina-display|portrait|landscape|state-interactive|state-complete|state-loaded|window-focused|window-blured|no-scrolling|scrolling)$/ ) )
				special = 'main';
			if ( classes[ i ].match( /(-(less|more))$/ ) )
				special = 'secondary';

			// test na platform/userAgent/version
			for ( var j = 0; j < tags.length; j++ )
				if ( classes[ i ].indexOf( tags[ j ] ) >= 0 )
					special = 'super';


			var anchor = classes[ i ].replace( /-v?[0-9]+(-[0-9]+)?/, '' );
			if ( classes[ i ].match( /^vertical-/ ) )
				anchor = 'vertical-sizes';
			else if ( classes[ i ].match( /(small|medium|large)|(-(less|more))$/ ) )
				anchor = 'horizontal-sizes';
			html += '<a href="#' + anchor + '" class="' + special + '">' + classes[ i ] + '</a>';
		}
		document.getElementById( 'html-class' ).innerHTML = html;

		document.getElementById( 'window-size' ).innerHTML = jsr.getWindowWidth() + ' x ' + jsr.getWindowHeight();
		document.getElementById( 'document-size' ).innerHTML = jsr.getDocumentWidth() + ' x ' + jsr.getDocumentHeight();

		// var props = [];
		// for (var prop in e)
		//     props.push( '<a href="#addOnChangeHandler" class="'+(e[prop] ? 'active' : '')+'">'+prop+': '+e[prop]+'</a>' );
		// document.getElementById('event-object').innerHTML = props.join(', ');

	} );

	JS.Responsive
		.addHorizontalBreakPoint( 'medium', 960 )
		.addHorizontalBreakPoint( 'small', 480 )
		.addHorizontalBreakPoint( 'large', 1280 )
		.addHorizontalBreakPoint( 'x-small', 320 );

	JS.Responsive.setTimeBreakPoints( [
		{ name: 'cooool111', time: 2000 },
		{ name: 'cooool222', time: 4000, remains: 3000 },
		{ name: 'cooool333', time: 8000, remains: true },
		{ name: 'cooool444', time: 10000 }
	] );

	JS.Responsive.setInactiveTimeLimit( 3, 'po3s', function ( name, limit ) {
		console.log( 'inactivity limit reached', name, limit );
	} );
	JS.Responsive.setInactiveTimeLimit( 10, 'po10s', function ( name, limit ) {
		console.log( 'inactivity limit reached', name, limit );
	} );

	// JS.Responsive.disableAutoInit();
	// setTimeout(JS.Responsive.init, 5000);

	JS.Responsive.setLocation( 48.136609, 17.107228 );

	JS.Responsive.init();

} );


