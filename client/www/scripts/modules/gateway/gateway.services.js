Gateway.service('GatewayServices', [
  '$log',
  'Policy',
  'GatewayMapping',
  'Pipeline',
  function($log, Policy, GatewayMapping, Pipeline) {
    var svc = this;


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
    svc.clonePolicy = function(data) {
      return svc.getPolicyById(data.id)
        .then(function(srcInstance) {
          var targetInstance = angular.copy(srcInstance);
          targetInstance.name = data.name;
          delete targetInstance.id;
          return svc.savePolicy(targetInstance)
            .$promise
            .then(function(clonedObj) {
              return clonedObj;
            })
            .catch(function(error) {
              $log.warn('bad save cloned object: ' + JSON.stringify(error));
            });
        })
        .catch(function(error) {
          $log.warn('bad get  instance for cloning: ' + JSON.stringify(error));
        });
    };
    svc.renamePolicy = function(policy, newName, oldName) {

      return Policy.rename({}, {newName:newName, currentName:oldName}, function(err, response) {
        if (err) {
          $log.warn('bad policy rename: ' + JSON.stringify(err));
          return;
        }
        return response;
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
    svc.clonePipeline = function(data) {
      return svc.getPipelineById(data.id)
        .then(function(srcInstance) {
          var targetInstance = angular.copy(srcInstance);
          targetInstance.name = data.name;
          delete targetInstance.id;
          return svc.savePipeline(targetInstance)
            .$promise
            .then(function(clonedObj) {
              return clonedObj;
            })
            .catch(function(error) {
              $log.warn('bad save cloned object: ' + JSON.stringify(error));
            });
        })
        .catch(function(error) {
          $log.warn('bad get  instance for cloning: ' + JSON.stringify(error));
        });
    };
    svc.savePipeline = function(pipeline) {
      if (pipeline) {
        // update
        delete pipeline.isActive;
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

    svc.getPipelineDetail = function(id) {
      var returnObj = {};
      var tPolicies = [];
      var tPipelines = [];
      function getPipelineRenderPolicy(policyId) {
        return _.findWhere(tPolicies, { id: policyId });
      }
      function inflatePipelinePolicies(pipeline) {
        pipeline.policies = [];
        pipeline.policyIds.map(function(policyId) {
          var inflatedPolicy = getPipelineRenderPolicy(policyId);
          pipeline.policies.push(inflatedPolicy);
        });
        return pipeline;
      }
      function getPipelineDetail(argId) {
        for (var i = 0;i < tPipelines.length;i++) {
          var cPipeline = tPipelines[i];
          if (cPipeline.id === argId) {
            var retVal = inflatePipelinePolicies(cPipeline);
            return retVal;
          }
        }
      };


      // get policies
      return svc.getPolicies()
      .then(function(policies) {
          tPolicies = policies;

          return svc.getPipelines()
            .then(function(pipelines) {
              tPipelines = pipelines;
              returnObj = getPipelineDetail(id);
              return returnObj;

            });
        });

    };
    /*
    *
    * GATEWAY MAPS
    *
    * */
    svc.deleteGatewayMap = function(gatewayMapId) {
      return GatewayMapping.deleteById({id:gatewayMapId})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad delete GatewayMapping' + JSON.stringify(error));
        });
    };
    svc.cloneGatewayMap = function(data) {
      return svc.getGatewayMapById(data.id)
          .then(function(srcInstance) {
            var targetInstance = angular.copy(srcInstance);
            targetInstance.name = data.name;
            delete targetInstance.id;

            return svc.saveGatewayMap(targetInstance)
              .$promise
              .then(function(clonedInstance) {
                return clonedInstance;
              })
              .catch(function(error) {
                $log.warn('bad save cloned object: ' + JSON.stringify(error));
              });
          })
          .catch(function(error) {
            $log.warn('bad get  GatewayMapping: ' + JSON.stringify(error));
          });
    };
    svc.cloneInstance = function(data) {
      switch(data.type) {
        case GATEWAY_CONST.POLICY_TYPE:
          return svc.clonePolicy(data)
            .then(function(instance) {
              return instance;
            });
          break;
        case GATEWAY_CONST.PIPELINE_TYPE:
          return svc.clonePipeline(data)
            .then(function(instance) {
              return instance;
            });
          break;
        case GATEWAY_CONST.MAPPING_TYPE:
          return svc.cloneGatewayMap(data)
            .then(function(instance) {
              return instance;
            });
          break;
        default:
      }
    };

    svc.renamePipeline = function(pipeline, newName, oldName) {

      return Pipeline.rename({}, {newName:newName, currentName:oldName}, function(err, response) {
        if (err) {
          $log.warn('bad pipeline rename: ' + JSON.stringify(err));
          return;
        }
        return response;
      });
    };
    svc.renameMapping = function(mapping, newName, oldName) {

      return GatewayMapping.rename({}, {newName:newName, currentName:oldName}, function(err, response) {
        if (err) {
          $log.warn('bad mapping rename: ' + JSON.stringify(err));
          return;
        }
        return response;
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
          return GatewayMapping.upsert(gatewayMap,
            function(response){
              console.log('updated GatewayMapping');
              return response;
            },
            function(error){
              console.log('error adding GatewayMapping: ' + JSON.stringify(error));

            }
          );
        }
        // create
        else {
          return GatewayMapping.create( gatewayMap,
            function(response){
              console.log('added GatewayMapping');
              return response;
            },
            function(error){
              console.log('error adding GatewayMapping: ' + JSON.stringify(error));
            }
          );
        }
      }
    };
    /*
    *
    * map.pipeline = GatewayServices.getPipelineDetail(map.pipelineId)
    *
    *
    *
    * */

    svc.getGatewayMaps = function() {
      return GatewayMapping.find({include: 'pipelines'})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad get all GatewayMaps: ' + JSON.stringify(error));
        })
    };
    //svc.getGatewayMappings = function() {
    //  return GatewayMapping.find({})
    //    .$promise
    //    .then(function(response) {
    //      return response;
    //    })
    //    .catch(function(error) {
    //      $log.warn('bad get all GatewayMaps: ' + JSON.stringify(error));
    //    })
    //};
    svc.getGatewayMapById = function(id) {
      return GatewayMapping.findById({id:id})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad get  GatewayMapping: ' + JSON.stringify(error));
        })
    };

    svc.getGatewayEndpoints = function() {
      //  var swaggerUrl = 'http://localhost:4000/explorer/resources';
      var swaggerUrl = 'http://pool2015.herokuapp.com/explorer/resources';

    };
     return svc;
  }
]);
