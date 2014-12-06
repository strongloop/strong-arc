// Copyright StrongLoop 2014
PM.controller('PMAppController', [
  '$scope',
  '$log',
  '$timeout',
  '$interval',
  'PMAppService',
  function($scope, $log, $timeout, $interval, PMAppService) {

    var PMCONST = {
      STOPPED_STATE: 'stopped',
      STARTING_STATE: 'starting',
      RUNNING_STATE: 'running',
      RESTARTING_STATE: 'restarting',
      STOPPING_STATE: 'stopping',
      UNKNOWN_STATE: 'unknown'
    };
    /*
     *
     * PM App Control variables
     *
     * */
    $scope.pm = {};
    $scope.pm.localAppState = PMCONST.STOPPED_STATE; // set initial app running state
    $scope.pm.localAppLink = '';  // will poppoulate when necessary
    $scope.pm.isLocalApp = true;
   // $scope.pm.isLocalApp = PMAppService.isLocalApp();  // do we need this
    $scope.pm.isLocalAppRunning = false;  // TODO


   /**
    *
    * Check Local App Status
    *
    * ??
    * */
    function checkLocalAppStatus() {

      $log.debug('localAppState[' + $scope.pm.localAppState + ']');

     /*
     *
     * The tick
     *
     * - check if local app
     * - check if local app is ServiceInstance started
     * - check if we get a port from ServiceProcesses
     *
     * - set current state properties
     * -- should be in services
     * */
      PMAppService.isLocalAppRunning()
        .then(function(response) {
          if (response.started === true) {
            $scope.pm.isLocalAppRunning = true;
            $scope.getLocalAppLink();
            $scope.pm.localAppState = PMCONST.RUNNING_STATE;
          }
          else {
            $scope.pm.isLocalAppRunning = false;
            $scope.pm.localAppLink = '';
          }
        })
        .catch(function(error) {
          $log.warn('bad polling for is app running');
        });
    }



    /*
    *
    * Actions [buttons]
    *
    * */
    // Start the app button event
    $scope.startApp = function() {
      $scope.pm.localAppState = PMCONST.STARTING_STATE;

      return PMAppService.startLocalApp()
        .then(function(response) {
          return response;
        });
    };
    $scope.reStartApp = function() {
      $scope.pm.localAppState = PMCONST.RESTARTING_STATE;

      PMAppService.restartLocalApp()
        .then(function(response) {
          $timeout(function() {
            $scope.getLocalAppLink();
          }, 5000);
        });
    };
    $scope.stopApp = function() {
      $scope.pm.localAppState = PMCONST.STOPPING_STATE;

      PMAppService.stopLocalApp()
        .then(function(response) {
          $scope.pm.localAppState = PMCONST.STOPPED_STATE;
          $scope.pm.localAppLink = '';
          $scope.pm.isLocalAppRunning = false;

        })
        .catch(function(error) {
          $scope.pm.localAppState = PMCONST.STOPPED_STATE;
        });

    };





    // Get local App link
    $scope.getLocalAppLink = function() {
      PMAppService.getLocalAppUrl()
        .then(function(response) {
          if (response){
            $scope.pm.localAppLink = response;
            $scope.pm.isLocalAppRunning = true;
            $scope.pm.localAppState = PMCONST.RUNNING_STATE;
          }
          else {
            $scope.pm.localAppLink = '';
          }
        });
    };
    // is app running
    $scope.isAppRunning = function() {
      PMAppService.isLocalAppRunning()
        .then(function(response) {
          if (response.started === false) {
            $scope.pm.localAppLink = '';
            $log.warn('App is not running');
          }
          else {
            $scope.pm.localAppLink = $scope.getLocalAppLink();
          }
        });
    };









    /*
    *
    *   UI BUTTON CONFIG STUFF
    *
    * */
    $scope.isShowStartButton = function() {
      if (($scope.pm.localAppState === PMCONST.RUNNING_STATE) ||
        ($scope.pm.localAppState === PMCONST.RESTARTING_STATE)||
        ($scope.pm.localAppState === PMCONST.STOPPING_STATE)) {
        return false;
      }
      return true;
    };
    $scope.isShowRestartButton = function() {
      if (($scope.pm.localAppState === PMCONST.RUNNING_STATE) || ($scope.pm.localAppState === PMCONST.RESTARTING_STATE)) {
        return true;
      }
      return false;
    };
    $scope.isShowAppLink = function() {
      if ($scope.pm.localAppLink) {
        return true;
      }
    };
    $scope.isShowAppControlSpinner = function() {
      if ($scope.pm.localAppLink) {
        return false;
      }
      if ($scope.pm.localAppState === PMCONST.STOPPED_STATE){
        return false;
      }
      return true;
    };
    $scope.isButtonDisabled = function(buttonName) {

      var well = false;
      switch(buttonName) {

        case 'stop':
          if (($scope.pm.localAppState === PMCONST.STOPPED_STATE) ||
            ($scope.pm.localAppState === PMCONST.STOPPING_STATE)){
            well = true;
          }
          break;

        case 'start':
          if ($scope.pm.localAppState !== PMCONST.STOPPED_STATE){
            well = true;
          }
          break;

        case 'restart':
          if (($scope.pm.localAppState !== PMCONST.RUNNING_STATE)){
            well = true;
          }
          if (!$scope.pm.localAppLink) {
            well = true;
          }
          break;

        default:

      }
      return well;
    };

















    /*
    *
    * Engine Controls
    *
    * */
    $scope.pmAppControlInit = function() {
      $log.debug('pmAppControlInit');
      // get the state in order
      // kick the backend once to find out:
      // - is is a local app?
      // - is the app running?
      // start the polling engine
      $scope.startLocalAppPolling();
    };
    // kickoff
    $scope.startLocalAppPolling = function() {
      // TODO check this logic around isLocalAppRunning
      if ($scope.pm.isLocalApp && !$scope.pm.isLocalAppRunning) {
        checkLocalAppStatus();
        $interval(function() {
          $log.debug('- tick -')
          checkLocalAppStatus();
        }, PMAppService.getAppStatePollInterval());
      }
    };



    $scope.pmAppControlInit();
  }
]);
