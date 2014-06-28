// Copyright StrongLoop 2014
/*
*
*   Canvas API View
*
* */
Canvas.directive('slCanvasApiView', [
  'IAService',
  function(IAService) {
    return {
      replace: true,
      template: '<div ></div>',
      link: function(scope, el, attrs) {

        //jQuery('[data-id="CanvasApiContainer"]').drags();


        var iaInstance = jsPlumb.getInstance({
          PaintStyle:{
            lineWidth:1,
            strokeStyle:'#eeeeee',
            outlineColor:'pink',
            outlineWidth:0
          },
          Connector:[ 'Bezier', { curviness: 30 } ],
          Endpoint:[ 'Dot', { radius:1 } ],
          EndpointStyle : { fillStyle: '#567567'  },
          Anchor : [ 0.5, 0.5, 1, 1 ]
        });
        iaInstance.setContainer(el[0]);

        jsPlumb.ready(function() {

          scope.$watch('mainNavModels', function(mainNavModels) {
            if (mainNavModels.length > 0){
              var dataset = {
                name: 'x',
                children: mainNavModels
              };
              React.renderComponent(Canvas.MainCanvasContainer({scope: scope}), el[0]);

              jsPlumb.makeSource($('.model-connection-point'), {
                connector: 'StateMachine'
              });
              jsPlumb.makeTarget($('.model-connection-point'), {
                anchor: 'Continuous'
              });

              jsPlumb.draggable($('.canvas-model-container'), {
                containment: 'PlumberInstanceContainer'
              });

            }
          }, true);

        });
      }
    }
  }
]);
Canvas.directive('canvasReactPlumber', [
  function() {
    return {
      replace: true,
      template:'<div></div>',
      link: function(scope, el, attrs) {


        var iaInstance = jsPlumb.getInstance({
          PaintStyle:{
            lineWidth:2,
            strokeStyle:'#ff45f1',
            outlineColor:'black',
            outlineWidth:1
          },
          Connector:[ 'Bezier', { curviness: 30 } ],
          Endpoint:[ 'Dot', { radius:2 } ],
          EndpointStyle : { fillStyle: '#567567'  },
          Anchor : [ 0.5, 0.5, 1, 1 ]
        });
        iaInstance.setContainer(el[0]);

        jsPlumb.ready(function() {

          scope.$watch('mainNavModels', function(mainNavModels) {
            if (!mainNavModels.$promise && (mainNavModels.length > 0)){
              var dataset = {
                name: 'x',
                children: mainNavModels
              };
              React.renderComponent(Canvas.MainCanvasContainer({scope: scope}), el[0]);

              jsPlumb.makeSource($('.model-connection-point'), {
                connector: 'StateMachine'
              });
              jsPlumb.makeTarget($('.model-connection-point'), {
                anchor: 'Continuous'
              });

              jsPlumb.draggable($('.canvas-model-container'), {
                containment: 'PlumberInstanceContainer'
              });

            }
          });



















        });











      }
    }
  }
]);
Canvas.directive('plumber1', [
  function() {
    return {
      replace: true,
      template:'<div data-id="PlumberInstanceContainer" class="api-canvas-view-container"></div>',
      link: function(scope, el, attrs) {

//        var dragSrcEl = null;
//        $('.api-canvas-view-container').
//          on('dragover',
//          function(e) {
//            e.preventDefault();
//            e.stopPropagation();
//          }
//        ).
//          on('dragenter',
//          function(e) {
//            e.preventDefault();
//            e.stopPropagation();
//          }
//        ).
//          on('dragstart',
//          function(e) {
//
//          }
//        ).
//          on('drop',
//          function(e){
//            if(e.originalEvent.dataTransfer){
//
//              e.preventDefault();
//              e.stopPropagation();
//              /*UPLOAD FILES HERE*/
//              if (dragSrcEl != this) {
//                // Set the source column's HTML to the HTML of the column we dropped on.
//                // dragSrcEl.innerHTML = this.innerHTML;
//                var dropPayload = e.originalEvent.dataTransfer.getData('text/json');
//
//                if (dropPayload) {
//                  var para=document.createElement('span');
//                  para.setAttribute('draggable', 'true');
//                  var node=document.createTextNode(dropPayload);
//                  para.appendChild(node);
//                  e.target.appendChild(para);
//
//                }
//
//              }
//              //}
//            }
//          }
//        );









        var iaInstance = jsPlumb.getInstance({
          PaintStyle:{
            lineWidth:6,
            strokeStyle:'#567567',
            outlineColor:'black',
            outlineWidth:1
          },
          Connector:[ 'Bezier', { curviness: 30 } ],
          Endpoint:[ 'Dot', { radius:5 } ],
          EndpointStyle : { fillStyle: '#567567'  },
          Anchor : [ 0.5, 0.5, 1, 1 ]
        });
        iaInstance.setContainer(el[0]);


        jsPlumb.ready(function() {



          scope.$watch('models', function(models) {
            if (!models.$promise && (models.length > 0)){
              var dataset = {
                name: 'x',
                children: models
              };
              dataset.relations = [];

              var canvas = d3.select(el[0]);

              var modelContainer = canvas.selectAll('.canvas-model-container').
                data(dataset.children).
                enter().
                append('div').
                attr('class', 'canvas-model-container').
                attr('id', function(d, i) {
                  return 'model_container_' + d.name;
                }).
                attr('style',function(d, i) {
                  return 'top:' + (i / 2) + (50 * .3) + 'px;left:' +  ( ((i + 4) / 1.5) * 67) + 'px';
                });
               // attr('draggable', 'true');


              var canvasFooter = canvas.append('div').
                attr('class', 'canvas-footer');


              var modelHeader = modelContainer.append('div').
                attr('class', 'model-header').
                append('h3').
                attr('class', 'model-header-title').
                text(function(d) {
                  return d.name;
                }
              );


              var modelBody = modelContainer.append('div').
                attr('class', 'model-body').
                text(function(d) {
                  return '[datasouce]: ' + d.props.dataSource;
                });
              var relationPoint = modelContainer.append('div').
                attr('class', 'model-connection-point');

              var modelPropertyList = modelBody.append('ul');

              var properyList = modelPropertyList.selectAll('li').
                data(function(d) {
                  var tData = d.props;
                  if (d.props.properties) {
                    return d.props.properties;
                  }
                  return [];
                }).
                enter().
                append('li').
                text(function(d) {
                  // var x = d;
                  return d.name;
                });


              jsPlumb.makeSource($('.model-connection-point'), {
                connector: 'StateMachine'
              });
              jsPlumb.makeTarget($('.model-connection-point'), {
                anchor: 'Continuous'
              });

              jsPlumb.draggable($('.canvas-model-container'), {
                containment: 'PlumberInstanceContainer'
              });

            }
          });



















        });











      }
    }
  }
]);
Canvas.directive('canvasView', [
  function() {
    return {
      replace: true,
      template: '<div data-id="CanvasInstanceContainer" class="api-canvas-view-container"></div>',
      link: function(scope, el, attrs) {

        var color = d3.scale.category10();
        var force = d3.layout.force()
          .gravity(.05)
          .distance(100)
          .charge(-100)
          .size([600, 500]);
        scope.$watch('models', function(models) {

          if (!models.$promise){
            var dataset = {
              name: 'x',
              children: models
            };
            dataset.relations = [];

            var canvas = d3.select(el[0]).append('svg').
              attr('width', 600).
              attr('height', 500).
              append("g").
              attr('transform', 'translate(10, 10)');


            force.nodes(dataset.children).
              links(dataset.relations).
              start();




            var edges = canvas.selectAll('line').
              data(dataset.relations).
              enter().
              append('line').
              style('stroke', '#ccc').
              style('stroke-width', 1);

            var node = canvas.selectAll(".node").
              data(dataset.children).
              enter().
              append("g").
              attr("class", "node").
              call(force.drag);

            node.append('circle').
              attr('r', 10).
              style('fill', function(d, i) {
                return color(i);
              });

            node.append('text').
              attr('dx', 12).
              attr('dy', -3).
              text(function(d) { return d.name });
//
//            var names = canvas.selectAll('p').
//              data(dataset.children).
//              enter().
//              append('p').
//              text(function(d, i) {
//                return d.name;
//              });


            force.on('tick', function() {

              edges.attr('x1', function(d) {return d.source.x; });
              edges.attr('y1', function(d) {return d.source.y; });
              edges.attr('x2', function(d) {return d.source.x; });
              edges.attr('y2', function(d) {return d.source.y; });

              node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

//              names.attr('style', function(d) {
//                var x1 = d.x + 5;
//                var y1 = d.y + 5;
//                var style = 'position:absolute;top:' + x1 + 'px;left:' + y1 + 'px';
//                return style;
//              });
////            names.attr('y', function(d) {return d.y; });
//
            });


            console.log('models: ' + models);

















          }






        }); // end scope watch


      }
    }
  }
]);
Canvas.directive('iaInstance', [
  function() {
    return {
      replace: true,
      template: '<div data-id="IAInstanceContainer"></div>',
      link: function(scope, el, attrs) {

        var instanceIaData = {
          "name":"IA",
          "children":IA.root
        };

//        console.log('|---');
//        console.log('|');
//        console.log(' | Tree Data:  ' + instanceIaData);
//        console.log('|');
//        console.log('|----');

        var canvas = d3.select(el[0]).append('svg').
          attr('width', 1200).
          attr('height', 3000).
          append("g").
          attr('transform', 'translate(10, 10)');

        var tree = d3.layout.tree().size([3000,1100]);


        function drawTheTree(data){

          var nodes = tree.nodes(data);
          console.log('| NODES ' + nodes);
          var links = tree.links(nodes);
          var node  = canvas.selectAll('.node').
            data(nodes).
            enter().
            append('g').
            attr('class','node').
            attr('transform', function(d){ return 'translate(' + d.y + ',' + d.x + ')'; });

          node.append('circle').
            attr('r', 5).
            attr('fill','steelblue');



          var diagonal = d3.svg.diagonal().
            projection(function(d){ return [d.y, d.x];});

          canvas.selectAll('.link').
            data(links).
            enter().
            append('path').
            attr('class', 'link').
            attr('fill','none').
            attr('stroke','#444444').
            attr('d', diagonal);

          node.append('text').
            text(function(d){
              return d.name;
            });



        }

        drawTheTree(instanceIaData);


      }
    }
  }
]);
