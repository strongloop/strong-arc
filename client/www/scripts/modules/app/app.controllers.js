// Copyright StrongLoop 2014
app.controller('IDEController', [
  '$scope',
  '$state',
  '$location',
  'ModelService',
  function($scope, $state, $location, ModelService) {
    var apple_selected, tree, treedata_avm, treedata_geography;
    $scope.my_tree_handler = function(branch) {
      var _ref;
      $scope.output = "Module: " + branch.name;

      if ((_ref = branch.data) != null ? _ref.description : void 0) {
        return $scope.output += '(' + branch.data.description + ')';
      }
      if (branch.stateName) {
        $state.transitionTo(branch.stateName);
      } else {
//        $state.transitionTo('' + branch.name);
        $location.path('/model/' + branch.name);
      }

    };




    var treedata_api_nav = [
      {
        name: 'Models',
        stateName: 'model',
        children: [
          {
            name: 'Properties',
            children: ['data type', 'default']
          }, {
            name: 'ACL',
            children: ['allow all', 'restrict']
          }, {
            name: 'Relations',
            children: ['has many', 'belongs to']
          }
        ]
      },
      {
        name: 'Datasources',
        stateName: 'datasource',
        children: [
          {
            name: 'Mongo Prod 1',
            children: ['type', 'properties', 'connection']
          }, {
            name: 'prod apn customer',
            children: ['type', 'properties', 'connection']
          }, {
            name: 'MySQL WP reg',
            children: ['type', 'properties', 'connection']
          }
        ]
      },
      {
        name: 'Forms',
        stateName: 'uiform'
      },
      {
        name: 'Layouts',
        stateName: 'layout'
      }
    ];
    $scope.my_data = treedata_api_nav;
    $scope.models = [];


    $scope.models = ModelService.getAllModels({});
    $scope.models.$promise.
      then(function (result) {

        var core = result[0];

        var log = [];
        var models = [];
        angular.forEach(core, function(value, key){
          this.push(key + ': ' + value);
          models.push({name:key,children:value});
        }, log);



        var treedata_api_nav = [
          {
            name: 'Models',
            stateName: 'model',
            children: [
              {
                name: 'Properties',
                children: ['data type', 'default']
              }, {
                name: 'ACL',
                children: ['allow all', 'restrict']
              }, {
                name: 'Relations',
                children: ['has many', 'belongs to']
              }
            ]
          },
          {
            name: 'Datasources',
            stateName: 'datasource',
            children: [
              {
                name: 'Mongo Prod 1',
                children: ['type', 'properties', 'connection']
              }, {
                name: 'prod apn customer',
                children: ['type', 'properties', 'connection']
              }, {
                name: 'MySQL WP reg',
                children: ['type', 'properties', 'connection']
              }
            ]
          },
          {
            name: 'Forms',
            stateName: 'uiform'
          },
          {
            name: 'Layouts',
            stateName: 'layout'
          }
        ];









        for (var i = 0;i < treedata_api_nav.length;i++) {
          if (treedata_api_nav[i].name === 'Models') {
            treedata_api_nav[i].children = models;
            break;
          }
        }






        $scope.models = treedata_api_nav;


      });

  }
]);
app.controller('HomeMainController',[
  '$scope',
  '$location',
  function($scope, $location){
    var viewModel = {};
    viewModel.message = 'StrongLoop API Studio';
    $scope.viewModel = viewModel;


  }
]);
app.controller('MainNavController',[
  '$scope',
  'ProfileService',
  '$location',
  function($scope, ProfileService, $location) {
    $scope.isAuthUser = function(){
      return ProfileService.getCurrentUserId();
    };
  }
]);
app.controller('DragDropCtrl', function($scope) {
  $scope.handleDrop = function() {
    console.log('Item has been dropped');
  }
});
