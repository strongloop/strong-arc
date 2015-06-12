Licenses.controller('LicensesMainController', [
  '$scope',
  '$q',
  '$log',
  'LicensesService',
  function ($scope, $q, $log, LicensesService) {
    $scope.errors = {
      renewal: {},
      generic: []
    };

    $scope.hasErrors = false;

    window.setScrollView('.common-instance-view-container');


    $scope.selectLicenseText = function(id){
      $(id).select();
    };

    $scope.copyToClipboard = function(id){
      $log.log(id);
      return $(id).val();
    };

    function handleSuccess(results){

      //handle calls that failed
      results.forEach(function(res){
        if ( res.data && res.data.error ) {
          handleError(res);
        }
      });

      //refresh the list
      LicensesService.getProductsAndLicenses()
        .then(function(products){
          $scope.allProducts = products;
        });
    }

    function handleError(err){
      var error = err.data.error;

      if ( error.message.indexOf('cannot be renewed') ) {
        var id = error.product;
        var humanName = $scope.origProducts[id].info && $scope.origProducts[id].info.description || id;
        var msg = error.message.replace(': '+id, ': ' + humanName);

        error.id = id;
        error.type = 'InvalidRenewal';
        error.title = humanName + ' cannot be renewed';
        error.message = 'Please contact sales@strongloop.com for help';
        $scope.errors.renewal[id] = error;
      } else {
        $scope.hasErrors = true;
        $scope.errors.generic.push(error);
      }

      $log.error(error);
    }

    //perform autorenew and respond with updated products list
    LicensesService.getProductsAndLicenses()
      .then(function(products){
        $scope.origProducts = products; //incase of error we can recover the list

        return LicensesService.getRenewableProducts(products);
      })
      .then(function(product){
        var def = $q.defer();

        LicensesService.renewProducts(product)
          .then(function(data){
            def.resolve(data);
          })
          .catch(function(err){
            def.reject(err);
          });

        return def.promise;
      })
      .then(handleSuccess)
      .catch(handleError);
  }]);
