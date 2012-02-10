var Unauthorized = require('./unauthorized')

exports.router = function (err, req, res, next) {
  // log it
  console.error(err.stack);

  if (err instanceof Unauthorized) {
	req.flash('error', err.message);
    res.redirect('home');
  } else {
	// respond with 500 "Internal Server Error".
	res.send(500);
  }
};