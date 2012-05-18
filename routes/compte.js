exports.index = function(req, res) {
  res.render('../views/compte/index', {
	user: req.session.user.name
  });
};