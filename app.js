/**
 * Module dependencies.
 */
var express = require('express')
  , crypto = require('crypto')
  , notifications = require('express-messages')
  , utils = require('./lib/utils')
  , db = require('./lib/db')
  , error = require('./lib/error')
  , Unauthorized = require('./lib/unauthorized')
  , NotFound = require('./lib/notFound');

// Application
var app = express.createServer();
  
/**
 * Models
 */
require('./models/user');

/**
 * Routes
  */
var site = require('./routes/site')
  , post = require('./routes/post')
  , user = require('./routes/user')
  , session = require('./routes/session');
  
// SessionStore Management
//var RedisStore = require('connect-redis')(express);
var MongoStore = require('connect-mongo');

// NowJS
var nowjs = require("now");
exports = module.exports = everyone = nowjs.initialize(app);

everyone.now.distributeMessage = function(message){
  everyone.now.receiveMessage(this.now.name, message);
};


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
	, store: new MongoStore({url: "mongodb://localhost/sessions" })
	, clear_interval: 60 * 5
	, cookie: {  maxAge: 60000 * 5 } }));
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(error.router);

// Helpers
app.dynamicHelpers({ messages : notifications });
app.dynamicHelpers({ 
	request: function(req){ return req; },
	session: function(req, res){ return req.session; }
});

// General
app.get('/', site.index);

// Session management
app.get('/login', session.requestLogin);
app.get('/logout', session.logout);
app.post('/login', session.login);

// User
app.get('/users', user.list);
app.post('/user', user.create);
app.all('/user/:id/:op?', andRestrictToSelf, user.load);
app.get('/user/:id', user.view);
app.get('/user/:id/view', user.view);
app.get('/user/:id/edit', user.edit);
app.put('/user/:id/edit', user.update);

// Posts
app.get('/posts', post.list);

app.listen(3000);
console.log('Express app started on port 3000');

// Functions


function andRestrictToSelf(req, res, next) {
  // If our authenticated user is the user we are viewing
  // then everything is fine :)
  if (req.session && req.session.user) {
    next();
  } else {
    // You may want to implement specific exceptions
    // such as UnauthorizedError or similar so that you
    // can handle these can be special-cased in an error handler
    // (view ./examples/pages for this)
    next(new Unauthorized('Vous devez être connecté pour cette action.'));
  }
}

function andRestrictTo(role) {
  return function(req, res, next) {
    if (req.authenticatedUser.role == role) {
      next();
    } else {
      next(new Unauthorized('Vous ne disposez pas des droits nécessaires pour cette action.'));
    }
  }
}