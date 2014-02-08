'use strict';

/* Directives */


angular.module('bookd.directives', [])
  .directive('blackoutEdit', ['$window', function($window) {
    return {
      restrict: 'C',
      scope: true,
      link: function(scope, element, attrs) {
        var $canvas = element.find('canvas.blackout-canvas');
        var context = $canvas[0].getContext('2d');
        var defaultTool = {kind: 'marker', size: 15};

        scope.save = function() {
          html2canvas($('.blackout-board')[0], {
            onrendered: function(canvas) {
              scope.$emit('save', canvas.toDataURL('image/png'));
            }
          });
        };

        scope.resetTool = function() {
          scope.tool = defaultTool;
        };

        scope.setToolType = function(tool) {
          scope.tool.kind = tool;
        };

        scope.setToolSize = function(size) {
          scope.tool.size = size;
        };

        scope.$on('clear', function() {
          context.clearRect(0, 0, context.canvas.width, context.canvas.height);
          scope.resetTool();
        });

        scope.$watch('tool', function(newTool) {
          if(newTool) {
            scope.tool = newTool;
          }
          else {
            scope.resetTool();
          }
        }, true);
      }
    };
  }])
  .directive('tabDrawer', [function() {
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {
        var width = element.width();

        var slide = function(e) {
          var l = element.offset().left;
          var left = (l < 0) ? 0: -0.75 * width;
          element.offset({left: left});
        };

        element[0].addEventListener('click', slide, false);
      }
    };
  }])
  .directive('blackoutBoard', ['$window', 'util', function($window, util) {
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {
        var deviceWidth = Math.min($window.screen.width, $window.screen.height);
        var $container = element.parent();
        var $frame = element.find('.blackout-frame');
        var $source = element.find('.blackout-source');
        var newWidth = (deviceWidth < 769) ? deviceWidth - 90 : deviceWidth;
        scope.$root.dimensions = {width: newWidth, height: 0};

        scope.$watch('dimensions', function(dimensions) {
          if (!dimensions) return;
          $container.width(dimensions.width);
          element.height(dimensions.height);
        }, true);

        scope.$watch('source.content', function(content) {
          if (!content) return;
          var containerHeight = (deviceWidth < 481) ? newWidth * 4 : newWidth * (3/2);
          var lineHeight = parseInt($source.find('p').css('line-height'), 10);
          var sourceHeight = $source.height();
          var frameHeight = 0;
          var frameBorder = lineHeight * 2;
          var borderStyle = 'px solid white';
          var start = element[0].offsetTop + frameBorder;
          var offset = 0;

          if (sourceHeight <= containerHeight) {
            frameHeight = sourceHeight;
          }
          else {
            frameHeight = Math.floor(containerHeight / lineHeight) * lineHeight;
            offset = util.random(0, sourceHeight - frameHeight);
            offset = Math.floor(offset / lineHeight) * lineHeight;
          }

          scope.$root.dimensions.height =  frameHeight + frameBorder * 2;
          $frame.height(frameHeight);
          $frame.css({borderTop: frameBorder + borderStyle, borderBottom: frameBorder + borderStyle});
          $source.offset({top: start - offset});
        });
      }
    };
  }])
  .directive('previewInfo', [function() {
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {
        element.outerWidth(scope.$root.dimensions.width);
      }
    };
  }])
  .directive('blackoutCanvas', ['$window', function($window) {
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {
        var $canvas = element;
        var context = element[0].getContext('2d');
        var canvasOffset = $canvas.offset();
        var $blackoutBoard = $('.blackout-board');
        var strokes = {};
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
          context.lineCap = 'round';
          context.lineWidth = scope.tool.size;
          if(scope.tool.kind === 'marker') {
            context.globalCompositeOperation = 'source-over';
            context.strokeStyle = '#000';
          }
          else {
            context.globalCompositeOperation = 'destination-out';
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
          canvasOffset = $canvas.offset();
          var mouseX = e.pageX - canvasOffset.left;
          var mouseY = e.pageY - canvasOffset.top;
          paint = true;
          strokes.mouse = new Stroke(mouseX, mouseY);

          $(document).bind('mousemove', onMousemove);
          $(document).bind('mouseup', onMouseup);
          $window.requestAnimFrame(drawPoints);
        };

        var onMousemove = function(e) {
          if (paint) {
            var mouseX = e.pageX - canvasOffset.left;
            var mouseY = e.pageY - canvasOffset.top;
            strokes.mouse.addPoint(mouseX, mouseY);
          }
        };

        var onMouseup = function(e) {
          paint = false;
          strokes.mouse = null;
          $(document).unbind('mouseup', onMouseup);
          $(document).unbind('mousemove', onMousemove);
        };

        var onTouchstart = function(e) {
          canvasOffset = $canvas.offset();
          var touches = e.originalEvent.changedTouches;
          paint = true;

          for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            var touchX = touch.pageX - canvasOffset.left;
            var touchY = touch.pageY - canvasOffset.top;
            strokes[touch.identifier] = new Stroke(touchX, touchY);
          }

          $canvas.bind('touchmove', onTouchmove);
          $canvas.bind('touchend', onTouchend);
          $window.requestAnimFrame(drawPoints);
          e.preventDefault();
        };

        var onTouchmove = function(e) {
          var touches = e.originalEvent.changedTouches;
          if (paint) {
            for (var i = 0; i < touches.length; i++) {
              var touch = touches[i];
              var touchX = touch.pageX - canvasOffset.left;
              var touchY = touch.pageY - canvasOffset.top;
              strokes[touch.identifier].addPoint(touchX, touchY);
            }
          }
        };

        var onTouchend = function(e) {
          var touches = e.originalEvent.changedTouches;
          for (var i = 0; i < touches.length; i++) {
            delete strokes[touches[i].identifier];
          }

          if (Object.keys(strokes) === 1) {
            paint = false;
            $canvas.unbind('touchmove', onTouchmove);
            $canvas.unbind('touchend', onTouchend);
          }
          e.preventDefault();
        };

        function drawPoints() {
          for (var id in strokes) {
            if (strokes[id]) {
              strokes[id].draw();
            }
          }

          $window.requestAnimFrame(drawPoints);
        }

        $canvas.mousedown(onMousedown);
        $canvas.bind('touchstart', onTouchstart);
        $window.addEventListener('resize', function() {
          $blackoutBoard.width(scope.width);
          canvasOffset = $canvas.offset();
        });
      }
    };
  }]);