'use strict';

/* Directives */


angular.module('bookd.directives', [])
  .directive('blackoutEdit', [function() {
    return {
      restrict: 'C',
      scope: true,
      link: function(scope, element, attrs) {
        var $canvas = element.find('canvas.blackout-canvas');
        var context = $canvas[0].getContext('2d');

        scope.save = function() {
          html2canvas($('.blackout-board')[0], {
            onrendered: function(canvas) {
              scope.$emit('save', canvas.toDataURL('image/png'));
            }
          });
        };

        scope.setCurTool = function(tool) {
          scope.curTool = tool;
        };

        scope.$on('clear', function() {
          context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        });

        scope.$watch('curTool', function(curTool) {
          if(curTool) {
            scope.setCurTool(curTool);
          }
          else {
            scope.setCurTool('marker');
          }
        });
      }
    };
  }])
  .directive('blackoutBoard', [function() {
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {
        var element = element[0];
        scope.width = element.offsetWidth;
        scope.height = element.offsetHeight;
      }
    };
  }])
  .directive('blackoutCanvas', ['$window', function($window) {
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {
        var $canvas = element;
        var context = element[0].getContext('2d');
        var lastX;
        var lastY;
        var paint;

        $canvas.width(scope.width);
        $canvas.height(scope.height);

        function saveLast(x, y) {
          lastX = x;
          lastY = y;
        }

        function redraw(toX, toY, dragging) {
          context.beginPath();
          if(dragging) {
            if(scope.curTool === "marker") {
              context.globalCompositeOperation = "source-over";
              context.strokeStyle = "#000";
              context.lineCap = "round";
              context.lineWidth = 10;
            }
            else {
              context.globalCompositeOperation = "destination-out";
            }
              
            context.moveTo(lastX, lastY);
            context.lineTo(toX, toY);
            context.stroke();
            saveLast(toX, toY);
          }
        }

        var onMousedown = function(e) {
          var parentOffset = $(this).parent().offset();
          var mouseX = e.pageX - parentOffset.left;
          var mouseY = e.pageY - parentOffset.top;
            
          paint = true;
          saveLast(mouseX, mouseY);
          redraw();
        };

        var onMousemove = function(e) {
          if(paint){
            var parentOffset = $(this).parent().offset();
            var mouseX = e.pageX - parentOffset.left;
            var mouseY = e.pageY - parentOffset.top;
            redraw(mouseX, mouseY, true);
          }
        };

        var onTouchstart = function(e) {
          e.preventDefault();
          var touches = e.originalEvent.changedTouches;

          var parentOffset = $(this).parent().offset();
          var mouseX = touches[0].pageX - parentOffset.left;
          var mouseY = touches[0].pageY - parentOffset.top;
          paint = true;
          saveLast(mouseX, mouseY);
        };

        var onTouchmove = function(e) {
          e.preventDefault();
          var touches = e.originalEvent.changedTouches;
          if(paint) {
            var parentOffset = $(this).parent().offset();
            var linetoX = touches[0].pageX - parentOffset.left;
            var linetoY = touches[0].pageY - parentOffset.top;
            redraw(linetoX, linetoY, true);
          }
        };

        var onUp = function(e) {
          paint = false;
        };

        $canvas.mousedown(onMousedown);
        $canvas.mousemove(onMousemove);
        $canvas.mouseup(onUp);
        $canvas.bind('touchstart', onTouchstart);
        $canvas.bind('touchmove', onTouchmove);
        $canvas.bind('touchend', onUp);
      }
    };
  }])
  .directive('textJump', ['util', function(util) {
    return {
      restrict: 'A',
      scope: {
        content: '=ngBindHtml'
      },
      link: function(scope, element, attr) {
        scope.$watch('content', function() {
          element.height('auto');
          var parentHeight = scope.$parent.height;
          var lineHeight = parseInt($('.blackout-source p').css('line-height'));
          var fullHeight = Math.floor(element[0].offsetHeight / lineHeight) * lineHeight;
          element.height(fullHeight);
          var start = element.parent()[0].offsetTop;
          var offset = (fullHeight > parentHeight) ? util.random(0, fullHeight - parentHeight) : 0;
          offset = Math.floor(offset / lineHeight) * lineHeight;
          element.offset({top: start - offset});
        });
      }
    };
  }]);