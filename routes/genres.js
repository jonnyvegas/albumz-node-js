var express = require('express');
var router = express.Router();
var firebase = require("firebase");

router.get('/', function(req, res, next) {
  	var genreRef = firebase.database().ref().child("genres");;

	genreRef.once('value', function(snapshot){
		var genres = [];
		snapshot.forEach(function(childSnapshot){
			var key = childSnapshot.key;
			var childData = childSnapshot.val();
			genres.push({
				id: key,
				name: childData.name
			});
		});
		res.render('genres/index',{genres: genres});
	});
});

router.get('/add', function(req, res, next) {
  	res.render('genres/add');
});

router.post('/add', function(req, res, next) {
  	var genre = {
  		name: req.body.name
  	}

  	var genreRef = firebase.database().ref().child("genres");
  	genreRef.push().set(genre);

  	req.flash('success_msg', 'Genre Saved');
  	res.redirect('/genres');
});

router.get('/edit/:id', function(req, res, next) {
	var id = req.params.id;
	var genreRef = firebase.database().ref("genres/" + id);
  	genreRef.once('value', function(snapshot) {
		var genre = snapshot.val();
		res.render('genres/edit', {genre: genre, id: id});
	});
});

router.post('/edit/:id', function(req, res, next) {
	var id = req.params.id;
	var name = req.body.name;
	var genreRef = firebase.database().ref("genres/" + id);
  	genreRef.update({
  		name: name,
  	});
  	res.redirect('/genres');
});

router.delete('/delete/:id', function(req, res, next) {
	var id = req.params.id;
	var genreRef = firebase.database().ref("genres/" + id);
  	genreRef.remove();
	req.flash('success_msg','Genre Deleted');
	res.send(200);
});

module.exports = router;



