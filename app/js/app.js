'use strict';


// Declare app level module which depends on filters, and services
angular.module('bookd', [
  'ngRoute',
  'ngSanitize',
  'bookd.filters',
  'bookd.services',
  'bookd.directives',
  'bookd.controllers',
  'oauth.io'
]).
config(['$routeProvider', 'OAuthProvider', function($routeProvider, OAuthProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/blackout.html', controller: 'BlackoutCtrl'});
  $routeProvider.otherwise({redirectTo: '/'});

  OAuthProvider.setPublicKey('BzEOe8jjOVbv3wnAil2s-7-HirM');
  OAuthProvider.setHandler('twitter', ['OAuthData', 'credentials', function(OAuthData, credentials) {
  	var cred = {
  		token: OAuthData.result.oauth_token,
  		secret: OAuthData.result.oauth_token_secret
  	};

  	credentials.set('twitter', cred);
  }]);
}]);