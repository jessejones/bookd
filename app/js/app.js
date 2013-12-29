'use strict';


// Declare app level module which depends on filters, and services
angular.module('bookd', [
  'ngRoute',
  'ngSanitize',
  'bookd.services',
  'bookd.directives',
  'bookd.controllers'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {templateUrl: '/partials/blackout.html', controller: 'BlackoutCtrl'})
  .when('/share/:provider', {templateUrl: '/partials/share.html', controller: 'ShareCtrl'})
  .otherwise({redirectTo: '/'});
  $locationProvider.html5Mode(true).hashPrefix('!');
}]);