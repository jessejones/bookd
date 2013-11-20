'use strict';


// Declare app level module which depends on filters, and services
angular.module('bookd', [
  'ngRoute',
  'ngSanitize',
  'bookd.filters',
  'bookd.services',
  'bookd.directives',
  'bookd.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/blackout.html', controller: 'BlackoutCtrl'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);