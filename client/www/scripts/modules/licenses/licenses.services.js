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
      var feature = license.feature;
      var isFeatureAllowed = feature && feature === page.substr(1); //remove '/' in page

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
        var isExpired = expirationDate < now;

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
          var products = data[0]; //remove angular properties from object
          var licenses = data[1];

          //delete extraneous attributes
          delete products['$promise'];
          delete products['$resolved'];

          //embed the license for each product on the object for use in view
          licenses.forEach(function(lic){
            var product = lic.product;
            var feature = lic.feature;
            var expirationDate = moment(lic.expirationDate).unix();
            var now = moment().unix();
            var isExpired = expirationDate < now;

            lic.isExpired = isExpired;

            //apply feature access flag for easy access in view
            if ( products[product] ) {
              products[product].features[feature].access = !isExpired;

              //attach license object to product list
              products[product].features[feature].license = lic;
            }
          });

          return products;
        });
    };

    svc.alertLicenseInvalid = function(license){
      if ( license ){
        $rootScope.$emit('message', {
          body: 'StrongLoop Arc ' + license.name + ' licensing missing or invalid.  If you have questions about your licenses or licensing please contact sales',
          link: '/#licenses',
          linkText: 'Verify your licenses',
          email: 'sales@strongloop.com?subject=Licensing',
          emailText: 'Contact sales@strongloop.com'
        });
      }

    };

    svc.alertProductFeatureInvalid = function(product, feature){
      var license = feature.license;
      var name = product.description === feature.description ? product.description : product.description + ' ' + feature.description;

      $rootScope.$emit('message', {
        body: name + ' licensing missing or invalid.  If you have questions about your licenses or licensing please contact sales',
        email: 'sales@strongloop.com?subject=Licensing',
        emailText: 'Contact sales@strongloop.com'
      });
    };

    svc.alertProductFeatureValid = function(product, feature){
      var productDescription = product.description || '';
      $rootScope.$emit('message', {
        body: productDescription + ' ' + feature.description +' licensing has been renewed'
      });
    };

    svc.renewProductFeature = function(product, feature){
      var userId = ArcUserService.getCurrentUserId();
      var productId = feature.license.product;
      var feature = feature.license.feature;

      return Subscription.renewTrial({ userId: userId }, { product: productId, features: [feature] }).$promise;
    };

    return svc;
  }
]);
