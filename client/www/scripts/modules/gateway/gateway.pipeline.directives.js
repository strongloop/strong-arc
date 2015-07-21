/*
 *
 * PIPELINE DIRECTIVES
 *
 *
 * */
Gateway.directive('slPipelineMainView', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/pipeline.main.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
Gateway.directive('slPipelineForm', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/pipeline.form.html',
      controller: function($scope) {

      }
    }
  }
]);
Gateway.directive('slPipelineList', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/pipeline.list.html'
    }
  }
]);
