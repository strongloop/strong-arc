
var Manager = angular.module('Manager', []);
var MANAGER_CONST = {
  DELETE_ACTION: 'delete',
  EDIT_ACTION: 'edit',
  START_ACTION: 'start',
  STOP_ACTION: 'stop',
  RESTART_ACTION: 'restart',
  CLUSTER_RESTART_ACTION: 'cluster-restart',
  LICENSE_PUSH_ACTION: 'license-push',
  ENV_SET_ACTION: 'env-set',
  ENV_GET_ACTION: 'env-get'
};
Manager.value('MANAGER_CONST', MANAGER_CONST);

Manager.run(function() {
 // $scope.meshInstance = require('strong-mesh-client')('http://' + $location.host() + ':' + $location.port() + '/manager');
});
