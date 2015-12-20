/**
 * Prevent Browsers without console to throw an error if console.log() or similar is used
 *
 * @ homepage: https://github.com/netzgestaltung/jquery.console
 * @ Copyright 2015 nexxar/Thomas Fellinger
 * @ License GPLv2
 *
 * Use $.log(), $.error(), $.warn(), $.info(), $.debug() instead
 */
jQuery.log = function log(){ 
  try { if (console.log.apply !== undefined) { console.log.apply(console,arguments); } else { console.log(arguments[0]);} } catch(e){} 
};
jQuery.error = function error(){
  try { if (console.error.apply !== undefined) { console.error.apply(console,arguments); } else { console.error(arguments[0]);} } catch(e){} 
};
jQuery.warn = function warn(){
  try { if (console.warn.apply !== undefined) { console.warn.apply(console,arguments); } else { console.warn(arguments[0]);} } catch(e){} 
};
jQuery.info = function info(){
  try { if (console.info.apply !== undefined) { console.info.apply(console,arguments); } else { console.info(arguments[0]);} } catch(e){} 
};
jQuery.debug = function debug(){
  try { if (console.debug.apply !== undefined) { console.debug.apply(console,arguments); } else { console.debug(arguments[0]);} } catch(e){} 
};


/*
 * debouncedresize: special jQuery event that happens once after a window resize
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/jquery-smartresize
 *
 * Copyright 2012 @louis_remi
 * Licensed under the MIT license.
 *
 * This saved you an hour of work? 
 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
 */
(function($) {

  var $event = $.event,
	    $special,
	    resizeTimeout;

  $special = $event.special.debouncedresize = {
	  setup: function() {
		  $( this ).on( "resize", $special.handler );
	  },
	  teardown: function() {
		  $( this ).off( "resize", $special.handler );
	  },
	  handler: function( event, execAsap ) {
		  // Save the context
		  var context = this,
			  args = arguments,
			  dispatch = function() {
				  // set correct event type
				  event.type = "debouncedresize";
				  $event.dispatch.apply( context, args );
			  };

		  if ( resizeTimeout ) {
			  clearTimeout( resizeTimeout );
		  }

		  execAsap ?
			  dispatch() :
			  resizeTimeout = setTimeout( dispatch, $special.threshold );
	  },
	  threshold: 150
  };

})(jQuery);

