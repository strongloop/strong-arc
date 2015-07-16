VisualComposer.directive('slComposerCanvas', [
  function slComposerCanvas() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div style="width:100%;height:100%"></div>',
      scope: {

      },
      link: function($scope, elem) {
        var height = elem.height();
        var width = elem.width();

        var zoom = d3.behavior.zoom()
          .scaleExtent([0.1, 1])
          .on('zoom', zoomed);

        var drag = d3.behavior.drag()
          .on('dragstart', dragStart)
          .on('drag', dragMove)
          .on('dragend', dragEnd);

        var svg = d3.select(elem[0])
          .append('svg')
            .attr('height', height)
            .attr('width', width)
            .call(zoom);

        var container = svg.append('g');

        container.append('rect')
          .attr('height', 50)
          .attr('width', 200)
          .call(drag);

        container.append('rect')
          .attr('x', 100)
          .attr('y', 100)
          .attr('height', 50)
          .attr('width', 200)
          .call(drag);

        function zoomed() {
          container
            .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
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
            .attr('x', d3.event.x - eventOffset[0])
            .attr('y', d3.event.y - eventOffset[1]);
        }

        function dragEnd() {

        }
      }
    };
  }
]);
