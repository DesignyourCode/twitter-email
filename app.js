var express = require('express');
var app = express();
var path = require('path');
var Twitter = require('twitter');
var webshot = require('webshot');

var assert = require('assert');
var env = require('node-env-file');

env(__dirname + '/.env');

var client = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token_key: process.env.ACCESS_KEY,
	access_token_secret: process.env.ACCESS_SECRET
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static('public'));

// Creating home page
app.get('/', function (req, res) {
	var current_url = req.protocol + '://' + req.get('host');

	res.render('index', {
		current_url: current_url
	});
});

// Build feed
app.get('/output/:username', function (req, res) {
	var username = req.params.username;
	var url = req.protocol + "://" + req.get('host') + req.originalUrl;

	var params = {screen_name: username};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	 	if (!error) {
		  	res.render('feed', {
		  		tweets: tweets,
		  		username: username
		  	});
		}
	});

});

app.get('/:username', function (req, res) {
	var username = req.params.username;
	var url = req.protocol + "://" + req.get('host') + '/output/' + username;

	// Screenshot
	webshot(url, function(err, renderStream) {
		renderStream.pipe(res);
	});
});

// Set server port
app.listen(4000);
console.log('server is running');
