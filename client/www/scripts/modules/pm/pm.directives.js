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
PM.directive('slPmHostForm', [
  'PMHostService',
  'PMPidService',
  function(PMHostService, PMPidService) {
    return {
      templateUrl: './scripts/modules/pm/templates/pm.host.form.html',
      controller: [
        '$scope',
        '$log',
        '$timeout',
        'PMAppService',
        function($scope, $log, $timeout, PMAppService) {

          var isLocal = false;

          $scope.currentServerConfig = {
            host: '',
            port: 0
          };
          $scope.pmServers = PMHostService.getPMServers();
          $scope.candidateServerConfig = {};
          // set value to last referenced server if available
          if (PMHostService.getPMServers().length) {
            $scope.candidateServerConfig = PMHostService.getLastPMServer();
          }
          $scope.selected = undefined;
          $scope.activeProcess = null;
          $scope.showMoreMenu = false;
          $scope.isRemoteValid = false;
          $scope.isOpen = false;

          $scope.showPortInput = function() {
            return !isLocal;
          };

          $scope.pmHostFocus = function() {
            console.log('| ');
            console.log('| pmHostFocus ');
            console.log('| ');
            isLocal = false;

          };


          $scope.processes = [];

          $scope.onPMServerSelect = function(item) {
            console.log('| ');
            console.log('| onPMServerSelect: ' + JSON.stringify(item));
            console.log('| ');
            if (item.host === PM_CONST.LOCAL_PM_HOST_NAME) {
              isLocal = true;
            }
            else {
              isLocal = false;
            }
            $scope.candidateServerConfig = item;
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
                  $scope.initServerProcesses(serverConfig, id);
                }
               });
          }

          $scope.isShowPidDisplaySpinner = function() {
            if ($scope.processes && $scope.processes.length > 0) {
              return false;
            }
            return true;

          };

          $scope.submitPMHostForm = function(form) {
            if ( form.$valid ) {
              $scope.loadProcesses();
            }
          };

          $scope.pmHostBlur = function(event) {
            console.log('| ');
            console.log('| pmHostBlur: ' + event.currentTarget.value);
            console.log('| ');
            if (event.currentTarget.value === PM_CONST.LOCAL_PM_HOST_NAME) {
              isLocal = true;
            }

              // $log.debug('Blur host value :' + event.currentTarget.value);
          };

          $scope.loadProcesses = function(){

              $scope.processes = [];


              if ($scope.candidateServerConfig.host === PM_CONST.LOCAL_PM_HOST_NAME) {
                $scope.currentServerConfig = $scope.candidateServerConfig;
                // disable port view
                isLocal = true;

                // check if server is running or not
                PMAppService.isLocalAppRunning()
                  .then(function(response) {
                    if (response.started === false) {
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
                if ($scope.candidateServerConfig.host && Number.isInteger($scope.candidateServerConfig.port) && ($scope.candidateServerConfig.port > 1)) {

                  $scope.currentServerConfig = $scope.candidateServerConfig;
                  isLocal = false;
                  $scope.initServerProcesses($scope.currentServerConfig, 1);
                }
                else {
                  $log.warn('invalid server host config form loadProcess request: ' + JSON.stringify($scope.candidateServerConfig));
                }


              }


          };
          $scope.initServerProcesses = function(serverConfig, ServiceId) {
            PMPidService.getDefaultPidData(serverConfig, ServiceId)
              .then(function(pidCollection) {
                console.log('| ');
                console.log('| getDefaultPidData: ' + JSON.stringify(pidCollection));
                console.log('| ');
                PMHostService.addPMServer(serverConfig);
                $scope.processes = pidCollection;
                $scope.pmServers = PMHostService.getPMServers();

                //activate first process
                if ( $scope.processes.length ) {
                  $scope.setActiveProcess($scope.processes[0], false)
                }
              });
          };

          //clear out active processes and remote state when going back to file
          $scope.resetRemoteState = function(){
            $scope.isRemoteValid = false;
            $scope.processes = [];
            $scope.activeProcess = null;

          };




          $scope.$watch('form.$valid', function(newVal, oldVal) {
            if ( newVal !== oldVal && !newVal ) {
              $scope.resetRemoteState();
            }
          });

          $scope.setActiveProcess = function(process, isMoreClick){
            if ( $scope.activeProcess && $scope.activeProcess.status !== 'Running' ) return false;

            $scope.activeProcess = process;
            $scope.isProcessFromMore = isMoreClick;
            $log.debug('active process', process);
            $scope.isRemoteValid = true;


          };

          $scope.loadProcesses();
        }]
    }
  }
]);
PM.directive('slPmProcesses', [
  function(){
    return {
      templateUrl: './scripts/modules/pm/templates/pm.processes.html',
      controller: function() {

      }
    }
  }

]);
PM.directive('slPmPidSelector', [
  '$log',
  function($log){
    return {
      restrict: 'E',
      replace: true,
      templateUrl: './scripts/modules/pm/templates/pm.pid.selector.html'
    }
  }]);
