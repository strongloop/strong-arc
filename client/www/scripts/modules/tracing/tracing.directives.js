Tracing.directive('slTracingBreadcrumbs', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/tracing/templates/tracing.breadcrumbs.html',
      controller: [
        '$log',
        '$scope',
        function($log, $scope) {
          $scope.getFirstCrumbClass = function() {
            // if there is a current PF key then enable this
            if ($scope.tracingCtx.currentPFKey) {
              return 'link-cmd';
            }
            return 'readonly-crumb';

          };
          $scope.getSecondCrumbClass = function() {
            // if there is a waterfall key then enable this
            if ($scope.tracingCtx.currentWaterfallKey) {
              return 'link-cmd';
            }
            return 'readonly-crumb';

          };
        }
      ],
      link: function(scope, el, attrs) {
        scope.$watch('tracingCtx.currentPFKey', function(newPFKey, oldKey) {
          var tStamp = scope.getTimestampForPFKey(newPFKey);
          scope.tracingCtx.currentBreadcrumbs[1] = {
            instance: moment(tStamp).format('ddd, MMM Do YYYY, h:mm:ss a'),
            label: moment(tStamp).format('ddd, MMM Do YYYY, h:mm:ss a')
          };
        }, true);
        scope.$watch('tracingCtx.currentTraceSequenceId', function(newVal, oldVal) {
          var bc2 = {};
          if (newVal) {
            bc2 = {
              instance: newVal,
              label: newVal
            };
          }
          scope.tracingCtx.currentBreadcrumbs[2] = bc2;
        }, true);
      }
    }
  }
]);
Tracing.directive('slTracingProcesses', [
  function(){
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/tracing/templates/tracing.processes.html'
    }
  }
]);
Tracing.directive('slTracingPrevNext', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/tracing/templates/tracing.prev.next.html'
    }
  }
]);
Tracing.directive('slTracingInspectorCosttree', [
  '$log',
  '$timeout',
  function($log, $timeout) {
    return {
      templateUrl: './scripts/modules/tracing/templates/tracing.inspector.costtree.html',
      restrict: 'E',
      link: function(scope, el, attrs) {
        // can be very long or short
        $timeout(function() {
          window.setScrollView('.tracing-content-container');
        }, 300);
      }
    }
  }
]);
Tracing.directive('slTracingInspectorEventloop', [
  '$log',
  function($log) {
    return {
      templateUrl: './scripts/modules/tracing/templates/tracing.inspector.eventloop.html',
      restrict: 'E'
    }
  }
]);
Tracing.directive('slTracingInspectorFunctions', [
  function() {
    return {
      templateUrl: './scripts/modules/tracing/templates/tracing.inspector.function.html',
      restrict: 'E'
    }
  }
]);
Tracing.directive('slTracingInspectorBase', [
  function() {
    return {
      templateUrl: './scripts/modules/tracing/templates/tracing.inspector.base.html',
      restrict: 'E'
    }
  }
]);
Tracing.directive('slTracingWaterfallSummary', [
  '$log',
  function($log) {
    return {
      templateUrl: './scripts/modules/tracing/templates/tracing.waterfall.summary.html',
      restrict: 'E'
    }
  }
]);
Tracing.directive('slTracingHeader', [
  '$log',
  function($log) {
    return {
      templateUrl: './scripts/modules/tracing/templates/tracing.header.html',
      restrict: 'E',
      link: function(scope, el, attrs) {
        scope.$watch('tracingCtx.currentPMInstance', function(newVal, oldVal) {
          // pm instance is up but app is stopped
          if (newVal && newVal.setSize === 0) {
            $log.warn('no processes');
            scope.tracingProcessCycleActive = false;
            scope.showTimelineLoading = false;
          }

        }, true);
        scope.getStatusText = function(instance) {
          if (instance.status) {

            if (instance.status.isProblem) {
              return 'problem';

            }

            else if (instance.status.isInactive){
              return 'app not running';
            }
            else {
              return '';
            }
          }
        };
      }
    }
  }
]);
Tracing.directive('slTracingWaterfallView', [
  '$log',
  'Sha1',
  'EventLoop',
  'FlameGraph',
  'MSFormat',
  'RawTree',
  'Inspector',
  'Color',
  '$timeout',
  function($log, Sha1, EventLoop, FlameGraph, msFormat, RawTree, Inspector, Color, $timeout) {
    return {
      templateUrl: './scripts/modules/tracing/templates/tracing.waterfall.view.html',
      restrict: 'E',
      controller: [
        '$scope',
        '$log',
        function($scope, $log) {

          $scope.msFormat = msFormat;
          $scope.waterfallChildIndex = 1;
          $scope.tracingCtx.currentBreadcrumbs[2] = {};
          $scope.isPrevDisabled = true;
          $scope.isNextDisabled = true;

          $scope.inspectorModel = {};

          $scope.showDetailView = function() {
            return ($scope.tracingCtx.currentWaterfallKey && $scope.tracingCtx.currentWaterfallKey.length > 0);
          };
          $scope.closeDetailView = function() {
            $scope.tracingCtx.currentWaterfallKey = '';
            $scope.waterfallChildIndex = 1;
          };
          $scope.previousWaterfall = function() {
            var totalLen = $scope.tracingCtx.currentWaterfalls.length;
            for (var i = 0;i < totalLen; i++) {
              var wf = $scope.tracingCtx.currentWaterfalls[i];
              if ((wf.id === $scope.tracingCtx.currentWaterfallKey) || (Sha1(wf.id) === $scope.tracingCtx.currentWaterfallKey)) {
                if (i > 0) {
                  $scope.waterfallChildIndex = ($scope.waterfallChildIndex - 1);
                  $scope.tracingCtx.currentWaterfallKey = $scope.tracingCtx.currentWaterfalls[i - 1].id;
                  break;
                }
              }
            }
          };
          $scope.isShowTopCosts = function() {
            if ($scope.tracingCtx.currentFunction.item && $scope.tracingCtx.currentFunction.item.costSummary && $scope.tracingCtx.currentFunction.item.costSummary.topCosts) {
              return true;
            }
            return false;
          };
          $scope.nextWaterfall = function() {
            var totalLen = $scope.tracingCtx.currentWaterfalls.length;
            for (var i = 0;i < totalLen; i++) {
              var wf = $scope.tracingCtx.currentWaterfalls[i];
              if ((wf.id === $scope.tracingCtx.currentWaterfallKey) || (Sha1(wf.id) === $scope.tracingCtx.currentWaterfallKey)) {
                if (i < ($scope.tracingCtx.currentWaterfalls.length - 1)) {
                  $scope.waterfallChildIndex = ($scope.waterfallChildIndex + 1);
                  $scope.tracingCtx.currentWaterfallKey = $scope.tracingCtx.currentWaterfalls[i + 1].id;
                  break;
                }
              }
            }
          };
          $scope.loadWaterfallById = function(waterfallKey) {
            var waterfall = [];
            $scope.tracingCtx.currentTrace.waterfalls.map(function(w) {
              if ((w.id === waterfallKey) || (Sha1(w.id) === waterfallKey)) {
                waterfall = w;
              }
            });
            return waterfall;
          };
          $scope.showEventloopInspector = function() {
            return false;
          };
          $scope.showCosttreeInspector = function() {
            return true
          };
          $scope.showFunctionsInspector = function() {
            return false;
          };
        }],
      link: function(scope, el, attrs) {
        scope.$watch('tracingCtx.currentWaterfallKey', function(newVal, oldVal) {
          if (newVal && newVal.length > 0) {
            scope.tracingCtx.currentWaterfall = scope.loadWaterfallById(newVal);

          }
        });
        scope.charts = [];
        scope.selected = {};
        scope.eventloop = new EventLoop();
        scope.flame = new FlameGraph();
        scope.rawtree = new RawTree();
        scope.inspector = new Inspector({
          app: {},
          trace: scope.tracingCtx.currentTrace,
          el: jQuery('[role=inspector]')[0]
        });

        function setViewScrolls() {
          $timeout(function() {
            var viewPortHeight = $(window).height();
            var targetColOffset = $('.inspector-col').offset().top;
            var maxHeight = viewPortHeight - targetColOffset;
            $('.inspector-col').css('height', maxHeight);
            $('.waterfall-col').css('height', maxHeight);
          },10);
        }
        scope.eventloop.init('[data-hook="eventloop"]', { expanded: true, color: Color });
        scope.flame.init('[data-hook="flame"]', {colors: Color, disableZoom: true});
        scope.rawtree.init('[data-hook="rawtree"]', {colors: Color});

        function setPrevNextButtonStatus() {
          if (scope.waterfallChildIndex < scope.tracingCtx.currentWaterfalls.length) {
            scope.isNextDisabled = false;
          }
          else {
            scope.isNextDisabled = true;
          }
          if (scope.waterfallChildIndex > 1) {
            scope.isPrevDisabled = false;
          }
          else {
            scope.isPrevDisabled = true;
          }
        }

        scope.preview = function mouseEnter(d){
          scope.$apply(function() {
            scope.inspectorModel = d;
          });
          /*
           *
           * need to switch on type
           * - flame
           * - eventLoop
           * - rawTree
           *
           * */
          scope.charts.forEach(function(chart) {
            if (chart.highlight) {
              chart.highlight(d.item);
            }
          });
        };
        scope.restore = function mouseLeave(){
          scope.$apply(function() {
            scope.inspectorModel = scope.tracingCtx.currentFunction || {};
          });
          scope.charts.forEach(function(chart) {
            if (chart.highlight) chart.highlight()
          });
        };
        scope.select = function select(d) {
          scope.selected = (scope.selected && scope.selected.item == d.item) ? false : d
          scope.charts.forEach(function(chart) {
            if (chart.select){
              chart.select(scope.selected && scope.selected.item);
            }
          });
          setViewScrolls();
          scope.tracingCtx.currentFunction = scope.selected;
        };
        scope.deselect = function deselect() {
          delete scope.selected;
        };
        var setupListeners = function setupListeners(charts){
          scope.charts = charts;
          scope.charts.forEach(function(d){
            d.on('mouseenter', scope.preview.bind(self));
            d.on('mouseleave', scope.restore.bind(self));
            d.on('click', scope.select.bind(self));
          });
        };
        setupListeners([scope.rawtree, scope.eventloop, scope.flame]);

        scope.$watch('tracingCtx.currentWaterfall', function(newWaterfall, oldVal) {
          if (newWaterfall && newWaterfall.id) {
            setPrevNextButtonStatus();
            scope.eventloop.update(newWaterfall, scope.tracingCtx.currentTrace.functions);
            scope.flame.update(newWaterfall, scope.tracingCtx.currentTrace.functions);
            scope.rawtree.update(newWaterfall);
            setViewScrolls();

          }
        });
        window.onresize(setViewScrolls);
      }
    }
  }
]);
Tracing.directive('slTracingTraceMappedTraces', [
  '$log',
  'Sha1',
  'EventLoop',
  'MSFormat',
  'TracingServices',
  'ArcServices',
  '$timeout',
  'Color',
  'StringService',
  function($log, Sha1, EventLoop, msFormat, TracingServices, ArcServices, $timeout, Color, strSvc) {
    return {
      templateUrl: './scripts/modules/tracing/templates/tracing.trace.mapped.traces.html',
      restrict: 'E',
      link: function (scope, el, attrs) {
        /*
         *
         * Mapped Traces
         *
         * */
        scope.format = d3.format('.3s');

        scope.$watch('tracingCtx.currentTraceToggleBool', function (newVal, oldVal) {
          if (scope.tracingCtx.currentTrace && scope.tracingCtx.currentTrace.transactions) {
            scope.tracingCtx.mappedTransactions = TracingServices.getMappedTransactions(scope.tracingCtx.currentTrace.transactions.transactions);

            // check if we need to filter untagged waterfalls
            ArcServices.getFeatureFlags()
              .then(function(flags) {
                var includeUntagged = false;
                for (var i = 0;i < flags.data.length;i++) {
                  if (flags.data[i] === TRACING_CONST.FF_UNTAGGED_WATERFALLS) {
                    includeUntagged = true;
                    break;
                  }
                }
                if (!includeUntagged) {
                  scope.tracingCtx.mappedTransactions = scope.tracingCtx.mappedTransactions.filter(function(transaction) {
                    return transaction.id !== 'untagged';
                  });
                }
                render();
              })
              .catch(function(error) {
                $log.warn('bad get feature flags: ' + error.message);
                // render regardless
                render();
              });
          }
        }, true);

        scope.msFormat = function (d) {
          return scope.format(d / 1000000) + 's';
        };


        function render() {
          scope.isShowTraceSequenceLoader = false;
          /*
           *
           * Trace Sequences
           *
           * */
          var trans = d3.select('[role=transactions]')
            .selectAll('li')
            .data(scope.tracingCtx.mappedTransactions, function key(d) {
              return d.id
            });
          trans.exit().remove();

          //transaction enter
          var transactionEnter = trans.enter()
            .append('li')
            .attr('class', 'list-group-item transaction')
            .classed('expanded', function (d) {
              return true
            });

          var transactionTableEnter = transactionEnter.append('table');
          var transactionTableRow = transactionTableEnter.append('tr');

          transactionTableRow.append('td').attr('class', 'transaction-badge')
            .attr('class', 'transaction-badge')
            .append('span')
            .attr('class', 'badge');
          transactionTableRow.append('td')
            .append('button')
            .attr('class', 'link-cmd transaction-route')
            .on('click', function (d) {

              scope.waterfallChildIndex = 1;
              scope.tracingCtx.currentWaterfalls = d.waterfalls;
              // navigate to the first waterfall key
              var waterfallId = Sha1(d.waterfalls[0].id);
              scope.tracingCtx.currentWaterfallKey = waterfallId;
              scope.tracingCtx.currentTraceSequenceId = d.id;
              return false;
            })
            .text(function (d) {
              return d.id
            });
          transactionTableRow.append('td').attr('class', 'transaction-jsmicros');
          transactionTableRow.append('td').attr('class', 'transaction-totalmicros');
          transactionTableRow.append('td').attr('class', 'transaction-async');
          transactionTableRow.append('td').attr('class', 'transaction-blocked');

          /*
          *
          * Trace Transaction Sequences
          *
          * */
          var panelEnter = transactionEnter.append('ul')
            .attr('class', 'waterfalls')
            .attr('data-id', function (d) {
              return Sha1(d.id)
            });

          trans.select('span.badge')
            .text(function (d) {
              return d.waterfalls.length
            });

          var waterfalls = trans.select('.waterfalls')
            .selectAll('.waterfall')
            .data(function (d) {
              return d.waterfalls
            }, function (d) {
              return d.id
            });

          var waterfall = waterfalls.enter()
            .append('li')
            .append('div')
            .attr('class', 'waterfall panel panel-default')
            .attr('data-id', function (d) {
              return Sha1(d.id)
            });

          var waterfallHeadingTableEnter = waterfall.append('div')
            .attr('class', 'panel-heading')
            .append('table');

          var waterfallTableHeaderEnter = waterfallHeadingTableEnter
            .append('thead')
            .append('tr');

          waterfallTableHeaderEnter.append('th')
            .text('Code Path')
            .append('span')
            .attr('class', 'help-text')
            .text('click to drill down into waterfall');
          waterfallTableHeaderEnter.append('th').text('JS');
          waterfallTableHeaderEnter.append('th').text('Total');
          waterfallTableHeaderEnter.append('th').text('Async');
          waterfallTableHeaderEnter.append('th').text('Blocked');

          var waterfallTitleEnter = waterfallHeadingTableEnter.append('td')
            .attr('class', 'waterfall-title');

          var waterfallMicroEnter = waterfallHeadingTableEnter.append('td')
            .attr('class', 'waterfall-js');

          var waterfallMicroEnter = waterfallHeadingTableEnter.append('td')
            .attr('class', 'waterfall-total');

          var waterfallAsyncEnter = waterfallHeadingTableEnter.append('td')
            .attr('class', 'waterfall-async');

          var waterfallSyncEnter = waterfallHeadingTableEnter.append('td')
            .attr('class', 'waterfall-sync');

          var waterfallBodyEnter = waterfall
            .attr('href', function (d) {
              return '#';
            })
            .on('click', function (d) {
              var waterfallId = Sha1(d.id);
              scope.tracingCtx.currentWaterfallKey = waterfallId;
              return false;
            })
            .append('div')
            .attr('class', 'panel-body')
            .each(function (waterfall) {
              this.eventloop = EventLoop().init(this, {expanded: true, color: Color})
            });

          //exit set
          waterfalls.exit().remove();

          waterfalls.selectAll('.waterfall-title')
            .text(function (d, i) {
              return d.costSummary.summaryText
            });

          waterfalls.selectAll('.waterfall-js')
            .text(function (d, i) {
              return msFormat(d.timing_stats.jsMicros)
            });

          waterfalls.selectAll('.waterfall-total')
            .text(function (d, i) {
              return msFormat(d.timing_stats.totalMicros)
            });

          waterfalls.selectAll('.waterfall-async')
            .text(function (d, i) {
              return Math.floor(d.timing_stats.percentAsync) + '%'
            });

          waterfalls.selectAll('.waterfall-sync')
            .text(function (d, i) {
              return Math.floor(d.timing_stats.percentBlocked) + '%'
            });

          // Update
          trans.attr('id', function (d) {
            return strSvc.slugify(d.id)
          });
          trans.select('.transaction-route').text(function (d) {
            return (d.id === 'untagged') ? 'Untagged Waterfalls' : d.id
          });
          trans.select('.transaction-jsmicros').text(function (d) {
            return msFormat(d.waterfalls.summary_stats.jsMicros)
          });
          trans.select('.transaction-async').text(function (d) {
            return Math.floor(d.waterfalls.summary_stats.percentAsync) + '%'
          });
          trans.select('.transaction-blocked').text(function (d) {
            return Math.floor(d.waterfalls.summary_stats.percentBlocked) + '%'
          });
          trans.select('.transaction-totalmicros').text(function (d) {
            return msFormat(d.waterfalls.summary_stats.totalMicros)
          });
          trans.attr('data-id', function (d) {
            return d.id
          });

          // only update visible eventloops
          trans.each(function (transaction) {
            d3.select(this).selectAll('.waterfall .panel-body')
              .each(function (waterfall) {
                if (this.eventloop) {
                  this.eventloop.update(waterfall, scope.tracingCtx.currentTrace.functions)
                }
                else {
                  $log.debug('no event loop');
                }
              });
          });

          //finally, sort the array
          trans.sort(function (a, b) {
            return b.waterfalls.summary_stats.totalMicros - a.waterfalls.summary_stats.totalMicros
          });

          // Jump to the proper id after UI is finished rendering
          // TODO confirm if this code is still valid
          setTimeout(function () {
            //if (window.location.hash)
            if (true == false) {
              var target = document.getElementById(window.location.hash.slice(1))
              target.classList.add('expanded')
              d3.select(target).selectAll('.waterfall .panel-body')
                .each(function (waterfall) {
                  this.eventloop.update(waterfall, self.trace.functions);
                });
              window.location.href = window.location.hash;
            }
          }, 0);
        }
      }

    }}
]);
/*
* currently not displayed (v1)
* */
Tracing.directive('slTracingTraceSummary', [
  '$log',
  'Sha1',
  'EventLoop',
  'PieChart',
  'MSFormat',
  function($log, Sha1, EventLoop, PieChart, msFormat) {
    return {
      templateUrl: './scripts/modules/tracing/templates/tracing.trace.summary.html',
      restrict: 'E',
      link: function(scope, el, attrs) {

        scope.msFormat = msFormat;

        /*
        *
        * Pie Charts
        *
        * */
        var traceToAsyncPie = function(trace){
          var data = [
            {
              key: "async",
              value: trace.summary_stats.percentAsync,
              fillClass: 'async'
            },
            {
              key: "sync",
              value: trace.summary_stats.percentBlocked,
              fillClass: 'blocked'
            }
          ];
          return data
        };
        var asyncpie = new PieChart();
        var idlepie = new PieChart();
        asyncpie.init('[role="summary-async-pie"]', {fixedWidth: 200, fixedHeight: 200});
        idlepie.init('[role=summary-idle-pie]', {fixedWidth: 200, fixedHeight: 200});

        var traceToIdlePie = function(trace){
          var data = [
            {
              key: "idle",
              value: trace.summary_stats.percentIdle,
              fillClass: 'idle'
            },
            {
              key: "busy",
              value: trace.summary_stats.percentOperating,
              fillClass: 'operating'
            }
          ];
          return data
        };

        var renderTraceSummary = function() {
          /*
           *
           * Pie Charts
           *
           * */
          asyncpie.update(traceToAsyncPie(scope.tracingCtx.currentTrace));
          idlepie.update(traceToIdlePie(scope.tracingCtx.currentTrace));

        };
        /*
        * Render
        * */
        if (scope.tracingCtx.currentTrace.summary_stats) {
          asyncpie.update(scope.traceToAsyncPie(scope.tracingCtx.currentTrace));
          idlepie.update(scope.traceToIdlePie(scope.tracingCtx.currentTrace));
        }

        scope.$watch('tracingCtx.currentTraceToggleBool', function(newVal, oldVal) {
          if (scope.tracingCtx.currentTrace) {
            renderTraceSummary();
          }
        }, true);
      }
    }
  }
]);
Tracing.directive('slTracingTraceView', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/tracing/templates/tracing.trace.view.html',
      controller: ['$scope', function($scope) {
        $scope.showTraceView = function() {
          if ($scope.tracingCtx.currentTrace && $scope.tracingCtx.currentTrace.metadata) {
            if ($scope.tracingCtx.currentWaterfallKey && $scope.tracingCtx.currentWaterfallKey.length > 0) {
              return false;
            }
            return true;
          }
          return false;
        };
      }]
    }
  }
]);
Tracing.directive('slTracingTimeSeriesCharts', [
  '$log',
  '$rootScope',
  'TimeSeries',
  '$timeout',
  function($log, $rootScope, TimeSeries, $timeout) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/tracing/templates/tracing.timeseries.charts.html',
      link: function(scope, el, attrs) {
        var colormap = {
          'Process Heap Total': '#7777ff',
          'Process Heap Used': '#2ca02c',
          'Process RSS': '#ff7f0e',
          'Load Average': '#7777ff',
          'Memory Used': '#ff7f0e'
        };

        function color(name){
          return colormap[name] || '#00000'
        }

        scope.cpuGraphOptions = {
          height: 100,
          margin: {top: 20, right: 25, bottom: 30, left: 0},
          color: color,
          format: {
            'y': 'num',
            'y1': 'num'
          },
          keySchema: {
            'Load Average': {
              class: 'cx-monitor-loadavg',
              type: 'line',
              y: 'y'
            },
            'Memory Used': {
              class: 'cx-monitor-uptime',
              type: 'line',
              y: 'y1'
            }
          }
        };

        function updateCurrentPFKey(data) {
          scope.setCurrentPFKey(data.pfkey);
        }
        scope.cpugraph = new TimeSeries('#cpu-history-cont', scope.cpuGraphOptions)
          .on('click', updateCurrentPFKey);

        scope.$watch('tracingCtx.currentPFKey', function(newKey, oldVal) {

          if (!newKey) {
            if (scope.tracingCtx.currentTimeline && scope.tracingCtx.currentTimeline.length) {
              scope.cpugraph = new TimeSeries('#cpu-history-cont', scope.cpuGraphOptions)
                .on('click', updateCurrentPFKey);
              scope.cpugraph.draw(scope.tracingCtx.currentTimeline);

              var pfKeyTime = scope.getTimestampForPFKey(newKey);
              if (pfKeyTime > 0) {
                scope.cpugraph.setSelection(pfKeyTime);
              }
            }
          }
          else {
            scope.cpugraph = new TimeSeries('#cpu-history-cont', scope.cpuGraphOptions)
              .on('click', updateCurrentPFKey);
            scope.cpugraph.draw(scope.tracingCtx.currentTimeline);

            var pfKeyTime = scope.getTimestampForPFKey(newKey);
            if (pfKeyTime > 0) {
              scope.cpugraph.setSelection(pfKeyTime);
            }
          }
        });
        scope.$watch('tracingCtx.currentTimeline', function(tl, oldVal) {
          if (tl) {
            if( tl.length && (tl !== oldVal)){
              scope.cpugraph = new TimeSeries('#cpu-history-cont', scope.cpuGraphOptions)
                .on('click', updateCurrentPFKey);
              $timeout(function() {
                scope.cpugraph.draw(tl);
              });

            }
          }
        }, true);
      }
    }
  }
]);

