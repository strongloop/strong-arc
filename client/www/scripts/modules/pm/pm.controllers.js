// Copyright StrongLoop 2014
PM.controller('PMAppController', [
  '$scope',
  '$log',
  '$timeout',
  '$interval',
  'PMAppService',
  function($scope, $log, $timeout, $interval, PMAppService) {

    // app module constants
    var PMCONST = {
      STOPPED_STATE: 'stopped',
      STARTING_STATE: 'starting',
      RUNNING_STATE: 'running',
      RETRIEVING_PORT_STATE: 'retrieving-port',
      RESTARTING_STATE: 'restarting',
      STOPPING_STATE: 'stopping',
      UNKNOWN_STATE: 'unknown'
    };



   /*
    * Check Local App Status
    *
    * - recursive call to check if local app is running
    * - if app is running call second api to get url
    *
    * */
    function checkLocalAppStatus() {
      PMAppService.isLocalAppRunning()
        .then(function(response) {
          if (response.started === true) {
            $scope.getLocalAppLink();  // spawn process to obtain url when it's ready
            if($scope.pm.localAppState !== PMCONST.RUNNING_STATE) {
              $scope.pm.localAppState = PMCONST.RETRIEVING_PORT_STATE;
            }
          }
        })
        .catch(function(error) {
          $log.warn('bad polling for is app running');
        });
      $timeout(function(){
        checkLocalAppStatus();
      }, PMAppService.getAppStatePollInterval());
    }



    /*
    *
    * Button Event Controls
    *
    * */
    $scope.startApp = function() {
      $scope.pm.localAppState = PMCONST.STARTING_STATE;
      return PMAppService.startLocalApp()
        .then(function(response) {
          return response;
        });
    };
    $scope.reStartApp = function() {
      $scope.pm.isLocalAppRunning = false;
      $scope.pm.localAppState = PMCONST.RESTARTING_STATE;
      $scope.pm.localAppLink = '';
      return PMAppService.restartLocalApp()
        .then(function(response) {
          return response;
        });
    };
    $scope.stopApp = function() {
      $scope.pm.isLocalAppRunning = false;
      $scope.pm.localAppState = PMCONST.STOPPING_STATE;
      $scope.pm.localAppLink = '';
      PMAppService.stopLocalApp()
        .then(function(response) {
          $scope.pm.localAppLink = '';
          $scope.pm.localAppState = PMCONST.STOPPED_STATE;
        })
        .catch(function(error) {
          $scope.pm.localAppState = PMCONST.STOPPED_STATE;
        });
    };

    /*
    *
    * Get local App link
    *
    * async process kicked off each tick as the app started
    * and port availability are 2 separate calls
    *
    * after the app has 'started' we wait until we get a url before
    * the app has fully come up
    *
    * */
    $scope.getLocalAppLink = function() {
      PMAppService.getLocalAppUrl()
        .then(function(response) {
          if (response){
            $scope.pm.localAppLink = response;
            $scope.pm.localAppState = PMCONST.RUNNING_STATE;
            $scope.pm.isLocalAppRunning = true;  // only used by header icon to show dif color
          }
        });
    };

    /*
    *
    *   UI Button State Stuff
    *
    * */
    $scope.isShowStartButton = function() {
      if (($scope.pm.localAppState === PMCONST.STOPPED_STATE) ||
          ($scope.pm.localAppState === PMCONST.STARTING_STATE) ||
          ($scope.pm.localAppState === PMCONST.UNKNOWN_STATE)) {
        return true;
      }
      return false;
    };
    $scope.isShowRestartButton = function() {
      if (($scope.pm.localAppState === PMCONST.RUNNING_STATE) ||
        ($scope.pm.localAppState === PMCONST.RETRIEVING_PORT_STATE) ||
        ($scope.pm.localAppState === PMCONST.STOPPING_STATE) ||
        ($scope.pm.localAppState === PMCONST.RESTARTING_STATE)) {
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

    $scope.pmAppControlInit = function() {
      $log.info('pmAppControlInit');

       // PM App Control variables
      $scope.pm = {
        localAppState: PMCONST.STOPPED_STATE,
        isLocalAppRunning: false,
        localAppLink: '',
        isLocalApp: true
      };

      // - is is a local app?
      PMAppService.isLocalApp()
        .then(function(isLocal) {
          if (!isLocal) {  // no local app to run
            $scope.pm.isLocalApp = false;
            return;
          }
          // start the polling engine
          checkLocalAppStatus();
        });

    };

    $scope.pmAppControlInit();
  }
]);
