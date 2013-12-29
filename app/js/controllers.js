'use strict';

/* Controllers */

angular.module('bookd.controllers', [])
  .controller('BlackoutCtrl', [
      '$scope',
      '$window',
      'penguinClassics',
      function($scope, $window, penguin) {
        $scope.init = function() {
          penguin.randomArticle().then(function(data) { $scope.source = data; });
          $scope.mode = 'edit';
          $scope.blackoutImage = '';
        };

        $scope.edit = function() {
          $scope.mode = 'edit';
        };

        $scope.clear = function() {
          $scope.$broadcast('clear');
        };

        $scope.$on('save', function(e, data) {
          $scope.$apply(function() {
            $scope.mode = 'save';
            $scope.blackoutImage = data;
          });
        });

        $scope.startNew = function() {
          $scope.clear();
          $scope.init();
        };

        $scope.init();
      }
    ]
  );