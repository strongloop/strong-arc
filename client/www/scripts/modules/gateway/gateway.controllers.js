Gateway.controller('GatewayMainController', [
  '$scope',
  '$log',
  'GatewayServices',
  '$timeout',
  '$state',
  '$stateParams',
  '$location',
  '$modal',
  function($scope, $log, GatewayServices, $timeout, $state, $stateParams, $location, $modal) {


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
            delete pipeline.renderPolicies;
            GatewayServices.savePipeline(pipeline)
              .$promise
              .then(function(data) {
                $scope.pipelineCtx.newPipeline = {};
                refreshPipelines();
              });

            /**
             * refresh the user's pipelines list in nav
             */
            function refreshPipelines() {
              $scope.pipelineCtx.pipelines = GatewayServices.getPipelines()
                .then(function(data) {
                  $scope.pipelineCtx.pipelines = data;
                  $scope.pipelineCtx.pipelines.map(function(pipeline){
                    pipeline.renderPolicies = pipeline.policyIds.map(function(policyId){
                      return getPipelineRenderPolicy(policyId);
                    });
                  })
                });
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

          case 'pipeline':
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
                .then(function(response) {
                  $scope.close();
                  $scope.refreshDataSets();
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
          $scope.gatewayMapCtx.currentGatewayMap = {};
          $scope.title = title;
          $scope.close = function() {
            $modalInstance.dismiss();
          };
          $scope.saveNewGatewayMap = function(map) {
            $scope.close();
            if (map.name && map.endpoint) {

              if (!map.verb) {
                map.verb = 'ALL';
              }

              if (map.pipelineId) {
                GatewayServices.saveGatewayMap(map)
                  .$promise
                  .then(function(map) {
                    $state.go('gateway');
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
            $scope.close();
            if (policy.name && policy.type) {

              GatewayServices.savePolicy(policy)
                .$promise
                .then(function(policy) {
                  $state.go('policy');
                 });
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
    $scope.isShowScopesCrud = false;
    $scope.showScopesCrud = function() {
      $scope.isShowScopesCrud = !$scope.isShowScopesCrud;
    };
    $scope.gatewayCtx = {};

    function getPipelineRenderPolicy(policyId) {
      return _.findWhere($scope.policyCtx.policies, { id: policyId });
    }

    $scope.getPipelineRenderPolicy = getPipelineRenderPolicy;


    function inflatePipelinePolicies(pipeline) {
      pipeline.policies = [];
      pipeline.policyIds.map(function(policyId) {
        var inflatedPolicy = getPipelineRenderPolicy(policyId);
        pipeline.policies.push(inflatedPolicy);
      });
      return pipeline;
    }


    function getPipelineDetail(argId) {
      for (var i = 0;i < $scope.gatewayMapCtx.currentPipelines.length;i++) {
        var cPipeline = $scope.gatewayMapCtx.currentPipelines[i];
        if (cPipeline.id === argId) {
          var retVal = inflatePipelinePolicies(cPipeline);
          return retVal;
        }
      }
    }
    /*
    *
    * Refresh collections
    *
    * */

    $scope.$watch('pipelineCtx.pipelines', function(newVal){
      $log.log('watcher pipelines', newVal);
    }, true);

    $scope.refreshDataSets = function() {
      $log.log('refreshDataSets');

      return GatewayServices.getPolicies()
        .then(function(policies) {
          $scope.policyCtx.policies = policies;
          $scope.pipelineCtx.policies = policies;
          $scope.gatewayMapCtx.currentPolicies = policies;

        }).then(getPipelines)
          .then(getGatewayMaps)
        .then(function() {

        //  $scope.main();
        });


      function getPipelines(){
        return GatewayServices.getPipelines()
          .then(function(pipelines) {
            $log.debug('|  refresh pipelines: ' + pipelines.length);
            $scope.pipelineCtx.pipelines = [];

            pipelines.map(function(pipeline){
              pipeline.renderPolicies = [];

              pipeline.policyIds.map(function(policyId){
                var policy = getPipelineRenderPolicy(policyId);

                pipeline.renderPolicies.push(policy);
              });
            });

            $log.log('official pipelines 1', angular.extend({}, pipelines));

            //$timeout(function(){
              $log.log('official pipelines 2', angular.extend({}, pipelines));
              $scope.pipelineCtx.pipelines = pipelines;
              $scope.gatewayMapCtx.currentPipelines = pipelines;
            //}, 100);
          });
      }

      function getGatewayMaps(){
        return GatewayServices.getGatewayMaps()
          .then(function(maps) {
            $log.debug('|  refresh maps: ' + maps.length);
            maps.map(function(map) {
              map.pipeline = getPipelineDetail(map.pipelineId);
            });
            $scope.gatewayMapCtx.gatewayMaps = maps;

            window.triggerResizeUpdate();
          });
      }
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
        newGatewayMap: {},
        gatewayMaps: [],
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
            id: 'ratelimiting',
            name: 'Rate Limit',
            description: ''
          },
          {
            id: 'reverseproxy',
            name: 'Proxy',
            description: ''

          }
        ]
      };

      $scope.refreshDataSets();


    }();
    $scope.main = function() {
      /*
       * Retrieve instance data if context id is present
       * */
      if ($scope.gatewayCtx.currentInstanceId) {
        switch($scope.gatewayCtx.currentView) {

          case 'gatewaymap':
            $scope.gatewayMapCtx.currentGatewayMap = GatewayServices.getGatewayMapById($scope.gatewayCtx.currentInstanceId)
              .then(function(map) {
                if (map.pipelineId) {
                  map.pipeline = getPipelineDetail(map.pipelineId);
                }
                $scope.gatewayMapCtx.currentGatewayMap = map;
              });
            break;

          case 'pipeline':
            $scope.pipelineCtx.currentPipeline = GatewayServices.getPipelineById($scope.gatewayCtx.currentInstanceId)
              .then(function(pipe) {
                $scope.pipelineCtx.currentPipeline = pipe;
                $scope.pipelineCtx.currentPipeline.renderPolicies = $scope.pipelineCtx.currentPipeline.policyIds.map(function(policyId){
                  return getPipelineRenderPolicy(policyId);
                });
              });

            break;

          case 'policy':
            $scope.policyCtx.viewTitle = 'Policy';
            $scope.policyCtx.currentPolicy = GatewayServices.getPolicyById($scope.gatewayCtx.currentInstanceId)
              .then(function(policy) {
                $scope.policyCtx.currentPolicy = policy;
              });

            break;

          default:

        }
      }
      setView();
    }
    function setView() {
     // $timeout(function() {
        if ($scope.gatewayCtx.currentView) {
          //$scope.refreshDataSets();
          switch($scope.gatewayCtx.currentView) {
            case 'gatewaymap':
              if (!$scope.gatewayCtx.currentInstanceId) {
                $scope.policyCtx.viewTitle = 'Gateway Maps';
              }
              else {
                $scope.policyCtx.viewTitle = 'Gateway Map';
              }
              $scope.gatewayCtx.isShowGatewayMapView = true;
              $scope.gatewayCtx.isShowPipelineView = false;
              $scope.gatewayCtx.isShowPolicyView = false;


              break;
            case 'pipeline':
              if (!$scope.gatewayCtx.currentInstanceId) {
                $scope.policyCtx.viewTitle = 'Pipelines';
              }
              else {
                $scope.policyCtx.viewTitle = 'Pipeline';
              }
              $scope.gatewayCtx.isShowGatewayMapView = false;
              $scope.gatewayCtx.isShowPipelineView = true;
              $scope.gatewayCtx.isShowPolicyView = false;



              break;
            case 'policy':
              if (!$scope.gatewayCtx.currentInstanceId) {
                $scope.policyCtx.viewTitle = 'Policies';
              }
              else {
                $scope.policyCtx.viewTitle = 'Policy';
              }
              $scope.gatewayCtx.isShowGatewayMapView = false;
              $scope.gatewayCtx.isShowPipelineView = false;
              $scope.gatewayCtx.isShowPolicyView = true;



              break;
            default:

          }


        }

     // });

    }
    $scope.setMainNav = function(view, id) {
      $scope.gatewayCtx.currentView = view;
      if (id) {
        $scope.gatewayCtx.currentInstanceId = id;
      }
      else {
        $scope.gatewayCtx.currentInstanceId = null;
      }
      $scope.refreshDataSets()
        .then(function() {
          setView();
        });
    };
  }
]);



