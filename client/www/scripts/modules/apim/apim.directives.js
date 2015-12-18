Apim.directive('slApimNavbarSelector', [
  '$log',
  '$timeout',
  '$modal',
  'ApimService',
  function($log, $timeout, $modal, ApimService){
    var templateBase = './scripts/modules/apim/templates';
    return {
      restrict: 'E',
      replace: true,
      templateUrl: templateBase + '/apim.navbar.selector.html',
      scope: {},
      controller: function($scope) {
        $scope.apimContextMenu = {
          templateUrl: templateBase + '/apim.navbar.selector.popover.html',
          position: 'bottom'
        };

        $scope.setupHidePopover = function($event) {
          var element = angular.element($event.target);

          $scope.hidePopover = function() {
            $timeout(function() {
              angular.element('.sl-apim-navbar-selector > span').click();
            });
          };

          var btns = angular.element('.navButtons > ul > li:visible');
          var len = btns.length;
          var idx = btns.index(element.parents('li'));
          // position from right
          var i = len-idx;

          // set class for trigger position in list so we can override in apim.less
          var className = 'trigger-pos-'+i;

          $timeout(function(){
            angular.element('.popover').addClass(className);
          }, 0, false)
        };

        $scope.showSignIn = function() {
          $scope.hidePopover();
          $scope.showSignInModal();
        };

        $scope.showSignInModal = function(){
          var modalDlg = $modal.open({
            templateUrl: templateBase + '/apim.signin.modal.html',
            size: 'md',
            controller: function($scope, $modalInstance) {
              $scope.close = function() {
                $modalInstance.dismiss();
              };

              //form model
              $scope.apimUser = {};

              $scope.submit = function(){
                ApimService.login({
                    hostname: $scope.apimUser.hostname,
                    username: $scope.apimUser.username,
                    password: $scope.apimUser.password,
                    remember: $scope.apimUser.remember
                  })
                  .then(function(data){
                    $log.log('logged into apim', data);
                  });
              };

              $scope.apimLogin = function($form){
                if ( $form.$valid ) {
                  return $scope.submit();
                }
              };
            }
          });
        };
      }
    }
  }]);
