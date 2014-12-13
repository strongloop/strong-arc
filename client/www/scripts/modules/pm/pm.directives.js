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
          $scope.isLocalPMSelected = false;


          $scope.processes = [];

          $scope.onPMServerSelect = function(item) {
            if (item.host === PM_CONST.LOCAL_PM_HOST_NAME) {
              $scope.isLocalPMSelected = true;
            }
            else {
              $scope.isLocalPMSelected = false;
            }
            $scope.candidateServerConfig = item;
          };
          $scope.hideMenu = function(){
            $scope.isOpen = false;
          };

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

          $scope.loadProcesses = function(){

              $scope.processes = [];
              $scope.currentServerConfig = $scope.candidateServerConfig;

              if ($scope.currentServerConfig.host === PM_CONST.LOCAL_PM_HOST_NAME) {
                // check if server is running or not
                PMAppService.isLocalAppRunning()
                  .then(function(response) {
                    if (response.started === false) {
                      PMAppService.startLocalApp()
                        .then(function(response) {
                          // check to make sure the app comes up
                          // probably need a poll
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
                $scope.initServerProcesses($scope.currentServerConfig, 1);

              }


          };
          $scope.initServerProcesses = function(serverConfig, ServiceId) {
            PMPidService.getDefaultPidData(serverConfig, ServiceId)
              .then(function(pidCollection) {
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
