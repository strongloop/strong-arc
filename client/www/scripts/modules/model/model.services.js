// Copyright StrongLoop 2014
Model.service('ModelService', [
  'Modeldef',
  '$q',
  function(Modeldef, $q) {
    var svc = {};
  //  var deferred = $q.defer();
    svc.getAllModels = function() {
      return Modeldef.query({},
        function(response) {

          console.log('good get model defs: '+ response);

          var core = response[0];
          var log = [];
          var models = [];
          angular.forEach(core, function(value, key){
            this.push(key + ': ' + value);
            models.push({name:key,props:value});
          }, log);

         // $scope.models = models;
          return models;
        },
        function(response) {
          console.log('bad get model defs');

        }

      );
    }
    return svc;
  }
]);
