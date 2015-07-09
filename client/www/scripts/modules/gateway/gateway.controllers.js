Gateway.controller('GatewayMainController', [
  '$scope',
  '$log',
  'GatewayServices',
  '$timeout',
  '$state',
  '$location',
  '$modal',
  function($scope, $log, GatewayServices, $timeout, $state, $location, $modal) {


    function getNavBasePath() {
      var path = $location.path();
      if (path.indexOf("pipeline") > -1) {
        return 'pipeline';
      }
      if (path.indexOf("gatewaymap") > -1) {
        return 'gatewaymap';
      }
      if (path.indexOf("policy") > -1) {
        return 'policy';
      }
      return 'gatewaymap';
    }

    $scope.showAddNewPipelineForm = function() {
      var modalDlg = $modal.open({
        templateUrl: './scripts/modules/gateway/templates/add.pipeline.modal.html',
        size: 'lg',
        controller: function($scope, $modalInstance, title) {
          $scope.title = title;
          $scope.close = function() {
            $modalInstance.dismiss();
          };
        },
        resolve: {
          title: function() {
            return 'Example Modal Dialog';
          }
        }
      });
    };
    $scope.deleteInstanceRequest = function(id, type) {
      if (id && type) {
        switch (type) {
          case 'policy':
            if (confirm('delete policy?')) {
              GatewayServices.deletePolicy(id)
                .then(function(response) {
                  $scope.refreshDataSets();
                });

            }

            break;

          case 'gatewaymap':
            if (confirm('delete gateway map?')) {
              GatewayServices.deleteGatewayMap(id)
                .then(function(response) {
                  $scope.refreshDataSets();
                });

            }
            break;

          case 'pipleline':
            if (confirm('delete pipeline?')) {
              GatewayServices.deletePipeline(id)
              .then(function(response) {
                  $scope.refreshDataSets();
                });

            }

            break;

          default:

        }

      }
    };
    $scope.showAddNewGatewayMapForm = function() {
      var modalDlg = $modal.open({
        templateUrl: './scripts/modules/gateway/templates/add.map.modal.html',
        size: 'lg',
        controller: function($scope, $modalInstance, title) {
          $scope.title = title;
          $scope.close = function() {
            $modalInstance.dismiss();
          };
        },
        resolve: {
          title: function() {
            return 'Example Modal Dialog';
          }
        }
      });
    };
    $scope.showAddNewPolicyForm = function() {
      var modalDlg = $modal.open({
        templateUrl: './scripts/modules/gateway/templates/add.policy.modal.html',
        size: 'lg',
        controller: function($scope, $modalInstance, title) {
          $scope.title = title;
          $scope.close = function() {
            $modalInstance.dismiss();
          };
        },
        resolve: {
          title: function() {
            return 'Example Modal Dialog';
          }
        }
      });
    };
    $scope.isShowScopesCrud = false;
    $scope.showScopesCrud = function() {
      $scope.isShowScopesCrud = !$scope.isShowScopesCrud;
    };
    $scope.gatewayCtx = {};
    $scope.refreshDataSets = function() {

      $scope.pipelineCtx.pipelines = GatewayServices.getPipelines()
        .then(function(pipelines) {
          $scope.pipelineCtx.pipelines = pipelines;
        });
      GatewayServices.getGatewayMaps()
        .then(function(maps) {
          $scope.gatewayMapCtx.gatewayMaps = maps;
        });
      $scope.policyCtx.policies = GatewayServices.getPolicies()
        .then(function(policies) {
          $scope.policyCtx.policies = policies;
          window.triggerResizeUpdate();
        });
      $scope.policyScopeCtx.policyScopes = GatewayServices.getPolicyScopes()
        .then(function(scopes) {
          $scope.policyScopeCtx.policyScopes = scopes;
        });
      $scope.isShowScopesCrud = false;
    };



    $scope.init = function() {
      $log.debug('Gateway Location : ' + getNavBasePath());
      $log.debug('Gateway Params: ' + JSON.stringify($state.params));

      $scope.gatewayCtx = {
        currentView: getNavBasePath(),
        currentInstanceId: $state.params.id,
        currentExternalEndpoint: {},
        currentInternalEndpoint: {},
        currentPolicy: {},
        currentPolicyScope: {},
        currentPhase: {},
        policyTypes: [
          {
            id: 'auth',
            name: 'Authentication',
            description: ''
          },
          {
            id: 'log',
            name: 'Logging',
            description: ''
          },
          {
            id: 'ratelimit',
            name: 'Rate Limit',
            description: ''
          },
          {
            id: 'proxy',
            name: 'Proxy',
            description: ''

          }
        ]
      };
      $scope.gatewayCtx.isShowGatewayMapView = true;
      $scope.gatewayCtx.isShowPipelineView = false;
      $scope.gatewayCtx.isShowPolicyView = false;

      $scope.gatewayMapCtx = {
        currentGatewayMap: {},
        gatewayMaps: [],
        currentPolicyScopes: [],
        currentPipelines: []
      };
      $scope.policyScopeCtx = {
        currentPolicyScope: {},
        policyScopes: []
      };
      $scope.pipelineCtx = {
        currentPipeline: {},
        newPolicyName: '',
        newPolicy: {},
        pipelines: [],
        deployedApps: [],
        isShowNewPipelineForm: false,
        isProxyPipeline: false,
        isShowAddPipelinePolicyButton: false,
        currentInternalEndpoint: ''
      };
      $scope.policyCtx = {
        currentPolicy: {},
        policies: [],
        deployedApps: []
      };
      $scope.refreshDataSets();

      if ($scope.gatewayCtx.currentInstanceId) {
        switch($scope.gatewayCtx.currentView) {

          case 'gatewaymap':
            $scope.gatewayMapCtx.currentGatewayMap = GatewayServices.getGatewayMapById($scope.gatewayCtx.currentInstanceId)
            .then(function(map) {
                $scope.gatewayMapCtx.currentGatewayMap = map;
              });
            break;

          case 'pipeline':
            $scope.pipelineCtx.currentPipeline = GatewayServices.getPipelineById($scope.gatewayCtx.currentInstanceId)
              .then(function(map) {
                $scope.pipelineCtx.currentPipeline = map;
              });

            break;

          case 'policy':
            $scope.policyCtx.currentPolicy = GatewayServices.getPolicyById($scope.gatewayCtx.currentInstanceId)
              .then(function(map) {
                $scope.policyCtx.currentPolicy = map;
              });

            break;

          default:

        }


      }




      setView();
    }();
    function setView() {
      $timeout(function() {
        if ($scope.gatewayCtx.currentView) {
          //$scope.refreshDataSets();
          switch($scope.gatewayCtx.currentView) {
            case 'gatewaymap':
              $scope.gatewayCtx.isShowGatewayMapView = true;
              $scope.gatewayCtx.isShowPipelineView = false;
              $scope.gatewayCtx.isShowPolicyView = false;


              break;
            case 'pipeline':
              $scope.gatewayCtx.isShowGatewayMapView = false;
              $scope.gatewayCtx.isShowPipelineView = true;
              $scope.gatewayCtx.isShowPolicyView = false;



              break;
            case 'policy':
              $scope.gatewayCtx.isShowGatewayMapView = false;
              $scope.gatewayCtx.isShowPipelineView = false;
              $scope.gatewayCtx.isShowPolicyView = true;



              break;
            default:

          }


        }

      });

    }
    $scope.setMainNav = function(view, id) {
      $state.go(view);


    }

  }
]);
Gateway.controller('ExternalEndpointMainController', [
  '$scope',
  '$log',
  'GatewayServices',
  'AppServices',
  '$timeout',
  '$modal',
  function($scope, $log, GatewayServices, AppServices, $timeout, $modal) {
    $log.debug('ExternalEndpoint Controller');
    $scope.externalEndpointCtx = {
      currentExternalEndpoint: {},
      externalEndpoints: [],
      srcEndpoints: [],
      externalModels: [],
      deployedApps: []
    };
    $scope.endpointMethods = [{name:'GET', isIncluded:true}, {name:'POST', isIncluded:true}, {name:'PUT', isIncluded:true}, {name: 'DELETE', isIncluded:true}, {name:'HEAD', isIncluded:true}];

    $scope.filteredModels = [];
    $scope.endpointFilter = function() {
      var returnEndpoints = [];
      $scope.externalEndpointCtx.externalEndpoints.map(function(endpoint) {
        $scope.filteredModels.map(function(filterModels) {
          if (filterModels.isIncluded && filterModels.resourcePath === endpoint.path) {
            returnEndpoints.push(endpoint);
          }
        });
      });
      return returnEndpoints;
    };


    $scope.externalEndpointCtx.externalEndpoints = GatewayServices.getGatewayEndpoints()
      .then(function(endPoints) {

        var  returnArray = [];
        var  modelArray = [];

        endPoints.map(function(path) {
          var currentPath = path.resourcePath;
          modelArray.push(path);
          path.apis.map(function(api) {
            var currentPattern = api.path;
            api.operations.map(function(operation) {
              var newItem = {
                path:currentPath,
                pattern:currentPattern,
                method: operation.method,
                nickname: operation.nickname

              };
              returnArray.push(newItem);
            });
          });

        });

        endPoints.tmp = returnArray;

        $scope.externalEndpointCtx.externalModels = modelArray;
        //$scope.filteredModels = modelArray;
        modelArray.map(function(modelItem) {
          modelItem.isIncluded = true;
          $scope.filteredModels.push(modelItem);
        });
        $scope.filteredMethods = $scope.endpointMethods;
        $scope.externalEndpointCtx.srcEndpoints = returnArray;
        $scope.externalEndpointCtx.externalEndpoints = returnArray;
      });


    $scope.filteredMethods = $scope.endpointMethods;
    $scope.isFilterSelected = function(argModel) {
      $scope.filteredModels.map(function(model) {
        if (model.path === argModel.path) {
          return true;
        }
      });
      return false;
    };

    $scope.endpointMethodFilter = function(method) {
      //$log.debug('filter method: ' + method);
      //$scope.filteredMethods.push(method);
      //$log.debug('applied filters: ' + JSON.stringify($scope.filteredMethods));

    };
    $scope.endpointModelFilter = function(model) {
      $log.debug('filter model: ' + model.path);

      //$scope.filteredModels[model.path].isIncluded = false;
      //$log.debug('applied filters: ' + JSON.stringify($scope.filteredModels));
      //$log.debug('applied filters: ' + JSON.stringify($scope.filteredModels));

    };

    $scope.$watch('filteredModels', function(newValue) {
      var updatedCollection = [];
      if (newValue.map) {
        newValue.map(function(modelFilter) {
          if (modelFilter.isIncluded) {
            if ($scope.externalEndpointCtx.srcEndpoints.map) {
              $scope.externalEndpointCtx.srcEndpoints.map(function(endpoint) {
                if (endpoint.path === modelFilter.resourcePath) {
                  // make sure the method is allowed
                  $scope.filteredMethods.map(function(method) {

                    if (method.isIncluded && (method.name === endpoint.method)) {
                      updatedCollection.push(endpoint);

                    }

                  });
                }
              });
            }

          }
        });
      }
      else {
        updatedCollection = $scope.externalEndpointCtx.externalEndpoints
      }
      $timeout(function() {
        $scope.externalEndpointCtx.externalEndpoints = updatedCollection;
      });
    }, true);
    $scope.$watch('filteredMethods', function(newValue) {
      var updatedCollection = [];
      // methods array
      if (newValue.map) {
        $scope.filteredMethods.map(function(methodFilter) {
          if (methodFilter.isIncluded) {
            if ($scope.externalEndpointCtx.srcEndpoints.map) {
              $scope.externalEndpointCtx.srcEndpoints.map(function(endpoint) {
                if (endpoint.method === methodFilter.name) {
                  // make sure the model is allowed
                  $scope.filteredModels.map(function(model) {

                    if (model.isIncluded && (endpoint.path === model.resourcePath)) {
                      updatedCollection.push(endpoint);

                    }

                  });
                }
              });
            }

          }
        });
      }
      else {
        updatedCollection = $scope.externalEndpointCtx.srcEndpoints;
      }
      $timeout(function() {
        $scope.externalEndpointCtx.externalEndpoints = updatedCollection;
      });
    }, true);
    $scope.saveExternalEndpoint = function(externalEndpoint) {
      $scope.externalEndpointCtx.currentExternalEndpoint = externalEndpoint;
      $scope.saveCurrentExternalEndpoint();
    }
    function resetCurrentExternalEndpoint() {
      $scope.externalEndpointCtx.currentExternalEndpoint = {};
    }
    //function refreshExternalEndpoints() {
    //  $scope.externalEndpointCtx.externalEndpoints = GatewayServices.getExternalEndpoints()
    //    .then(function(lbs) {
    //      $scope.externalEndpointCtx.externalEndpoints = lbs;
    //    });
    //}
    function refreshDeployedApps() {
      $scope.externalEndpointCtx.deployedApps = AppServices.getDeployedApps()
        .then(function(apps) {
          $scope.externalEndpointCtx.deployedApps = apps;
        });
    }
    //$scope.externalEndpointCtx.externalEndpoints = GatewayServices.getExternalEndpoints()
    //  .then(function(endpoints) {
    //    $scope.externalEndpointCtx.externalEndpoints = endpoints;
    //  });
    $scope.deleteExternalEndpoint = function(externalEndpoint) {
      if (confirm('delete Load Balancer?')) {
        GatewayServices.deleteExternalEndpoint(externalEndpoint.id)
          .then(function(response) {
            refreshExternalEndpoints();
          });
      }
    };
    $scope.externalEndpointCtx.deployedApps = AppServices.getDeployedApps()
      .then(function(apps) {
        $scope.externalEndpointCtx.deployedApps = apps;
      });

    $scope.editExternalEndpoint = function(externalEndpoint) {
      externalEndpoint.editMode = true;
    };
    $scope.cancelEditExternalEndpoint = function(externalEndpoint) {
      externalEndpoint.editMode = false;
    };
    $scope.saveCurrentExternalEndpoint = function() {
      $scope.externalEndpointCtx.currentExternalEndpoint.editMode = false;
      if ($scope.externalEndpointCtx.currentExternalEndpoint.host && $scope.externalEndpointCtx.currentExternalEndpoint.port) {
        $scope.externalEndpointCtx.currentExternalEndpoint = GatewayServices.saveExternalEndpoint($scope.externalEndpointCtx.currentExternalEndpoint)
          .$promise
          .then(function(response) {
            $scope.externalEndpointCtx.currentExternalEndpoint = {};
            resetCurrentExternalEndpoint();
            refreshExternalEndpoints();
          });
      }
      else {
        $log.debug('invalid ExternalEndpoint attempt save');
      }
    };
    $scope.clearExternalEndpointForm = function() {
      $scope.externalEndpointCtx.currentExternalEndpoint = {};
    };



  }
]);
Gateway.controller('InternalEndpointMainController', [
  '$scope',
  '$log',
  'InternalEndpointServices',
  'AppServices',
  '$modal',
  function($scope, $log, InternalEndpointServices, AppServices, $modal) {
    $log.debug('InternalEndpoint Controller');
    $scope.internalEndpointCtx = {
      currentInternalEndpoint: {},
      internalEndpoints: [],
      deployedApps: []
    };
    function resetCurrentInternalEndpoint() {
      $scope.internalEndpointCtx.currentInternalEndpoint = {};
    }
    function refreshInternalEndpoints() {
      $scope.internalEndpointCtx.internalEndpoints = InternalEndpointServices.getInternalEndpoints()
        .then(function(lbs) {
          $scope.internalEndpointCtx.internalEndpoints = lbs;
        });
    }
    function refreshDeployedApps() {
      $scope.internalEndpointCtx.deployedApps = AppServices.getDeployedApps()
        .then(function(apps) {
          $scope.internalEndpointCtx.deployedApps = apps;
        });
    }
    $scope.internalEndpointCtx.internalEndpoints = InternalEndpointServices.getInternalEndpoints()
      .then(function(hosts) {
        $scope.internalEndpointCtx.internalEndpoints = hosts;
      });
    $scope.deleteInternalEndpoint = function(internalEndpoint) {
      if (confirm('delete Load Balancer?')) {
        InternalEndpointServices.deleteInternalEndpoint(internalEndpoint.id)
          .then(function(response) {
            refreshInternalEndpoints();
          });
      }
    };
    $scope.internalEndpointCtx.deployedApps = AppServices.getDeployedApps()
      .then(function(apps) {
        $scope.internalEndpointCtx.deployedApps = apps;
      });

    $scope.editInternalEndpoint = function(internalEndpoint) {
      internalEndpoint.editMode = true;
    };
    $scope.cancelEditInternalEndpoint = function(internalEndpoint) {
      internalEndpoint.editMode = false;
    };
    $scope.saveCurrentInternalEndpoint = function() {
      $scope.internalEndpointCtx.currentInternalEndpoint.editMode = false;
      if ($scope.internalEndpointCtx.currentInternalEndpoint.host && $scope.internalEndpointCtx.currentInternalEndpoint.port) {
        $scope.internalEndpointCtx.currentInternalEndpoint = InternalEndpointServices.saveInternalEndpoint($scope.internalEndpointCtx.currentInternalEndpoint)
          .$promise
          .then(function(response) {
            $scope.internalEndpointCtx.currentInternalEndpoint = {};
            resetCurrentInternalEndpoint();
            refreshInternalEndpoints();
          });
      }
      else {
        $log.debug('invalid InternalEndpoint attempt save');
      }
    };
    $scope.clearInternalEndpointForm = function() {
      $scope.internalEndpointCtx.currentInternalEndpoint = {};
    };



  }
]);
Gateway.controller('PhaseMainController', [
  '$scope',
  '$log',
  'PhaseServices',
  'AppServices',
  '$modal',
  function($scope, $log, PhaseServices, AppServices, $modal) {
    $log.debug('Phase Controller');
    $scope.phaseCtx = {
      currentPhase: {},
      phases: [],
      deployedApps: []
    };
    function resetCurrentPhase() {
      $scope.phaseCtx.currentPhase = {};
    }
    function refreshPhases() {
      $scope.phaseCtx.phases = PhaseServices.getPhases()
        .then(function(lbs) {
          $scope.phaseCtx.phases = lbs;
        });
    }
    function refreshDeployedApps() {
      $scope.phaseCtx.deployedApps = AppServices.getDeployedApps()
        .then(function(apps) {
          $scope.phaseCtx.deployedApps = apps;
        });
    }
    $scope.phaseCtx.phases = PhaseServices.getPhases()
      .then(function(hosts) {
        $scope.phaseCtx.phases = hosts;
      });
    $scope.deletePhase = function(phase) {
      if (confirm('delete Load Balancer?')) {
        PhaseServices.deletePhase(phase.id)
          .then(function(response) {
            refreshPhases();
          });
      }
    };

    $scope.showModal = function() {
      var modalDlg = $modal.open({
        templateUrl: './scripts/modules/loadbalancer/templates/add.loadbalancer.modal.html',
        size: 'lg',
        scope: $scope,
        controller: function($scope, $modalInstance, title) {
          $scope.title = title;
          $scope.close = function() {
            $modalInstance.dismiss();
          };
        },
        resolve: {
          title: function() {
            return 'Example Modal Dialog';
          }
        }
      });
    };
    $scope.editPhase = function(phase) {
      phase.editMode = true;
    };
    $scope.cancelEditPhase = function(phase) {
      phase.editMode = false;
    };
    $scope.saveCurrentPhase = function() {
      $scope.phaseCtx.currentPhase.editMode = false;
      if ($scope.phaseCtx.currentPhase.host && $scope.phaseCtx.currentPhase.port) {
        $scope.phaseCtx.currentPhase = PhaseServices.savePhase($scope.phaseCtx.currentPhase)
          .$promise
          .then(function(response) {
            $scope.phaseCtx.currentPhase = {};
            resetCurrentPhase();
            refreshPhases();
          });
      }
      else {
        $log.debug('invalid Phase attempt save');
      }
    };
    $scope.clearPhaseForm = function() {
      $scope.phaseCtx.currentPhase = {};
    };



  }
]);


