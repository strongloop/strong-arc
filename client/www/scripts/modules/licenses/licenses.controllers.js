Licenses.controller('LicensesMainController', [
  '$scope',
  '$q',
  '$log',
  '$rootScope',
  'LicensesService',
  function ($scope, $q, $log, $rootScope, LicensesService) {
    window.setScrollView('.common-instance-view-container');


    $scope.selectLicenseText = function(id){
      $(id).select();
    };

    $scope.copyToClipboard = function(id){
      return $(id).val();
    };

    //get all products and user licenses and merge into allProducts
    LicensesService.getProductsAndLicenses()
      .then(function(products){
        $scope.allProducts = products; //incase of error we can recover the list
      });


    $scope.renewProductFeature = function(product, feature){
        var license = feature.license;

        //don't both to renew if we don't have a license
        if ( !license ) {
          return $rootScope.$emit('message', {
            body: product.description + ' ' + feature.description + ' licensing missing or invalid.  If you have questions about your licenses or licensing please contact sales',
            email: 'sales@strongloop.com?subject=Licensing',
            emailText: 'Contact sales@strongloop.com'
          });
        }

        LicensesService.renewProductFeature(product, feature)
          .then(function(res){
            LicensesService.alertProductFeatureValid(product, feature);
          }).catch(function(err){
            $log.error(err);
            LicensesService.alertProductFeatureInvalid(product, feature);
          });
    };
  }]);
