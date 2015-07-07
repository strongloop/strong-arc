Gateway.service('GatewayServices', [
  '$log',
  'InternalEndpoint',
  'ExternalEndpoint',
  'PolicyScope',
  'Policy',
  'Phase',
  'GatewayMap',
  'Pipeline',
  '$http',
  '$q',
  function($log, InternalEndpoint, ExternalEndpoint, PolicyScope, Policy, Phase, GatewayMap, Pipeline, $http, $q) {
    var svc = this;



    /*
    *
    * InternalEndpoint
    *
    * */
    svc.deleteInternalEndpoint = function(internalEndpointId) {
      return InternalEndpoint.deleteById({id:internalEndpointId})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad delete InternalEndpoint' + JSON.stringify(error));
        });
    };
    svc.saveInternalEndpoint = function(internalEndpoint) {
      if (internalEndpoint.host && internalEndpoint.port) {
        if (!internalEndpoint.name) {
          internalEndpoint.name = 'lb-' + internalEndpoint.host + ':' + internalEndpoint.port;
        }
        // update
        if (internalEndpoint.id) {
          delete internalEndpoint._id;
          return InternalEndpoint.upsert(internalEndpoint,
            function(response){
              console.log('updated InternalEndpoint');
              return response;
            },
            function(error){
              console.log('error adding InternalEndpoint: ' + JSON.stringify(error));

            }
          );
        }
        // create
        else {
          return InternalEndpoint.create( internalEndpoint,
            function(response){
              console.log('added InternalEndpoint');
              return response;
            },
            function(error){
              console.log('error adding InternalEndpoint: ' + JSON.stringify(error));
            }
          );
        }
      }
    };
    svc.getInternalEndpoints = function() {
      return InternalEndpoint.find({})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad get all InternalEndpoint: ' + JSON.stringify(error));
        })
    };

    /*
    *
    * ExternalEndpoint
    *
    * */
    svc.deleteExternalEndpoint = function(externalEndpointId) {
      return ExternalEndpoint.deleteById({id:externalEndpointId})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad delete ExternalEndpoint' + JSON.stringify(error));
        });
    };
    svc.saveExternalEndpoint = function(externalEndpoint) {
      if (externalEndpoint) {
        // update
        if (externalEndpoint.id) {
          delete externalEndpoint._id;
          return ExternalEndpoint.upsert(externalEndpoint,
            function(response){
              console.log('updated ExternalEndpoint');
              return response;
            },
            function(error){
              console.log('error adding ExternalEndpoint: ' + JSON.stringify(error));

            }
          );
        }
        // create
        else {
          return ExternalEndpoint.create( externalEndpoint,
            function(response){
              console.log('added ExternalEndpoint');
              return response;
            },
            function(error){
              console.log('error adding ExternalEndpoint: ' + JSON.stringify(error));
            }
          );
        }
      }
    };
    svc.getGatewayEndpoints = function() {
    //  var swaggerUrl = 'http://localhost:4000/explorer/resources';
      var swaggerUrl = 'http://pool2015.herokuapp.com/explorer/resources';

      return $http.get(swaggerUrl)
        .then(function(resources) {
          return $q.all(
            resources.data.apis.map(function fetchSingleApi(api) {
              return $http.get(swaggerUrl + api.path)
                .then(function(response) {
                  return response.data;
                })
                .catch(function(error) {
                  $log.warn('bad get swagger resource item: ' + JSON.stringify(error))
                });
            })

          );
        }).
        catch(function(error) {
          $log.warn('bad get swagger resources: ' + JSON.stringify((error)));
        });
    };
    svc.getRawEndpointList = function() {
      return svc.getGatewayEndpoints()
        .then(function(endPoints) {

          var  returnArray = [];

          endPoints.map(function(path) {
            var currentPath = path.resourcePath;
            path.apis.map(function(api) {
              var currentPattern = api.path;
              api.operations.map(function(operation) {
                var newItem = {
                  path:currentPath,
                  pattern:currentPattern,
                  method: operation.method,
                  nickname: operation.nickname

                }
                returnArray.push(newItem);
              });
            });

          });

          //endPoints.tmp = returnArray;

          return returnArray;
        });
    };
    svc.getExternalEndpoints = function() {
      return ExternalEndpoint.find({})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad get all ExternalEndpoints: ' + JSON.stringify(error));
        })
    };

    /*
    *
    * PolicyScope
    *
    * */
    svc.deletePolicyScope = function(policyScopeId) {
      return PolicyScope.deleteById({id:policyScopeId})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad delete PolicyScope' + JSON.stringify(error));
        });
    };

    svc.savePolicyScope = function(policyScope) {
      if (policyScope) {
        if (!policyScope.name) {
          policyScope.name = 'lb-' + policyScope.host + ':' + policyScope.port;
        }
        // update
        if (policyScope.id) {
          delete policyScope._id;
          return PolicyScope.upsert(policyScope,
            function(response){
              console.log('updated PolicyScope');
              return response;
            },
            function(error){
              console.log('error adding PolicyScope: ' + JSON.stringify(error));

            }
          );
        }
        // create
        else {
          return PolicyScope.create( policyScope,
            function(response){
              console.log('added PolicyScope');
              return response;
            },
            function(error){
              console.log('error adding PolicyScope: ' + JSON.stringify(error));
            }
          );
        }
      }
    };
    svc.getPolicyScopes = function() {
      return PolicyScope.find({})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad get all PolicyScopes: ' + JSON.stringify(error));
        })
    };

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
    }


    /*
    *
    * Phase
    *
    * */
    svc.deletePhase = function(phaseId) {
      return Phase.deleteById({id:phaseId})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad delete Phase' + JSON.stringify(error));
        });
    };
    svc.savePhase = function(phase) {
      if (phase) {
        // update
        if (phase.id) {
          delete phase._id;
          return Phase.upsert(phase,
            function(response){
              console.log('updated Phase');
              return response;
            },
            function(error){
              console.log('error adding Phase: ' + JSON.stringify(error));

            }
          );
        }
        // create
        else {
          return Phase.create( phase,
            function(response){
              console.log('added Phase');
              return response;
            },
            function(error){
              console.log('error adding Phase: ' + JSON.stringify(error));
            }
          );
        }
      }
    };
    svc.getPhases = function() {
      return Phase.find({})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad get all Phases: ' + JSON.stringify(error));
        })
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

     return svc;
  }
]);
