VisualComposer.directive('slComposerCanvas', [
  function slComposerCanvas() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div style="height:100%"></div>',
      scope: {
        models: '=',
        connections: '=',
        activeInstance: '=',
        datasources: '=',
        onSelect: '&',
        onNewConnection: '&'
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
              x: pos.x,
              y: pos.y
            };
          });

        var drag2 = d3.behavior.drag()
          .on('dragstart', connectStart)
          .on('drag', connectMove)
          .on('dragend', connectEnd)
          .origin(function(d) {
            var pos = getDiagonalCoords(d.id);
            return {
              x: pos.x,
              y: pos.y
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

          if (obj == null) {
            return { x: 0, y:0 };
          }

          var parentNode = obj;
          var parts = id.split('.');
          var lv = parts.length - 1;
          var translate;

          // this is to account for datasources not having a parent group
          if (parts.pop() === '_ds') {
            lv--;
          }

          while (lv > 0 && parentNode && parentNode.parentNode) {
            parentNode = parentNode.parentNode;
            translate = d3.transform(
              d3.select(parentNode).attr('transform')
            ).translate;

            base[0] += translate[0];
            base[1] += translate[1];
            lv--;
          }

          var cords = {x: 'x', y: 'y'};
          var offset = {x: 6, y: 15};

          if (typeof obj.cy !== 'undefined') {
            cords = { x: 'cx', y: 'cy'};
            offset = { x: 0, y: 0 };
          }

          return {
            x: base[0] + obj[cords.x].baseVal.value + offset.x,
            y: base[1] + obj[cords.y].baseVal.value + offset.y
          };
        }

        var vcConnector = function(type) {
          var source = target = projection = function() {};

          function verticalPath(p0, p3, m) {
            var p = [
              { x: p0.x, y: p0.y },
              { x: p0.x, y: p0.y + 25 },
              { x: p0.x, y: m.y },
              { x: m.x, y: m.y },
              { x: p3.x, y: m.y },
              { x: p3.x, y: p3.y - 25},
              { x: p3.x, y: p3.y }
            ];

            p = p.map(projection);

            return 'M ' + p[0] +
              ' L ' + p.slice(0, 2).join(' ') +
              ' C ' + p.slice(1, 4).join(' ') +
              ' C ' + p.slice(3, 6).join(' ') +
              ' L ' + p.slice(-2).join(' ');
          }

          function directPath(p0, p3, m) {
            var p = [
              { x: p0.x, y: p0.y },
              { x: p0.x + 25, y: p0.y },
              { x: m.x, y: p0.y },
              { x: m.x, y: m.y },
              { x: m.x, y: p3.y },
              { x: p3.x - 25, y: p3.y },
              { x: p3.x, y: p3.y }
            ];

            p = p.map(projection);

            return 'M ' + p[0] +
              ' L ' + p.slice(0, 2).join(' ') +
              ' C ' + p.slice(1, 4).join(' ') +
              ' C ' + p.slice(3, 6).join(' ') +
              ' L ' + p.slice(-2).join(' ');
          }

          function reflexPath(p0, p3, m0) {
            var m1 = { x: p0.x + 50, y: p0.y + ((p3.y - p0.y) / 4)};
            var m2 = { x: p3.x - 50, y: p0.y + 3 * ((p3.y - p0.y) / 4) };
            var p = [
              { x: p0.x, y: p0.y },
              { x: p0.x + 25, y: p0.y },
              { x: m1.x, y: p0.y },
              { x: m1.x, y: m1.y },
              { x: m1.x, y: m0.y },
              { x: m0.x, y: m0.y },
              { x: m2.x, y: m0.y },
              { x: m2.x, y: m2.y },
              { x: m2.x, y: p3.y },
              { x: p3.x - 25, y: p3.y },
              { x: p3.x, y: p3.y }
            ];

            p = p.map(projection);

            return 'M ' + p[0] +
              ' L ' + p.slice(0, 2).join(' ') +
              ' Q ' + p.slice(2, 4).join(' ') +
              ' Q ' + p.slice(4, 6).join(' ') +
              ' Q ' + p.slice(6, 8).join(' ') +
              ' Q ' + p.slice(8, 10).join(' ') +
              ' L ' + p.slice(-2).join(' ');
          }

          function diagonal(d, i) {
            var p0 = source.call(this, d, i);
            var p3 = target.call(this, d, i);
            var m = {
              x: (p3.x + p0.x) / 2,
              y: (p3.y + p0.y) / 2
            };

            if (type == 'db') {
              return verticalPath(p0, p3, m);
            }

            if (p3.x - p0.x < 50) {
              return reflexPath(p0, p3, m);
            }

            return directPath(p0, p3, m);
          }

          diagonal.source = function(x) {
            if (!arguments.length) return source;
            source = d3.functor(x);
            return diagonal;
          };

          diagonal.target = function(x) {
            if (!arguments.length) return target;
            target = d3.functor(x);
            return diagonal;
          };

          diagonal.projection = function(x) {
            if (!arguments.length) return projection;
            projection = x;
            return diagonal;
          };

          return diagonal;
        };

        var dbPath = vcConnector('db')
          .source(function(d) {
            return getDiagonalCoords(d.source);
          })
          .target(function(d) {
            return getDiagonalCoords(d.target);
          })
          .projection(function(d) {
            return [d.x, d.y];
          });

        var modelPath = vcConnector('model')
          .source(function(d) {
            return getDiagonalCoords(d.source);
          })
          .target(function(d) {
            return getDiagonalCoords(d.target);
          })
          .projection(function(d) {
            return [d.x, d.y];
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

        $scope.$watch('datasources', function(newVal) {
          var ds = container.selectAll('.datasource')
            .data(newVal, function(d) {
              return d.name;
            });

          ds.enter()
            .append('g')
            .attr('class', 'datasource')
            .attr('filter', 'url(#drop-shadow)')
            .call(buildDatasource);

          ds.call(updateDatasource);

          ds.exit()
            .remove();
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

          models.exit()
              .remove();

          if (newVal.length) {
            container.call(buildLinks);
          }
        });

        function buildDatasource(selection) {
          var createIndex = 1;

          selection.each(function(d) {
            var g = d3.select(this);

            g.attr('transform', function(d, i) {
              var x = createIndex * 225;
              createIndex += 1;

              return 'translate(' + x + ', -300)';
            });

            g.append('rect')
              .attr('height', 50)
              .attr('width', 50)
              .attr('rx', 5)
              .attr('class', 'ds-icon');

            g.append('rect')
              .attr('height', 18)
              .attr('width', 10)
              .attr('y', 58)
              .attr('rx', 10)
              .attr('class', 'title-bg');

            g.append('text')
              .attr('class', 'title')
              .attr('text-anchor', 'middle')
              .attr('y', 72)
              .attr('x', 25);

            var connector = g.append('circle')
              .attr('cy', 85)
              .attr('cx', 25)
              .attr('r', 1);

            idMapping[d.id] = connector[0][0];
          });
        }

        function updateDatasource(selection) {
          selection.each(function(d) {
            var g = d3.select(this);

            var title = g.selectAll('.title')
              .text(function(d) {
                return d.name;
              });

            var textBox = title[0][0].getBBox();
            var width = textBox.width + 20;

            g.selectAll('.title-bg')
              .attr('x', function() {
                return 25 - (width / 2);
              })
              .attr('width', function() {
                return width;
              });
          });

          selection.call(drag);
        }

        function updateLinks(selection) {

        }

        function buildLinks(selection) {
          var links = selection.selectAll('.link-group')
            .data($scope.connections.filter(
              function(x) {
                return x.target !== 'connector' || tempConnections == null;
              }
            ));

          var enter = links.enter()
            .append('g')
            .attr('class', 'link-group');

          enter.append('path');
          enter.append('circle')
            .attr('r', 10)
            .attr('class', 'link-type');

          links
            .selectAll('path')
            .attr('d', function(d) {
              if (d.type == 'db') {
                return dbPath.apply(this, arguments);
              }

              return modelPath.apply(this, arguments);
            })
            .attr('class', function(d) {
              if (d.target == 'connector') {
                return 'link loose';
              } else if (d === tempConnections) {
                return 'link valid';
              }

              return 'link';
            });

          links
            .selectAll('circle')
            .attr('cx', function(d) {
              var pos0 = getDiagonalCoords(d.source);
              var pos1 = getDiagonalCoords(d.target);

              return (pos1.x + pos0.x) / 2;
            })
            .attr('cy', function(d) {
              var pos0 = getDiagonalCoords(d.source);
              var pos1 = getDiagonalCoords(d.target);

              return (pos1.y + pos0.y) / 2;
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

            g.append('line')
              .attr('class', 'separator')
              .attr('x1', 10)
              .attr('y1', 12)
              .attr('x2', 175)
              .attr('y2', 12);


            var circle = g.append('circle')
              .attr('class', 'connector')
              .attr('cx', 200)
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
                return 'translate(0, ' + (65 + (i * 25)) + ')';
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
              .attr('height', 45)
              .attr('width', 200)
              .attr('class', 'title-bg');

            g.append('text')
              .attr('class', 'title')
              .attr('text-anchor', 'middle')
              .attr('y', 30)
              .attr('x', 100);

            var ds = g.append('circle')
              .attr('class', 'ds-connector')
              .attr('cx', 100)
              .attr('cy', -2)
              .attr('r', 2);

            var attach = g.append('rect')
              .attr('class', 'connector')
              .attr('x', -6)
              .attr('y', 8)
              .attr('rx', 5)
              .attr('height', 30)
              .attr('width', 12)
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

            idMapping[d.id] = attach[0][0];
            idMapping[d.id + '._ds'] = ds[0][0];
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

        var connector = null;
        var connectSource = null;
        var tempConnections = null;

        function connectStart(d) {
          var dragEvent = d3.event.sourceEvent;
          var cords = getDiagonalCoords(dragEvent.srcElement.__data__.id);

          connector = container.append('circle')
            .attr('r', 5)
            .attr('cx', cords.x)
            .attr('cy', cords.y);

          connectSource = d;
          idMapping.connector = connector[0][0];

          $scope.connections.push({
            source: d.id,
            target: 'connector'
          });

          d3.event.sourceEvent.stopPropagation();
        }

        function connectMove(d) {
          var dragEvent = d3.event.sourceEvent;
          var pos = {x: 0, y: 0};

          if (tempConnections) {
            pos = getDiagonalCoords(tempConnections.target);
          } else {
            pos.x = d3.event.x - 15; // padding to prevent cursor overlapping
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

          if (tempConnections) {
            $scope.onNewConnection(tempConnections);
            tempConnections = null;
          }

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
