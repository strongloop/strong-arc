VisualComposer.directive('slSliderBar', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="sl-resize-bar"></div>',
    link: function($scope, $elem, attrs) {
      var $left = $($elem.prev());
      var $right = $($elem.next());

      $elem.on('dblclick', function() {
        var collapsed = ($left.width() < 1);
        if (collapsed) {
          $right.css({
            flexGrow: 0,
            width: 0
          });

          $left.css({
            flexGrow: 1,
            width: ''
          });
        } else {
          $left.css({
            flexGrow: 0,
            width: 0
          });

          $right.css({
            flexGrow: 1,
            width: ''
          });
        }
      });

      $elem.draggable({
        axis: 'x',
        cursor: 'move',
        revert: true,
        helper: 'clone',
        drag: function(dragEvent, ui) {
          var offset = ui.position.left - $left.offset().left;

          $left.width(function() {
            return Math.max(0, offset);
          });

          $right.scrollLeft(function() {
            return Math.min(0, 0 - offset);
          });
        }
      });
    }
  }
})

VisualComposer.directive('slInstanceEditor', [
  function slInstanceEditor() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/scripts/modules/visual-composer/templates/visual-composer.instance-editor.html',
      scope: {
        models: '=',
      },
      link: function($scope, elem) {

      },
      controller: function($scope) {

      }
    }
  }
]);

