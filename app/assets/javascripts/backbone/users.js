
// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){
  
    // User Model
    var User = Backbone.Model.extend({
	//Default attributes for the user item
	defaults: function(){
	    return {
			email: "",
			password: "",
			password_confirmation:"",
			remember_me: 0
	    };
	},
	//Constructor
	initialize: function(){
	    // Initialize ...
	},
	url: "/users",
	paramRoot: 'user',
	
	authenticate: function (password, callback) {
	    var self = this;
	
	    $.ajax({
	      type: 'POST',
	      url:  '/users/sign_in.json',
	      data: {user:{
	        email: this.get('email'),
	        password: password
	       }}
	    }).done(function(data, textStatus, jqXHR){
	    	//console.log(">>done status:" +arguments[1]);
	    	//data.success
    		callback.call(this, data, self);
	    }).fail(function(jqXHR, textStatus, errorThrown){
	    	//console.log(">>fail status:" + arguments[1]);
	    	callback.call(this, {success: false, errors: ["login_failed"]}, self);
	    }).always(function(){
	    	//console.log(">>always status:" + arguments[1]);
	    	
	    });
	  }
    });
    // Static methods
	User.authorize = function (attrs, callback) {
		var user = new User({email: attrs.email});
		user.authenticate(attrs.password, callback);
	};
	User.resetPassword = function(email, callback){
		$.ajax({
	      type: 'POST',
			url:  '/users/password.json',
			data: {user:{ 'email': email}}
		}).done(function(data, textStatus, jqXHR){
			console.log(">>done status:" +arguments[1]);
			if(data.success){
				callback.call(this, data);
			}else{
				callback.call(this, data);
			}
		}).fail(function(jqXHR, textStatus, errorThrown){
			console.log(">>fail status:" + arguments[1]);
			callback.call(this, {success: false, notice: "sending_reset_password_failed"});
	    });
	};
	  
    User.shake = function( el){
	    $(el).animate({left: '-=20'}, 100)
	    .animate({left: '+=40'}, 100)
	    .animate({left: '-=40'}, 100)
	    .animate({left: '+=40'}, 100)
	    .animate({left: '-=20'}, 100);
	};

    // Signup View
    var SignupView = Backbone.View.extend({
    	el: "#signup-view",
    	events: {
    		"submit #sign_up_user": "createUser"
    	},
    	
    	attributes: function () {
		    return {
		      email: this.$el.find('#user_email').val(),
		      password: this.$el.find('#user_password').val(),
		      password_confirmation: this.$el.find('#user_password_confirmation').val()
		    };
		},
		
		initialize: function () {
			//Constructor
		},
		
		createUser: function(){
		    var form = this.$el.find('form'),
		    emailField = this.$el.find('#user_email'),
		    passwordField = this.$el.find('#user_password'),
		    passwordConfirmationField = this.$el.find('#user_password_confirmation'),
		    submitButton = this.$el.find('input[type=submit]');
		    
			if(submitButton.hasClass('disabled') && form.data('user-created') !== true){
				return false;
			} else {
				submitButton.addClass('disabled');
			}
			var self = this,
				notice = $("#notice"),
				user = new User(this.attributes());
			
			user.save(null, {
				success: function(model, response, options){
					form.data('user-created', true);
					
					if(response.success){
						notice.text(I18N[response.notice]).fadeIn().fadeOut(7000);
						//document.location.href = response.redirect ? response.redirect : '/';
					} else {
						notice.text(I18N[response.notice]).fadeIn().fadeOut(7000);
						User.shake("#userapp");
					}
				},
				error: function(model, xhr, options){
					//console.log(xhr);
					self.$el.find('input').removeClass('error');
					try{
						var errors = JSON.parse(xhr.responseText).errors;
						_.each(errors, function(value, key){
							self.$el.find('input[name='+key +']').addClass('error');
						});
					}catch(err){
						console.log(err);
					}
					
					submitButton.removeClass('disabled');
					User.shake("#userapp");
				}
			});
			
			return false;
		},
		
    });
    
    // Login View
	var LoginView = Backbone.View.extend({
	  el: '#login-view',
	  events: { "submit form":"authorize" },

	  initialize: function () {
			//Constructor
	  },
	
	  authorize: function (e) {
	  	e.preventDefault();
	  	var form = this.$el.find('form'),
	  		submitButton = this.$el.find('input[type=submit]'),
	    	emailField = this.$el.find('input[name="user[email]"]'),
	    	passwordField = this.$el.find('#user_password');

	    if (submitButton.hasClass('disabled') && !(form.data('user-authorized') === true)) {
	      return false;
	    } else {
	      submitButton.addClass('disabled');
	    }

	    var self = this,
	        attrs = {
	          email: emailField.val(),
	          password: passwordField.val()
	        };
	    
	    User.authorize(attrs, function (data, user) {
	      if(data.success) { self.loginSuccess(); }
	      else { self.loginFailure(data.errors); }
	    });
	    return (form.data('user-authorized') === true);
	  },
	
	  loginSuccess: function () {
	  	var form = this.$el.find('form');
	    form.data('user-authorized', true);
	    $("#userapp").fadeOut();
	  },
	
	  loginFailure: function (errors) {
	  	var form = this.$el.find('form'),
	  		notice = $('#notice');
	  	var msg = _.map(errors, function(err){	return I18N[err]}).join("<br/>");
	    notice.text( msg).fadeIn().fadeOut(7000);;

	    User.shake("#userapp");
	    form.find('input[name="user[email]"]').focus();
	    form.find('input[type=submit]').removeClass('disabled');
	  },
	
	});    
    
    // Forgot Password
    var PasswordView = Backbone.View.extend({
    	el: $("#password-view"),
	  	events: { 
	  		"submit form":"resetPassword" 
	  	},
    	
    	initialize: function() {
		  //this.input = this.$("form #user-email");
		},
		
    	resetPassword: function(){
    		var notice = $("#notice");
    			email = this.$el.find("#user_email").val();
    		
    		User.resetPassword(email, function(data) {
			  	notice.text(I18N[data.notice]).fadeIn().fadeOut(7000);
			  	if(data && data.success){
			  		$("#userapp").fadeOut(7000);
			  	}else {
			  		User.shake("#userapp");
			  	} 
			});
			return false;
		}
    });
    
    // User View
    var UserView = Backbone.View.extend({
		// Bind to the existing skelton of the App already present in the HTML
		el: $("#userapp"),
		// template
		loginTemplate: Handlebars.compile($("#login-template").html()),
		signupTemplate: Handlebars.compile($("#signup-template").html()),
		passwordTemplate: Handlebars.compile($("#password-template").html()),
		
		// Delegated events
		events: {
		    "click  #login": "showLogin",
		    "click  #signup": "showSignup",
		    "click  #forgotPassword": "showForgotPassword",
		    //"submit #sign_in_user": "loginUser",
		},
		
		//Constructor
		initialize: function(){
		    //this.model = new User;
		    
		    //console.log(this.model);
		    
		    //this.listenTo(this.model, 'change', this.render);
		    //this.listenTo(this.model, 'all', this.render);
		    
		    this.input = this.$("#user_email");
		    this.login = this.$("#login");
		    this.signup = this.$("#signup");
		    this.forgotPassword = this.$("#forgotPassword");
		    this.loginView = this.$("#login-view");
		    this.signupView = this.$("#signup-view");
		    this.passwordView = this.$("#password-view");
		    this.notice = this.$el.find("#notice");
		},
		render: function(){
		    console.log(arguments);
		    alert(arguments);
		    return this;
		},
		
		showLogin: function(e){
		    //e.preventDefault();
		    this.login.parent().addClass("active");
		    _.each([this.signup,this.forgotPassword],function(el){el.parent().removeClass("active")});
		    this.loginView.show().html(this.loginTemplate());
		    this.signupView.hide();
		    this.passwordView.hide();
		},
		showSignup: function(e){
		    //e.preventDefault();
		    this.signup.parent().addClass("active");
		    _.each([this.login,this.forgotPassword],function(el){el.parent().removeClass("active")});
		    this.signupView.show().html(this.signupTemplate());
		    this.loginView.hide();
		    this.passwordView.hide();
		},
		showForgotPassword: function(e){
		    //e.preventDefault();
		    this.forgotPassword.parent().addClass("active");
		    _.each([this.signup,this.login],function(el){el.parent().removeClass("active")});
		    this.passwordView.show().html(this.passwordTemplate());
		    this.loginView.hide();
		    this.signupView.hide();
		},
	});
    
    var signupV = new SignupView;
    
    var loginV = new LoginView;
    
    var passwordV = new PasswordView;
    
    var userV = new UserView;
    userV.login.trigger("click");
    
});