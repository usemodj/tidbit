// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.

/*
 * https://github.com/sstephenson/sprockets
 * 
 */ 

//= require jquery
//= require jquery_ujs
//= require json2
//= require underscore-min
//= require backbone-min
// require backbone.localStorage
// require backbone-localstorage
//= require handlebars-1.0.rc.1.min
//= require handlebars-helpers
//= require jquery.ba-hashchange.min
//= require jquery.jsonp-2.4.0.min
//= require select2

// require jquery.timeago
// require jquery.timeago.ko
//= require moment.min
//= require moment.ko
//= require livestamp.min
//= require jquery-ui-1.10.0.custom.min

/* 
 *  require_tree : recursively to require all files in all subdirectories of the directory specified by path 
 *  require_directory : only require all files in the directory specified by path, not recursively
 */
//require_tree .
//= require_tree ./backbone


//Backbone.history.start()

/* jquery-hashchange */
$(function(){
  
  // Bind an event to window.onhashchange that, when the hash changes, gets the
  // hash and adds the class "selected" to any matching nav link.
  $(window).hashchange( function(){
    var hash = location.hash;
    
    // Set the page title based on the hash.
    document.title = 'The hash is ' + ( hash.replace( /^#/, '' ) || 'blank' ) + '.';
    
    // Iterate over all nav links, setting the "selected" class as-appropriate.
    $('#nav a').each(function(){
      var that = $(this);
      that[ that.attr( 'href' ) === hash ? 'addClass' : 'removeClass' ]( 'selected' );
    });
  })
  
  // Since the event is only triggered when the hash changes, we need to trigger
  // the event now, to handle the hash the page may have loaded with.
  $(window).hashchange();
  
});
