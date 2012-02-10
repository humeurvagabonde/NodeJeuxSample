// Fake user database
var users = [
    { name: 'TJ', password: 'tjp', email: 'tj@vision-media.ca' }
  , { name: 'Tobi', password: 'tobip', email: 'tobi@vision-media.ca' }
];

var utils = require('../lib/utils')
var User = mongoose.model('User');

exports.list = function(req, res){
  res.render('users', { title: 'Users', users: users });
};

exports.load = function(req, res, next){
	console.log('Op asked : load ' + req.params.id);
	User.findById(req.params.id, function (err, user) {
		if (err) {
			next(new Error('cannot find user ' + req.params.id));
		} else {
			req.user = user;
			next();
		}
	});
};

exports.create = function(req, res) {
console.log('Op asked : create');
	var newUser = new User(req.body.user);
	newUser.save(function(err) {
		if (err) {
			utils.mongooseErrorHandler(err, req);
			console.log('Save failure / ' + err);
			res.redirect('/');
		} else {
			req.flash('notice', 'Created successfully');
			console.log('Created successfully / ' + newUser._id);
			req.session.user = newUser;
			res.redirect('/accueil');
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