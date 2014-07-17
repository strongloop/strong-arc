// Copyright StrongLoop 2014
Demo.directive('slDemoMainNav', [
  function() {
    return {
      controller: function($scope, ModelService, $stateParams) {
        $scope.httpMethod = 'POST';
        $scope.formMode = 'new';
        $scope.modelRef = $stateParams.modelName;
        if ($scope.modelRef) {
          console.log('DEMO THIS MODEL: ' + $scope.modelRef);
        }

        $scope.appModels = ModelService.getAllModels();
        $scope.appModels.
          then(function (result) {
            console.log('MODELS: ' + JSON.stringify(result));
            $scope.appModels = result;

          }
        );
      },
      link: function(scope, el, attrs) {
        scope.$watch('appModels', function(appModels) {
          React.renderComponent(DemoModelNav({scope:scope}), el[0]);
        }, true);
        scope.$watch('modelRef', function(modelRef) {
          console.log('[nav] model ref changed');
        }, true);
      }
    }
  }
]);
Demo.directive('slDemoMainForm', [
  function() {
    return {
      template: '<div>form: {{modelRef}}</div>',
      controller: function($scope, $stateParams, ModelService) {
        console.log('Demo Main form directive controller');
        $scope.modelRef = $stateParams.modelName;
        $scope.targetModelDef = {};
        if ($scope.modelRef) {
          console.log('slDemoMainForm THIS MODEL: ' + $scope.modelRef);

          $scope.targetModelDef = ModelService.getModelByName($scope.modelRef);

          // render form based on model properties



        }
      },
      link: function(scope, el, attrs) {
        scope.$watch('targetModelDef', function(modelDef) {
          console.log('[form] model ref changed');
          React.renderComponent(DemoForm({scope:scope,modelDef:modelDef}), el[0]);
        }, true);
      }
    }
  }
]);
Demo.directive('slDemoMainGrid', [
  function() {
    return {
      template: '<div class="demo-data-grid"  ng-grid="demoDataGridOptions"></div>',
      controller: function($scope, $stateParams, $timeout, $http) {
        console.log('Demo Main Grid directive controller');
        $scope.modelData = {};

        $scope.modelRef = $stateParams.modelName;

        $scope.colDefs = [];
        $scope.demoDataGridOptions = {
          data: 'modelData',
          columnDefs: 'colDefs',
          selectedItems:  $scope.tableSelections,
          multiSelect: true,
          filterOptions: $scope.filterOptions
        };

        $scope.demoEdit = function(item) {
          console.log('EDIT THIS ITEM: ' + JSON.stringify(item.entity));
          $scope.formMode = 'edit';
          $scope.httpMethod = 'PUT';
        };
        $scope.demoDelete = function(item) {
          if (confirm('delete this item?')) {
            console.log('DELETE THIS ITEM: ' + JSON.stringify(item.entity));
            $scope.httpMethod = 'DELETE';
            var reqObj = {
              method:$scope.httpMethod,
              path:'/api/',
              endPoint:$scope.modelRef,
              id:item.entity.id
            };
            $scope.demoRestApiRequest(reqObj);
          }

        };
        $scope.clearForm = function() {
          console.log('clear the form');
          $scope.formMode = 'new';

        };




        $scope.demoRestRequest = function(modelRef) {
          console.log('demo rest request:  ' + modelRef);
          var config = {
            method: 'GET',
            url: '/api/' + modelRef +'s'
          };
//          if (isPayloadTypeRequest(requestObj)) {
//            config.data = requestObj.data;
//          }



          $http(config).
            success( function(response) {
              $scope.colDefs = [];
              $scope.modelData = response;

              if (response.length > 0) {
                var defRow = response[0];
                angular.forEach(defRow, function(value, key){
                  $scope.colDefs.push({field:key,displayName:key});
                });
                $scope.colDefs.push({field: '', cellTemplate: '<button ng-click="demoEdit(row)">Edit</button>'});
                $scope.colDefs.push({field: '', cellTemplate: '<button ng-click="demoDelete(row)">Delete</button>'});
              }
//
//              $scope.colDefs = [
//                {field:'id', displayName:'id'},
//                {field:'name', displayName:'name'},
//                {field:'value',displayName:'value'}
//              ];
            }).
            error(function(response) {
              console.warn('bad demo rest get request ');

            });
        };



      },
      link: function(scope, el, attrs) {
        scope.$watch('modelData', function(modelRef) {
          console.log('[grid] model ref changed');
          scope.demoRestRequest('car');
          scope.demoDataGridOptions = {
            data: 'modelData',
            columnDefs:  'colDefs',
            multiSelect: false
          };
        }, true);
      }
    }
  }
]);

