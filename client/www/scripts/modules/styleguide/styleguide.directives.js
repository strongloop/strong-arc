Styleguide.directive('slStyleguideModuleButtons', [
  '$log',
  function ($log) {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/styleguide/templates/styleguide.module.buttons.html',
      scope: {},
      controller: function($scope){
        $scope.show = true;

        $scope.clickModule = function(){
          $scope.show = !$scope.show;
        }
      }
    };
  }
]);

Styleguide.directive('slStyleguideModuleText', [
  '$log',
  function ($log) {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/styleguide/templates/styleguide.module.text.html',
      scope: {},
      controller: function($scope){
        $scope.show = true;

        $scope.tabs = [{ id: 1, name: 'Normal' }, { id: 2, name: 'second tab' }, { id: 3, name: 'three' }, { id: 4, name: 'this is the fourth tab' }];
        $scope.crumbs = [{ name: 'Link 1' }, { name: 'Link 2' }, { name: 'Link 3' }, { name: 'Link 4' }];
        $scope.clickedCrumb = null;
        $scope.activeTab = null;

        $scope.setActiveTab = function(tab){
          $scope.activeTab = tab;
        };

        $scope.closeTab = function(tab){

        };

        $scope.clickModule = function(){
          $scope.show = !$scope.show;
        };

        $scope.onClickCrumb = function(i, crumb, len){
          $scope.clickedCrumb = crumb;
        };
      }
    };
  }
]);

Styleguide.directive('slStyleguideModuleColor', [
  '$log',
  '$timeout',
  function ($log, $timeout) {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/styleguide/templates/styleguide.module.color.html',
      scope: {},
      controller: function($scope){
        $scope.show = true;

        //color-scheme classes
        $scope.colors = {};
        $scope.colors.primary = 'green-1 green-2'.split(' ');
        $scope.colors.secondary = 'green-3 green-4 blue-1 blue-2'.split(' ');
        $scope.colors.grey = 'grey-1 grey-2 grey-3 grey-4 grey-5 grey-6 grey-7'.split(' ');
        $scope.colors.tertiary = 'red-1 red-2 teal-dark teal-light orange purple-dark purple-light'.split(' ');
        $scope.hex = {};

        $scope.clickModule = function(){
          $scope.show = !$scope.show;
        };
      },
      link: function(scope, el, attrs){
        scope.$watch('$viewContentLoaded', function(){
          //hack to wait until view content is actually parsed
          $timeout(function(){
            var $colors = el.find('.colors .color');

            $colors.each(function(i, el){
              var rgb = $(el).css('backgroundColor');
              var hex = rgb2hex(rgb);
              $(el).siblings('.hex').text(hex);
            });

          }, 0);
        });
      }
    };
  }
]);

Styleguide.directive('slStyleguideModuleForms', [
  '$log',
  function ($log) {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/styleguide/templates/styleguide.module.forms.html',
      scope: {},
      controller: function($scope){
        $scope.show = true;
        $scope.interests = ['biking', 'scuba', 'skiing'];
        $scope.education = ['high school', '2-year college', '4-year college', 'masters program'];

        //models
        $scope.user = {};
        $scope.user.interests = {};
        $scope.user.education = {};
        $scope.nolabel = {};
        $scope.nolabel.interests = {};
        $scope.nolabel.education = {};

        //togglers
        $scope.toggler1 = 'id-1';
        $scope.togglers1 = [
          { id: 'id-1', label: 'One', activeId: 'toggler1' },
          { id: 'id-2', label: 'Two', activeId: 'toggler1' }
        ];

        $scope.toggler2 = 'id-1';
        $scope.togglers2 = [
          { id: 'id-1', label: 'One', activeId: 'toggler2' },
          { id: 'id-2', label: 'Two', activeId: 'toggler2' },
          { id: 'id-3', label: 'Three', activeId: 'toggler2' }
        ];

        $scope.toggler3 = 'id-1';
        $scope.togglers3 = [
          { id: 'id-1', label: 'One', activeId: 'toggler3' },
          { id: 'id-2', label: 'Two', activeId: 'toggler3' },
          { id: 'id-3', label: 'Three', activeId: 'toggler3' },
          { id: 'id-4', label: 'Example number Four', activeId: 'toggler3' }
        ];

        $scope.switch1 = 'new';
        $scope.switches1 = [
          { id: 'new', label: 'New', activeId: 'switch1' },
          { id: 'existing', label: 'Existing', activeId: 'switch1' }
        ];

        $scope.switch2 = 'new';
        $scope.switches2 = [
          { id: 'new', label: 'New', activeId: 'switch2' },
          { id: 'existing', label: 'Existing', activeId: 'switch2' }
        ];

        $scope.switch3 = 'off';
        $scope.switches3 = [
          { id: 'off', label: 'Off', activeId: 'switch3' },
          { id: 'on', label: 'On', activeId: 'switch3' }
        ];

        $scope.switch4 = 'off';
        $scope.switches4 = [
          { id: 'off', label: 'Off', activeId: 'switch4' },
          { id: 'on', label: 'On', activeId: 'switch4' }
        ];

        $scope.submit = function(myForm){
          $log.log(myForm);
        };

        $scope.clickModule = function(){
          $scope.show = !$scope.show;
        };
      }
    };
  }
]);

