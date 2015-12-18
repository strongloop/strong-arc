// Copyright StrongLoop 2014
Apim.service('ApimService', [
  '$http',
  '$log',
  function ($http, $log) {
    var svc = this;

    function login(creds){
      return $http.post('/apim/login', creds);
    }

    svc.login = login;

    return svc;
  }
]);
