// Copyright StrongLoop 2014
Api.service('ApiService',[
  'Apidefinition',
  function(Apidefinition){
    var svc = {};

    svc.getAllApis = function() {
      return Apidefinition.query();
    };
    svc.createApi = function(apiObj) {
      return Apidefinition.create(apiObj);
    }

    return svc;
  }
]);
