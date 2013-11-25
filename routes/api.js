/*
 * Serve JSON to our AngularJS client
 */

var request = require('request');
var qs = require('querystring');
var fs = require('fs');
var q = require('q');

// var parseDataURI = function(uri) {
//   var data = uri.replace(/^data:img\/png;base64,/, '');
//   return new Buffer(data, 'base64');
// };

var toTwitter = function(oauth_token, oauth_token_secret, input) {
  var url = 'https://api.twitter.com/1.1/statuses/update_with_media.json';
  var oauth = {
    consumer_key: 'xrl36Mmyeui5z0r9OJK1Jg',
    consumer_secret: 'VAIw1WrBhUVhfExx1fMO6W2Rav4Dz9zwP8dwdszZk',
    token: oauth_token,
    token_secret: oauth_token_secret,
    version: '1.0',
  };
  var params = {
    include_entities: true,
    status: input.status
  };
  // url += '?' + qs.stringify(params);
  var headers = {
    'content-type': 'multipart/form-data'
  };
  var multipart = [
    {
      'Content-Disposition': 'form-data; name="status"',
      body: input.status
    },
    {
      'Content-Disposition': 'form-data; name="media[]"',
      'Content-Type': 'application/octet-stream;',
      body: new Buffer(input['media[]'].replace(/^data:image\/png;base64,/, ''), 'base64')
    }
  ];
  var deferred = q.defer();

  request.post({url: url, headers: headers, oauth: oauth, multipart: multipart}, function(error, obj, response) {
    if (error) {
      deferred.resolve(error);
    }
    else {
      deferred.resolve(response);
    }
  });

  return deferred.promise;
};

exports.share = function (req, res) {
  var data = req.body;

  toTwitter(data.oauth_token, data.oauth_token_secret, data.input)
  .then(function(response) { res.send(response); });
};