'use strict';

/* Controllers */

angular.module('bookd.controllers', [])
  .controller('BlackoutCtrl', [
      '$scope', 
      'penguinClassics', 
      'OAuth', 
      'credentials', 
      'share',
      function($scope, penguin, OAuth, credentials, share) {
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

        $scope.tweet = function() {
          var cred = credentials.get('twitter');
          if (!cred) {
            OAuth.popup('twitter');
          }
          else {
            cred = JSON.parse(cred);
            var data = {};
            data.status = 'testing twitter integration';
            data['media[]'] = $scope.blackoutImage;
            share.post({oauth_token: cred.token, oauth_token_secret: cred.secret, input: data});
          }
        };

        $scope.init();
      }]);