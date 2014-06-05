// Copyright StrongLoop 2014
app.service('AppService', [
  '$location',
  '$state',
  function($location, $state) {
    var svc = {};
    svc.isViewAuth = function(stateName){
      switch(stateName){

      }
    };
    return svc;
  }
]);
app.service('AppStorageService', [
  function() {
    var svc = {};
    svc.setItem = function(itemName, item) {
      return window.localStorage.setItem(itemName, JSON.stringify(item));
    };
    svc.getItem = function(itemName) {
      return JSON.parse(window.localStorage.getItem(itemName));
    };
    svc.removeItem = function(itemName) {
      return window.localStorage.removeItem(itemName);
    };
    return svc;
  }
]);
app.service('NavigationService', [
  '$location',
  function($location) {
    var svc = {};
    svc.postLogoutNav = function(){
      $location.path('/login');
    };
    return svc;
  }
]);
