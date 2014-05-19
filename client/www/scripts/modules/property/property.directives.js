// Copyright StrongLoop 2014
/*
 *
 * Property Validation Editor
 *
 * */
Property.directive('propertyValidationEditor', [
  function() {
    return {
      templateUrl: './scripts/modules/property/templates/property.validation.editor.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
/*
 *
 * Property Index Editor
 *
 * */
Property.directive('propertyIdEditor', [
  function() {
    return {
      templateUrl: './scripts/modules/property/templates/property.id.editor.html',
      link: function(scope, el, attrs) {

        if (scope.property.props.id){

        }
        console.log('Property Id Editor: ' + scope.property.name);
      }
    }
  }
]);
/*
 *
 * Property Map Editor
 *
 * */
Property.directive('propertyMapEditor', [
  function() {
    return {
      templateUrl: './scripts/modules/property/templates/property.map.editor.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
/*
 *
 * Property Format Editor
 *
 * */
Property.directive('propertyFormatEditor', [
  function() {
    return {
      templateUrl: './scripts/modules/property/templates/property.format.editor.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
