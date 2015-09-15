var PM = angular.module('PM', []);
// app module constants
var PM_CONST = {
  STOPPED_STATE: 'stopped',
  STARTING_STATE: 'starting',
  RUNNING_STATE: 'running',
  RETRIEVING_PORT_STATE: 'retrieving port',
  RESTARTING_STATE: 'restarting',
  STOPPING_STATE: 'stopping',
  UNKNOWN_STATE: 'unknown',
  APP_POLL_INTERVAL: 8000,
  LOCAL_PM_HOST_NAME: 'local application',
  LOCAL_PM_PORT_MASK: '----',

};
PM.value('PM_CONST', PM_CONST);
PM.run([
  '$rootScope',
  '$log',
  'PackageDefinition',
  function ($rootScope, $log, PackageDefinition) {
    var pkg = PackageDefinition.findOne();
    return pkg.$promise
      .then(function () {
        $rootScope.projectName = pkg.name;
      })
      .catch(function (err) {
        $log.warn('Cannot get project\'s package definition.', err);
      });
  }
]);

