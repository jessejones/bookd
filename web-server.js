#!/usr/bin/env node

require('newrelic');

/**
 * Module dependencies
 */

var express = require('express'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();

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
}

// production only
// if (app.get('env') === 'production') {
// };

app.use(express.static(path.join(__dirname, '/app')));
app.use(app.router);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});