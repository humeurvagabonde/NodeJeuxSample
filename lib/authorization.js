/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.loggedIn) {
    req.flash('notice', 'You are not authorized. Please login')
    res.redirect('/')
  }
  next()
};