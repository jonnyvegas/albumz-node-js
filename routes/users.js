var express = require('express');
var router = express.Router();
var firebase = require("firebase");

router.get('/register', function(req, res, next) {
  	res.render('users/register');
});

// Home Page
router.get('/login', function(req, res, next) {
  	res.render('users/login');
});

router.post('/register', function(req, res, next) {
  	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;
	var location = req.body.location;
	var fav_artists = req.body.fav_artists;
	var fav_genres = req.body.fav_genres;
	// Validation
	req.checkBody('first_name', 'First name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('users/register', {
			errors: errors
		});
		console.log("there are errors");
	} else {
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  		// Handle Errors here.
 		 	var errorCode = error.code;
  			var errorMessage = error.message;
  		// ...
		});
		var user = {
					
					email: email,
					first_name: first_name,
					last_name: last_name,
					location: location,
					fav_genres: fav_genres,
					fav_artists: fav_artists
				}

				var userRef = firebase.database().ref().child("users");
				userRef.push().set(user);

				req.flash('success_msg', 'You are now registered and can login');
				res.redirect('/users/login');
	}
});

router.post('/login', function(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;
		// Validation
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('users/login', {
			errors: errors
		});
		console.log("there are errors");
	} else {
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  		// Handle Errors here.
 		 	var errorCode = error.code;
  			var errorMessage = error.message;
  			req.flash('error_msg', 'Login failed')
  			//res.redirect('/users/login')
  		// ...
		});

		req.flash('success_msg', 'You are now logged in.');
		res.redirect('/albums');
	}
});

router.get('/logout', function(req, res) {
	firebase.auth().signOut().then(function() {
  // Sign-out successful.
  req.flash("success_msg", "You have been logged out.");
  res.redirect('/users/login')
}).catch(function(error) {
  // An error happened.
});
});

module.exports = router;
