Gateway.service('GatewayServices', [
  '$log',
  'Policy',
  'GatewayMap',
  'Pipeline',
  function($log, Policy, GatewayMap, Pipeline) {
    var svc = this;



    ///*
    //*
    //* PolicyScope
    //*
    //* */
    //svc.deletePolicyScope = function(policyScopeId) {
    //  return PolicyScope.deleteById({id:policyScopeId})
    //    .$promise
    //    .then(function(response) {
    //      return response;
    //    })
    //    .catch(function(error) {
    //      $log.warn('bad delete PolicyScope' + JSON.stringify(error));
    //    });
    //};
    //
    //svc.getPolicyScopes = function() {
    //  return GatewayMap.getAuthScopes()
    //    .$promise
    //    .then(function(response) {
    //      return response;
    //    })
    //    .catch(function(error) {
    //      $log.warn('bad get all PolicyScopes: ' + JSON.stringify(error));
    //    })
    //};

    /*
    *
    * Policy
    *
    * */
    svc.deletePolicy = function(policyId) {
      return Policy.deleteById({id:policyId})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad delete Policy' + JSON.stringify(error));
        });
    };
    svc.savePolicy = function(policy) {
      if (policy) {
        // update
        if (policy.id) {
          delete policy._id;
          return Policy.upsert(policy,
            function(response){
              console.log('updated Policy');
              return response;
            },
            function(error){
              console.log('error adding Policy: ' + JSON.stringify(error));

            }
          );
        }
        // create
        else {
          return Policy.create( policy,
            function(response){
              console.log('added Policy');
              return response;
            },
            function(error){
              console.log('error adding Policy: ' + JSON.stringify(error));
            }
          );
        }
      }
    };
    svc.getPolicies = function() {
      return Policy.find({})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad get all Policies: ' + JSON.stringify(error));
        });
    };
    svc.getPolicyById = function(id) {
      return Policy.findById({id:id})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad get  Policy: ' + JSON.stringify(error));
        });
    };



    svc.deletePipeline = function(pipelineId) {
      return Pipeline.deleteById({id:pipelineId})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad delete Pipeline' + JSON.stringify(error));
        });
    };
    svc.savePipeline = function(pipeline) {
      if (pipeline) {
        // update
        if (pipeline.id) {
          delete pipeline._id;
          return Pipeline.upsert(pipeline,
            function(response){
              console.log('updated Pipeline');
              return response;
            },
            function(error){
              console.log('error adding Pipeline: ' + JSON.stringify(error));

            }
          );
        }
        // create
        else {
          return Pipeline.create( pipeline,
            function(response){
              console.log('added Pipeline');
              return response;
            },
            function(error){
              console.log('error adding Pipeline: ' + JSON.stringify(error));
            }
          );
        }
      }
    };
    svc.getPipelines = function() {
      return Pipeline.find({})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad get all Pipelines: ' + JSON.stringify(error));
        })
    };
    svc.getPipelineById = function(id) {
      return Pipeline.findById({id:id})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad get Pipeline: ' + JSON.stringify(error));
        })
    };
    /*
    *
    * GATEWAY MAPS
    *
    * */
    svc.deleteGatewayMap = function(gatewayMapId) {
      return GatewayMap.deleteById({id:gatewayMapId})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad delete GatewayMap' + JSON.stringify(error));
        });
    };
    svc.saveGatewayMap = function(gatewayMap) {
      if (gatewayMap) {
        if (gatewayMap.pipelineId && gatewayMap.pipelineId.id) {
          gatewayMap.pipelineId = gatewayMap.pipelineId.id;
        }
        // update
        if (gatewayMap.id) {
          delete gatewayMap._id;
          return GatewayMap.upsert(gatewayMap,
            function(response){
              console.log('updated GatewayMap');
              return response;
            },
            function(error){
              console.log('error adding GatewayMap: ' + JSON.stringify(error));

            }
          );
        }
        // create
        else {
          return GatewayMap.create( gatewayMap,
            function(response){
              console.log('added GatewayMap');
              return response;
            },
            function(error){
              console.log('error adding GatewayMap: ' + JSON.stringify(error));
            }
          );
        }
      }
    };
    svc.getGatewayMaps = function() {
      return GatewayMap.find({})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad get all GatewayMaps: ' + JSON.stringify(error));
        })
    };
    svc.getGatewayMapById = function(id) {
      return GatewayMap.findById({id:id})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad get  GatewayMap: ' + JSON.stringify(error));
        })
    };

    svc.getGatewayEndpoints = function() {
      //  var swaggerUrl = 'http://localhost:4000/explorer/resources';
      var swaggerUrl = 'http://pool2015.herokuapp.com/explorer/resources';

    };
     return svc;
  }
]);
