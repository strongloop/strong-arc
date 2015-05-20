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
  'growl',
  '$timeout',
  function(growl, $timeout) {
    return {
      replace: true,
      templateUrl: './scripts/modules/discovery/templates/discovery.model.preview.html',
      link: function(scope, el, attrs) {

        function PropertyCollection(propertiesObj) {
          var propertyKeys = Object.keys(propertiesObj);
          var retCollection = propertyKeys.map(function(key) {
            var propObj = propertiesObj[key];
            propObj.name = key;
            propObj._selectable = !(propObj.id || propObj.required);
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
                {field: 'name', displayName: 'Name', cellClass: 'discovery-data-cell'},
                {field: 'type', displayName: 'Type', cellClass: 'discovery-data-cell'},
                {field: 'id', displayName: 'Is Id', cellFilter: 'isIdFilter', cellClass: 'discovery-data-cell'},
                {field: 'precision', displayName: 'Precision', cellClass: 'discovery-data-cell'},
                {field: 'required', displayName: 'Required', cellClass: 'discovery-data-cell'},
                {field: 'scale', displayName: 'Scale', cellClass: 'discovery-data-cell'}
              ],
              checkboxHeaderTemplate: '<input class="ngSelectionHeader" type="checkbox" ng-model="allSelected" ng-change="toggleSelectAll(allSelected)"/>',
              checkboxCellTemplate: '<label class="ui-checkbox">' +
                '<input type="checkbox" class="checked">' +
                '<i class="icon"></i>'+
                '</label>',
              showSelectionCheckbox: true,
              selectWithCheckboxOnly: false,
              selectedItems: scope.masterSelectedProperties[i],
              multiSelect: true,
              beforeSelectionChange: beforeSelectionChange,
              afterSelectionChange: afterSelectionChange,
              rowHeight: 40,
              filterOptions: scope.filterOptions,
              plugins: [new ngGridFlexibleHeightPlugin()]
            });

          }

          //hack to deal with dynamic ng-Grid width/height calculation of cells
          $timeout(function(){
            scope.gridOptions = tableConfigs;
          }, 0);
        });
      }
    };

    function afterSelectionChange(rowItem){
      //add class to checkbox if row is selected
      var $input = rowItem.elm.find('.ui-checkbox [type=checkbox]');

      if ( rowItem.selected ) {
        $input.addClass('checked');
      } else {
        $input.removeClass('checked');
      }
    }

    function beforeSelectionChange(rowItem) {
      var changeAllowed;
      if (!Array.isArray(rowItem)) {
        changeAllowed = !!rowItem.entity._selectable;
        if (!changeAllowed)
          warn('The row must be always selected.');
      } else {
        // rowItem.all(isSelectable)
        changeAllowed = !rowItem.some(function(item) {
          return !item._selectable;
        });
        if (!changeAllowed)
          warn('Some of the rows must be always selected.');
      }

      return changeAllowed;

      function warn(msg) {
        growl.addWarnMessage(msg, { ttl: 1000 });
      }
    }
  }
]).filter('isIdFilter', function() {
    return function(val) {
      if (val) {
        return true;
      }
      return false;
    };
  });
// control disabled state of next wizard buttons
Discovery.directive('slDiscoveryNextDisabledAttrib', [
  function() {
    return {
      restrict: 'A',
      replace: false,
      controller: function($scope) {
        $scope.isDisabled = true;
      },
      link: function(scope, el, attrs) {

        el.prop('disabled', true);
        scope.$watch('tableSelections', function(items) {
          if (items){
            if (items.length && items.length > 0) {
              el.prop('disabled', false);
            }
            else {
              el.prop('disabled', true);
            }
          }
        }, true);
      }
    };
  }
]);
// control disabled state of next wizard buttons
Discovery.directive('slDiscoverySelectallDisabledAttrib', [
  function() {
    return {
      restrict: 'A',
      replace: false,
      controller: function($scope) {
        $scope.isDisabled = true;
      },
      link: function(scope, el, attrs) {

        el.prop('disabled', true);
        scope.$watch('schemaSrcTables', function(items) {
          if (items){
            if (items.length && items.length > 0) {
              el.prop('disabled', false);
            }
            else{
              el.prop('disabled', true);
            }
          }
        }, true);
      }
    };
  }
]);
