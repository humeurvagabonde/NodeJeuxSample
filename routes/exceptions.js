﻿function Unauthorized(msg){
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

exports = Unauthorized;
exports = NotFound;