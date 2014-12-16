Arc.service('ArcNavigationService', [
  '$location',
  function($location) {
    var svc = {};
    svc.postLogoutNav = function(){
      $location.path('/login');
    };
    return svc;
  }
]);
