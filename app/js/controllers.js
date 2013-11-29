'use strict';

/* Controllers */

angular.module('bookd.controllers', [])
  .controller('BlackoutCtrl', [
      '$scope', 
      'penguinClassics',
      'credentials', 
      'share',
      function($scope, penguin, credentials, share) {
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
            $scope.mode = 'share';
            $scope.blackoutImage = data;
          });
        });

        $scope.startNew = function() {
          $scope.clear();
          $scope.init();
        };

        $scope.share = function() {
          share.storeMedia($scope.blackoutImage);
          credentials.popup('twitter');
        };

        $scope.init();
      }
    ]
  )
  .controller('ShareCtrl', [
    '$scope',
    '$routeParams',
    '$location',
    '$window',
    'credentials',
    'share',
    function($scope, $routeParams, $location, $window, credentials, share) {
      var provider = $scope.provider = $routeParams.provider;

      var data = share.getMedia();
      if (!data) {
        $location.url('/');
      }
      else {
        $scope.edit = true;
        $scope.input = {};
        $scope.input.media = data;
      }

      $scope.post = function() {
        var input = $scope.input;
        share.storeMessage(input.status);

        share.post(input)
             .then(function(data) {
               $scope.edit = false;
               $scope.message = 'You tweeted: ' + data.text;
               $window.setTimeout(function() {
                 $window.close();
               }, 5000);
             });
      };
    }
  ]);