// Fake user database
var users = [
    { name: 'TJ', password: 'tjp', email: 'tj@vision-media.ca' }
  , { name: 'Tobi', password: 'tobip', email: 'tobi@vision-media.ca' }
];

var utils = require('../lib/utils')
var userService = require('../lib/userService');
//var User = mongoose.model('User');

exports.list = function(req, res){
  res.render('users', { title: 'Users', users: users });
};
/* a mettre dans userService */
/*
exports.load = function(req, res, next){
	User.findById(req.params.id, function (err, user) {
		if (err) {
			next(new Error('cannot find user ' + req.params.id));
		} else {
			req.user = user;
			next();
		}
	});
};
*/

exports.create = function(req, res) {
console.log('Create' + req.body.user) ;
	userService.register(req.body.user, function(err, user) {
		if (err) {
			utils.mongooseErrorHandler(err, req);
			console.log('Save failure / ' + err);
			res.redirect('/');
		} else {
			req.flash('notice', 'Created successfully');
			console.log('Created successfully / ' + user._id);
			req.session.user = user;
			res.redirect('/compte');
		}
	});
};

exports.view = function(req, res) {
  console.log('Op asked : view ' + req.params.id);
  res.render('../views/users/view', {
	  title: 'Viewing user ' + req.user.name
	, user: req.user
  });
};

exports.edit = function(req, res){
  res.render('users/edit', {
      title: 'Editing user ' + req.user.name
    , user: req.user
  });
};

exports.update = function(req, res){
  // Normally you would handle all kinds of
  // validation and save back to the db
  var user = req.body.user;
  req.user.name = user.name;
  req.user.email = user.email;
  res.redirect('back');
};