// Copyright StrongLoop 2014
dnd.service('AppService', [
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
dnd.service('NavigationService', [
  '$location',
  function($location) {
    var svc = {};
    svc.postLogoutNav = function(){
      $location.path('/login');
    }
    return svc;
  }
]);
