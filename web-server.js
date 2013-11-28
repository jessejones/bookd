#!/usr/bin/env node

/**
 * Module dependencies
 */

var express = require('express'),
	oauth = require('./routes/auth'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();
var RedisStore = require('connect-redis')(express);

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('json prefix', ')]}\',\n');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
  app.use(express.cookieSession(
  	{
  		secret: '12DEFAA632C39E34', 
  		cookie: { path: '/', httpOnly: true, maxAge: 3600000}
  	}
  ));
}

// production only
if (app.get('env') === 'production') {
  app.use(express.cookieSession(
  	{
  		store: new RedisStore({
  			host: 'spinyfin.redistogo.com',
  			port: 9017,
  			db: 1,
  			pass: '3b615eee9e7a8e0b3f85efd4e46a8668'
  		}),
  		secret: '12DEFAA632C39E34', 
  		cookie: { path: '/', httpOnly: true, maxAge: 3600000}
  	}
  ));
};

app.use(express.static(path.join(__dirname, '/app')));
app.use(app.router);

/**
 * Routes
 */

 // OAuth
app.get('/signin/:provider', oauth.signin);
app.get('/auth/:provider', oauth.auth);
app.get('/oauth-complete/twitter', oauth.complete);

// JSON API
app.post('/api/share', api.share);

// Send all other requests to Angular.js app
app.get(/^\/(?!#!)/, function(req, res, next) {
	res.sendfile('./app/index.html');
});

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});