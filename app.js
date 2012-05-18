/**
 * Module dependencies.
 */
var express = require('express')
  , crypto = require('crypto')
  , notifications = require('express-messages')
  , auth = require('./lib/authorization')
  , utils = require('./lib/utils')
  , db = require('./lib/db');

// Application
var app = express.createServer();

/**
 * Models
 */
require('./models/user');
require('./models/game');
require('./models/tictactoe');

/**
 * Services
 */
var gameService = require('./lib/gameService');

/**
 * Routes
  */
var site    = require('./routes/site')
  , compte  = require('./routes/compte')
  , jouer   = require('./routes/jouer')
  , user    = require('./routes/user');
  
// SessionStore Management
//var RedisStore = require('connect-redis')(express);
var MongoStore = require('connect-mongo');
var sessionStore = new MongoStore({url: "mongodb://localhost/sessions" });

// NowJS
var nowjs = require("now");
exports = module.exports = everyone = nowjs.initialize(app);

//  Application Config
//var configLoader = require('yaml-config');
//exports = module.exports = config = configLoader.readConfig('config/db.yaml');
//exports = module.exports = config = configLoader.readConfig('config/db.yaml');

// Server Config
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(express.session({ 
	  secret: "homesweethome"
	, store: sessionStore
	, clear_interval: 60 * 5
	, cookie: {  maxAge: 60000 * 5 } }));
app.use(auth.loggedIn);
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(site.error);

// Helpers
app.dynamicHelpers({ 
      messages : notifications
	, request:  function(req, res){ return req; }
	, response: function(req, res){ return res; }
	, session:  function(req, res){ return req.session; }
	
});

// General
app.all('/', utils.currentPage('accueil'));
app.get('/', site.index);

// Login (temporary state)
app.post('/login', site.login);
app.get('/logout', site.logout);

// User homepage
app.all('/compte', utils.currentPage('compte'), auth.andRestrictToSelf);
app.get('/compte', compte.index);

// Play 
app.all('/jouer', utils.currentPage('jouer'), auth.andRestrictToSelf);
app.get('/jouer', jouer.index);
app.get('/jouer/:game', jouer.gameIndex);
app.post('/jouer/:game', jouer.create);

// User
app.get('/users', user.list);
app.post('/user', user.create);
app.all('/user/:id/:op?', auth.andRestrictToSelf, user.load);
app.get('/user/:id', user.view);
app.get('/user/:id/view', user.view);
app.get('/user/:id/edit', user.edit);
app.put('/user/:id/edit', user.update);

app.listen(3000);
console.log('Express app started on port 3000');

// functions
everyone.now.createGame = function(name) {
    var nowUser = this.user;
	var sid = unescape(this.user.cookie['connect.sid']);
	sessionStore.get(sid, function(err, session) {
		if (err) {
			console.log('Cant load session : ' + err);
		} else {
			gameService.create(session.user, name, function(err, game) {
				if (err) {
					utils.mongooseErrorHandler(err, req);
					console.log('Game creation fails / ' + err);
					
				} else {
					console.log('Created successfully / ' + game._id);
					session.games.push(game);
					everyone.now.receiveGameCreated('Partie créée : ' + game._id);
				}
			});
		}
	});
}

everyone.now.addTo = function(game) {
    var nowUser = this.user;
	var sid = unescape(this.user.cookie['connect.sid']);
	sessionStore.get(sid, function(err, session) {
		if (err) {
			console.log('Cant load session : ' + err);
		} else {
			var gameGroup = nowjs.getGroup(game);
			gameGroup.hasClient(nowUser.clientId, function (bool) { 
				if (!bool) {
					nowUser.nickname = '[' + session.user.profile.nickname + ']';
					gameGroup.addUser(nowUser.clientId);
				} else {
				    console.log('User is already a member of `group`. User : ' + nowUser.nickname);
				}	
			});
		}
	});
}

everyone.now.sendMessageToChannel = function(group, message) {
	var gameGroup = nowjs.getGroup(group);
	var formattedMessage = this.user.nickame + ' ' + message;
	gameGroup.now.receiveMessage(formattedMessage);
}

everyone.now.sendNotification = function() {
  var formattedMessage = this.user.nickname + ' ' + message;
  everyone.now.notify(formattedMessage);
}