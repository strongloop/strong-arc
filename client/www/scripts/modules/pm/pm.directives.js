PM.directive('slPmHostForm', [
  'PMHostService',
  'PMPidService',
  '$state',
  function(PMHostService, PMPidService, $state) {
    return {
      scope: {
        onLoadHost: '&',
        onUpdateProcesses: '&',
        onUpdateSelection: '&'
      },
      templateUrl: './scripts/modules/pm/templates/pm.host.form.html',
      controller: [
        '$scope',
        '$log',
        '$q',
        'growl',
        '$timeout',
        'PMServerService',
        'ManagerServices',
        '$timeout',
        function($scope, $log, $q, growl, $timeout, PMServerService, ManagerServices, $timeout) {

          var isLocal = false;

          $scope.selectedPMHost = {};
          $scope.currentInstanceId = 1;

          $scope.candidateServerConfig = {};

          $scope.managerHosts = ManagerServices.getManagerHosts(function(hosts) {
            $scope.$apply(function () {
              $scope.managerHosts = hosts;
              if ($scope.managerHosts.length) {
                $scope.candidateServerConfig = $scope.managerHosts[0];
                $scope.selectedPMHost = $scope.candidateServerConfig;
              }
            });
          });


          $scope.goToAddPM = function() {
            $state.go('process-manager');
          };
          $scope.changePMHost = function(host) {
            $scope.candidateServerConfig = host;
            $scope.selectedPMHost = host;
            $scope.onUpdateProcesses({
              processes: []
            });
          };

          $scope.selected = undefined;
          $scope.activeProcess = null;
          $scope.showMoreMenu = false;
          $scope.isRemoteValid = false;
          $scope.isOpen = false;

          $scope.showPortInput = function() {
            return !isLocal;
          };

          $scope.pmHostFocus = function() {
            isLocal = false;
          };

          $scope.processes = [];

          $scope.onPMServerSelect = function(item) {

              isLocal = false;


            //fixes infinite host property being referenced
            $scope.candidateServerConfig.host = item.host;
            $scope.candidateServerConfig.port = item.port;
            $scope.processes = [];
          };

          $scope.hideMenu = function(){
            $scope.isOpen = false;
          };

          $scope.submitPMHostForm = function(form) {
            if ( form.$valid ) {
              $scope.loadProcesses();
            }
          };

          $scope.pmHostBlur = function(event) {

          };

          $scope.loadProcesses = function(form){
            if ( $scope.hasClickLoad ) {
              if ( form.$valid ) {
                return $scope.onClickLoad({ form: form });
              }
            }

            $scope.isLoading = true;


            // make sure the values are at least valid
            if ($scope.candidateServerConfig.host && Number.isInteger(JSON.parse($scope.candidateServerConfig.port)) && (JSON.parse($scope.candidateServerConfig.port) > 1)) {

              $scope.currentServerConfig = $scope.candidateServerConfig;
              isLocal = false;
              $scope.initServerProcesses($scope.currentServerConfig, $scope.currentInstanceId);
            }
            else {
              $log.warn('invalid server host config form loadProcess request: ' + JSON.stringify($scope.candidateServerConfig));
            }

            $scope.onLoadHost({host: $scope.currentServerConfig});
          };

          $scope.setProcesses = function(pids, refresh) {
            $scope.processes = pids.filter(function(process) {
              return process.serviceInstanceId === 1 && process.workerId > 0;
            });

            $scope.onUpdateProcesses({
              processes: $scope.processes,
              refresh: refresh
            });

            $scope.isRemoteValid = $scope.processes.length > 0;
            return $scope.processes;
          };

          $scope.initServerProcesses = function(serverConfig, ServiceId) {
            growl.addInfoMessage('retrieving server processes', {ttl:2000});
            $scope.activeProcess = null;

            $scope.selectedPMHost = ManagerServices.processHostStatus(serverConfig);

            // make sure selected host is working
            return PMHostService.getFirstPMInstance($scope.selectedPMHost, function(err, instance) {
              if(err) {
                $log.warn('bad get first pm instance: ' + JSON.stringify(err));
                $log.warn('invalid PM server values');
                growl.addWarnMessage('invalid PM server values');
                return;
              }
              if (instance && !$scope.selectedPMHost.status.isProblem) {
                var refresh = function() {
                  var deferred = $q.defer();
                  instance.processes(function(err, rawProcesses) {

                    if (err) {
                      $log.warn('bad get processes: ' + err.message);
                      return [];
                    }
                    var returnProcesses = [];
                    //filter out dead pids and supervisor
                    returnProcesses = rawProcesses.filter(function(process){
                      return (!process.stopTime && (process.workerId !== 0));
                    });

                    for (var i = 0;i < returnProcesses.length;i++) {
                      returnProcesses[i].status = 'Running';
                    }

                    deferred.resolve(returnProcesses);
                  });
                  return deferred.promise;
                };

                refresh().then(function(processes) {
                  $scope.setProcesses(processes, refresh);

                  //activate first process
                  if (processes.length > 0) {
                    $scope.setActiveProcess(processes[0], false);
                  }
                });
              }
              else {
                $log.warn('invalid PM server values');
                growl.addWarnMessage('invalid PM server values');
              }
              $scope.isLoading = false;
            });



          };
          $scope.setActiveProcess = function(process, isMoreClick){
            if ( $scope.activeProcess && $scope.activeProcess.status !== 'Running' ) return false;

            $scope.activeProcess = process;
            $scope.isProcessFromMore = isMoreClick;
            $scope.isRemoteValid = true;
          };
        }],
      link: function(scope, el, attrs) {
        scope.$watch('selectedPMHost', function(newHost) {
          if (newHost.host) {

            if (newHost.host !== scope.candidateServerConfig.host || newHost.port !== scope.candidateServerConfig.port) {
              scope.candidateServerConfig = newHost;
            }
            scope.onLoadHost({host:newHost});
            scope.initServerProcesses(newHost, scope.currentInstanceId);
          }
        }, true);
      }
    }
  }
]);

