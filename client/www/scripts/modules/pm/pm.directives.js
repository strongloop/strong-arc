// Copyright StrongLoop 2014
PM.directive('slPmAppControls', [
  function() {
    return {
      templateUrl: './scripts/modules/pm/templates/pm.app.controls.html'
    }
  }
]);

PM.directive('slPmAppControllerMenu', [
  function() {
    return {
      templateUrl: './scripts/modules/pm/templates/pm.app.controller.menu.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
/*
*
* temporary copy/paste to separate from original due to
* scope conflicts
* - will be replaced with pm selector in the watchdog story
*
* */
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
        'growl',
        '$timeout',
        'PMAppService',
        'PMServerService',
        'ManagerServices',
        '$timeout',
        function($scope, $log, growl, $timeout, PMAppService, PMServerService, ManagerServices, $timeout) {

          var isLocal = false;
          var isInit = true;
          var serverConfig = {
            host: PM_CONST.LOCAL_PM_HOST_NAME,
            port: PM_CONST.LOCAL_PM_PORT_MASK
          };
          $scope.selectedPMHost = {};

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
            if (item.host === PM_CONST.LOCAL_PM_HOST_NAME) {
              isLocal = true;
            } else {
              isLocal = false;
            }

            //fixes infinite host property being referenced
            $scope.candidateServerConfig.host = item.host;
            $scope.candidateServerConfig.port = item.port;
            $scope.processes = [];
          };

          $scope.hideMenu = function(){
            $scope.isOpen = false;
          };

          // loop until app starts up
          function fireWhenReady(serverConfig, id) {
            PMAppService.isLocalAppRunning()
              .then(function(response) {
                if (response.started === false) {
                  $timeout(function(){
                    fireWhenReady(serverConfig, id);
                  }, 250);
                }
                else {
                  growl.addInfoMessage('local app has started');
                  $scope.initServerProcesses(serverConfig, id);
                }
              });
          }

          $scope.submitPMHostForm = function(form) {
            if ( form.$valid ) {
              $scope.loadProcesses();
            }
          };

          $scope.pmHostBlur = function(event) {
            if (event.currentTarget.value === PM_CONST.LOCAL_PM_HOST_NAME) {
              isLocal = true;
            }
          };

          $scope.loadProcesses = function(form){
            if ( $scope.hasClickLoad ) {
              if ( form.$valid ) {
                return $scope.onClickLoad({ form: form });
              }
            }

            $scope.isLoading = true;

            if ($scope.candidateServerConfig.host === PM_CONST.LOCAL_PM_HOST_NAME) {
              $scope.currentServerConfig = $scope.candidateServerConfig;
              //PMHostService.addPMServer($scope.currentServerConfig);
              // disable port view
              isLocal = true;

              // check if server is running or not
              PMAppService.isLocalAppRunning()
                .then(function(response) {
                  if (response.started === false) {
                    growl.addInfoMessage('starting local app ...', {ttl:1000});
                    PMAppService.startLocalApp()
                      .then(function(response) {
                        // check to make sure the app comes up
                        // then load processes
                        fireWhenReady($scope.currentServerConfig, 1);
                      })
                  }
                  else {
                    $scope.initServerProcesses($scope.currentServerConfig, 1);
                  }
                });
            }
            else {
              // make sure the values are at least valid
              if ($scope.candidateServerConfig.host && Number.isInteger(JSON.parse($scope.candidateServerConfig.port)) && (JSON.parse($scope.candidateServerConfig.port) > 1)) {

                $scope.currentServerConfig = $scope.candidateServerConfig;
                isLocal = false;
                $scope.initServerProcesses($scope.currentServerConfig, 1);
              }
              else {
                $log.warn('invalid server host config form loadProcess request: ' + JSON.stringify($scope.candidateServerConfig));
              }
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
              if (instance && !$scope.selectedPMHost.isHostProblem) {
                var refresh = function() {
                  return PMPidService.getDefaultPidData(serverConfig, ServiceId)
                    .then(function(pidCollection) {
                      return pidCollection.filter(function(process) {
                        return process.serviceInstanceId === 1;
                      });
                    });
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
        }]
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
        showPidSelector: '=',
        multiple: '='
      },
      controller: function($scope) {
        $scope.processes = [];
        $scope._showPidSelector = true;

        $scope.$watch('showPidSelector', function(newVal) {
          if (angular.isDefined(newVal)) {
            $scope._showPidSelector = !!newVal;
          }
        });

        $scope.updateProcesses = function(processes, refresh) {
          $scope.processes = processes;

          $scope.onUpdateProcesses({
            processes: processes,
            refresh: refresh
          });
        };

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
