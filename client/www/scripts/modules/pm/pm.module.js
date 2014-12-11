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
  LOCAL_PM_HOST_NAME: 'arc.local.pm',
  LOCAL_PM_PORT_MASK: 9999
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
PM.run([
  'PMHostService',
  '$log',
  function (PMHostService, $log) {

    var defaultLocalPMHostConfig = {
      host: PM_CONST.LOCAL_PM_HOST_NAME,
      port: PM_CONST.LOCAL_PM_PORT_MASK
    };
    $log.debug('add local Arc PM host reference: ' + JSON.stringify(defaultLocalPMHostConfig));
    return PMHostService.addPMServer(defaultLocalPMHostConfig)

  }
]);
