var Gateway = angular.module('Gateway', []);
var GATEWAY_CONST = {
  MAPPING_TYPE: 'gatewaymap',
  PIPELINE_TYPE: 'pipeline',
  POLICY_TYPE: 'policy',
  POLICY_AUTH_TYPE: 'auth',
  POLICY_METRICS_TYPE_TYPE: 'metrics',
  POLICY_PROXY_TYPE: 'reverseproxy',
  POLICY_RATELIMIT_TYPE: 'ratelimiting',

};
Gateway.value('GATEWAY_CONST', GATEWAY_CONST);
