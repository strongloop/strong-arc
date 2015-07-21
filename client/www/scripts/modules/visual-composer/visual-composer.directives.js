VisualComposer.directive('slComposerCanvas', [
  function slComposerCanvas() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div style="width:100%;height:100%"></div>',
      scope: {
        models: '=',
        connections: '='
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
          .on('dragend', dragEnd);

        var getDiagonalCoords = function(id) {
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
        };

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

        var container = svg.append('g');

        $scope.$watch('models', function(newVal) {
          container.selectAll('.model')
            .data(newVal, function(d) {
              return d.name;
            })
            .enter()
              .append('g')
              .attr('class', 'model')
              .call(buildInstance);

          if (newVal.length) {
            container.call(buildLinks);
          }
        });

        function buildLinks(selection) {
          var links = selection.selectAll('.link')
            .data($scope.connections);

          links.enter()
              .append('path')
              .attr('class', 'link');

          links
              .attr('d', diagonal);
        }

        function buildProperty(selection) {
          selection.each(function(d) {
            var g = d3.select(this);

            g.append('text')
              .attr('x', 10)
              .attr('y', 5)
              .text(function(d) {
                return d.name;
              });

            var circle = g.append('circle')
              .attr('cx', 200)
              .attr('r', 10);

            idMapping[d.id] = circle[0][0];
          });
        }

        function buildInstance(selection) {
          selection.each(function(d) {
            var g = d3.select(this);

            g.append('rect')
              .attr('height', function(d) {
                return 75 + (25 * d.properties.length);
              })
              .attr('width', 200);

            g.append('text')
              .attr('class', 'title')
              .attr('text-anchor', 'middle')
              .attr('y', 25)
              .attr('x', 100)
              .text(function(d) {
                return d.name;
              });

            var circle = g.append('circle')
              .attr('cx', 0)
              .attr('cy', 15)
              .attr('r', 10);

            idMapping[d.id] = circle[0][0];

            g.selectAll('.property')
              .data(d.properties)
              .enter()
                .append('g')
                .attr('class', 'property')
                .attr('transform', function(d, i) {
                  return 'translate(0, ' + (75 + (i * 25)) + ')';
                })
                .call(buildProperty);
          });

          selection.call(drag);
        }

        var scale = 1.0;

        function zoomed() {
          scale = d3.event.scale;
          container
            .attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
        }

        var eventOffset = [0, 0];

        function dragStart() {
          var dragEvent = d3.event.sourceEvent;

          eventOffset = ['Y', 'X'].map(function(axis) {
            return dragEvent['client' + axis] - dragEvent['offset' + axis];
          });

          dragEvent.stopPropagation();
        }

        function dragMove(d) {
          d3.select(this)
            .attr('transform', function(d) {
              var x = d3.event.x - eventOffset[0];
              var y = d3.event.y - eventOffset[1];

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
