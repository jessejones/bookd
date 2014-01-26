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
          if ($window.confirm('Are you sure you want to clear your work?')) {
            $scope.$broadcast('clear');
            return true;
          }
          else {
            return false;
          }
        };

        $scope.$on('save', function(e, data) {
          $scope.$apply(function() {
            $scope.mode = 'save';
            $scope.blackoutImage = data;
          });
        });

        $scope.startNew = function() {
          if ($scope.clear()) {
            $scope.init();
          }
        };

        $scope.init();
      }
    ]
  );