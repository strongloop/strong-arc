// Copyright StrongLoop 2014
//UIForm.directive('')
UIForm.directive('uiformFormBuilder', [
  function() {
    return {
      templateUrl: './scripts/modules/uiform/templates/uiform.form.html',
      link: function(scope, elem, attrs) {

        scope.$watch('currUIForm.fields', function(uiFormFields) {
          scope.formFields = uiFormFields;
        }, true);


      }
    }
  }
]);

UIForm.directive('fieldDirective', [
  '$http',
  '$compile',
  function ($http, $compile) {

  var getTemplateUrl = function(field) {
    var type = field.fieldType;
    var templateUrl = '';

    switch(type) {
      case 'text':
        templateUrl = './scripts/modules/uiform/templates/uiform.text.html';
        break;
      case 'email':
        templateUrl = './scripts/modules/uiform/templates/uiform.email.html';
        break;
      case 'textarea':
        templateUrl = './scripts/modules/uiform/templates/uiform.textarea.html';
        break;
      case 'checkbox':
        templateUrl = './scripts/modules/uiform/templates/uiform.checkbox.html';
        break;
      case 'date':
        templateUrl = './scripts/modules/uiform/templates/uiform.date.html';
        break;
      case 'select':
        templateUrl = './scripts/modules/uiform/templates/uiform.select.html';
        break;
      case 'hidden':
        templateUrl = './scripts/modules/uiform/templates/uiform.hidden.html';
        break;
      case 'password':
        templateUrl = './scripts/modules/uiform/templates/uiform.password.html';
        break;
      case 'radio':
        templateUrl = './scripts/modules/uiform/templates/uiform.radio.html';
        break;
    }
    return templateUrl;
  }

  var linker = function(scope, element) {
    // GET template content from path
    var templateUrl = getTemplateUrl(scope.field);
    $http.get(templateUrl).success(function(data) {
      element.html(data);
      $compile(element.contents())(scope);
    });
  }

  return {
    template: '<div>{{field}}</div>',
    restrict: 'E',
    scope: {
      field:'='
    },
    link: linker
  };
}
]);
