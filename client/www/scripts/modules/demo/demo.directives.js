// Copyright StrongLoop 2014
Demo.directive('slDemoMainNav', [
  function() {
    return {
      controller: function($scope, ModelService, $stateParams) {
        $scope.httpMethod = 'POST';
        $scope.formMode = 'new';
        $scope.modelRef = $stateParams.modelName;
        if ($scope.modelRef) {

        }

        $scope.appModels = ModelService.getAllModels();
        $scope.appModels.
          then(function (result) {

            $scope.appModels = result;

          }
        );
      },
      link: function(scope, el, attrs) {
        scope.$watch('appModels', function(appModels) {
          React.renderComponent(DemoModelNav({scope:scope}), el[0]);
        }, true);
        scope.$watch('modelRef', function(modelRef) {

        }, true);
      }
    }
  }
]);
Demo.directive('slDemoMainForm', [
  'ModelService',
  function(ModelService) {
    return {
      controller: function($scope, $stateParams, ModelService) {

        $scope.modelRef = $stateParams.modelName;
        $scope.currFormData = {};
        if ($scope.modelRef) {

          $scope.curFormData = ModelService.getModelByName($scope.modelRef);
          var propertiesCount = 0;
          if ($scope.currFormData.props && $scope.currFormData.props.properties) {

            propertiesCount = $scope.currFormData.props.properties.length;

          }

          for (var i = 0;i < propertiesCount;i++) {

          }


          // render form based on model properties



        }
      },
      link: function(scope, el, attrs) {
        scope.$watch('curFormData', function(data) {
          React.renderComponent(DemoForm({scope:scope}), el[0]);
        }, true);
        scope.$watch('curFormData.props', function(data) {
          React.renderComponent(DemoForm({scope:scope}), el[0]);
        }, true);
        scope.$watch('modelRef', function(modelRef) {
          if (modelRef) {
            // get the model definition
            scope.curFormData = ModelService.getModelByName(modelRef);
            React.renderComponent(DemoForm({scope:scope}), el[0]);
          }

        }, true);
        scope.$watch('targetModelDef', function(modelDef) {
          React.renderComponent(DemoForm({scope:scope}), el[0]);
        }, true);
      }
    }
  }
]);
Demo.directive('slDemoMainGrid', [
  function() {
    return {
      template: '<div class="demo-data-grid"  ng-grid="demoDataGridOptions"></div>',
      controller: function($scope, $stateParams, $timeout, $http, ModelService) {
        $scope.modelData = {};

        $scope.modelRef = $stateParams.modelName;

        $scope.colDefs = [];
        $scope.demoDataGridOptions = {
          data: 'modelData',
          columnDefs: 'colDefs',
          selectedItems:  $scope.tableSelections,
          multiSelect: false,
          filterOptions: $scope.filterOptions
        };

        $scope.demoEdit = function(item) {

          $scope.formMode = 'edit';
          $scope.httpMethod = 'PUT';
          var modelDef = ModelService.getModelByName($scope.modelRef);
          if (modelDef.props && modelDef.props.properties) {
            for (var i = 0;i < modelDef.props.properties.length;i++) {
              if (item.entity[modelDef.props.properties[i].name]) {
                modelDef.props.properties[i].value = item.entity[modelDef.props.properties[i].name];
              }
              else {
                modelDef.props.properties[i].value = '';

              }
            }
          }
          // get the model definition here
          // loop over the properties
          // assign values where they are found
          // empty values for non
          $scope.curFormData = modelDef;

        };
        $scope.demoDelete = function(item) {
          if (confirm('delete this item?')) {
            $scope.httpMethod = 'DELETE';
            var reqObj = {
              method:$scope.httpMethod,
              path:'/api/',
              endPoint:$scope.modelRef,
              id:item.entity.id
            };
            $scope.demoRestApiRequest(reqObj);
            $scope.loadModelData($scope.modelRef);
            $scope.curFormData = {};
          }

        };
        $scope.clearForm = function() {
          $scope.formMode = 'new';
          $scope.curFormData = {};

        };

        if ($scope.modelRef) {
          // load model data
          $scope.loadModelData($scope.modelRef);
        }




      },
      link: function(scope, el, attrs) {

        scope.$watch('modelRef', function(modelRef) {

          if (modelRef) {
            scope.loadModelData(modelRef);
            scope.demoDataGridOptions = {
              data: 'modelData',
              columnDefs:  'colDefs',
              multiSelect: false
            };
          }

        }, true);
        scope.$watch('modelData', function(data) {

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

