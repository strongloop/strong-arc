Licenses.controller('LicensesMainController', [
  '$scope',
  '$q',
  '$log',
  '$timeout',
  '$rootScope',
  'LicensesService',
  function ($scope, $q, $log, $timeout, $rootScope, LicensesService) {
    window.setScrollView('.common-instance-view-container');

    $scope.selectLicenseText = function(id){
      $timeout(function(){
        $(id).select();
      });
    };

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
            getProductsAndLicenses();
          }).catch(function(err){
            $log.error(err);
            LicensesService.alertProductFeatureInvalid(product, feature);
          });
    };

    //get all products and user licenses and merge into allProducts
    function getProductsAndLicenses(){
      LicensesService.getProductsAndLicenses()
        .then(function(products){
          $scope.allProducts = products; //incase of error we can recover the list
        });
    }

    getProductsAndLicenses();
  }]);
