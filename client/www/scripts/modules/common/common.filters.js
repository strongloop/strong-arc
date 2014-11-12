Common
  .filter('offset', [function(){
    return function(input, start) {
      start = parseInt(start, 10);

      return input.slice(start);
    };
  }])
  .filter('rawHtml', ['$sce', function($sce){
    return function(val) {
      return $sce.trustAsHtml(val);
    };
  }])
