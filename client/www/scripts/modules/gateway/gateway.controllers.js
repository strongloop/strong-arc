Gateway.controller('GatewayMainController', [
  '$scope',
  '$log',
  'GatewayServices',
  '$timeout',
  '$state',
  '$stateParams',
  '$location',
  '$modal',
  '$rootScope',
  function($scope, $log, GatewayServices, $timeout, $state, $stateParams, $location, $modal, $rootScope) {


    function getNavBasePath() {
      var path = $location.path();
      if (path.indexOf(GATEWAY_CONST.PIPELINE_TYPE) > -1) {
        return GATEWAY_CONST.PIPELINE_TYPE;
      }
      if (path.indexOf(GATEWAY_CONST.MAPPING_TYPE) > -1) {
        return GATEWAY_CONST.MAPPING_TYPE;
      }
      if (path.indexOf(GATEWAY_CONST.POLICY_TYPE) > -1) {
        return GATEWAY_CONST.POLICY_TYPE;
      }
      return GATEWAY_CONST.MAPPING_TYPE;
    }

    $scope.showAddNewPipelineForm = function() {
      var modalDlg = $modal.open({
        templateUrl: './scripts/modules/gateway/templates/add.pipeline.modal.html',
        size: 'lg',
        scope: $scope,
        controller: function($scope, $modalInstance, title) {
          $scope.isModal = true;
          $scope.pipelineCtx.newPipeline = {};
          $scope.title = title;
          $scope.close = function() {
            $modalInstance.dismiss();
          };

          /**
           * save new pipeline
           * @param pipeline
           */
          $scope.saveNewPipeline = function(pipeline){
            delete pipeline.policies; // relation
            GatewayServices.savePipeline(pipeline)
              .$promise
              .then(function(data) {
                $scope.setMainNav(GATEWAY_CONST.PIPELINE_TYPE, pipeline.id);
                $scope.refreshPipelines();
                $scope.close();
              });

          };
        },
        resolve: {
          title: function() {
            return 'Example Modal Dialog';
          }
        }
      });
    };
    $scope.deleteInstanceRequest = function(type, id) {
      if (id && type) {
        $scope.confirmDeleteInstance(id, type);
      }
    };

    $scope.confirmDeleteInstance = function(id, type){
      var modalDlg = $modal.open({
        templateUrl: './scripts/modules/gateway/templates/confirm.instance.delete.html',
        size: 'md',
        scope: $scope,
        controller: function($scope, $modalInstance, title) {
          $scope.isModal = true;
          $scope.title = title;
          $scope.id = id;
          $scope.type = type;
          $scope.close = function() {
            $modalInstance.dismiss();
          };

          $scope._deleteInstance = function(id, type){
            $scope.deleteInstance(id, type);
            $scope.close();
          }
        },
        resolve: {
          title: function() {
            return 'Confirm Delete Instance';
          }
        }
      });
    };

    $scope.deleteInstance = function(id, type){

      switch(type){
        case GATEWAY_CONST.POLICY_TYPE:
          GatewayServices.deletePolicy(id)
            .then(function(response) {
              $scope.refreshPolicies();
            });

          break;

        case GATEWAY_CONST.PIPELINE_TYPE:
            GatewayServices.deletePipeline(id)
              .then(function(response) {
                $scope.refreshPipelines();
              });

          break;

        case GATEWAY_CONST.MAPPING_TYPE:
          GatewayServices.deleteGatewayMap(id)
              .then(function(response) {
                $scope.refreshMappings();
              });

          break;
      }
    };

    $scope.cloneInstanceRequest  = function(data) {
      if (data.id && data.type && data.name) {
        var originalData = angular.copy(data);
        $scope.cloneInstance = data;
        $scope.cloneInstance.name = originalData.name + '-' + (Math.floor(Math.random() * (11 - 1)) + 1);
        $scope.showCloneInstanceDialog(data, originalData.name);
      }
    };
    $scope.showCloneInstanceDialog = function(data, originalName) {
      var modalDlg = $modal.open({
        templateUrl: './scripts/modules/gateway/templates/clone.instance.modal.html',
        size: 'md',
        scope: $scope,
        controller: function($scope, $modalInstance, title) {
          $scope.instanceObj = $scope.$parent.cloneInstance;
          $scope.saveTheClone = function(clone) {
            if (clone.name && (clone.name !== originalName)) {
              GatewayServices.cloneInstance(clone)
                .then(function(newInstance) {
                  $scope.close();
                  $scope.setMainNav($scope.instanceObj.type, newInstance.id);
                  switch($scope.instanceObj.type) {
                    case GATEWAY_CONST.MAPPING_TYPE:
                      $scope.refreshMappings();
                      break;
                    case GATEWAY_CONST.PIPELINE_TYPE:
                      $scope.refreshPipelines();
                      break;

                    case GATEWAY_CONST.POLICY_TYPE:
                      $scope.refreshPolicies();
                      break;

                    default:

                  }
                  //$scope.refreshDataSets();
                });
            }
          };
          $scope.close = function() {
            $modalInstance.dismiss();
          };

        },
        resolve: {
          title: function() {
            return '';
          }
        }
      });
    };
    $scope.showAddNewGatewayMapForm = function() {

      // ensure new gateway object is reset;
      $scope.gatewayMapCtx.newGatewayMap = {verb:'ALL'};
      // if there is more than one pipeline
      if (!$scope.gatewayMapCtx.currentPipelines || !$scope.gatewayMapCtx.currentPipelines.length || ($scope.gatewayMapCtx.currentPipelines.length === 0)) {
        $log.warn('no pipelines available');
        if (confirm('would you like to create a pipeline now?')) {
          $log.debug('you should open the new pipeline form now');
        }
        else {
          return;
        }
      }
      var modalDlg = $modal.open({
        templateUrl: './scripts/modules/gateway/templates/add.gateway.map.modal.html',
        size: 'lg',
        scope: $scope,
        controller: function($scope, $modalInstance, title) {
          $scope.title = title;
          $scope.getMappingPipelineLabel = function(map) {
            if (map.pipelineId) {
              return map.pipelineId;
            }
            return 'choose a pipeline';
          };
          $scope.close = function() {
            $modalInstance.dismiss();
          };
          $scope.saveNewGatewayMap = function(map, form) {

            if ( form.$invalid ) {
              return;
            }

            $scope.close();
            if (map.name && map.endpoint) {

              if (!map.verb) {
                map.verb = 'ALL';
              }

              if (map.pipelineId) {
                GatewayServices.saveGatewayMap(map)
                  .$promise
                  .then(function(map) {
                    $scope.refreshMappings();
                    // reset 'new mapping'
                    $scope.setMainNav(GATEWAY_CONST.MAPPING_TYPE, map.id);

                  });

              }
              else {
                alert('validation: no pipeline');
              }
            }
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
        scope: $scope,
        controller: function($scope, $modalInstance, title, $log) {
          $scope.policyCtx.newPolicy = {};
          $scope.title = title;
          $scope.close = function() {
            $modalInstance.dismiss();
          };
          $scope.saveNewPolicy = function(policy) {
            if ( $scope.policyForm.$invalid ) {
              return;
            }

            if (policy.name && policy.type) {

              GatewayServices.savePolicy(policy)
                .$promise
                .then(function(policy) {
                  $scope.refreshPolicies();
                  $scope.setMainNav(GATEWAY_CONST.POLICY_TYPE, policy.id);
                 });
            }

            $scope.close();
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

    $scope.showAddNewModal = function(type) {
      switch(type) {
        case GATEWAY_CONST.MAPPING_TYPE:
          $scope.showAddNewGatewayMapForm();
          break;

        case GATEWAY_CONST.PIPELINE_TYPE :
          $scope.refreshPolicies();
          $scope.showAddNewPipelineForm();
          break;

        case GATEWAY_CONST.POLICY_TYPE:
          $scope.showAddNewPolicyForm();
          break;

        default:


      }
    };
    /*
    *
    * Refresh collections
    *
    * */

    $scope.$watch('pipelineCtx.pipelines', function(newVal){
      $log.log('watcher pipelines', newVal);
    }, true);

    function hoistPipelineProperties(pipeline) {
      // hoist scopes and targetURL if present
      if (pipeline.policies) {
        pipeline.policies.map(function(policy) {
          if (policy.scopes) {
            pipeline.scopes = policy.scopes;
          }
          if (policy.targetURL) {
            pipeline.targetURL = policy.targetURL;
          }
        })
      }
      return pipeline;
    }

    $scope.refreshMappings = function() {
      return GatewayServices.getGatewayMaps()
        .then(function(mappings) {
          if (mappings && mappings.map) {
            mappings.map(function(mapping) {
              if (mapping.pipeline) {
                mapping.pipeline = hoistPipelineProperties(mapping.pipeline);
              }
            });
          }
          $scope.gatewayMapCtx.gatewayMaps = mappings;

          $scope.gatewayCtx.navMenus[GATEWAY_CONST.MAPPING_TYPE] = {
            type:GATEWAY_CONST.MAPPING_TYPE,
            title:'Mappings',
            items: mappings,
            addNew: 'Mapping'
          };
        });
    };
    $scope.refreshPipelines = function() {
      return GatewayServices.getPipelines()
        .then(function(pipelines) {
          if (pipelines && pipelines.map) {
            pipelines.map(function(pipeline) {
              pipeline = hoistPipelineProperties(pipeline);
            });
          }
          $scope.pipelineCtx.pipelines = pipelines;
          $scope.gatewayMapCtx.currentPipelines = pipelines;
          $scope.gatewayCtx.navMenus[GATEWAY_CONST.PIPELINE_TYPE] = {
            type:GATEWAY_CONST.PIPELINE_TYPE,
            title:'Pipelines',
            items: pipelines,
            addNew: 'Pipeline'
          };
      });
    };

    $scope.refreshPolicies = function() {
      return GatewayServices.getPolicies()
        .then(function(policies) {
          $scope.policyCtx.policies = policies;
          $scope.pipelineCtx.policies = policies;
          $scope.gatewayMapCtx.currentPolicies = policies;
          $scope.gatewayCtx.navMenus[GATEWAY_CONST.POLICY_TYPE] = {
            type:GATEWAY_CONST.POLICY_TYPE,
            title:'Policies',
            items: policies,
            addNew: 'Policy'
          };
        });
    };

    $scope._refreshDataSets = function() {
      $log.log('refreshDataSets');
      $scope.gatewayCtx.navMenus = [];

      return $scope.refreshPolicies()
        .then($scope.refreshPipelines)
        .then($scope.refreshMappings)
        .then(function() {
          $log.debug('data sets refreshed');

          setScrollView();
        });
    };

    function setScrollView(){
      $timeout(function(){
        window.setScrollView('.sidebar-layout-main-container');
        window.setScrollView('[data-id="GatewayMainContainer"]');
        $(window).trigger('resize');
      }, 0);
    }

    $scope.init = function() {

      $scope.gatewayCtx = {
        currentView: getNavBasePath(),
        currentInstanceId: $state.params.id,
        navMenus: {},
        currentExternalEndpoint: {},
        currentInternalEndpoint: {},
        currentPolicy: {},
        currentPolicyScope: {},
        currentPhase: {},
        rateScales: [
          {name:'millisecond', display: 'millisecond(s)'},
          {name:'second', display: 'second(s)'},
          {name:'minute', display: 'minute(s)'},
          {name:'hour', display: 'hour(s)'},
          {name:'day', display: 'day(s)'}
        ]
      };
      $scope.gatewayCtx.isShowGatewayMapView = true;
      $scope.gatewayCtx.isShowPipelineView = false;
      $scope.gatewayCtx.isShowPolicyView = false;

      $scope.gatewayMapCtx = {
        currentGatewayMap: {},
        newGatewayMap: {verb:'ALL'},
        gatewayMaps: [],
        originalInstance: {},
        currentPolicies: [],
        currentPipelines: []
      };
      $scope.policyScopeCtx = {
        currentPolicyScope: {},
        policyScopes: []
      };
      $scope.pipelineCtx = {
        currentPipeline: {},
        currentInstanceId: $state.params.id,
        originalInstance: {},
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
        currentPolicy: {}, //edit
        newPolicy: {}, //new
        originalInstance: {},
        defaultRateScale: {name:'second', display: 'second(s)'},
        policies: [],
        deployedApps: [],
        policyTypes: [
          {
            id: 'auth',
            name: 'Authentication',
            description: ''
          },
          {
            id: 'metrics',
            name: 'Metrics',
            description: ''
          },
          {
            id: 'rateLimiting',
            name: 'Rate Limit',
            description: ''
          },
          {
            id: 'reverseProxy',
            name: 'Proxy',
            description: ''

          }
        ]
      };

      $scope._refreshDataSets();


    }();
    $scope.main = function() {
      /*
       * Retrieve instance data if context id is present
       * */
      if ($scope.gatewayCtx.currentInstanceId) {
        switch($scope.gatewayCtx.currentView) {

          case GATEWAY_CONST.MAPPING_TYPE:
            $scope.gatewayMapCtx.currentGatewayMap = GatewayServices.getGatewayMapById($scope.gatewayCtx.currentInstanceId)
              .then(function(map) {
                $scope.gatewayMapCtx.originalInstance = angular.copy(map);
                $scope.gatewayMapCtx.currentGatewayMap = map;
              });
            break;

          case GATEWAY_CONST.PIPELINE_TYPE:
            $scope.pipelineCtx.currentPipeline = GatewayServices.getPipelineById($scope.gatewayCtx.currentInstanceId)
              .then(function(pipe) {
                $scope.pipelineCtx.currentPipeline = pipe;
                $scope.pipelineCtx.originalInstance = angular.copy($scope.pipelineCtx.currentPipeline);
              });

            break;

          case GATEWAY_CONST.POLICY_TYPE:
            $scope.policyCtx.viewTitle = 'Policy';
            $scope.policyCtx.currentPolicy = GatewayServices.getPolicyById($scope.gatewayCtx.currentInstanceId)
              .then(function(policy) {
                $scope.policyCtx.currentPolicy = policy;
                $scope.policyCtx.originalInstance = angular.copy(policy);
              });

            break;

          default:

        }
      }
      setView();
    }

    function setView() {
        if ($scope.gatewayCtx.currentView) {
          //$scope.refreshDataSets();
          switch($scope.gatewayCtx.currentView) {
            case GATEWAY_CONST.MAPPING_TYPE:
              if (!$scope.gatewayCtx.currentInstanceId) {
                $scope.gatewayCtx.viewTitle = 'Mappings';
              }
              else {
                $scope.gatewayCtx.viewTitle = 'Mapping';
              }
              $scope.gatewayCtx.isShowGatewayMapView = true;
              $scope.gatewayCtx.isShowPipelineView = false;
              $scope.gatewayCtx.isShowPolicyView = false;


              break;
            case GATEWAY_CONST.PIPELINE_TYPE:
              if (!$scope.gatewayCtx.currentInstanceId) {
                $scope.gatewayCtx.viewTitle = 'Pipelines';
              }
              else {
                $scope.gatewayCtx.viewTitle = 'Pipeline';
              }
              $scope.gatewayCtx.isShowGatewayMapView = false;
              $scope.gatewayCtx.isShowPipelineView = true;
              $scope.gatewayCtx.isShowPolicyView = false;



              break;
            case 'policy':
              if (!$scope.gatewayCtx.currentInstanceId) {
                $scope.gatewayCtx.viewTitle = 'Policies';
              }
              else {
                $scope.gatewayCtx.viewTitle = 'Policy';
              }
              $scope.gatewayCtx.isShowGatewayMapView = false;
              $scope.gatewayCtx.isShowPipelineView = false;
              $scope.gatewayCtx.isShowPolicyView = true;



              break;
            default:

          }


        }

    }

    $scope.setMainNav = function(view, id) {
      $rootScope.$emit('hide-popup-help');

      $scope.gatewayCtx.currentView = view;
      if (id) {
        $scope.gatewayCtx.currentInstanceId = id;
      }
      else {
        $scope.gatewayCtx.currentInstanceId = null;
        $scope.gatewayMapCtx.originalInstance = {};
        $scope.policyCtx.originalInstance = {};
        $scope.pipelineCtx.originalInstance = {};
        $scope._refreshDataSets();
      }
      $scope.main();
    };
  }
]);



