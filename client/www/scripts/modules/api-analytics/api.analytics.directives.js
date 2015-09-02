ApiAnalytics.directive('slApiAnalyticsChart', [
  '$log',
  '$interpolate',
  function ($log, $interpolate) {
    var pageSize = 10;


    function custom(scope, elem){
      var margin = {top: 70, right: 120, bottom: 0, left: 270},
        width = 960 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

      var x = d3.scale.linear()
        .range([0, width]);

      var tip;

      var barHeight = 20;

      var color = d3.scale.ordinal()
        .range(["steelblue"]);

      var duration = 750,
        delay = 25;

      var partition = d3.layout.partition()
        .value(function(d) { return d.size; });

      var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(6)
        .orient("top");

      var svgParent = d3.select(elem.find('.svg-chart')[0]).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 40);

      var svg = svgParent
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", up);

      svg.append("g")
        .attr("class", "x axis");

      svg.append("g")
        .attr("class", "y axis")
        .append("line")
        .attr("y1", "100%");

      function toggleTip(e, tip){
        scope.showToolTip = !scope.showToolTip;

        if ( scope.showToolTip ) {
          tip.show(e);
        } else {
          tip.hide(e);
        }
      }

      function sortByTime(a, b){
        var aTime = new Date(a.orig.timeStamp).getTime();
        var bTime = new Date(b.orig.timeStamp).getTime();

        return aTime - bTime;
      }

      function drawAxisLabels(){
        var xLabel;
        var yLabel;

        switch(scope.chartDepth){
          case 0:
            xLabel = 'Number of requests';
            yLabel = 'End point path';
            break;
          case 1:
            xLabel = 'Number of requests';
            yLabel = 'Hour of day';
            break;
          case 2:
            xLabel = 'Response time';
            yLabel = 'End point path';
            break;
        }

        svg.select('.x.label').remove();
        svg.select('.y.label').remove();

        //x-axis label
        svg.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "middle")
          .attr("x", width/2)
          .attr("y", -40)
          .text(xLabel);

        //y-axis label
        svg.append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("font-size", "36px")
          .attr("x", -100)
          .attr("y", 60)
          .attr("dy", -60)
          .attr("transform", "rotate(0)")
          .text(yLabel);
      }

      function processData(d, i) {
        if ( !d.children ) return;
        scope.responseMax = d.rangeMax;
        var end = duration + d.children.length * delay;

        if ( scope.chartDepth === 1 ) {
          d.children = d.children.sort(function(a, b){
            var aTime = new Date(a.orig.timeStamp).getTime();
            var bTime = new Date(b.orig.timeStamp).getTime();

            return aTime - bTime;
          })
        }


        drawAxisLabels();

        // Mark any currently-displayed bars as exiting.
        var exit = svg.selectAll(".enter")
          .attr("class", "exit");

        // Entering nodes immediately obscure the clicked-on bar, so hide it.
        exit.selectAll("rect").filter(function(p) { return p === d; })
          .style("fill-opacity", 1e-6);

        // Enter the new bars for the clicked-on data.
        // Per above, entering bars are immediately visible.
        var enter = bar(d)
          .attr("transform", stack(i))
          .style("opacity", 1);

        // Have the text fade-in, even though the bars are visible.
        // Color the bars as parents; they will fade to children if appropriate.
        enter.select("text").style("fill-opacity", 1e-6);
        enter.select("rect").style("fill", color(true));

        // Update the x-scale domain.
        if (scope.chartDepth === 2 && scope.responseMax) {
          x.domain([0, scope.responseMax]).nice();
        }
        else {
          x.domain([0, d3.max(d.children, function(d) { return d.value; })]).nice();
        }


        // Update the x-axis.
        svg.selectAll(".x.axis").transition()
          .duration(duration)
          .call(xAxis);

        //show tooltip for chart 3
        if ( scope.chartDepth === 1 || scope.chartDepth === 2 ) {
          tip = d3.tip().attr('class', 'd3-tip endpoint').direction('se').html(function(d) {
            var list = '';

            //show proper data for current chart
            if ( scope.chartDepth === 2 ) {
              var keys = 'requestMethod statusCode responseDuration responseSize clientDetail'.split(' ');
            } else if ( scope.chartDepth === 1 ) {
              var keys = 'GET POST DELETE PUT'.split(' ');
            }

            keys.forEach(function(key){
              var val = d.orig[key];
              var tmpl = $interpolate('<li>{{key}}: {{val}}</li>');

              if ( key === 'responseDuration' ) {
                val += 'ms';
              }

              if ( key === 'responseSize' ){
                val += 'kb';
              }

              if ( key === 'clientDetail' ){
                var tmpl = $interpolate('<li>{{key}}: <textarea class="data" onfocus="this.select()">{{val}}</textarea></li>');

                val = JSON.stringify(val);
              }

              list += tmpl({ key: key, val: val });
            });

            var icon = (
            '<span class="ui-icon"><svg version="1.1" viewBox="0 0 30 30" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="arrow-popover">' +
              '<g>' +
                '<path d="M3.55271368e-15,0 L30,15 L-3.55271368e-15,30"></path>' +
              '</g>' +
            '</svg></span>'
            );

            var listTmpl = $interpolate(icon+'<h3>{{name}}</h3><ul>{{list}}</ul>');

            return listTmpl({ name: d.name, list: list });
          });

          svg.call(tip);

          svg.selectAll('g.enter g text')
            .on('click', function(e){
              toggleTip(e, tip);
            });

          if (scope.chartDepth === 2) {
            svg.selectAll('g.enter g rect')
              .on('click', function(e){
                toggleTip(e, tip);
              });

          }
        }

        // Transition entering bars to their new position.
        var enterTransition = enter.transition()
          .duration(duration)
          .delay(function(d, i) { return i * delay; })
          .attr("transform", function(d, i) { return "translate(0," + barHeight * i * 1.2 + ")"; });

        // Transition entering text.
        enterTransition.select("text")
          .style("fill-opacity", 1);

        // Transition entering rects to the new x-scale.
        enterTransition.select("rect")
          .attr("width", function(d) { return x(d.value); })
          .style("fill", function(d) { return color(true); });

        // Transition exiting bars to fade out.
        var exitTransition = exit.transition()
          .duration(duration)
          .style("opacity", 1e-6)
          .remove();

        // Transition exiting bars to the new x-scale.
        exitTransition.selectAll("rect")
          .attr("width", function(d) { return x(d.value); });

        // Rebind the current node to the background.
        svg.select(".background")
          .datum(d)
          .transition()
          .duration(end);

        d.index = i;
      }

      scope.$watch('page', function(newVal, oldVal){
        if ( !scope.chart.allData || newVal < 0 ) return; //at first page

        var root = scope.chart.data;
        var allData = scope.chart.allData;
        var nodeIdx = scope.chart.nodeIdx;
        var start = (newVal-1)*pageSize;
        var end = start+pageSize;

        //check if we are on last page or not
        if ( allData.children && allData.children.length > start ) {
          root.children = allData.children.slice(start, end);
          processData(root, nodeIdx);
        }
      });

      scope.$watch('chart', function(newVal, oldVal){
        if ( !newVal || !newVal.data ) {
          //reset everything if load button is clicked
          scope.crumbs = [{ name: 'Past 24 Hours', orig: null }];
          scope.chartStack = [];
          scope.chartDepth = 0;
          return;
        }

        var root = newVal.data;
        var allData = newVal.allData;
        var node = newVal.node;
        var nodeIdx = newVal.nodeIdx;

        scope.page = 1; //reset pagination on new charts
        scope.maxPages = Math.ceil(allData.children.length/pageSize); //used by view

        partition.nodes(root);
        x.domain([0, root.value]).nice();

        if ( scope.navDirection === 'down' ) {
         if ( Object.keys(oldVal).length ){
           //scope.prevChart = oldVal;
           scope.chartStack.push(oldVal);
           var crumbNode = oldVal.allData.children[newVal.nodeIdx];
           scope.crumbs.push({ name: crumbNode.name, orig: crumbNode.orig });
           $log.log('stack', scope.chartStack);
         }
        }

        var start = (scope.page-1)*pageSize;
        var end = start+pageSize;

        //sort by time for chart 2
        if ( scope.chartDepth === 1 ) {
          root.children = root.children.sort(sortByTime);
          allData.children = allData.children.sort(sortByTime);
        }

        if ( allData.children.length > start ) {
          root.children = allData.children.slice(start, end);
        }

        processData(root, nodeIdx);
      });

      function down(d, i) {
        $log.log('down');
        scope.chartDepth += 1;
        scope.navDirection = 'down';

        //chart only goes three deep
        if (this.__transition__ || scope.chartDepth > 2 ) return;

        if ( scope.chartDepth === 1 ) {
          scope.initialModel = d.name;
        }

        if ( scope.chartDepth > 0 ) {
          scope.getData({ d: d, i: i, depth: scope.chartDepth, initialModel: scope.initialModel })
            .then(function(chart){
              scope.chart = chart;
            })
            .catch(function(error) {
              $log.warn('bad getData for api analytics chart ', error);
              throw error;
            });
        }
      }

      function up(d, i, skipCrumb) {
        if ( tip ) {
          scope.showToolTip = false;
          tip.hide();
        }
        if (this.__transition__) return;
        if ( !scope.chartStack.length ) return;

        $log.log('up');
        scope.chartDepth = scope.chartDepth > 0 ? scope.chartDepth - 1 : 0;
        scope.navDirection = 'up';
        scope.chart = scope.chartStack.pop();
        if ( !skipCrumb ) {
          scope.crumbs.pop();
        }
        $log.log(scope.chart);
      }

// Creates a set of bars for the given data node, at the specified index.
      function bar(d) {
        var bar = svg.insert("g", ".y.axis")
          .attr("class", "enter")
          .attr("transform", "translate(0,5)")
          .selectAll("g")
          .data(d.children)
          .enter().append("g")
          .style("cursor", "pointer");

        //.on("click", down);

        var calculatedHeight = barHeight*d.children.length;
        var minHeight = 100;
        var chartHeight = calculatedHeight < minHeight ? minHeight : calculatedHeight;

        svgParent.attr('height', chartHeight + margin.top - margin.bottom);

        bar.append("text")
          .attr("x", -6)
          .attr("y", barHeight / 2)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d.name; });

        bar.append("rect")
          .attr("width", function(d) {
            return x(d.value);
          })
          .attr("height", barHeight)
          .on('click', down);


        return bar;
      }

// A stateful closure for stacking bars horizontally.
      function stack(i) {
        var x0 = 0;
        return function(d) {
          var tx = "translate(" + x0 + "," + barHeight * i * 1.2 + ")";
          x0 += x(d.value);
          return tx;
        };
      }
    }

    return {
      restrict: "E",
      replace: true,
      scope: {
        chart: '=',
        getData: '&getdata'
      },
      templateUrl: './scripts/modules/api-analytics/templates/api.analytics.chart.html',
      link: function(scope, elem, attrs){
        scope.chartDepth = 0;
        scope.initialModel = null;
        scope.chartStack = [];
        scope.crumbs = [];
        scope.navDirection = 'down';
        scope.showToolTip = false;
        scope.page = 1;

        //example(scope, elem);
        custom(scope, elem);

        scope.onClickCrumb = function(i, crumb, len){
          scope.navDirection = 'up';
          scope.chartDepth = i;
          scope.chartStack.splice(i+1, len);
          scope.chart = scope.chartStack.pop();
        };

        scope.onClickPrevPage = function(){
          scope.page--;
        };

        scope.onClickNextPage = function(){
          scope.page++;
        };
      }
    };
  }
]);
