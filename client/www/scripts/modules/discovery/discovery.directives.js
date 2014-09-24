// Copyright StrongLoop 2014
Discovery.directive('slDiscoverySchema', [
  function() {
    return {
      replace:true,
      templateUrl: './scripts/modules/discovery/templates/discovery.schema.html'
    }
  }
]);
Discovery.directive('slDiscoveryModelPreview', [
  function() {
    return {
      replace: true,
      templateUrl: './scripts/modules/discovery/templates/discovery.model.preview.html',
      link: function(scope, el, attrs) {

        function PropertyCollection(propertiesObj) {
          var propertyKeys = Object.keys(propertiesObj);
          var retCollection = propertyKeys.map(function(key) {
            var propObj = propertiesObj[key];
            propObj.name = key;
            return propObj
          });
          return retCollection;
        }

        scope.$watch('targetGenerateSrcTables', function(tables) {
          var tableConfigs = [];
          scope.masterProperties = [];

          for (var i = 0;i < tables.length;i++) {
            scope.masterSelectedProperties[i] = [];

            var propertiesObj = tables[i].properties;
            scope.allSelected = true;

            scope.masterProperties.push(new PropertyCollection(propertiesObj));
            // select all by default
            scope.masterProperties[i].map(function(prop) {
              scope.masterSelectedProperties[i].push(prop);
            });

            tableConfigs.push({
              tableName: tables[i].name,
              data: 'masterProperties[' + i + ']', // trick to render multiple ng-grids
              columnDefs: [
                {field: 'name', displayName: 'Name'},
                {field: 'type', displayName: 'Type'},
                {field: 'id', displayName: 'Is Id', cellFilter: 'isIdFilter'},
                {field: 'precision', displayName: 'Precision'},
                {field: 'required', displayName: 'Required'},
                {field: 'scale', displayName: 'Scale'}
              ],
              checkboxHeaderTemplate: '<input class="ngSelectionHeader" type="checkbox" ng-model="allSelected" ng-change="toggleSelectAll(allSelected)"/>',
              checkboxCellTemplate: '<label class="select-item-cell"><span class="sl-icon sl-icon-checkmark"></span><input type="checkbox" /></label>',
              showSelectionCheckbox: true,
              selectWithCheckboxOnly: false,
              selectedItems:  scope.masterSelectedProperties[i],
              multiSelect: true,
              filterOptions: scope.filterOptions,
              plugins: [new ngGridFlexibleHeightPlugin()]
            });

          }
          scope.gridOptions = tableConfigs;

        });
      }
    };
  }
]).filter('isIdFilter', function() {
    return function(val) {
      if (val) {
        return true;
      }
      return false;
    };
  });
// control disabled state of wizard buttons
Discovery.directive('slDiscoveryDisabledAttrib', [
  function() {
    return {
      restrict: 'A',
      replace: false,
      controller: function($scope) {
        $scope.isDisabled = true;
      },
      link: function(scope, el, attrs) {

        el.attr('disabled', 'disabled');
        scope.$watch('tableSelections', function(items) {
          if (items){
            if (items.length && items.length > 0) {
              el.removeAttr('disabled');
            }
            else{
              el.attr('disabled', 'disabled');
            }
          }
        }, true);
      }
    };
  }
]);