VisualComposer.directive('slComposerCanvas', [
  function slComposerCanvas() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div style="height:100%"></div>',
      scope: {
        models: '=',
        connections: '=',
        activeInstace: '=',
        onSelect: '&'
      },
      link: function($scope, elem) {
        var idMapping = {};
        var height = elem.height();
        var width = elem.width();

        var zoom = d3.behavior.zoom()
          .scaleExtent([0.1, 1.0])
          .on('zoom', zoomed);

        var drag = d3.behavior.drag()
          .on('dragstart', dragStart)
          .on('drag', dragMove)
          .on('dragend', dragEnd)
          .origin(function(d) {
            var pos = getDiagonalCoords(d.id);
            return {
              x: pos.y,
              y: pos.x
            };
          });

        var drag2 = d3.behavior.drag()
          .on('dragstart', connectStart)
          .on('drag', connectMove)
          .on('dragend', connectEnd)
          .origin(function(d) {
            var pos = getDiagonalCoords(d.id);
            return {
              x: pos.y,
              y: pos.x
            };
          });

        var select = function(selection) {
          selection.on('click', function(d) {
            $scope.onSelect({
              model: d
            });
          });
        };

        function getDiagonalCoords(id) {
          var obj = idMapping[id];
          var base = [0, 0];

          var parentNode = obj;
          var lv = id.split('.').length - 1;
          var translate;

          while (lv > 0 && parentNode.parentNode) {
            parentNode = parentNode.parentNode;
            translate = d3.transform(
              d3.select(parentNode).attr('transform')
            ).translate;

            base[0] += translate[0];
            base[1] += translate[1];

            lv--;
          }

          return {
            y: base[0] + obj.cx.baseVal.value,
            x: base[1] + obj.cy.baseVal.value
          };
        }

        var diagonal = d3.svg.diagonal()
          .source(function(d) {
            return getDiagonalCoords(d.source);
          })
          .target(function(d) {
            return getDiagonalCoords(d.target);
          })
          .projection(function(d) {
            return [d.y, d.x];
          });

        var svg = d3.select(elem[0])
          .append('svg')
            .attr('height', height)
            .attr('width', width)
            .call(zoom);

        var defs = svg.append('defs');

        var shadow = defs.append('filter')
          .attr('id', 'drop-shadow')
          .attr('height', '130%');

        shadow.append('feGaussianBlur')
          .attr('in', 'SourceAlpha')
          .attr('stdDeviation', 5)
          .attr('result', 'blur');

        shadow.append('feOffset')
          .attr('in', 'blur')
          .attr('stdDeviation', 5)
          .attr('result', 'offsetBlur');

        var merge = shadow.append('feMerge');

        merge.append('feMergeNode')
          .attr('in', 'offsetBlur');

        merge.append('feMergeNode')
          .attr('in', 'SourceGraphic');

        var container = svg.append('g');

        $scope.$on('refreshModels', function() {
          var models = container.selectAll('.model')
            .data($scope.models, function(d) {
              return d.name;
            });

          models.enter()
              .append('g')
              .attr('class', 'model')
              .attr('filter', 'url(#drop-shadow)')
              .call(buildInstance);

          models.call(updateInstance);

          if ($scope.models.length) {
            container.call(buildLinks);
          }
        });

        $scope.$watch('models', function(newVal) {
          var models = container.selectAll('.model')
            .data(newVal, function(d) {
              return d.name;
            });

          models.enter()
              .append('g')
              .attr('class', 'model')
              .attr('filter', 'url(#drop-shadow)')
              .call(buildInstance);

          models.call(updateInstance);

          if (newVal.length) {
            container.call(buildLinks);
          }
        });

        function buildLinks(selection) {
          var links = selection.selectAll('.link')
            .data($scope.connections.filter(
              function(x) {
                return x.target !== 'connector' || tempConnections == null;
              }
            ));

          links.enter()
            .append('path')
            .attr('class', 'link');

          links
            .attr('d', diagonal)
            .attr('class', function(d) {
              if (d.target == 'connector') {
                return 'link loose';
              } else if (d === tempConnections) {
                return 'link valid';
              }

              return 'link';
            });

          links.exit()
            .remove();
        }

        function buildProperty(selection) {
          selection.each(function(d) {
            var g = d3.select(this);

            g.append('text')
              .attr('class', 'prop-name')
              .attr('x', 10)
              .attr('y', 5);

            var circle = g.append('circle')
              .attr('cx', 180)
              .attr('r', 8)
              .call(drag2);

            idMapping[d.id] = circle[0][0];
          });
        }

        function updateInstance(selection) {
          selection.each(function(d) {
            var g = d3.select(this);

            g.selectAll('.main-body')
              .attr('height', function(d) {
                return 75 + (25 * d.properties.length);
              })
              .attr('width', 200);

            g.selectAll('.title')
              .text(function(d) {
                return d.name;
              });

            var properties = g.selectAll('.property')
              .data(d.properties);

            properties.enter()
              .append('g')
              .attr('class', 'property')
              .attr('transform', function(d, i) {
                return 'translate(0, ' + (75 + (i * 25)) + ')';
              })
              .call(buildProperty);

            properties.selectAll('.prop-name')
              .text(function(d) {
                return d.name;
              });
          });
        }

        function buildInstance(selection) {
          var createIndex = 1;

          selection.each(function(d) {
            var g = d3.select(this);

            g.attr('transform', function(d, i) {
              var x = createIndex * 225;
              createIndex += 1;

              return 'translate(' + x + ', 0)';
            });

            g.append('rect')
              .attr('class', 'main-body');

            g.append('rect')
              .attr('height', 35)
              .attr('width', 200)
              .attr('class', 'title-bg');

            g.append('text')
              .attr('class', 'title')
              .attr('text-anchor', 'middle')
              .attr('y', 25)
              .attr('x', 100);

            var circle = g.append('circle')
              .attr('cx', 15)
              .attr('cy', 20)
              .attr('r', 8)
              .on('mouseover', function(d) {
                if (connectSource) {
                  if (tempConnections == null) {
                    tempConnections = {
                      source: connectSource.id,
                      target: d.id
                    }

                    $scope.connections.push(tempConnections);
                  }
                }
              })
              .on('mouseout', function(d) {
                if (tempConnections) {
                  $scope.connections = $scope.connections.filter(
                    function(x) {
                      return x != tempConnections;
                    }
                  );

                  tempConnections = null;
                }
              });

            idMapping[d.id] = circle[0][0];
          });

          selection.call(select);
          selection.call(drag);
        }

        var scale = 1.0;

        function zoomed() {
          scale = d3.event.scale;
          container
            .attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
        }

        var eventOffset = [0, 0];
        var connector = null;
        var connectSource = null;
        var tempConnections = null;

        function connectStart(d) {
          var dragEvent = d3.event;

          connector = container.append('circle')
            .attr('r', 5)
            .attr('cx', dragEvent.x)
            .attr('cy', dragEvent.y);

          connectSource = d;
          idMapping.connector = connector[0][0];

          $scope.connections.push({
            source: d.id,
            target: 'connector'
          });

          d3.event.sourceEvent.stopPropagation();
        }

        function connectMove(d) {
          var pos = {x: 0, y: 0};

          if (tempConnections) {
            pos = getDiagonalCoords(tempConnections.target);
          } else {
            pos.x = d3.event.x - 10;
            pos.y = d3.event.y;
          }

          connector
            .attr('cx', pos.x)
            .attr('cy', pos.y);

          container.call(buildLinks);
        }

        function connectEnd() {
          connector.remove();
          connector = null;
          connectSource = null;
          tempConnections = null;

          $scope.connections = $scope.connections.filter(
            function(d) {
              return d.target !== 'connector';
            }
          );

          container.call(buildLinks);
        }

        function dragStart() {
          var dragEvent = d3.event.sourceEvent;

          d3.select(dragEvent.currentTarget).each(function(d) {
            $scope.onSelect({
              model: d
            });
          });

          eventOffset = ['Y', 'X'].map(function(axis) {
            return dragEvent['client' + axis] - dragEvent['offset' + axis];
          });

          dragEvent.stopPropagation();
        }

        function dragMove(d) {
          d3.select(this)
            .attr('transform', function(d) {
              var x = d3.event.x;
              var y = d3.event.y;

              return 'translate(' + x + ', ' + y + ')';
            });

          container.call(buildLinks);
        }

        function dragEnd() {
        }
      }
    };
  }
]);
