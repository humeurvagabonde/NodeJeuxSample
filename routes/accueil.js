exports.index = function(req, res) {
  res.render('../views/accueil/index', {
	  title: 'Accueil ' + req.session.user.name
	, user: req.session.user.name
  });
};