PM.directive('slPmProcesses', [
  function(){
    return {
      templateUrl: './scripts/modules/pm/templates/pm.processes.html',
      scope: {
        processes: '=',
        multiple: '=',
        showSupervisor: '=',
        onUpdateSelection: '&'
      },
      controller: function($scope) {
        $scope.selectCount = 0;

        function updateSelection() {
          $scope.onUpdateSelection({
            selection: $scope.processes.filter(function(process) {
              return process.isActive;
            })
          });
        }

        var selectProcess = function(process) {
          if (!$scope.multiple) {
            $scope.deselectAll();
          }

          if (!process.isActive) {
            process.isActive = true;
            $scope.selectCount++;
          }
        };

        var deselectProcess = function(process) {
          if (process.isActive) {
            process.isActive = false;
            $scope.selectCount--;
          }
        };

        $scope.processHidden = function(process) {
          return process.workerId > 0 || $scope.showSupervisor;
        };

        $scope.selectAll = function() {
          $scope.processes.forEach(selectProcess);
          updateSelection();
        };

        $scope.deselectAll = function() {
          $scope.processes.forEach(deselectProcess);
          updateSelection();
        };

        $scope.isActive = function(process) {
          return process.isActive;
        };

        $scope.toggleSelect = function(process) {
          if (!$scope.isActive(process)) {
            selectProcess(process);
          } else {
            deselectProcess(process);
          }

          updateSelection();
        };
      }
    };
  }

]);
PM.directive('slPmPidSelector', [
  '$log',
  function($log){
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: './scripts/modules/pm/templates/pm.pid.selector.html',
      scope: {
        onUpdateHost: '&',
        onUpdateProcesses: '&',
        onUpdateSelection: '&',
        externalProcesses: '=',
        showPidSelector: '=',
        multiple: '='
      },
      controller: function($scope) {
        $scope.processes = [];
        $scope.isExternalProcesses = false;
        $scope._showPidSelector = true;

        $scope.$watch('showPidSelector', function(newVal) {
          if (angular.isDefined(newVal)) {
            $scope._showPidSelector = !!newVal;
          }
        });

        $scope.updateProcesses = function(processes, refresh) {
          if ($scope.isExternalProcesses){
            return;
          }
          $scope.processes = processes;

          $scope.onUpdateProcesses({
            processes: processes,
            refresh: refresh
          });
        };
        // in case a component (tracing) needs to supply an external set of processes
        // based on some additional filtering
        $scope.$watch('externalProcesses', function(newVal) {
          if (newVal !== undefined) {
            $scope.isExternalProcesses = true;
            $scope.processes = newVal;
          }
        }, true);
        $scope.updateHost = function(host) {
          $scope.onUpdateHost({
            host: host
          });
        };

        $scope.updateSelection = function(selection) {
          $scope.onUpdateSelection({
            selection: selection
          });
        };
      }
    }
  }]);
