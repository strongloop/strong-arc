Tracing.controller('TracingMainController', [
  '$scope',
  '$log',
  '$timeout',
  '$interval',
  '$location',
  'TracingServices',
  'TraceEnhance',
  function($scope, $log, $timeout, $interval, $location, TracingServices, TraceEnhance) {

    $scope.pm = {};
    $scope.systemFeedback = [];  // FEEDBACK
    $scope.managerHosts = [];    // $location.host()
    $scope.selectedPMHost = {};
    $scope.processes = [];
    $scope.showTransactionHistoryLoading = true;
    $scope.showTimelineLoading = true;
    $scope.selectedProcess = {};
    $scope.tracingCtx = {};
    $scope.transactionHistoryRenderToggle = false;

    /*
     *
     * INIT
     *
     * */
    $scope.init = function() {
      $scope.resetTracingCtx();

      // check if user has a valid metrics license
      TracingServices.validateLicense()
        .then(function(isValid) {
          if (!isValid) {
            $log.warn('invalid tracing license');
            return;
          }

          $scope.managerHosts = TracingServices.getManagerHosts(function(hosts) {
            $scope.$apply(function() {
              $scope.managerHosts = hosts;
              if (!$scope.selectedPMHost.host) {
                $scope.selectedPMHost = {
                  host: $scope.managerHosts[0].host,
                  port: $scope.managerHosts[0].port
                };
              }
              $scope.main();
            });
          });

        })
        .catch(function(error) {
          $log.warn('exception validating tracing license (controller)');
          return;
        });

    };

    /*
     *
     * MAIN
     *
     * */
    $scope.main = function() {
      if (!$scope.selectedPMHost.host) {
        // set notification banner?
        $log.warn('tracing main: no host selected');
        return;
      }

      // make sure selected host is working
      TracingServices.getFirstPMInstance($scope.selectedPMHost, function(err, instance) {
        if (err) {
          $log.warn('error getting first pm instance: ' + err.message);
          $scope.$apply(function() {
            $scope.resetTracingCtx();
          });
          $scope.$apply(function() {
            TracingServices.alertNoProcesses();

          });
          return;
        }
        $scope.tracingCtx.currentPMInstance = instance;

        $scope.tracingCtx.currentPMHost = {
          host:$scope.selectedPMHost.host,
          port:$scope.selectedPMHost.port
        };

        $scope.tracingCtx.currentBreadcrumbs[0] = {
          instance: $scope.tracingCtx.currentPMInstance,
          label: $scope.tracingCtx.currentPMInstance.applicationName
        };
        $scope.$apply(function() {
          $scope.processes =  [];

        });
        if ($scope.tracingCtx.currentPMInstance.tracingEnabled) {
          $scope.tracingCtx.currentPMInstance.processes(function(err, processes) {
            if (err) {
              $log.warn('bad get processes: ' + err.message);
              return;
            }
            if (!processes) {
              $log.warn('no processes');

            }
            /*
             * we have processes but they need to be filtered
             * */
            var filteredProcesses = [];
            //filter out dead pids
            processes = processes.filter(function(process){
              return !process.stopTime;
            });
            // filter out the supervisor
            processes.map(function(proc) {
              if (proc.workerId !== 0) {
                filteredProcesses.push(proc);
              }
            });

            $scope.processes = filteredProcesses;
            $scope.tracingCtx.currentProcesses = filteredProcesses;
            $scope.tracingCtx.currentProcess = filteredProcesses[0];  //default
            $scope.selectedProcess = filteredProcesses[0];
            $scope.refreshTimelineProcess();

          });
        }


      });

    };
    /*
    * reset main context variables
    * */
    $scope.resetTracingCtx = function() {
      $scope.tracingCtx = {
        currentPFKey: '',
        selectedManagerHost: {},
        currentPMHost: {},
        currentPMInstance: {},
        currentTraceToggleBool: false,
        currentTimelineTimestamp: '',
        currentTimelineDuration: 0,
        currentTimelineKeyCollection: [],
        currentTrace: {},
        currentBreadcrumbs: [],
        currentWaterfallKey: '',
        currentWaterfall: {},
        currentFunction: {},
        currentProcesses: [],
        currentProcess: {},
        currentPids: [],
        currentTimeline: [],
        currentTransactionKeys: [],
        currentTransactionHistoryCollection: [],
        currentApp: {name: ''}
      };
      $scope.processes = [];
    };

    /*
    *
    *
    *
    * UPDATE TIMELINE DATA
    *
    *
    * */
    function updateTimelineData(timeline) {
      var self = this;
      self.timeline = timeline;
      $scope.tracingCtx.currentTimelineKeyCollection = [];
      self.timeline.map(function(trace) {
        var t = trace;
        $scope.tracingCtx.currentTimelineKeyCollection.push(trace.__data.pfkey);
      });
      $scope.$apply(function() {
        $scope.tracingCtx.currentTimeline = self.timeline;

      });

      $scope.tracingCtx.currentTimelineTimestamp = TracingServices.getCurrentTimelineTimestamp();
      $scope.updateTransactionHistory();
    }
    /*
     *
     * REFRESH TIMELINE PROCESS
     *
     * */
    $scope.refreshTimelineProcess = function() {
      $scope.tracingCtx.currentProcess.getTimeline(function(err, rawResponse) {
        $scope.showTimelineLoading = false;
        if (err) {
          $log.warn('bad get timeline: ' + err.message);
          return;
        }

        $scope.tracingCtx.currentPFKey = '';

        $scope.tracingCtx.timelineStart = 0;

        /*
         *
         *  process the response
         *
         * */
        var trueResponse = TracingServices.convertTimeseries(rawResponse);

        updateTimelineData(trueResponse);
      });
    };



    /*

    HELPERS

    *
    * GET TIMESTAMP FOR KEY
    *
    * */
    $scope.getTimestampForPFKey = function(pfKey) {
      if ($scope.tracingCtx && $scope.tracingCtx.currentTimeline.length) {
        for (var i = 0;i < $scope.tracingCtx.currentTimeline.length;i++) {
          var instance = $scope.tracingCtx.currentTimeline[i];
          if (instance.__data && (instance.__data.pfkey === pfKey)) {
            return instance._t;

          }
        }
        return 0;
      }
      return 0;
    };
    /*
    *
    * GET TIMELINE DURATION
    *
    * */
    $scope.getCurrentTimelineDuration = function() {
      if (!$scope.tracingCtx.currentTimeline) {
        return 0;
      }
      var dataPointCount = $scope.tracingCtx.currentTimeline.length;
      if (dataPointCount > 0) {
        return $scope.tracingCtx.currentTimeline[dataPointCount - 1].Uptime
      }
      return 0;
    };


    /*

    DATA MODEL CHANGERS
    *
    * CHANGE PM HOST
    *
    *
    * */
    // from the host selector in tracing header
    $scope.changePMHost = function(host) {
      if (host.host && host.port) {
        $scope.resetTracingCtx();
        $scope.selectedPMHost = host;

        $scope.main();
      }
    };

    /*
    *
    * SET ACTIVE PID
    *
    * */
    $scope.setActiveProcess = function(process) {
      $scope.showTimelineLoading = true;
      $scope.tracingCtx.currentTimeline = [];
      $scope.tracingCtx.currentTransactionKeys = [];
      $scope.tracingCtx.currentTransactionHistoryCollection = [];
      $scope.tracingCtx.currentWaterfallKey = '';
      $scope.tracingCtx.currentTrace = {};

      $scope.tracingCtx.currentProcess = process;
      if ($scope.tracingCtx.currentProcess) {
        $scope.refreshTimelineProcess();
      }
    };


    $scope.turnTracingOn = function() {
      $scope.tracingCtx.currentPMInstance.tracingStart(function(err, response) {
        if (err) {
          $log.warn('bad start tracing: ' + err);
          return;
        }
        $scope.main();
      });
    };
    $scope.turnTracingOff = function() {
      $scope.tracingCtx.currentPMInstance.tracingStop(function(err, response) {
        if (err) {
          $log.warn('bad stop tracing: ' + err);
          return;
        }
        $scope.main();
      });
    };


    /*
     *
     * SET PF KEY
     *
     * */
    $scope.setCurrentPFKey = function(key) {
      $scope.tracingCtx.currentTrace = {};
      $scope.tracingCtx.currentPFKey = key;
      $scope.tracingCtx.currentWaterfallKey = '';

    };

    /*
     * PREV KEY
     * */
    $scope.prevPFKey = function() {
      if ($scope.tracingCtx.currentTimelineKeyCollection) {
        var currIndex = $scope.tracingCtx.currentTimelineKeyCollection.indexOf($scope.tracingCtx.currentPFKey);
        if (currIndex > 1) {
          $scope.tracingCtx.currentTrace = {};
          $scope.tracingCtx.currentPFKey = $scope.tracingCtx.currentTimelineKeyCollection[currIndex - 1];
          $scope.tracingCtx.currentWaterfallKey = '';
        }
      }
    };
    /*
     * NEXT KEY
     * */
    $scope.nextPFKey = function() {
      if ($scope.tracingCtx.currentTimelineKeyCollection) {
        var currIndex = $scope.tracingCtx.currentTimelineKeyCollection.indexOf($scope.tracingCtx.currentPFKey);
        var len = $scope.tracingCtx.currentTimelineKeyCollection.length;
        if (len > 0) {
          if (currIndex < (len - 2)) {
            $scope.tracingCtx.currentTrace = {};
            $scope.tracingCtx.currentPFKey = $scope.tracingCtx.currentTimelineKeyCollection[currIndex + 1];
            $scope.tracingCtx.currentWaterfallKey = '';
          }
        }
      }
    };
    /*
    *
    *   TRANSACTION HISTORY
    *
    * */
    $scope.updateTransactionHistory = function() {
      $scope.tracingCtx.currentTransactionHistoryCollection = [];

      $scope.tracingCtx.currentProcess.getMetaTransactions(function(err, response) {
        $scope.showTransactionHistoryLoading = false;
        if (err) {
          $log.warn('bad get meta transactions: ' + err.message);

          return;
        }
        $scope.tracingCtx.currentTransactionKeys = response;
        /*
         the current context list of transactions

         we need to iterate over them and create a deeper object than the simple one used by transaction-list component

         trasObj = {
         key: transaction,
         history: {object based on api call}
         };

         */
        // isolate the transactions for this pid

        // iterate over the transaction keys
        var keyLen = $scope.tracingCtx.currentTransactionKeys.length;
        $scope.tracingCtx.currentTransactionKeys.map(function(transaction) {
          /*
           *
           * Transaction History
           *
           * - TODO expensive so should only do it on demand
           *
           * */

          $scope.tracingCtx.currentProcess.getTransaction(encodeURIComponent(transaction),
            function (err, history) {
              if (err) {
                $log.warn('bad get history: ' + err.message);
              }
              transObj = {
                history: history,
                key: transaction
              };
              $scope.tracingCtx.currentTransactionHistoryCollection.push(transObj);
              if ($scope.tracingCtx.currentTransactionHistoryCollection.length === keyLen) {
                $scope.$apply(function() {
                    $scope.transactionHistoryRenderToggle = !$scope.transactionHistoryRenderToggle;
                  });

              }
            });
        });

      });


    };
    /*
     *
     * NAV
     *
     * BACK TO TIMELINE
     *
     *
     * */
    $scope.backToTimeline = function() {
      $scope.tracingCtx.currentPFKey = '';
      $scope.tracingCtx.currentTrace = {};
      $scope.tracingCtx.currentWaterfallKey = '';
    };
    /*
     *
     * BACK TO TRACE
     *
     * */
    $scope.backToTrace = function() {
      $scope.tracingCtx.currentWaterfallKey = '';
    };
    /*
     *
     * CLOSE TRACE VIEW
     *   need a better way to do this
     * */
    $scope.closeTraceView = function() {
      $scope.tracingCtx.currentTrace = {};
      $scope.tracingCtx.currentPFKey = '';
      $scope.tracingCtx.currentWaterfallKey = '';
    };



    /*
    * TIMESTAMP FORMAT
    * */
    $scope.tsText = function(ts){
      return moment(ts).fromNow() +' (' + moment(ts).format('ddd, MMM Do YYYY, h:mm:ss a') + ')'
    };




    /*
     *
     * PF KEY WATCH
     *
     * if we get a key then load the trace file
     * set currentTrace
     * toggle currentTraceToggleBool
     * - watch target for directives
     * - instead of comparing the trace data object
     *
     * */
    $scope.$watch('tracingCtx.currentPFKey', function(newKey, oldVal) {
      if (newKey) {
        $scope.tracingCtx.currentTrace = {};

        $timeout(function() {
          $scope.tracingCtx.currentProcess.getTrace(newKey, function(err, trace) {
            if (err) {
              $log.warn('bad get trace: ' + err.message);
              return {};
            }
            var obj = JSON.parse(trace);
            var TE = TraceEnhance(obj);
            $scope.tracingCtx.currentTrace = TE;
            // too expensive to compare the trace
            $scope.$apply(function() {
              $scope.tracingCtx.currentTraceToggleBool = !$scope.tracingCtx.currentTraceToggleBool;
            });
          });

        }, 100);
      }
    }, true);

    window.onresize = function() {
      window.setScrollView('.tracing-content-container');
    };

    /*
    *
    * INIT
    *
    * */
    $scope.init();
  }
]);

