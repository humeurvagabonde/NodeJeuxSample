var Unauthorized = require('./unauthorized')
  , NotFound = require('./notFound');

exports.loggedIn = function isLoggedIn(req, res, next) {
	if (req.session && req.session.user) {
		req.loggedIn = true;
	}
	next();
}

exports.andRestrictToSelf = function andRestrictToSelf(req, res, next) {
  // If our authenticated user is the user we are viewing then everything is fine :)
  if (req.loggedIn) {
    next();
  } else {
    // You may want to implement specific exceptions
    // such as UnauthorizedError or similar so that you
    // can handle these can be special-cased in an error handler
    // (view ./examples/pages for this)
    next(new Unauthorized('Vous devez étre connecté pour cette action.'));
  }
}

exports.andRestrictTo = function andRestrictTo(role) {
  return function(req, res, next) {
    if (req.authenticatedUser.role == role) {
      next();
    } else {
      next(new Unauthorized('Vous ne disposez pas des droits nécessaires pour cette action.'));
    }
  }
}