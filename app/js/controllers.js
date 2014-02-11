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

        $scope.$on('save', function(e, data) {
          $scope.$apply(function() {
            $scope.mode = 'save';
            $scope.blackoutImage = data;
          });
        });

        $scope.startNew = function() {
          if ($window.confirm('Are you sure you want to start a new poem?')) {
            $scope.source = false;
            $scope.$broadcast('clear');
            $scope.init();
          }
        };

        $scope.init();
      }
    ]
  );