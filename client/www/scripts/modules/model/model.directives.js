// Copyright StrongLoop 2014

/*
*
*
*   MODEL INSTANCE HEADER
*
* */
Model.directive('modelInstanceHeader', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, el, attrs) {
        scope.$watch('currModelName', function(name) {
          React.renderComponent(ModelTitleHeader({scope: scope}), el[0]);
        });
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
* Schema Model Composer
*
* */
Model.directive('schemaModelComposer', [
  '$state',
  function($state) {
    return {
      templateUrl: './scripts/modules/model/templates/model.schema.composer.html',
      transclude: true,
      scope: {
        apiSourceTables: '=schemaModelComposer'
      },
      link: function(scope, elem, attrs) {
        console.log('Schema Composer link function: ' + scope.apiSourceTables);


        scope.property = 'checked';
        scope.generateModelFromDataSource = function() {
          if (confirm('generate model?')) {
            $state.transitionTo('uiform', {name:'test'});
          }
        };
        scope.collection = [];
        scope.$watch('apiSourceTables', function(sourceTables) {
          console.log('hell ya: ' + sourceTables);
          scope.collection = sourceTables;
          scope.property = 'checked';
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

/*
 *
 * MODEL PROPERTIES EDITOR
 *
 * */
Model.directive('modelPropertiesEditor',[
  function() {
    return {
      templateUrl: './scripts/modules/model/templates/model.properties.editor.html',
      link: function(scope, element, attrs) {
//        scope = scope.$parent;
        scope.isCollapsed = true;
        scope.isThisCollapsed = true;
      }
    }
  }
]);
/*
 *
 * MODEL BASE EDITOR
 *
 * */
Model.directive('modelBaseEditor',[
  function() {
    return {
      link: function(scope, el, attrs) {

       // scope = scope.$parent;
        scope.isModelInstanceBasePropertiesActive = false;

        scope.toggleModelDetailView = function() {
          scope.isModelInstanceBasePropertiesActive = !scope.isModelInstanceBasePropertiesActive;
        };

        scope.currProperty = {};

        scope.$watch('isModelInstanceBasePropertiesActive', function(val) {
          React.renderComponent(ModelDetailEditor({scope: scope, isModelInstanceBasePropertiesActive: val}), el[0]);
        });
        scope.$watch('activeModelInstance', function(val) {
          React.renderComponent(ModelDetailEditor({scope: scope, isModelInstanceBasePropertiesActive: val}), el[0]);
        });
      }
    }
  }
]);
/*
*   Model Property Pocket Editor
* */
Model.directive('modelPropertyPocketEditor', [
  function() {
    return {
      link: function(scope, el, attrs) {
        React.renderComponent(ModelPropertyPocketEditor({scope:scope}), el[0]);
      }
    }
  }
]);

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

       scope.$watch('property', function(config) {
         React.renderComponent(ModelPocketEditorContainer({scope:scope}), el[0]);
       });

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
          console.log('UIForm Form Builder: ' + JSON.stringify(models));
          scope.formFields = models;
        }, true);
      }
    }
  }
]);
/*
*
* Model Editor Tabs View
*
* */
Model.directive('slModelEditorTabsView', [
  'IAService',
  function(IAService) {
    return {
      link: function(scope, el, attrs) {

//        scope = scope.$parent;
        scope.$watch('currentOpenModelNames', function(newNames, oldNames) {
          var active = IAService.getActiveModelInstance();
          var tabItems = [];
          var sourceItems = [];
          if (scope.currentOpenModelNames) {
            sourceItems = scope.currentOpenModelNames;
          }
          else {
            sourceItems = scope.$parent.currentOpenModelNames;
          }
          for (var i = 0;i < sourceItems.length;i++) {
            var isActive = false;
            if (sourceItems[i] === IAService.getActiveModelInstance().name) {
              isActive = true;
            }
            tabItems.push({
              name:sourceItems[i],
              isActive:isActive
            });
          }

          React.renderComponent(ModelEditorTabsView({scope:scope, tabItems:tabItems}), el[0]);
        });
      }
    }
  }
]);
