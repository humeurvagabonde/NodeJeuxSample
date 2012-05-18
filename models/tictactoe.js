/*----------------------------------
 * TicTacToe Model Definition
 *-----------------------------------*/
var ObjectId = Schema.ObjectId;

var TicTacToeSchema = new Schema({
	gameDescriptor : ObjectId
  , activePlayer : ObjectId
});

mongoose.model('TicTacToe', TicTacToeSchema);