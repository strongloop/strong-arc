var PM = angular.module('PM', []);
PM.run(['$rootScope', '$log', 'PackageDefinition', function ($rootScope, $log, PackageDefinition) {
  var pkg = PackageDefinition.findOne();
  return pkg.$promise
    .then(function () {
      $rootScope.projectName = pkg.name;
    })
    .catch(function (err) {
      $log.warn('Cannot get project\'s package definition.', err);
    });
}]);
