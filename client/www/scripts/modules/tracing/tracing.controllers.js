Tracing.controller('TracingMainController', [
  '$scope',
  '$log',
  '$timeout',
  '$interval',
  '$location',
  'growl',
  'MSFormat',
  'TracingServices',
  'ManagerServices',
  'PMHostService',
  'TraceEnhance',
  '$state',
  function($scope, $log, $timeout, $interval, $location, growl, msFormat, TracingServices, ManagerServices, PMHostService, TraceEnhance, $state) {
    var loadTracingProcessesAttemptCount = 0;
    $scope.pm = {};
    $scope.killProcessPoll = true;
    $scope.pidCycleCheckCollection = [];
    $scope.tracingProcessCycleActive = false;
    $scope.showTraceToggle = true;
    $scope.targetProcessCount = 0;
    $scope.tracingOnOffCycleMessage = 'starting';
    $scope.systemFeedback = [];  // FEEDBACK
    $scope.managerHosts = [];    // $location.host()
    $scope.selectedPMHost = {};
    $scope.processes = [];
    $scope.selectedProcess = {};
    $scope.tracingCtx = {};
    $scope.showTimelineLoading = true;
    $scope.showTransactionHistoryLoading = true;
    $scope.isShowTraceSequenceLoader = false;
    $scope.transactionHistoryRenderToggle = false;
    // timeseries nav buttons
    $scope.isFirstPFKey = false;  // no key is pre selected during init
    $scope.isLastPFKey = false; // assume there is more than 1 record
    $scope.tracingOnOff = [
      { id: 'off', label: 'Off', activeId: 'isTracingOn' },
      { id: 'on', label: 'On', activeId: 'isTracingOn' }
    ];
    $scope.sysTime = {ticker:20};
    var updateInterval;
    $scope.tracingUpdateInterval = 20;
    $scope.startTicker = function() {
      $scope.sysTime.ticker = 20;
      $scope.startTimer();
    };
    $scope.restartTicker = function() {
      $scope.sysTime.ticker = 20;
      $scope.startTimer();
    };
    $scope.startTimer = function() {
      // cancel the previous interval if it wasn't cleaned up
      $scope.stopTimer();

      updateInterval = $interval(function() {
        // make sure we have a valid process to work with
        if ($scope.tracingCtx.currentProcess.pid) {
          $scope.sysTime.ticker--;

          if ($scope.sysTime.ticker < 1) {
            $scope.sysTime.ticker = $scope.tracingUpdateInterval;
            $scope.refreshTimelineProcess();
          }
        }
        else {
          $scope.stopTimer();
        }
      }, 1000);

      $scope.isTimerRunning = true;
    };
    $scope.stopTimer = function() {
      if (updateInterval !== null) {
        $interval.cancel(updateInterval);
        updateInterval = null;
        $scope.isTimerRunning = false;
      }
    };

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
            $scope.showTimelineLoading = false;
            $scope.showTransactionHistoryLoading = false;
            $scope.isShowTraceSequenceLoader = false;
            return;
          }

          $scope.managerHosts = ManagerServices.getManagerHosts(function(hosts) {
            $scope.$apply(function() {
              $scope.managerHosts = hosts;
              if ($scope.managerHosts && $scope.managerHosts.length > 0) {
                if (!$scope.selectedPMHost.host) {
                  $scope.selectedPMHost = $scope.managerHosts[0];
                }
                $scope.main();
              }
              else {
                TracingServices.alertNoHosts();
                $scope.selectedPMHost = {
                  error: 'no PM Hosts available',
                  errorType: 'NOHOSTS',
                  status: {
                    isProblem: true,
                    problem: {
                      title:'No PM Hosts available',
                      description:'You need to add a PM Host via the Process Manager view'
                    }
                  }
                };
                $scope.showTimelineLoading = false;
              }
            });
          });

        })
        .catch(function(error) {
          $log.warn('exception validating tracing license (controller)');
          return;
        });

    };

    function processTracingProcesses(argProcesses) {
      if (!argProcesses || argProcesses.length === 0) {
        $log.warn('no processes');
        return [];
      }
    }


    /*
    used to track any lazy tracing processes
    during stop then start tracing
    * */
    var totalUnlicensedPids = [];
    var totalIterations = 0;
    // to trigger growl messages as count changes
    var prevTracingPidCount = 0;
    var restarting = false;
    /*
    * polls itself until
    * - either all setSize pids come up with tracing enabled
    * - or 35 (magic nubmer) iterations pass with
    * -- pm instance.tracingEnabled = true
    * -- but no processes with isTracing = true;
    * */
    $scope.loadTracingProcesses = function(pmInstance) {
      totalIterations++;
      pmInstance.processes(function(err, rawProcesses) {
        if (err) {
          $log.warn('bad get processes: ' + err.message);
          return [];
        }

        if (!rawProcesses || rawProcesses.length === 0) {
          $log.warn('no processes');
          return [];
        }
        // remove supervisor process
        var processes = rawProcesses.filter(function(proc) {
          return (proc.workerId !== 0);
        });
        /*
         * we have processes but they need to be filtered
         * */
        var filteredProcesses = [];

        // interim test to check if processes come up without tracing on
        // would indicate license hasn't been pushed or pm is not returning
        // tracing enabled pids
        // keep track of all 'active' (no stopTime) pids with isTracing=false
        var nonTracingActivePids = [];
        processes.map(function(process) {
          if (!process.stopTime && !process.isTracing) {
            nonTracingActivePids.push(process);
            totalUnlicensedPids.push(process);
          }
        });
        // filter out dead and non-tracig pids
        filteredProcesses = processes.filter(function(process){
          return (!process.stopTime && process.isTracing);
        });
        // tracing pids are starting to come up
        if (filteredProcesses.length > 0) {
          /*
            show correct state in case old pids are still
            being shut down by pm
            pm will shut down old pids before spooling up the
            tracing pids
          */
          $scope.tracingOnOffCycleMessage = 'starting';
          restarting = false;

          loop1:
          for (var i = 0;i < filteredProcesses.length;i++) {
            var fproc = filteredProcesses[i];
            loop2:
            for (var k = 0;k < $scope.pidCycleCheckCollection.length;k++) {
              var staleWorkderId = $scope.pidCycleCheckCollection[k];
              // still some stale pids to shut down
              if (staleWorkderId === fproc.workerId) {
                $scope.tracingOnOffCycleMessage = 'restarting';
                growl.addWarnMessage('shutting down existing processes');
                restarting = true;
                break loop1;
              }
            }
          }
        }
        /*
        * safety valve in case a tracing enabled pm never returns
        * pids with tracing turned on
        * - may be licensing
        * */
        $scope.killProcessPoll = false;
        if ((totalIterations > 40) && (filteredProcesses.length === 0)) {
          $scope.killProcessPoll = true;
          $scope.tracingProcessCycleActive = false;
          $scope.showTransactionHistoryLoading = false;
          $scope.isShowTraceSequenceLoader = false;
          $scope.showTimelineLoading = false;
          $scope.transactionHistoryRenderToggle = false;
          $scope.pidCycleCheckCollection = [];
          $scope.processes = [];
          TracingServices.alertUnlicensedPMHost();
        }

        /*
         *
         * Note to self - account for 0 processes with a setSize greater than 0
         * - when app is stopped eg.
         *
         * */

          PMHostService.getFirstPMInstance($scope.selectedPMHost, function(err, instance) {
            if (err) {
              $log.warn('bad pm reload', err);
              return;
            }
            $scope.targetProcessCount = instance.setSize;
            if ($scope.targetProcessCount > 0) {
              $scope.startTicker();
              // processes are still coming up
              var fpLen = filteredProcesses.length;
              if (fpLen !== $scope.targetProcessCount) {
                if (!restarting) {
                  if (prevTracingPidCount !== fpLen) {
                    // show progress via growl each time the process count changes
                    growl.addSuccessMessage('starting process: ' + (fpLen + 1));
                    prevTracingPidCount = fpLen;
                    loadTracingProcessesAttemptCount = 0;
                  }
                }
                if (fpLen === 1 && ($scope.processes.length === 0)) {

                  $scope.tracingCtx.currentProcess = filteredProcesses[0];  //default
                  $scope.selectedProcess = filteredProcesses[0];
                  $scope.tracingCtx.currentProcesses = filteredProcesses;
                  $scope.startTicker();
                  $scope.refreshTimelineProcess();
                }
                $scope.processes = filteredProcesses;
                $timeout(function () {
                  if (!$scope.killProcessPoll) {

                    $scope.loadTracingProcesses(instance);
                    loadTracingProcessesAttemptCount++;
                    if (loadTracingProcessesAttemptCount > 40) {
                      $scope.killProcessPoll = true;
                      $scope.tracingProcessCycleActive = false;
                      $scope.showTransactionHistoryLoading = false;
                      $scope.isShowTraceSequenceLoader = false;
                      $scope.showTimelineLoading = false;
                      $scope.transactionHistoryRenderToggle = false;
                      $scope.pidCycleCheckCollection = [];
                      TracingServices.alertProcessLoadProblem();
                      loadTracingProcessesAttemptCount = 0;
                    }
                  }
                }, 1000);
              }
              // all processes are up and tracing
              else {
                var firstProcess = filteredProcesses[0];
                loadTracingProcessesAttemptCount = 0;
                firstProcess.isActive = true;
                $scope.tracingCtx.currentProcess = firstProcess;  //default
                $scope.selectedProcess = firstProcess;
                $scope.processes = filteredProcesses;
                $scope.tracingCtx.currentProcesses = filteredProcesses;
                $scope.tracingProcessCycleActive = false;
                $scope.killProcessPoll = true;
                $scope.pidCycleCheckCollection = [];
                growl.addSuccessMessage('All processes are up and tracing');

                $scope.refreshTimelineProcess();
              }
            }
            // pm process setSize = 0
            else {
              $scope.processes = [];
              $scope.tracingCtx.currentProcesses = [];
              $scope.killProcessPoll = true;
              $scope.tracingProcessCycleActive = false;
              $scope.showTransactionHistoryLoading = false;
              $scope.isShowTraceSequenceLoader = false;
              $scope.showTimelineLoading = false;
              $scope.transactionHistoryRenderToggle = false;
              $scope.pidCycleCheckCollection = [];

            }
          });




      });
    };
    $scope.setTracingOnOffToggle = function(value) {
      if (value == 'on') {
        $scope.isTracingOn = 'on';
        $scope.tracingOnOff[0].isActive = false;
        $scope.tracingOnOff[1].isActive = true;
      }
      else if (value === 'off') {
        $scope.isTracingOn = 'off';
        $scope.tracingOnOff[0].isActive = true;
        $scope.tracingOnOff[1].isActive = false;
      }
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
      var appContext = {
        name: '',
        version: ''
      };
      if ($scope.selectedPMHost.app && $scope.selectedPMHost.app.name) {
        appContext.name = $scope.selectedPMHost.app.name;
        appContext.version = $scope.selectedPMHost.app.version;
      }

      $scope.selectedPMHost = ManagerServices.processHostStatus($scope.selectedPMHost, appContext);

      if ($scope.selectedPMHost.error) {
        $scope.showTimelineLoading = false;
        TracingServices.alertNoProcesses();
        return;
      }

      // make sure selected host is working
      PMHostService.getFirstPMInstance($scope.selectedPMHost, function(err, instance) {
        if (err) {
          $log.warn('error getting first pm instance: ' + err.message);
          $scope.$apply(function() {
            $scope.resetTracingCtx();
            TracingServices.alertNoProcesses();
          });
          $scope.showTraceToggle = false;
          $scope.showTimelineLoading = false;
          return;
        }
        if ($scope.selectedPMHost.status.isProblem) {
          $scope.setTracingOnOffToggle('off');
          $scope.showTraceToggle = false;
          $scope.showTimelineLoading = false;
          $scope.resetTracingCtx();
          return;

        }
        $scope.showTraceToggle = true;

        $scope.tracingCtx.currentPMInstance = instance;

        $scope.tracingCtx.currentPMHost = $scope.selectedPMHost;

        $scope.tracingCtx.currentBreadcrumbs[0] = {
          instance: $scope.tracingCtx.currentPMInstance,
          label: $scope.tracingCtx.currentPMInstance.applicationName
        };
        $scope.$apply(function() {
          $scope.processes =  [];

        });
        if ($scope.tracingCtx.currentPMInstance.tracingEnabled) {
          $scope.$apply(function() {
            $scope.setTracingOnOffToggle('on');
            totalUnlicensedPids = [];
            totalIterations = 0;

            $scope.loadTracingProcesses($scope.tracingCtx.currentPMInstance);
          });
        }
        else {
          $scope.$apply(function() {
            $scope.setTracingOnOffToggle('off');
            $scope.showTimelineLoading = false;
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
        mappedTransactions: [],
        currentTrace: {},
        currentTraceSequenceId: '',
        currentManagerHost: {},
        currentBreadcrumbs: [],
        currentWaterfallKey: '',
        currentWaterfalls: [],  // when navigating trace sequence waterfalls
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
        $scope.tracingCtx.currentTimelineDuration = msFormat($scope.getCurrentTimelineDuration());

      });
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
          $log.warn('bad get timeline: ', err);
          return;
        }
        if (!rawResponse) {
          $log.warn('get timeline undefined');
          $scope.resetTracingCtx();
          TracingServices.alertNoProcesses();
          return;
        }
        $scope.tracingCtx.currentPFKey = '';

        $scope.tracingCtx.timelineStart = 0;

        /*
         *
         *  process the response
         *
         * */
        var convertedTimeSeries = TracingServices.convertTimeseries(rawResponse);

        updateTimelineData(convertedTimeSeries);
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
        return $scope.tracingCtx.currentTimeline[dataPointCount - 1].__data['p_ut'];
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
        $scope.tracingCtx.currentManagerHost = $scope.selectedPMHost;
        // establish current process count
        $scope.targetProcessCount = 0;
        if ($scope.tracingCtx.currentManagerHost.processes && $scope.tracingCtx.currentManagerHost.processes.pids) {
          var netProcesses = $scope.tracingCtx.currentManagerHost.processes.pids.filter(function(process){
            return (!process.stopTime && (process.workerId !== 0));
          });
          $scope.targetProcessCount = netProcesses.length;
        }
        $scope.main();

      }
    };
    $scope.updateHost = function(host) {
      $scope.changePMHost(host);
    };
    $scope.$watch('selectedPMHost', function(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        $scope.changePMHost(newVal);
      }
    });
    $scope.updateProcessSelection = function(selection) {
      if (selection.length) {
        selection[0].isActive = true;
        $scope.activeProcess = selection[0];
        $scope.setActiveProcess($scope.activeProcess);
      }
    };
    $scope.goToAddPM = function() {
      $state.go('process-manager');
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
      $scope.tracingCtx.currentTraceSequenceId = '';
      $scope.tracingCtx.currentProcess = process;
      if ($scope.tracingCtx.currentProcess) {
        $scope.refreshTimelineProcess();
      }
    };


    /*
    *
    * Tracing On/Off
    *
    * */
    $scope.turnTracingOn = function() {
      $scope.tracingCtx.currentPMInstance.processes = [];
      $scope.processes = [];
      $scope.tracingCtx.currentTimeline = [];
      $scope.tracingProcessCycleActive = true;
      $scope.tracingOnOffCycleMessage = 'starting';
      $scope.tracingCtx.currentPMInstance.tracingStart(function(err, response) {
        if (err) {
          $log.warn('bad start tracing: ' + err);
          return;
        }
        $scope.main();
      });
    };
    $scope.turnTracingOff = function() {

      if ($scope.tracingCtx.currentPMInstance.tracingEnabled) {
        $scope.pidCycleCheckCollection = [];
        $scope.processes.map(function(process) {
          $scope.pidCycleCheckCollection.push(process.workerId);
        });
        $scope.tracingCtx.currentPMInstance.processes = [];
        $scope.processes = [];
        $scope.tracingCtx.currentTimeline = [];
        $scope.tracingProcessCycleActive = true;
        $scope.tracingOnOffCycleMessage = 'stopping';
        $scope.tracingCtx.currentPMInstance.tracingStop(function(err, response) {
          if (err) {
            $log.warn('bad stop tracing: ' + err);
            return;
          }

          // give it time to stop the processes
          $timeout(function() {
            $scope.main();
            $scope.tracingProcessCycleActive = false;
          }, 20);
        });
        $scope.resetTracingCtx();
      }

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
      $scope.tracingCtx.currentTraceSequenceId = '';

    };

    function getPFKeyIndex(key) {
      return $scope.tracingCtx.currentTimelineKeyCollection.indexOf(key) || 0;
    }
    function setPrevNextDisabled(key) {
      var currIndex = getPFKeyIndex(key);
      var isLastRecord = false;
      var isFirstRecord = false;
      var isMoreThanOne = false;

      if ($scope.tracingCtx.currentTimelineKeyCollection.length > 1) {
        isMoreThanOne = true;
      }
      if (currIndex === 0) {
        isFirstRecord = true;
      }
      // last record
      if (currIndex === ($scope.tracingCtx.currentTimelineKeyCollection.length - 1)) {
        isLastRecord = true;
      }

      $timeout(function() {
        $scope.isFirstPFKey = isFirstRecord;
        $scope.isLastPFKey = isLastRecord;
      });
    }
    /*
     * PREV KEY
     * */
    $scope.prevPFKey = function() {
      if ($scope.tracingCtx.currentTimelineKeyCollection) {
        var currIndex = getPFKeyIndex($scope.tracingCtx.currentPFKey);
        if (currIndex !== 0) {
          // we are good to change
          currIndex--;
          setPrevNextDisabled($scope.tracingCtx.currentPFKey);
          $scope.tracingCtx.currentPFKey = $scope.tracingCtx.currentTimelineKeyCollection[currIndex];
          $scope.tracingCtx.currentWaterfallKey = '';
        }

      }
    };
    /*
     * NEXT KEY
     * */
    $scope.nextPFKey = function() {
      if ($scope.tracingCtx.currentTimelineKeyCollection) {
        var currIndex = getPFKeyIndex($scope.tracingCtx.currentPFKey);
        if (currIndex < ($scope.tracingCtx.currentTimelineKeyCollection.length - 1)) {
          // we are good to change
          currIndex++;
          setPrevNextDisabled($scope.tracingCtx.currentPFKey);
          $scope.tracingCtx.currentPFKey = $scope.tracingCtx.currentTimelineKeyCollection[currIndex];
          $scope.tracingCtx.currentWaterfallKey = '';
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
      $scope.tracingCtx.currentTraceSequenceId = '';
      $scope.startTicker();

    };
    /*
     *
     * BACK TO TRACE
     *
     * */
    $scope.backToTrace = function() {
      $scope.tracingCtx.currentWaterfallKey = '';
      $scope.tracingCtx.currentTraceSequenceId = '';
      $scope.tracingCtx.currentTraceSequenceId = '';
      $scope.stopTimer();
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
      $scope.tracingCtx.currentTraceSequenceId = '';
      $scope.stopTimer();
    };



    /*
    * TIMESTAMP FORMAT
    * */
    $scope.tsText = function(ts){
      return moment(ts).fromNow() +' (' + moment(ts).format('ddd, MMM Do YYYY, h:mm:ss a') + ')'
    };




    // Watches   $watch
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
        setPrevNextDisabled(newKey);
        $scope.isShowTraceSequenceLoader = true;
        $scope.tracingCtx.currentTrace = {};
        $scope.tracingCtx.currentTraceSequenceId = '';
        $timeout(function() {
          $scope.tracingCtx.currentProcess.getTrace(newKey, function(err, trace) {
            if (err) {
              $log.warn('bad get trace: ' + err.message);
              return {};
            }
            $timeout(function() {
              var obj = JSON.parse(trace);
              var TE = TraceEnhance(obj);
              $scope.tracingCtx.currentTrace = TE;
              $scope.stopTimer();
              // too expensive to compare the trace
              $scope.$apply(function () {
                $scope.tracingCtx.currentTraceToggleBool = !$scope.tracingCtx.currentTraceToggleBool;
              });
            }, 20);
          });

        }, 100);
      }
      else {

        $scope.startTicker();

      }
    }, true);

    $scope.$watch('processes', function(newProcesses, oldProcesses) {
      $scope.updateProcesses(newProcesses);
    });
    $scope.updateProcesses = function(newProcesses) {
      $scope.processes = newProcesses;
    };
    $scope.$watch('tracingOnOff', function(newVal, oldVal) {
      if ($scope.tracingCtx.currentPMInstance.tracingStop) {
        // on switch activated
        if (newVal[1].isActive) {
          if (!$scope.tracingCtx.currentPMInstance.tracingEnabled) {
            $scope.turnTracingOn();
          }
        }
        else {
          $scope.turnTracingOff();
        }
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

