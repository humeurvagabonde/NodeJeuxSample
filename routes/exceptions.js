function Unauthorized(msg){
  this.name = 'Unauthorized';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

function NotFound(msg){
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

Unauthorized.prototype.__proto__ = Error.prototype;
NotFound.prototype.__proto__ = Error.prototype;

/*
module.exports = function(app) {
	app.get('/401', function(req, res){
	  console.log('youp');
	  throw new Unauthorized('');
	});
	
	app.get('/404', function(req, res){
	  throw new NotFound('');
	});

	app.get('/500', function(req, res){
	  throw new Error('keyboard cat!');
	});
}
*/

exports = Unauthorized;
exports = NotFound;