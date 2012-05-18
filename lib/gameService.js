var utils = require('./utils');
var GameDescriptor = mongoose.model('GameDescriptor');
var TicTacToe = mongoose.model('TicTacToe');

exports.create = function(user, name, callback) {
    var gameDescriptorModel = createDescriptor();
	gameDescriptorModel.type = 'TicTacToe';
	gameDescriptorModel.players.push(user);
	
	var tictactoeModel = new TicTacToe();
	tictactoeModel.gameDescriptor = gameDescriptorModel;
	
	tictactoeModel.save(function(err, model) {
		callback(err, model);
	});
}

function createDescriptor () {
	return new GameDescriptor( { status: 'WAITING' } );
}
