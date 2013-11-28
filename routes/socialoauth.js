var qs = require('querystring');
var request = require('request');
var  q = require('q');

var Twitter = (function() {
  var consumer_key = 'xrl36Mmyeui5z0r9OJK1Jg';
  var consumer_secret = 'VAIw1WrBhUVhfExx1fMO6W2Rav4Dz9zwP8dwdszZk';
  var version = '1.0';
  var oauth = { consumer_key:consumer_key, consumer_secret:consumer_secret, version:version };

  function getRequestToken() {
    oauth.callback = 'http://10.0.0.5:3000/oauth-complete/twitter';
    var deferred = q.defer();
    var url = 'https://api.twitter.com/oauth/request_token';

    request.post({ url:url, oauth:oauth }, function(e, r, body) {
      var body = qs.parse(body);
      if (body.oauth_callback_confirmed) {
        deferred.resolve(body);
      }
      else {
        deferred.reject(body);
      }
    });
    return deferred.promise;
  }

  function getAccessToken(credentials) {
    var deferred = q.defer();
    oauth.token = credentials.token;
    oauth.verifier = credentials.verifier;
    var url = 'https://api.twitter.com/oauth/access_token';

    request.post({ url:url, oauth:oauth }, function(e, r, body) {
      var body = qs.parse(body);
      deferred.resolve(body);
    });
    return deferred.promise;
  }

  return {
    oauth: oauth,
    getRequestToken: getRequestToken,
    getAccessToken: getAccessToken
  };

})();

exports.Twitter = Twitter;