Licenses.service('LicensesService', [
  '$q',
  '$http',
  '$rootScope',
  '$log',
  'ArcUserService',
  'Subscription',
  function ($q, $http, $rootScope, $log, ArcUserService, Subscription) {
    var svc = this;

    svc.getAllProducts = function(){
      return Subscription.getProducts().$promise;
    };

    svc.getArcFeatures = function(){
      return svc.getAllProducts()
        .then(function(products){
          return products.arc.features;
        });
    };

    svc.getLicenses = function() {
      var userId = ArcUserService.getCurrentUserId();

      return Subscription.getSubscriptions({ userId: userId }).$promise;
    };


    function isLicenseInvalid(license, page, slProduct){
      var now = moment().unix();
      var isArcLicense = license.product === slProduct;

      var expirationDate = moment(license.expirationDate).unix();
      var isExpired = expirationDate < now; //if expired

      //skip feature check on non-arc licenses as they don't apply here
      if ( !isArcLicense ) return false;

      //check features allowed
      var features = license.features.split(', ');
      var isFeatureAllowed = features && _.contains(features, page.substr(1)); //remove '/' in page

      return isExpired || !isFeatureAllowed
    }

    //check arc licenses on accessing route
    svc.getInvalidLicenses = function(data, page, product){
      var licenses = data;
      var slProduct = product || 'arc';

      var retVal = [];

      licenses.map(function(license) {
        if (isLicenseInvalid(license, page, slProduct)) {
          retVal.push(license);
        }
      });
      return retVal;
    };

    //for arc routes handling
    svc.renewLicenses = function(licenses){
      function renew(license){
        var userId = ArcUserService.getCurrentUserId();

        return svc.getArcFeatures()
          .then(function(arcFeatures){
            return Subscription.renewTrial({ userId: userId }, { product: 'arc', features: arcFeatures }).$promise;
          });
      }

      return $q.all(licenses.map(renew));
    };

    svc.validateLicenses = function(page){
      return svc.getLicenses()
        .then(function(data){
          return svc.getInvalidLicenses(data, page);
        })
        .then(svc.renewLicenses)
        .catch(function(err){
          $log.error(err);

          return err;
        });
    };

    //for licensing page
    svc.renewProducts = function(toRenew){
      var userId = ArcUserService.getCurrentUserId();
      var renewArr = [];

      function renewProduct(product){
        var def = $q.defer();

        Subscription.renewTrial({ userId: userId }, { product: product.id, features: product.features }).$promise
          .then(function(data){
            def.resolve(data);
          })
          .catch(function(err){
            //resolve w/ error so failed call doesn't block the rest
            def.resolve(err);
          });

        return def.promise;
      }

      //convert object w/ keys to an array for use by $q.all map
      for ( var id in toRenew ) {
        toRenew[id].id = id;
        renewArr.push(toRenew[id]);
      }

      return $q.all(renewArr.map(renewProduct));
    };

    svc.getRenewableProducts = function(products){
      var def = $q.defer();
      var productKeys = Object.keys(products);

      //if any features or licenses are not enabled, renew them
      var toRenew = {};

      productKeys.map(function(id){
        var product = products[id];
        var license = product.license || {};
        var access = license.access || {};
        var expirationDate = moment(license.expirationDate).unix();
        var now = moment().unix();
        var isExpired = expirationDate < now+86400*1;

        toRenew[id] = {};

        //check for at least one missing feature
        for ( var i=0; i<product.features.length; i++ ) {
          var feature = product.features[i];

          if ( !access[feature] ) {
            //renew all features as the api doesn't allow us to renew just one feature
            toRenew[id].features = product.features;
            break;
          }
        }

        //also renew if the license is expired
        if ( isExpired ) {
          toRenew[id].features = product.features;
        }

        //remove the products that have no features to be renewed
        for ( var id in toRenew ) {
          if (!toRenew[id].features ) {
            delete toRenew[id];
          }
        }
      });

      $log.log('toRenew', toRenew);

      def.resolve(toRenew);

      return def.promise;
    };

    svc.validateModuleLicense = function(moduleName, product) {
      // query license service for users current license data
      return svc.getLicenses()
        .then(function(response) {
          /*
           * check the license data returned for metrics license
           * - if this method returns a payload it means the license is invalid
           * */
          var invalidLicenses = svc.getInvalidLicenses(response, '/' + moduleName.toLowerCase(), product);
          if (invalidLicenses.length) {
            svc.alertLicenseInvalid({name:moduleName});
            return false;
          }
          return true;
        });
    };


    svc.getProductsAndLicenses = function(){
      return $q.all([svc.getAllProducts(), svc.getLicenses()])
        .then(function(data){
          var products = JSON.parse(angular.toJson(data[0])); //remove angular properties from object
          var licenses = data[1];
          var productKeys = Object.keys(products);

          //embed the license (if any) for each product on the object for use in view
          productKeys.map(function(id){
            //check user licenses and add them to product list
            licenses.forEach(function(lic){
              var expirationDate = moment(lic.expirationDate).unix();
              var now = moment().unix();
              var isExpired = expirationDate < now+86400*1;

              if ( lic.product === id ) {
                var features = lic.features.split(', ');
                lic.access = {};
                lic.isExpired = isExpired;

                //apply feature access flag for easy access in view
                features.map(function(feature){
                  lic.access[feature] = true;
                });

                products[id].license = lic;
              }
            });
          });

          $log.log('products', products);

          return products;
        });
    };

    svc.alertLicenseInvalid = function(license){
      if ( license ){
        $rootScope.$emit('message', {
          body: 'StrongLoop Arc ' + license.name + ' licensing missing or invalid.  If you have questions about your licenses or licensing please contact sales',
          link: '/#licenses',
          linkText: 'Verify your licenses',
          email: 'mailto:sales@strongloop.com?subject=Licensing',
          emailText: 'Contact sales@strongloop.com'
        });
      }

    };

    return svc;
  }
]);
