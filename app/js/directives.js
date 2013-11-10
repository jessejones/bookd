'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('canvasText', ['$timeout', 'CanvasText', function($timeout, CanvasText) {
    var testTextBEM = 'c5MQB73bVWP1mV';
    var testTextB = 'dYSk1a9bwDjttV';
    return {
      restrict: 'A',
      controller: ['$scope', 'pcArticle', function($scope, pcArticle) {
        pcArticle.chooseArticle(getArticle);

        function getArticle(data) {
          pcArticle.getArticle(data.articles[0].id, setArticle);
          // pcArticle.getArticle(testTextBEM, setArticle);
        }

        function setArticle(data) {
          $scope.title = data.article.book.title;
          console.log(data.article.content);
          $scope.text = pcArticle.canvasText(data.article.content);
        }

        $scope.drawCanvasText = function(element, text) {
          var ct = new CanvasText();
          var canvas = element;
          var context = canvas.getContext('2d');

          ct.config({
            canvas: canvas,
            context: context,
            fontFamily: 'Georgia',
            fontSize: '14px',
            fontWeight: 'normal',
            fontColor: '#000',
            lineHeight: '24'
          });

          // ct.defineClass('', {});

          ct.defineClass('h2', {
            fontFamily: 'Georgia',
            fontSize: '16px',
            fontWeight: 'normal',
            fontColor: '#000',
            lineHeight: '30'
          });

          ct.defineClass('blockquote', {
            fontFamily: 'Georgia',
            fontSize: '14px',
            fontStyle: 'italic',
            fontColor: '#000',
            lineHeight: '30'
          });

          ct.defineClass('em', {
            fontFamily: 'Georgia',
            fontSize: '14px',
            fontStyle: 'italic',
            fontColor: '#000',
            lineHeight: '30'
          });

          ct.drawText({
            text: text,
            x: 40,
            y: 40,
            boxWidth: 700
          });
        };

      }],
      link: function(scope, elem, attr) {
        scope.$watch('text', function(text) {
          console.log(text);
          if(text) {
            scope.drawCanvasText(elem[0], text);
          }
        });
      }
    };
  }]);