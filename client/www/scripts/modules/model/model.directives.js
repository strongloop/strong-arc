// Copyright StrongLoop 2014
/*
*
*
*   MODEL ENGINE
*
* */
Model.directive('modelEngine', [
  'ModelService',
  'growl',
  'Focus',
  'StringService',
  'UserPreferenceService',
  'ModelDefinitionService',
  function(ModelService, growl, Focus, StringService, UserPreferenceService, ModelDefinitionService) {
    return{
      templateUrl: './scripts/modules/model/templates/model.engine.html',
      link: function(scope, elem, attrs) {
        console.log('in the model engine link function');
        scope.currModel = {
          isUnique:false
        };
        scope.newModelMaxNameLen = 0;

        scope.showAddPropertyForm = false;


        scope.hasCurrentModel = false;

        scope.modelOptions = [
          {name:'acls'},
          {name:'base'},
          {name:'relations'}
        ];
        scope.modelOption = scope.modelOptions[1]; // base
        scope.baseDataTypes = [
          {name:'array'},
          {name:'buffer'},
          {name:'date'},
          {name:'geopoint'},
          {name:'string'},
          {name:'number'},
          {name:'boolean'},
          {name:'object'},
          {name:'any'}
        ];
        scope.baseDataType = scope.baseDataTypes[4];  //string


        scope.toggleDialect = function() {
          console.log('Toggle Dialect');
          var x = {};
          if (scope.currModel.properties && (scope.currModel.properties instanceof Array)){
            x = ModelService.translateToObjectDialect(scope.currModel);
          } else {
            x = ModelService.translateToArrayDialect(scope.currModel);
          }

          scope.currModel = x;
          return scope.currModel;

        };

        scope.createNewModel = function(){
          if (scope.currModel.name){
            console.log('we have a model');
            scope.currModel.public = ModelDefinitionService.getNewModelInstance();
            scope.currModel.options = [];
            scope.currModel.relations = [];
            scope.hasCurrentModel = true;
            Focus('propertyEditInit');
            growl.addSuccessMessage("model has been created YAY!");

          }
        };
        scope.isCurrModelSaved = function(){
          return !scope.hasCurrentModel;
        };
        scope.checkUniqueStatus = function() {
          if (scope.currModel.display){
            if (!scope.currModel.isUnique) {
              return true;
            }
          }
          return false;
        };
        scope.isNewModelButtonDisabled = function(){
          return !scope.currModel.isUnique;
        };
        scope.currDisplayModel = function() {
          var x = {};
          var userPref = UserPreferenceService.getUserPref('modelEditingJSONDialect');

          if (userPref && (userPref == 'namedObj')){
            x = ModelService.translateToObjectDialect(scope.currModel);
          } else {
            x = ModelService.translateToArrayDialect(scope.currModel);
          }
          return x;
        };


        // check if the value is unique
        // normalize to
        scope.modelNameUpdate = function() {
          //        nameString = window.S(nameString).camelize().s;
          if (scope.currModel.display){
            scope.currModel.name = StringService.normalizeString(scope.currModel.display);
            // up the max name length for checking for backspace changes and restarts of the unique checker
            if (scope.currModel.name.length > scope.newModelMaxNameLen){
              scope.newModelMaxNameLen = scope.currModel.name.length;
            }
            // if the value is less than the prev max length then the user has
            // been editing the name so set it to dirty for confirmation
            if (scope.currModel.name.length < scope.newModelMaxNameLen){
              scope.currModel.isUnique = false;
            }
            if (!scope.currModel.isUnique){
              if (ModelService.isModelUnique(scope.currModel)){
                scope.currModel.isUnique = true;
              }
            }
          }


        };



      }
    }
  }
]);
/*
 *
 *
 *   MODEL PROPERTY EDITOR
 *
 * */
