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
        'growl',
        '$timeout',
        'PMAppService',
        'PMServerService',
        function($scope, $log, growl, $timeout, PMAppService, PMServerService) {

          var isLocal = false;
          var isInit = true;
          $scope.isLoading = false;
          $scope.currentServerConfig = {
            host: PM_CONST.LOCAL_PM_HOST_NAME,
            port: PM_CONST.LOCAL_PM_PORT_MASK
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
            isLocal = false;
          };


          $scope.processes = [];

          $scope.onPMServerSelect = function(item) {
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

          $scope.loadProcesses = function(){
            $scope.isLoading = true;
            $scope.processes = [];

            if ($scope.candidateServerConfig.host === PM_CONST.LOCAL_PM_HOST_NAME) {
              $scope.currentServerConfig = $scope.candidateServerConfig;
              PMHostService.addPMServer($scope.currentServerConfig);
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
          };
          $scope.initServerProcesses = function(serverConfig, ServiceId) {
            growl.addInfoMessage('retrieving server processes', {ttl:2000});
            $scope.activeProcess = null;
            $scope.processes = [];


            return PMServerService.find(serverConfig, {id:1})
              .then(function(response) {
                if (response.status === 200) {
                  PMPidService.getDefaultPidData(serverConfig, ServiceId)
                    .then(function(pidCollection) {

                      PMHostService.addPMServer(serverConfig, false);
                      $scope.processes = pidCollection;
                      $scope.pmServers = PMHostService.getPMServers();
                      //activate first process
                      if ( $scope.processes.length ) {

                        $scope.setActiveProcess($scope.processes[0], false)
                      }
                    });
                }
                else {
                  $log.warn('invalid PM server values');
                  growl.addWarnMessage('invalid PM server values')
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
