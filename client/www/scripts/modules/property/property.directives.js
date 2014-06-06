// Copyright StrongLoop 2014
/*
 *
 * Property Validation Editor
 *
 * */
Property.directive('propertyValidationEditor', [
  function() {
    return {
      link: function(scope, el, attrs) {

        scope.$watch('property.props.validation', function(config) {
          React.renderComponent(PropertyValidationEditor({scope: scope}), el[0]);
        })

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
      link: function(scope, el, attrs) {

        scope.$watch('property.props.id', function(config) {
          React.renderComponent(PropertyIdEditor({scope:scope}), el[0]);
        });

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
      link: function(scope, el, attrs) {
        scope.$watch('property.props.map', function(config) {
          React.renderComponent(PropertyMapEditor({scope:scope}), el[0]);
        });
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
      link: function(scope, el, attrs) {
        scope.$watch('property.props.format', function(config) {
          React.renderComponent(PropertyFormatEditor({scope:scope}), el[0]);
        });
      }
    }
  }
]);
