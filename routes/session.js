var users = {    'tj' : { name: 'TJ', password: 'tjp', email: 'tj@vision-media.ca' }  , 'tobi' : { name: 'Tobi', password: 'tobip', email: 'tobi@vision-media.ca' }};exports.requestLogin = function(req, res){  if (req.session.user) {    req.session.success = 'Authenticated as ' + req.session.user.name      + ' click to <a href="/logout">logout</a>. '      + ' You may now access <a href="/restricted">/restricted</a>.';  }  res.redirect('home');}exports.login = function(req, res){  authenticate(req.body.username, req.body.password, function(err, user){    if (user) {      // Regenerate session when signing in to prevent fixation       req.session.regenerate(function(){        // Store the user's primary key         // in the session store to be retrieved,        // or in this case the entire user object        req.session.user = user;		req.flash('info', 'Success');        res.redirect('/accueil');      });    } else {      req.session.error = 'Authentication failed, please check your '        + ' username and password.';	  req.flash('error', req.session.error);      res.redirect('home');    }  });}exports.logout = function(req, res){  // destroy the user's session to log them out  // will be re-created next request  req.session.destroy(function(){    res.redirect('home');  });}function authenticate(login, password, callback) {  var user = users[login];  // query the db for the given username  if (!user) return callback(new Error('cannot find user'));  // apply the same algorithm to the POSTed password, applying  // the hash against the pass / salt, if there is a match we  // found the user  if (user.password == password) return callback(null, user);  // Otherwise password is invalid  callback(new Error('invalid password'));}