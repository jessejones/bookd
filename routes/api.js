/*
 * Serve JSON to our AngularJS client
 */

var request = require('request');
var fs = require('fs');
var q = require('q');
var social = require('./socialoauth');

var toTwitter = function(oauth_token, oauth_token_secret, input) {
  var url = 'https://api.twitter.com/1.1/statuses/update_with_media.json';
  var t = social.Twitter;
  var oauth = t.oauth;
  oauth.token = oauth_token;
  oauth.token_secret = oauth_token_secret;
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
      body: new Buffer(input.media.replace(/^data:image\/png;base64,/, ''), 'base64')
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
  var auth = req.session.auth;

  toTwitter(auth.oauth_token, auth.oauth_token_secret, data)
    .then(function(response) { res.send(response); });
};