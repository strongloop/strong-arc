var ArcInit = angular.module('ArcInit', []);

ArcInit.run([
  'LoopBackAuth',
  'ArcUserService',
  function(auth, userService) {
    auth.accessTokenId = 'tokentoken';
    auth.userId = 1;
    auth.rememberMe = true;
    auth.save();

    userService.setLoginUser('user@email.com', 'User name', 1, 'tokentoken');
  },
]);

ArcInit.constant('ARC-LOCAL-PM-ENABLED', false);
ArcInit.constant('ARC-COMPOSER-ENABLED', false);
ArcInit.constant('ARC-LICENSING-ENABLED', false);
ArcInit.constant('ARC-PROJECTS-ENABLED', false);