Styleguide.directive('slStyleguideModuleTables', [
  '$log',
  function ($log) {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/styleguide/templates/styleguide.module.tables.html',
      scope: {},
      controller: function($scope){
        $scope.show = true;

        //models
        $scope.user = {};
        $scope.data = {};

        $scope.submit = function(myForm){
          $log.log(myForm);
        };

        $scope.clickModule = function(){
          $scope.show = !$scope.show;
        };

        $scope.clickStatus = function(id){
          $log.log('clicked %d', id);
        };

        $scope.delete = function(){
          $log.log('delete clicked');
        };

        $scope.whatever = function(){
          $log.log('whatever clicked');
        };

      }
    };
  }
]);

Styleguide.directive('slStyleguideModulePopovers', [
  '$log',
  '$modal',
  function($log, $modal) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: './scripts/modules/styleguide/templates/styleguide.module.popovers.html',
      scope: {},
      controller: function($scope, $timeout) {
        var templateBase = '/scripts/modules/styleguide/templates/';

        $scope.show = true;
        $scope.showClickableInfo = false;

        $scope.clickModule = function() {
          $scope.show = !$scope.show;
        };

        $scope.contextModal = {
          templateUrl: templateBase + 'styleguide.module.popovers.context.html',
          position: 'bottom',
          name: 'testValue',
          value: 100
        };

        /* this is a pretty ugly hack to work around the bootstrap popover
           not having any programatic control. This should be reworked if
           that situation changes

           https://github.com/angular-ui/bootstrap/issues/590
           */
        $scope.setupHidePopover = function($event) {
          var element = angular.element($event.target);
          $scope.hidePopover = function() {
            $timeout(function() {
              element.triggerHandler('click');
            });
          };
        };

        $scope.showModal = function() {
          var modalDlg = $modal.open({
            templateUrl: templateBase + 'styleguide.module.popovers.modal.html',
            size: 'lg',
            controller: function($scope, $modalInstance, title) {
              $scope.title = title;
              $scope.close = function() {
                $modalInstance.dismiss();
              };
            },
            resolve: {
              title: function() {
                return 'Example Modal Dialog';
              }
            }
          });
        };
      }
    };
  }
]);

Styleguide.directive('slStyleguideModuleMessage', [
  '$log',
  function ($log) {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/styleguide/templates/styleguide.module.message.html',
      scope: {},
      controller: function($scope, $rootScope){
        $scope.show = true;

        $scope.clickModule = function(){
          $scope.show = !$scope.show;
        };

        $scope.showMessage = function(obj){
          var data = { body: 'This is something you need to know about' };

          for ( var key in obj ) {
            data[key] = obj[key];
          }

          $rootScope.$emit('message', data);
        };
      }
    };
  }
]);

Styleguide.directive('slStyleguideModuleMenus', [
  '$log',
  function ($log) {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/styleguide/templates/styleguide.module.menus.html',
      scope: {},
      controller: function($scope, $rootScope){
        $scope.show = true;
        $scope.searchText1 = '';
        $scope.showDropdownMenu1 = false;
        $scope.showDropdownMenu2 = false;
        $scope.showDropdownMenu3 = false;
        $scope.selectedItemMenu0 = null;
        $scope.selectedItemMenu4 = null;


        $scope.menuItems = [
          { name: 'Item 1' },
          { name: 'Item 2' },
          { name: 'Item 3' },
          { name: 'Other 4' },
          { name: 'Other 5' },
          { name: 'Other 6' }
        ];

        $scope.clickModule = function(){
          $scope.show = !$scope.show;
        };

        $scope.selectItemMenu1 = function(item){
          $scope.searchText1 = item.name;
          $scope.selectedItemMenu1 = item;
          $scope.showDropdownMenu1 = false;
        };

        $scope.selectItemMenu2 = function(item){
          $scope.selectedItemMenu2 = item;
          $scope.showDropdownMenu2 = false;
        };

        $scope.selectItemMenu3 = function(item){
          $scope.selectedItemMenu3 = item;
          $scope.showDropdownMenu3 = false;
        };
      }
    };
  }
]);
