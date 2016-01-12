var Gateway = angular.module('Gateway', []);
var GATEWAY_CONST = {
  MAPPING_TYPE: 'gatewaymap',
  PIPELINE_TYPE: 'pipeline',
  POLICY_TYPE: 'policy',
  POLICY_AUTH_TYPE: 'auth',
  POLICY_METRICS_TYPE_TYPE: 'metrics',
  POLICY_PROXY_TYPE: 'reverseProxy',
  POLICY_RATELIMIT_TYPE: 'rateLimiting',

};
Gateway.value('GATEWAY_CONST', GATEWAY_CONST);
