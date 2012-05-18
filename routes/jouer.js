var gameService = require('../lib/gameService');

exports.index = function(req, res) {
  res.render('../views/jouer/index', {
	  title: 'Jouer'
  });
};

exports.gameIndex = function(req, res) {
  console.log('Game Index for ' + req.params.game);
  res.render('../views/jouer/game/index', {
	  title: 'Viewing user '
  });
};

exports.create = function(req, res) {
 gameService.create(req.user, req.params.game, function(err, game) {
		if (err) {
			utils.mongooseErrorHandler(err, req);
			console.log('Game creation fails / ' + err);
			res.redirect('/jouer/' + req.params.game);
		} else {
			req.flash('notice', 'Game Created successfully');
			console.log('Created successfully / ' + game._id);
			req.session.games.push(game);
			res.render('../views/jouer/game/' + game._id);
		}
	});
}