var Unauthorized = require('../lib/unauthorized')
var userService = require('../lib/userService');

exports.index = function(req, res){
  res.render('index', { title: 'Route Separation Example' });
};

exports.login = function(req, res, next){
  userService.login(req.body.user, function(err, loggedUser){
    if (loggedUser) {
      // Regenerate session when signing in to prevent fixation 
      req.session.regenerate(function(){
        // Store the user's primary key 
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = loggedUser;
		req.session.games = new Array();
		req.flash('info', 'Success');
        res.redirect('/compte');
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.';
	  req.flash('error', req.session.error);
	  next(new Error('AGH'));
    }
  });
}

exports.logout = function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('home');
  });
}

exports.error = function (err, req, res, next) {
  if (err instanceof Unauthorized) {
	req.flash('error', err.message);
    res.redirect('home');
  } else {
	// respond with 500 "Internal Server Error".
	//res.send(500);
	req.flash('error', err.message);
    res.redirect('home');
  }
};