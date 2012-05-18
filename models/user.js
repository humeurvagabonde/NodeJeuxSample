/*----------------------------------
 * User Model Definition
 *-----------------------------------*/
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	creationDate : { type: Date, default: Date.now }
  , lastModificationDate : Date
  , profile : {
	    nickname : { type: String, required: true, unique: true }
	  , password : { type: String, required: true }
	  , name : { type: String }
	  , firstname : { type: String }
	  , email : { type: String }
    }
});

mongoose.model('User', UserSchema);