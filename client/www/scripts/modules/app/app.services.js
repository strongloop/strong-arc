// Copyright StrongLoop 2014
app.service('AppService', [
  '$location',
  '$state',
  function($location, $state) {
    var svc = {};
    var globalExceptionObj = {};
    svc.isViewAuth = function(stateName){
      switch(stateName){

      }
    };
    svc.setGlobalException = function(config) {
      globalExceptionObj = config;
    };
    svc.clearGlobalException = function() {
      globalExceptionObj = {};
    };
    svc.getGlobalException = function() {
      return globalExceptionObj;
    };

    return svc;
  }
]);
app.service('AppStorageService', [
  function() {
    var svc = {};

    var getSlScope = function() {
      var slScope = window.localStorage.getItem('slScope');
      if (!slScope) {
        return {};
      }
      return JSON.parse(slScope);
    };

    svc.setItem = function(itemName, item) {
      var localScope = getSlScope();
      localScope[itemName] = item;
      return window.localStorage.setItem('slScope', JSON.stringify(localScope));
    };
    svc.getItem = function(itemName) {
      var localScope = getSlScope();
      return localScope[itemName];
    };
    svc.removeItem = function(itemName) {
      var localScope = getSlScope();
      delete localScope[itemName];
      window.localStorage.setItem('slScope', JSON.stringify(localScope));
      return localScope;
    };
    svc.clearActiveInstance = function() {
      svc.removeItem('activeInstance');
    };
    svc.clearStorage = function() {
      window.localStorage.removeItem('ApiModels');
      window.localStorage.removeItem('ApiDatasources');
      return window.localStorage.removeItem('slScope');
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
