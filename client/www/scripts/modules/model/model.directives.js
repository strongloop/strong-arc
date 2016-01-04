// Copyright StrongLoop 2014
/*
 *
 * Model Editor Main
 *
 *
 * */
Model.directive('slModelEditor', [
  function() {
    return {
      templateUrl: './scripts/modules/model/templates/model.editor.html',
      controller: ['$scope', '$log',
        function($scope, $log) {

          // TODO - remove as it seems redundant
          $scope.processModelNameValue = function() {
            $scope.saveModelInstance();
          };
          $scope.isJNameValid = function() {
            return /^[\-_a-zA-Z0-9]+$/.test($scope.activeInstance.definition.name);
          };
          $scope.saveModelInstance = function() {
            if ($scope.isNameValid($scope.activeInstance.definition.name)) {
              $scope.saveModelInstanceRequest($scope.activeInstance);
            }
          };
          $scope.setBaseForDataSource = function() {

            var modelDef = $scope.activeInstance.definition;
            var modelConfig = $scope.activeInstance.config;
            var base = modelDef.base;
            var baseIsDefault = base === CONST.NEW_MODEL_BASE;
            var noDataSourceSelected = modelConfig.dataSource === CONST.DEFAULT_DATASOURCE;

            if(noDataSourceSelected) {
              $scope.activeInstance.base = CONST.NEW_MODEL_BASE;
            } else {
              $scope.activeInstance.base = CONST.DEFAULT_DATASOURCE_BASE_MODEL;
            }

          };
          $scope.handleBaseBlur = function() {

            if(!$scope.activeInstance.base) {
              $scope.setBaseForDataSource();
            }
          };
         }
      ]
    }
  }
]);
Model.directive('slModelMigrate', [
  function() {
    return {
      templateUrl: './scripts/modules/model/templates/model.migrate.html',
      controller: ['$scope', '$log', function($scope, $log) {
          $scope.canMigrate = function() {
            return $scope.activeInstance.canMigrate;
          };
          $scope.migrateModel = function() {
            if ($scope.activeInstance.config.dataSource === CONST.DEFAULT_DATASOURCE) {
              $scope.activeInstance.config.dataSource = null;
            }
            $scope.migrateModelConfig($scope.activeInstance.config);
          };
        }
      ]
    }
  }
]);
/*
 * DataTypeSelect - Component to manage property 'type' value
 * - type value can be a wide variety of patterns including:
 * -- string
 * -- js object
 * -- model name reference
 * -- array of any of the above
 *
 * - it is possible users may edit the json directly in the project
 *     in a way that isn't possible via the gui - generally in the form of
 *     'anonymous' js object patterns
 *     eg:
 {
 "x": {
 "type": "number"
 },
 "y": {
 "type": "string"
 }
 }
 * - these can be direct type values or arrays of these patterns
 * - if an 'anonymous' object pattern is detected it is displayed read only
 * - if the user tries to change the value of a property type that includes an
 *     anonymous js object pattern they will be alerted that the current value
 *     will be destroyed if they continue
 *
 * This component may display 2 select components if the data type is an array
 *   so the user can choose the type of array
 * - DataTypeSelectOptions
 *
 * If the value is an ajop either directly or in an array, a control is displayed to
 *   allow the user to view the object pattern
 *
* Model Property Type Value Examples:
*
*   "properties": {
       "should-be-date": {
        "type": "date"
       },
       "should-be-prim-array": {
        "type": "array"
       },
       "should-be-array-of-anon": {
         "type": [
           {
             "x": {
               "type": "number"
             },
             "y": {
               "type": "string"
             }
           }
         ]
       },
       "should-be-string": {
        "type": "string"
       },
       "should-be-array-of-otherModel": {
         "type": [
            "otherModel"
           ]
       },
       "should-be-anon-obj": {
         "type": {
           "x": {
            "type": "number"
           },
           "y": {
            "type": "number"
           }
         }
       },
       "should-be-array-of-boolean": {
         "type": [
          "boolean"
         ]
       },
       "should-be-other-model": {
        "type": "otherModel"
      }
   },
*
* */
Model.directive('slPropertyDataTypeSelect', [
  function() {
    return  {
      restrict: 'E',
      replace: true,
      templateUrl: './scripts/modules/model/templates/model.property.data-type.html',
      controller: ['$scope', '$log', function($scope, $log) {

        $scope.updateDataTypeConditions = function() {
          $scope.isArray = ($scope.getDataTypeString($scope.property.type) === 'array');
          $scope.isAnonObject = $scope.isAnonObj($scope.property.type);
          $scope.arrayType =  $scope.getArrayType($scope.property.type);
          $scope.val = $scope.getDataTypeString($scope.property.type);
          $scope.displayType = $scope.getDataTypeString($scope.property.type);
          $scope.showObjDetails = false;
        };

        $scope.getDataType = function(property) {
          return $scope.getDataTypeString(property.type);
        };

        $scope.toggleAnonObjectDetails = function() {
          $scope.showObjDetails = !$scope.showObjDetails;
        };
        $scope.isNameValid = function() {
          var retVal = /^[\-_a-zA-Z0-9]+$/.test($scope.property.name);
          return retVal;
        };
        $scope.deleteModelProperty = function() {

          if ($scope.property && $scope.property.id) {
            $scope.deleteModelPropertyRequest($scope.property);

          }

        };
        $scope.handleChange = function(value) {

          var updateModelPropertyConfig = {};

          $scope.property.type = value;

          if ($scope.property.id) {
            var currProperties = $scope.activeInstance.properties;
            // get the index of this particular property
            // put an object together to pass to the update method
            // properties, property, index
            updateModelPropertyConfig = {
              propertyConfig: $scope.property,
              currProperties: currProperties
            };

            if ($scope.isAnonObject) {

              if (confirm('This value has been edited outside the scope of this gui.  ' +
                'If you change it the existing value will be lost. Continue?')) {
                $log.log('update property element');

                if ($scope.isNameValid()) {
                  $scope.updateModelPropertyRequest(updateModelPropertyConfig);
                }
              }
            }
            else {
              if ($scope.isNameValid()) {
                $scope.updateModelPropertyRequest(updateModelPropertyConfig);
              }
            }
          }
          else {
            $log.warn('There is no id: ' + JSON.stringify(updateModelPropertyConfig));
          }

          $scope.updateDataTypeConditions();
        };
        $scope.handleArrayTypeChange = function(value) {

          if ($scope.isAnonObject) {

            if (confirm('This value has been edited outside the scope of this gui. ' +
              'If you change it the existing value will be lost. Continue?')) {
              $scope.updatePropertyType(value);
            }
          }
          else {
            $scope.updatePropertyType(value);
          }
        };

        $scope.updatePropertyType = function(value) {

          $scope.property.type = [value];

          var currProperties = $scope.activeInstance.properties;
          // get the index of this particular property
          // put an object together to pass to the update method
          // properties, property, index
          updateModelPropertyConfig = {
            propertyConfig: $scope.property,
            currProperties: currProperties
          };

          if ($scope.isNameValid()) {
            $scope.updateModelPropertyRequest(updateModelPropertyConfig);
          }

        };

        $scope.updateDataTypeConditions();
      }]
    }
  }
]);
Model.directive('slModelPropertiesEditor',[
  'modelPropertyTypes',
  '$timeout',
  '$log',
  '$q',
  function(modelPropertyTypes, $timeout, $log, $q) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: './scripts/modules/model/templates/model.properties.editor.html',
      controller: ['$scope', 'growl', '$log', function($scope, growl, $log) {
        $scope.earlyNewPropertyWarning = function() {
          growl.addWarnMessage('you should name your model first');
        };

        $scope.isNameValid = function(name) {
          var retVal = /^[\-_a-zA-Z0-9]+$/.test(name);
          return retVal;
        };

        $scope.getArrayType = function(value) {

          var retVal = 'any'; // default
          var typeString = $scope.getDataTypeString(value);
          if (typeString === 'array') {
            var propType = value;
            if (Array.isArray(propType)) {
              retVal = propType[0];
              if (typeof retVal === 'object') {
                retVal = Array.isArray(retVal)? 'array' : 'object';
              }
            }
          }
          return retVal;
        };
        $scope.getDataTypeString = function(value) {
          if (Array.isArray(value)) {
            return 'array';
          }

          return value;
        };
        $scope.getAppModelNames = function() {
          var retVal = [];
          if ($scope.mainNavModels){
            $scope.mainNavModels.map(function(model) {
              retVal.push(model.name);
            });
          }
          return retVal;
        };

        $scope.isAnonObj = function(tO) {
          return tO === 'object';
        };

        $scope.triggerModelPropertyUpdate = function(property) {

          updateModelPropertyConfig = {
            propertyConfig: property,
            currProperties: $scope.activeInstance.properties
          };
          if ($scope.isNameValid(property.name)) {
            $scope.updateModelPropertyRequest(updateModelPropertyConfig);
          }
        };

        $scope.isModelInstancePropertiesActive = true;
        $scope.modelPropertyTypes = [];

        $q.when($scope.mainNavModels)
          .then(function(models) {
            $scope.modelPropertyTypes = modelPropertyTypes.concat(
              models.map(function(model) {
                return model.name;
              })
            );
          });
      }],
      link: function(scope, el, attrs) {
        $timeout(function() {
          window.setScrollView('[data-id="ModelEditorInstanceContainer"]');
        }, 400);
        window.onresize = function() {
          window.setScrollView('[data-id="ModelEditorInstanceContainer"]');
        };

        scope.toggleModelPropertiesView = function() {
          scope.isModelInstancePropertiesActive = !scope.isModelInstancePropertiesActive;
        };

      }
    }
  }
]);

/*
*
*   Model Instance Editor
*
* */
Model.directive('slModelInstanceEditor', [
  'ModelService',
  function(ModelService) {
    return {
      templateUrl: './scripts/modules/model/templates/model.instance.editor.html',
      controller: function($scope) {


      },
      link: function(scope, el, attrs) {

      }
    }
  }
]);
