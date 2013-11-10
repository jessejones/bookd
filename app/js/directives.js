'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('blackoutCanvas', [function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var canvas = element[0];
        var context = canvas.getContext('2d');
        var clickX = [];
        var clickY = [];
        var clickDrag = [];
        var paint;

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
          var mouseX = e.pageX - this.offsetLeft;
          var mouseY = e.pageY - this.offsetTop;
            
          paint = true;
          addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
          redraw();
        });

        $(canvas).mousemove(function(e){
          if(paint){
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
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
          if(text) {
            scope.drawCanvasText(elem[0], text);
          }
        });
      }
    };
  }]);