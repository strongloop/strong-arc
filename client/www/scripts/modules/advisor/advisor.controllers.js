// Copyright StrongLoop 2014
Advisor.controller('AdvisorController', [
  '$scope',
  'AdvisorService',
  function ($scope, AdvisorService) {
    $scope.name = '';

    var query =  {
      "match_phrase": {
        "id": $scope.name
      }
    };

    var body = {
      "size": 10,
      "from": 0,
      "query": query
    };

    function getModules(){
      AdvisorService.getModules(body)
        .then(function (data) {
          $scope.modules = data.hits.hits;
        });
    }

    getModules();

    $scope.$watch('name', function(newVal){
      query.match_phrase.id = newVal;
      if ( newVal.length < 2 ) return;

      getModules();
    })
  }

]);
