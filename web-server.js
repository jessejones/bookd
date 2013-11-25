#!/usr/bin/env node

/**
 * Module dependencies
 */

var express = require('express'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'app')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */

// serve index
// app.get('/', routes.index);

// JSON API
app.post('/api/share', api.share);

// redirect all others to the index (HTML5 history)
// app.get('*', routes.index);
app.use(function(req, res, next){
  res.send(404, '404 Not Found');
});


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});