Model.directive('modelPropertyEditor', [
  'ModelService',
  'Focus',
  'StringService',
  function(ModelService, Focus, StringService) {
    return {
      templateUrl: './scripts/modules/model/templates/model.property.editor.html',
      link: function(scope, elem, attrs) {

        scope.propertyEditorActive = false;

        scope.isPropertyEditorActive = function() {
          return scope.propertyEditorActive;
        }

        scope.currProperty = {
          isUnique:false
        };
        scope.newPropertyMaxNameLen = 0;

        scope.deactivatePropertyEditor = function(){
          scope.propertyEditorActive = false;
          console.log('Deactivate Editor')
        };

        scope.addProperty = function(value){

          if (!scope.propertyEditorActive) {
            scope.propertyEditorActive = true;
            Focus('propertyEditInit');
            return;
          }


          if (scope.currProperty.isUnique){
            scope.currProperty.type = scope.baseDataType.name;
            console.log('add property: ' + value + ':' + scope.baseDataType.name);
            scope.currModel.properties.push(scope.currProperty);
            scope.currProperty = {
              isUnique:false
            };
            Focus('propertyEditInit');
          }

        };
        scope.checkUniquePropStatus = function() {
          if (scope.currProperty.name){
            if (!scope.currProperty.isUnique) {
              return true;
            }
          }
          return false;
        };
        scope.isAddPropertyButtonDisabled = function() {
          if (!scope.propertyEditorActive){
            return false;
          }
          return !scope.currProperty.isUnique;
        };


        // check if the value is unique
        // normalize to
        scope.propertyNameUpdate = function() {
          //        nameString = window.S(nameString).camelize().s;
          if (scope.currProperty.name){
            scope.currProperty.name = StringService.normalizeString(scope.currProperty.name);

            // up the max name length for checking for backspace changes and restarts of the unique checker
            if (scope.currProperty.name.length > scope.newPropertyMaxNameLen){
              scope.newModelMaxNameLen = scope.currProperty.name.length;
            }
            // if the value is less than the prev max length then the user has
            // been editing the name so set it to dirty for confirmation
            if (scope.currProperty.name.length < scope.newModelMaxNameLen){
              scope.currProperty.isUnique = false;
            }
            if (!scope.currProperty.isUnique){
              if (ModelService.isPropertyUnique(scope.currModel, scope.currProperty.name)){
                scope.currProperty.isUnique = true;
              }
            }
          }
        };
      }
    }
  }
]);
/*
 *
 *
 *   MODEL OPTIONS EDITOR
 *
 * */
