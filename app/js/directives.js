'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('blackoutCanvas', ['$window', function($window) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var canvas = element[0];
        var context = canvas.getContext('2d');
        var clickX = [];
        var clickY = [];
        var clickDrag = [];
        var paint;

        scope.width = $(canvas).width();
        scope.height = $(canvas).height();

        function addClick(x, y, dragging)
        {
          clickX.push(x);
          clickY.push(y);
          clickDrag.push(dragging);
        }

        function redraw(){
          context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
          
          context.strokeStyle = "#000";
          context.lineJoin = "round";
          context.lineWidth = 10;
              
          for(var i=0; i < clickX.length; i++) {
            context.beginPath();
            if(clickDrag[i] && i){
              context.moveTo(clickX[i-1], clickY[i-1]);
            }
             else{
              context.moveTo(clickX[i]-1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.stroke();
          }
        }

        $(canvas).mousedown(function(e){

          var parentOffset = $(this).parent().offset();
          var mouseX = e.pageX - parentOffset.left;
          var mouseY = e.pageY - parentOffset.top;
            
          paint = true;
          addClick(mouseX, mouseY);
          redraw();
        });

        $(canvas).mousemove(function(e){
          if(paint){
            var parentOffset = $(this).parent().offset();
            var mouseX = e.pageX - parentOffset.left;
            var mouseY = e.pageY - parentOffset.top;
            addClick(mouseX, mouseY, true);
            redraw();
          }
        });

        $(canvas).mouseup(function(e){
          paint = false;
        });
      }
    };
  }])
  .directive('canvasText', ['CanvasText', function(CanvasText) {
    var testTextBEM1 = 'c5MQB73bVWP1mV';
    var testTextBEM2 = 'det2qCvqEVGnQz';
    var testTextBEM3 = '150pG6KShHn6nk';
    var testTextB = 'dYSk1a9bwDjttV';
    return {
      restrict: 'A',
      controller: ['$scope', 'pcArticle', function($scope, pcArticle) {
        pcArticle.chooseArticle(getArticle);

        function getArticle(data) {
          pcArticle.getArticle(data.articles[0].id, setArticle);
          // pcArticle.getArticle(testTextBEM1, setArticle);
        }

        function setArticle(data) {
          $scope.title = data.article.book.title;
          // console.log(data.article.content);
          $scope.text = pcArticle.canvasText(data.article.content);
        }

        $scope.drawCanvasText = function(element, text) {
          var ct = new CanvasText();
          var canvas = element;
          var context = canvas.getContext('2d');
          var parentOffset = $(element).parent().offset();

          ct.config({
            canvas: canvas,
            context: context,
            fontFamily: 'Georgia',
            fontSize: '16px',
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
            fontSize: '16px',
            fontStyle: 'italic',
            fontColor: '#000',
            lineHeight: '30'
          });

          ct.defineClass('em', {
            fontFamily: 'Georgia',
            fontSize: '16px',
            fontStyle: 'italic',
            fontColor: '#000',
            lineHeight: '30'
          });

          ct.drawText({
            text: text,
            x: $(element).width() * 0.2 / 2,
            y: parentOffset.top,
            boxWidth: $(element).width() * 0.8
          });
        };

      }],
      link: function(scope, elem, attr) {
        var canvas = elem[0];

        scope.width = $(canvas).width();
        scope.height = $(canvas).height();

        scope.$watch('text', function(text) {
          if(text) {
            scope.drawCanvasText(elem[0], text);
          }
        });
      }
    };
  }]);