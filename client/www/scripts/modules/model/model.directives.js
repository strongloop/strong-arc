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
 *
 * MODEL BASE EDITOR  (DETAILS)
 *
 * */
Model.directive('modelBaseEditor',[
  function() {
    return {
      link: function(scope, el, attrs) {

        // scope = scope.$parent;
        scope.isModelInstanceBasePropertiesActive = true;

        scope.toggleModelDetailView = function() {
          scope.isModelInstanceBasePropertiesActive = !scope.isModelInstanceBasePropertiesActive;
        };

        scope.currProperty = {};

        function renderComp() {
          var model = scope.activeInstance;
          React.renderComponent(ModelDetailEditor({scope: scope, model: model }), el[0]);

        }

        scope.$watch('isModelInstanceBasePropertiesActive', function(val) {
          renderComp();
        });

        scope.$watch('activeInstance', function(val) {
          renderComp();
        }, true);
      }
    }
  }
]);
/*
 *
 * MODEL PROPERTIES EDITOR
 *
 * */
Model.directive('modelPropertiesEditor',[
  'modelPropertyTypes',
  function(modelPropertyTypes) {
    return {
      controller: function($scope, growl) {
        $scope.earlyNewPropertyWarning = function() {
          growl.addWarnMessage('you should name your model first');
        };
      },
      link: function(scope, el, attrs) {

        scope.isModelInstancePropertiesActive = true;
        scope.modelPropertyTypes = modelPropertyTypes;
        for (var i = 0;i < scope.mainNavModels.length;i++) {
          scope.modelPropertyTypes.push(scope.mainNavModels[i].name);
        }

        function renderComp() {
          if (!scope.properties) {
            scope.properties = [];
          }
          React.renderComponent(ModelPropertiesEditor({scope:scope}), el[0]);

        }



        scope.toggleModelPropertiesView = function() {
          scope.isModelInstancePropertiesActive = !scope.isModelInstancePropertiesActive;
        };
        scope.$watch('isModelInstancePropertiesActive', function(val) {
          if (!scope.activeInstance.properties) {
            scope.activeInstance.properties = [];
          }
          renderComp();
        }, true);


        scope.$watch('activeModelPropertiesChanged', function(val) {
          if (!scope.activeInstance.properties) {
            scope.activeInstance.properties = [];
          }
          renderComp();

        }, true);
        scope.$watch('activeInstance', function(activeInstance) {
          if (!scope.activeInstance.properties) {
            scope.activeInstance.properties = [];
          }
          renderComp();
        }, true);
      }
    }
  }
]);
Model.directive('slPropertyDataTypeSelectOptions', [
  function() {
    return  {
      restrict: 'E',
      replace: true,
      templateUrl: './scripts/modules/model/templates/model.property.data-type.options.html'
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

        $scope.isArray = ($scope.getDataTypeString($scope.property.type) === 'array');
        $scope.isAnonObject = $scope.isAnonObj($scope.property.type);
        $scope.arrayType =  $scope.getArrayType($scope.property.type);
        $scope.val = $scope.getDataTypeString($scope.property.type);
        $scope.displayType = $scope.getDataTypeString($scope.property.type);
        $scope.showObjDetails = false;

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
                $log('update property element');

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
      }]
    }
  }
]);
Model.directive('slModelPropertiesEditor',[
  'modelPropertyTypes',
  '$timeout',
  '$log',
  function(modelPropertyTypes, $timeout, $log) {
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
          var retVal = value;
          if (typeof retVal === 'object') {
            retVal = Array.isArray(retVal)? 'array' : 'object';
          }
          return retVal;
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

        $scope.isAnonObj = function(value) {
          var isAnonObject = false;
          var tO = (typeof value);
          if (tO !== 'object') {
            return isAnonObject;
          }
          var isArray = Array.isArray(value)? true : false;

          // if not object, may be an array of anon obj
          if (isArray) {
            if (typeof value[0] === 'object') {
              isAnonObject = true;
            }
          }
          else {
            isAnonObject = true;
          }
          return isAnonObject;
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
        $scope.modelPropertyTypes = modelPropertyTypes;
        for (var i = 0;i < $scope.mainNavModels.length;i++) {
          $scope.modelPropertyTypes.push($scope.mainNavModels[i].name);
        }

        $scope.currentlPropertyTypes = $scope.modelPropertyTypes;
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
 *   Model Property Pocket Editor
 * */
//Model.directive('modelPropertyPocketEditor', [
//  function() {
//    return {
//      link: function(scope, el, attrs) {
//        React.renderComponent(ModelPropertyPocketEditor({scope:scope}), el[0]);
//      }
//    }
//  }
//]);

/*
 *
 * Pocket Editor Popover
 *
 * */
Model.directive('pocketEditorPopover',[
  function() {
    return {
      restrict: "E",
      replace: true,
      transclude: true,
      templateUrl: './scripts/modules/model/templates/editor.popover.html',
      scope: {
        editorName: '@name'
      },
      link: function (scope, el, attrs) {
        scope.isPocketPopoverActive = false;
        scope.togglePopover = function() {
          scope.isPocketPopoverActive = !scope.isPocketPopoverActive;
        }
      }
    };
  }
]);

/*
 *   Model Pocket Editor Container
 * */
Model.directive('modelPocketEditorContainer', [
  function() {
    return {
      link: function(scope, el, attrs) {

        scope.$watch('activeInstance', function(model) {
          React.renderComponent(ModelPocketEditorContainer({scope:scope}), el[0]);
        });

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
 /*
 *
 * MODEL SAMPLE FORM
 *
 * */
Model.directive('modelSampleForm', [
  function() {
    return {
      template: '<div uiform-form-builder ></div>',
      link: function(scope, elem, attrs) {
        scope.$watch('dmodels', function(models) {
          scope.formFields = models;
        }, true);
      }
    }
  }
]);
/*
 *   Property Comments Editor
 * */
Model.directive('propertyCommentEditor', [
  function() {
    return {
      link: function(scope, el, attrs) {
        var x = scope;
        var y = scope.property.props.doc;
        var t = y;
        scope.$watch('property.props.doc', function(oldVal, doc) {
          React.renderComponent(PropertyCommentEditor({scope:scope, doc:doc}), el[0]);
        });
      }
    }
  }
]);
/*
 *
 * property-connection-editor
 *
 * */
Model.directive('propertyConnectionEditor', [
  function() {
    return {
      link: function(scope, el, attrs) {
        scope.$watch('currModel', function(model) {
          React.renderComponent(PropertyConnectionEditor({scope: scope}), el[0]);
        });
      }
    }
  }
]);
/*
 *
 *
 *   MODEL RELATIONS EDITOR
 *
 * */
Model.directive('modelRelationsEditor', [
  function() {
    return {
      templateUrl: './scripts/modules/model/templates/model.relations.editor.html',
      link: function(scope, elem, attrs) {
        scope.relationsEditorActive = false;

        scope.isRelationsEditorActive = function() {
          return scope.relationsEditorActive;
        }

        scope.currRelation = {
          isUnique:false
        };
        scope.newRelationsMaxNameLen = 0;

        scope.deactivateRelationsEditor = function(){
          scope.relationsEditorActive = false;
        };
        scope.isAddRelationsButtonDisabled = function() {
          if (!scope.relationsEditorActive){
            return false;
          }
          return !scope.currRelation.isUnique;
        };

        scope.checkUniqueRelationStatus = function() {
          if (scope.currRelation.name){
            if (!scope.currRelation.isUnique) {
              return true;
            }
          }
          return false;
        };
        scope.addRelation = function(value){

          if (!scope.relationsEditorActive) {
            scope.relationsEditorActive = true;
            Focus('relationsEditInit');
            return;
          }


          if (scope.currRelation.isUnique){
            scope.currRelation.type = scope.baseDataType.name;
            if (!scope.currModel.options){
              scope.currModel.options = [];
            }
            scope.currModel.options.relations.push(scope.currRelation);
            scope.currRelation = {
              isUnique:false
            };
            Focus('relationsEditInit');
          }

        };

      }
    }
  }
]);
/*
 *
 *
 *   MODEL ACL EDITOR
 *
 * */
Model.directive('modelAclEditor', [
  function() {
    return {
      templateUrl: './scripts/modules/model/templates/model.acl.editor.html',
      link: function(scope, elem, attrs) {
        scope.aclEditorActive = false;

        scope.isAclEditorActive = function() {
          return scope.aclEditorActive;
        }

        scope.currAcl = {
          isUnique:false
        };
        scope.newAclMaxNameLen = 0;

        scope.deactivateEditor = function(){
          scope.aclEditorActive = false;
        };
        scope.isAddAclButtonDisabled = function() {
          if (!scope.aclEditorActive){
            return false;
          }
          return !scope.currAcl.isUnique;
        };

        scope.checkUniqueAclStatus = function() {
          if (scope.currAcl.name){
            if (!scope.currAcl.isUnique) {
              return true;
            }
          }
          return false;
        };
        scope.addAcl = function(value){

          if (!scope.aclEditorActive) {
            scope.aclEditorActive = true;
            Focus('aclEditInit');
            return;
          }


          if (scope.currAcl.isUnique){
            scope.currAcl.type = scope.baseDataType.name;
            scope.currModel.acl.push(scope.currAcl);
            scope.currOAcl = {
              isUnique:false
            };
            Focus('aclEditInit');
          }

        };

      }
    }
  }
]);

/*
 *
 *
 * Schema Model Composer
 *
 * */
Model.directive('schemaModelComposer', [
  '$state',
  '$modal',
  function($state, $modal) {
    return {
      templateUrl: './scripts/modules/model/templates/model.schema.composer.html',

      link: function(scope, elem, attrs) {

        scope.property = 'checked';
        scope.generateModelFromDataSource = function() {
          if (confirm('generate model?')) {
           // $state.transitionTo('uiform', {name:'test'});

          }
        };
        scope.collection = [];
        scope.$watch('apiSourceTables', function(sourceTables) {
          scope.collection = sourceTables;
          scope.property = 'checked';
        }, true);

        scope.getTableData = function(item) {
        };
        scope.newModel = {
          properties: []
        };
        scope.checkAll = function() {
          //scope.newModel.properties = angular.copy(scope.roles);
        };
        scope.uncheckAll = function() {
          scope.user.roles = [];
        };
        scope.checkFirst = function() {
          scope.newModel.properties.splice(0, scope.newModel.properties.length);
          // scope.user.roles.push(scope.roles[0]);
        };
      }
    }
  }
]);
/*
 * Property Name Editor
 * */
Model.directive('propertyNameEditor', [
  function() {
    return {
      replace: true,
      link: function(scope, el, attrs) {
        scope.$watch('property.name', function(name) {
          React.renderComponent(PropertyNameEditor({ scope: scope, name: name }), el[0]);
        });
      }
    }
  }
]);