Model.directive('modelOptionsEditor', [
  function() {
    return {
      templateUrl: './scripts/modules/model/templates/model.options.editor.html',
      link: function(scope, elem, attrs) {
        scope.optionsEditorActive = false;

        scope.isOptionsEditorActive = function() {
          return scope.optionsEditorActive;
        }

        scope.currOption = {
          isUnique:false
        };
        scope.newOptionMaxNameLen = 0;

        scope.deactivateEditor = function(){
          scope.optionsEditorActive = false;
          console.log('Deactivate Editor')
        };
        scope.isAddOptionsButtonDisabled = function() {
          if (!scope.optionEditorActive){
            return false;
          }
          return !scope.currOption.isUnique;
        };

        scope.checkUniqueOptionStatus = function() {
          if (scope.currOption.name){
            if (!scope.currOption.isUnique) {
              return true;
            }
          }
          return false;
        };
        scope.addOption = function(value){

          if (!scope.optionsEditorActive) {
            scope.optionsEditorActive = true;
            Focus('optionsEditInit');
            return;
          }


          if (scope.currOption.isUnique){
            scope.currOption.type = scope.baseDataType.name;
            console.log('add option: ' + value + ':' + scope.baseDataType.name);
            scope.currModel.options.push(scope.currOption);
            scope.currOption = {
              isUnique:false
            };
            Focus('optionsEditInit');
          }

        };

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
          console.log('Deactivate Editor')
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
            console.log('add relation: ' + value + ':' + scope.baseDataType.name);
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
          console.log('Deactivate Editor')
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
            console.log('add option: ' + value + ':' + scope.baseDataType.name);
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
 *   MODEL Datasource EDITOR
 *
 * */
Model.directive('modelDatasourceEditor', [
  function() {
    return {
      templateUrl: './scripts/modules/model/templates/model.datasource.editor.html',
      link: function(scope, elem, attrs) {
        scope.datasourceEditorActive = false;

        scope.isDatasourceEditorActive = function() {
          return scope.datasourceEditorActive;
        }

        scope.currDatasource = {
          isUnique:false
        };
        scope.newDatasourceMaxNameLen = 0;

        scope.deactivateEditor = function(){
          scope.datasourceEditorActive = false;
          console.log('Deactivate Editor')
        };
        scope.isAddDatasourceButtonDisabled = function() {
          if (!scope.datasourceEditorActive){
            return false;
          }
          return !scope.currDatasource.isUnique;
        };

        scope.checkUniqueDatasourceStatus = function() {
          if (scope.currDatasource.name){
            if (!scope.currDatasource.isUnique) {
              return true;
            }
          }
          return false;
        };
        scope.addDatasource = function(value){

          if (!scope.datasourceEditorActive) {
            scope.datasourceEditorActive = true;
            Focus('datasourceEditInit');
            return;
          }


          if (scope.currDatasource.isUnique){
            scope.currDatasource.type = scope.baseDataType.name;
            console.log('add option: ' + value + ':' + scope.baseDataType.name);
            scope.currModel.datasource.push(scope.currDatasource);
            scope.currDatasource = {
              isUnique:false
            };
            Focus('datasourceEditInit');
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
  function() {
    return {
      templateUrl: './scripts/modules/model/templates/model.schema.composer.html',
      transclude: true,
      scope: {
        apiSourceTables: '=schemaModelComposer'
      },
      link: function(scope, elem, attrs) {
        console.log('Schema Composer link function: ' + scope.apiSourceTables);


        scope.generateModelFromDataSource = function() {
          confirm('generate model?');
        };
        scope.collection = [];
        scope.$watch('apiSourceTables', function(sourceTables) {
          console.log('hell ya: ' + sourceTables);
          scope.collection = sourceTables;
        }, true);

        scope.getTableData = function(item) {
          console.log('Get Table Details: ' + item);
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
*
* Model Extension Editor
*
* */
Model.directive('modelExtensionEditor', [
  function() {
    return {
      templateUrl: './scripts/modules/model/templates/model.extension.editor.html',
      link: function(scope, elem, attrs) {
        scope.isExtensionEditorActive = function() {
          return true;
        }

      }
    }
  }
]);
/*
*
* Model Scopes Editor
*
* */
Model.directive('modelScopesEditor', [
  function() {
    return {
      templateUrl: './scripts/modules/model/templates/model.scopes.editor.html',
      link: function(scope, elem, attrs) {
        scope.isScopesEditorActive = function(){
          return true;
        }
      }
    }
  }
]);
/*
 *
 * Model List
 *
 * */
Model.directive('modelSourceList', [
  function() {
    return {
      templateUrl: './scripts/modules/model/templates/models.source.list.html',
      link: function(scope, elem, attrs) {
        scope.$watch('models', function(models) {
          scope.dmodels = models;
        }, true);
        scope.showSampleForm = function() {
          console.log('show the sample form');

        }
      }
    }
  }
]);
Model.directive('modelSampleForm', [
  function() {
    return {
      template: '<div uiform-form-builder ></div>',
      link: function(scope, elem, attrs) {
        scope.$watch('dmodels', function(models) {
          console.log('UIForm Form Builder: ' + JSON.stringify(models));
          scope.formFields = models;
        }, true);
      }
    }
  }
]);

