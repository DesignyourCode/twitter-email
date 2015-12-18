var express = require('express'),
	app = express(),
	path = require('path'),
	Twitter = require('twitter'),
	webshot = require('webshot'),
	nunjucks = require('nunjucks');

var client = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token_key: process.env.ACCESS_KEY,
	access_token_secret: process.env.ACCESS_SECRET
});

var env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(express.static(__dirname + './assets'));

// Creating home page
app.get('/', function (req, res) {
	var current_url = req.protocol + '://' + req.get('host'),
		username = 'designyourcode',
		params = {screen_name: username};

	client.get('statuses/user_timeline', params, function(error, tweets, response){
	 	if (!error) {
		  	res.render('index.html.nunjs', {
				current_url : current_url,
		  		tweets		: tweets,
		  		username	: username
		  	});
		}
	});
});

// Build feed
app.get('/output/:username', function (req, res) {
	var url = req.protocol + "://" + req.get('host') + req.originalUrl,
		username = req.params.username,
		params = {screen_name: username};

	client.get('statuses/user_timeline', params, function(error, tweets, response){
	 	if (!error) {
		  	res.render('feed.html.nunjs', {
		  		tweets	 : tweets,
		  		username : username
		  	});
		}
	});
});

app.get('/:username', function (req, res) {
	var username = req.params.username,
		url = req.protocol + "://" + req.get('host') + '/output/' + username;

	// Screenshot
	var options = {
		defaultWhiteBackground: true,
		streamType: 'png'
	};

	webshot(url, function(err, renderStream) {
		renderStream.pipe(res);
	});
});

app.get('/:username', function (req, res) {
	var username = req.params.username,
		url = req.protocol + "://" + req.get('host') + '/output/' + username;

	// Screenshot
	var options = {
		defaultWhiteBackground: true,
		streamType: 'png'
	};

	webshot(url, function(err, renderStream) {
		renderStream.pipe(res);
	});
});

// Custom filters
env.addFilter('limitTo', function(input, limit){
	if(typeof limit !== 'number'){
		return input;
	}
	if(typeof input === 'string'){
		if(limit >= 0){
			return input.substring(0, limit);
		} else {
			return input.substr(limit);
		}
	}
	if(Array.isArray(input)){
		limit = Math.min(limit, input.length);
		if(limit >= 0){
			return input.splice(0, limit);
		} else {
			return input.splice(input.length + limit, input.length);
		}
	}
	return input;
});

// Set server port
app.listen(process.env.PORT);
console.log('server is running');
