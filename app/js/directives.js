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
        var stroke = null;
        var paint = null;

        // shim layer with setTimeout fallback
        $window.requestAnimFrame = (function(){
          return  $window.requestAnimationFrame ||
            $window.webkitRequestAnimationFrame ||
            function( callback ){$window.setTimeout(callback, 1000 / 60);};
        })();

        function Point(x, y) {
          this.x = x;
          this.y = y;
        }

        function Stroke(x, y) {
          this.points = [new Point(x, y)];
        }

        Stroke.prototype.addPoint = function(x, y) {
          this.points.push(new Point(x, y));
        };

        Stroke.prototype.draw = function() {
          if (this.points.length < 2) return;

          context.beginPath();
          if(scope.curTool === "marker") {
            context.globalCompositeOperation = "source-over";
            context.strokeStyle = "#000";
            context.lineCap = "round";
            context.lineWidth = parseInt(element.css('fontSize')) - 2;
          }
          else {
            context.globalCompositeOperation = "destination-out";
          }

          context.moveTo(this.points[0].x, this.points[0].y);
          for (var i = 1; i < this.points.length; i++) {
            context.lineTo(this.points[i].x, this.points[i].y);
          }
          context.stroke();
          context.closePath();
          this.points = this.points.slice(-1);
        };

        var onMousedown = function(e) {
          var parentOffset = $(this).parent().offset();
          var mouseX = e.pageX - parentOffset.left;
          var mouseY = e.pageY - parentOffset.top;
            
          paint = true;
          stroke = new Stroke(mouseX, mouseY);

          $canvas.bind('mousemove', onMousemove);
          $canvas.bind('mouseenter', onMouseenter);
          $canvas.bind('mouseout', onMouseup);
          $(document).bind('mouseup', onMouseup);
        };

        var onMouseenter = function(e) {
          if (paint) {
            $canvas.trigger('mousedown');
          }
        };

        var onMousemove = function(e) {
          if (paint) {
            var parentOffset = $(this).parent().offset();
            var mouseX = e.pageX - parentOffset.left;
            var mouseY = e.pageY - parentOffset.top;
            stroke.addPoint(mouseX, mouseY);
          }
        };

        var onMouseup = function(e) {
          if (e.type === 'mouseup') {
            paint = false;
            stroke = null;
            $(document).unbind('mouseup', onMouseup);
            $canvas.unbind('mouseenter', onMouseenter);
          }
          $canvas.unbind('mousemove', onMousemove);
        };

        var onTouchstart = function(e) {
          e.preventDefault();
          var touches = e.originalEvent.changedTouches;

          var parentOffset = $(this).parent().offset();
          var mouseX = touches[0].pageX - parentOffset.left;
          var mouseY = touches[0].pageY - parentOffset.top;
          paint = true;
          stroke = new Stroke(mouseX, mouseY);
        };

        var onTouchmove = function(e) {
          e.preventDefault();
          var touches = e.originalEvent.changedTouches;
          if(paint) {
            var parentOffset = $(this).parent().offset();
            var linetoX = touches[0].pageX - parentOffset.left;
            var linetoY = touches[0].pageY - parentOffset.top;
            stroke.addPoint(linetoX, linetoY);
          }
        };

        var onUp = function(e) {
          paint = false;
        };

        function drawPoints() {
          if (stroke) {
            stroke.draw();
          }

          requestAnimFrame(drawPoints);
        }

        $canvas.mousedown(onMousedown);
        requestAnimFrame(drawPoints);
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
          var $parent = element.parent();
          element.height('auto');
          var parentHeight = scope.$parent.height;
          var lineHeight = parseInt($('.blackout-source p').css('line-height'));
          var fullHeight = Math.floor(element[0].offsetHeight / lineHeight) * lineHeight;
          element.height(fullHeight);
          var start = $parent[0].offsetTop + parseInt($('.blackout-frame').css('borderTopWidth'));
          var offset = (fullHeight > parentHeight) ? util.random(0, fullHeight - parentHeight) : 0;
          offset = Math.floor(offset / lineHeight) * lineHeight;
          element.offset({top: start - offset});
        });
      }
    };
  }]);