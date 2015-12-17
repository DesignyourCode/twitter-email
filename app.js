var express = require('express'),
	app = express(),
	path = require('path'),
	Twitter = require('twitter'),
	webshot = require('webshot');

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
	var url = req.protocol + "://" + req.get('host') + req.originalUrl,
		username = req.params.username,
		params = {screen_name: username};

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

// Set server port
app.listen(process.env.PORT);
console.log('server is running');
