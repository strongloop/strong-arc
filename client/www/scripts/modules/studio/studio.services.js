Studio.service('StudioNavigationService', [
  '$location',
  function($location) {
    var svc = {};
    svc.postLogoutNav = function(){
      $location.path('/login');
    };
    return svc;
  }
]);
