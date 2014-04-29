// Copyright StrongLoop 2014
app.service('AppService', [
  '$location',
  '$state',
  function($location, $state) {
    var svc = {};
    svc.isViewAuth = function(stateName){
      switch(stateName){

      }
    }
    return svc;
  }
]);
app.service('NavigationService', [
  '$location',
  function($location) {
    var svc = {};
    svc.postLogoutNav = function(){
      $location.path('/login');
    }
    return svc;
  }
]);
