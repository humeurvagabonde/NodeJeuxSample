/*----------------------------------
 * Game Model Definition
 *-----------------------------------*/
var ObjectId = Schema.ObjectId;
var User = mongoose.model('User');

var GameDescriptorSchema = new Schema({
	creationDate: { type: Date, default: Date.now }
  , lastModificationDate: Date
  , status: { type: String, enum: ['WAITING', 'STARTED', 'COMPLETED'] }
  , type: { type: String, enum: ['TicTacToe', 'SteamTorpedo'] }
  , players: [User.Schema]
});

mongoose.model('GameDescriptor', GameDescriptorSchema);