Tracing.directive('slTracingTransactionHistory', [
  '$log',
  '$timeout',
  'TransactionList',
  function($log, $timeout, TransactionList) {
    return {
      templateUrl: './scripts/modules/tracing/templates/tracing.transaction.history.html',
      restrict: 'E',
      controller: ['$scope', function($scope) {
        $scope.updatePFKeyFromTransactionHistory = function(pfkey) {
          $scope.tracingCtx.currentPFKey = pfkey;
        }
      }],
      link: function(scope, el, attrs) {
        scope.transactionListView = TransactionList('[data-hook="transaction-list-cont"]', {});


        scope.$watch('transactionHistoryRenderToggle', function(newVal, oldVal) {
          if (scope.tracingCtx.currentTransactionHistoryCollection && scope.tracingCtx.currentTransactionHistoryCollection.length) {

            scope.transactionListView.render(scope.tracingCtx.currentTransactionHistoryCollection);
            //
            $timeout(function() {
              window.setScrollView('.tracing-content-container');
            }, 200);

          }
        }, true);


      }
    }
  }

]);
Tracing.directive('slTracingHostStatus', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/tracing/templates/tracing.host.status.html'
    }
  }
]);
Tracing.directive('slTracingTimelineView', [
  '$log',
  '$timeout',
  'TransactionList',
  'TraceEnhance',
  function($log, $timeout, TransactionList, TraceEnhance) {
    return {
      templateUrl: './scripts/modules/tracing/templates/tracing.timeline.view.html',
      restrict: 'E',
      link: function(scope, el, attrs) {
        window.onresize = function() {
          window.setScrollView('.tracing-content-container');
        };
      }
    }
  }
]);
