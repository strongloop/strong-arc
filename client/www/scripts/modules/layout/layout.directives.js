// Copyright StrongLoop 2014
Layout.directive('fundooRating', function () {
  return {
    restrict: 'A',
    scope: {
      ratingValue: '=',
      max: '=',
      readonly: '@',
      onRatingSelected: '&'
    },
    link: function (scope, elem, attrs) {
      scope.toggle = function(index) {
        if (scope.readonly && scope.readonly === 'true') {
          return;
        }
        scope.ratingValue = index + 1;
        scope.onRatingSelected({rating: index + 1});
      };
      scope.$watch('ratingValue', function(oldVal, newVal) {
        React.renderComponent(window.FundooRating({scope: scope}), elem[0]);
      });
    }
  }
});
