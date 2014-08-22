// Copyright StrongLoop 2014
IA.service('IAService', [
  '$modal',
  'AppStorageService',
  'ModelService',
  'PropertyService',
  'DataSourceService',
  '$q',
  function($modal, AppStorageService, ModelService, PropertyService, DataSourceService, $q) {
    var svc = {};

    var currentlySelected = [];
    var globalExceptionStack = [];

    svc.getContainerWidth = function(selector) {
      if (selector) {
        return jQuery(selector).width();
      }
      return 0;
    };
    svc.openContainer = function(selector) {
      var dragTabWidth = 20;
      var mainWidth = (svc.getMainContentWidth() - dragTabWidth);
      jQuery(selector).animate({width: mainWidth}, 500 );

    };
    svc.closeContainer = function(selector) {
      return jQuery(selector).animate({width: 60}, 500 );
    };
    svc.getMainContentWidth = function() {
      return svc.getContainerWidth('[data-id="MainContentContainer"]');
    };
    svc.getViewportWidth = function() {
      return (window.innerWidth - 40);
    };

    /*
    *
    * Exception Handling
    *
    * */
    svc.setGlobalException = function(config) {
      if (config.message) { // barrier to entry
        globalExceptionStack.push(config);
      }
      return globalExceptionStack;
    };
    svc.clearGlobalExceptionStack = function() {
      return globalExceptionStack = [];
    };
    svc.getGlobalExceptionStack = function() {
      return globalExceptionStack;
    };

   // instances

    svc.getOpenInstanceRefs = function() {
      var retRefs = AppStorageService.getItem('openInstanceRefs');
      var activeInstance = AppStorageService.getItem('activeInstance');
      // TODO clean this up
      // make sure we don't have left overs from an abandoned create new model flow
      if (!retRefs) {
        retRefs = [];
      }
      if ((!activeInstance) || (!activeInstance.name)) {
        if ((retRefs.length === 1) && (!retRefs[0].id)) {
          // clear retRefs
          retRefs = [];
          AppStorageService.setItem('openInstanceRefs', retRefs);
        }
      }
      return retRefs;
    };
    // aka remove instance ref
    svc.closeInstanceById = function(id) {
      var sourceInstances = svc.getOpenInstanceRefs();
      for (var i = 0;i < sourceInstances.length;i++) {
        if (sourceInstances[i].id === id) {
          sourceInstances.splice(i, 1);
          break;
        }
      }
      AppStorageService.setItem('openInstanceRefs', sourceInstances);
      return sourceInstances;
    };
    svc.clearActiveInstance = function() {
      AppStorageService.clearActiveInstance();
      return {};
    };
    svc.isNewModelOpen = function() {
      var openInstanceRefs = AppStorageService.getItem('openInstanceRefs');
      if (openInstanceRefs && openInstanceRefs.length) {
        for (var i = 0;i < openInstanceRefs.length;i++) {
          if (openInstanceRefs[i].id === CONST.NEW_MODEL_PRE_ID) {
            return true;
          }
        }
      }
      return false;
    };
    svc.isNewDataSourceOpen = function() {
      var openInstanceRefs = AppStorageService.getItem('openInstanceRefs');
      if (openInstanceRefs && openInstanceRefs.length) {
        for (var i = 0;i < openInstanceRefs.length;i++) {
          if (openInstanceRefs[i].id === CONST.NEW_DATASOURCE_PRE_ID) {
            return true;
          }
        }
      }
      return false;
    };
    svc.clearOpenNewModelReference = function() {
      var openInstanceRefs = AppStorageService.getItem('openInstanceRefs');
      for (var i = 0;i < openInstanceRefs.length;i++) {
        if (openInstanceRefs[i].id === CONST.NEW_MODEL_PRE_ID) {
          openInstanceRefs.splice(i,1);
        }
      }
      AppStorageService.setItem('openInstanceRefs', openInstanceRefs);
    };
    svc.clearOpenNewDSReference = function() {
      var openInstanceRefs = AppStorageService.getItem('openInstanceRefs');
      for (var i = 0;i < openInstanceRefs.length;i++) {
        if (openInstanceRefs[i].id = CONST.NEW_DATASOURCE_PRE_ID) {
          openInstanceRefs.splice(i,1);
        }
      }
      AppStorageService.setItem('openInstanceRefs', openInstanceRefs);

    };
    svc.activateInstanceById = function(id, type) {
      var deferred = $q.defer();
      var openInstanceRefs = AppStorageService.getItem('openInstanceRefs');

      var newInstance = {};
      var isOpen = false;
      var instanceType = type;

      if (openInstanceRefs) {
        // first check if it is open already
        for (var i = 0;i < openInstanceRefs.length;i++) {

          if (openInstanceRefs[i].id === id) {
            isOpen = true;
            instanceType = openInstanceRefs[i].type;
            break;

          }
        }
      }



      // activate instance from respective repository
      switch(instanceType) {

        case 'model':
          // may be new model instance
          if (id === CONST.NEW_MODEL_PRE_ID) {
            // so don't try to initialize against server
            deferred.resolve(ModelService.createNewModelInstance());
          }
          else {
            newInstance = ModelService.getModelById(id).
              then(function(instance) {
                instance.type = 'model';
                svc.setActiveInstance(instance, instance.type);
                if (!isOpen) {
                  var currRefs = AppStorageService.getItem('openInstanceRefs');
                  if (!currRefs) {
                    currRefs = [];
                    AppStorageService.setItem('openInstanceRefs', currRefs);
                  }
                  currRefs.push({id: instance.id, name:instance.name,type:instanceType});
                  AppStorageService.setItem('openInstanceRefs', currRefs);
                }
                return deferred.resolve(instance);

              }
            );
          }


          break;

        case 'datasource':
          // may be new model instance
          if (id === CONST.NEW_DATASOURCE_PRE_ID) {
            // so don't try to initialize against server
            deferred.resolve(DataSourceService.createNewDataSourceInstance());
          }
          else {
            newInstance = DataSourceService.getDataSourceById(id).
              then(function(instance) {
                instance.type = 'datasource';
                svc.setActiveInstance(instance, instance.type);
                if (!isOpen) {
                  var currRefs = AppStorageService.getItem('openInstanceRefs');
                  if (!currRefs) {
                    currRefs = [];
                    AppStorageService.setItem('openInstanceRefs', currRefs);
                  }
                  currRefs.push({id: instance.id, name:instance.name,type:instanceType});
                  AppStorageService.setItem('openInstanceRefs', currRefs);
                }
                return deferred.resolve(instance);

              }
            );
          }



          break;

        default:
          // there is no instance type
          console.warn('trying to open instance by name but no type available: ' + id);


      }


      return deferred.promise;

    };
    svc.setActiveInstance = function(instance, type) {
      var targetInstance = instance;
      targetInstance.type = type;
      AppStorageService.setItem('activeInstance', targetInstance);
      return targetInstance;
    };
    svc.addInstanceRef = function(instanceRefObj) {
      if(instanceRefObj.id && instanceRefObj.name && instanceRefObj.type) {
        var currOpenInstanceRefs = svc.getOpenInstanceRefs();
        var instanceIsOpen = false;
        for (var i = 0;i < currOpenInstanceRefs.length;i++) {
          if (currOpenInstanceRefs[i].id === instanceRefObj.id) {
            instanceIsOpen = true;
            return currOpenInstanceRefs;
          }
        }
        if (!instanceIsOpen) {
          currOpenInstanceRefs.push(instanceRefObj);
          svc.updateOpenInstanceRefs(currOpenInstanceRefs);
          return currOpenInstanceRefs;

        }
      }
    };
    svc.updateOpenInstanceRefs = function(instanceRefs) {
      AppStorageService.setItem('openInstanceRefs', instanceRefs);
    };

    svc.getActiveInstance = function() {
      var deferred  = $q.defer();
      // getting the active instance
      // should already pre-exist
      // may already have properties
      //
      var instance = AppStorageService.getItem('activeInstance');

      if (instance) {

        switch (instance.type) {

          case CONST.MODEL_TYPE:
            // get the model definition from the api
            instance = ModelService.getModelById(instance.id).
              then(function(response) {
                deferred.resolve(response);
              });
            break;

          case CONST.DATASOURCE_TYPE:
            // get the model definition from the api
            instance = DataSourceService.getDataSourceById(instance.id).
              then(function(response) {
                deferred.resolve(response);
              });
            break;

          default:
        }

      }
      else {
        deferred.resolve({});
      }
      return deferred.promise;
    };
    /*
    *
    * Helpers
    *
    * */
    svc.getOpenModelNames =  function() {
      var retVal = [];
      var sourceInstances = svc.getOpenInstanceRefs();
      for (var i = 0;i < sourceInstances.length;i++) {
        if (sourceInstances[i].type === 'model') {
          retVal.push(sourceInstances[i].name);
        }
      }
      return retVal;
    };
    svc.getOpenDatasourceNames =  function() {
      var retVal = [];
      var sourceInstances = svc.getOpenInstanceRefs();
      for (var i = 0;i < sourceInstances.length;i++) {
        if (sourceInstances[i].type === 'datasource') {
          retVal.push(sourceInstances[i].name);
        }
      }
      return retVal;
    };
    svc.getInstanceType = function(instance) {
      var instanceName = instance;
      if(instance.type) {
        return instance.type;
      }
      else {
        if (instance.name) {
          instanceName = instance.name;
        }
        var dsDefs = DataSourceService.getAllDatasources();
        for (var i = 0;i < dsDefs.length;i++) {
          if (dsDefs[i].name === instanceName) {
            return 'datasource';
          }
        }
        return 'model';
      }
    };




    /*
     *
     * Selections
     *
     * */
    svc.addToCurrentInstanceSelections = function(instanceName, type) {

      // check if there are already some model instances open
      if (!currentlySelected) {

        currentlySelected = [];
      }
      // net new so add to list of open models
      // instantiate model by name
      // set as active instance
      if (currentlySelected.indexOf(instanceName) === -1) {
        currentlySelected.push(instanceName);

      }
      return currentlySelected;
    };
    svc.getCurrentInstanceSelections = function() {
      return currentlySelected;
    };
    svc.clearInstanceSelections = function() {
      currentlySelected = [];
      return currentlySelected;
    };

    /*
     *
     * end Selections
     *
     *
     * */

    svc.clearViews = function() {
      svc.closeContainer('[data-id="CommonInstanceContainer"]');
    };
    svc.showInstanceView = function() {
      svc.openContainer('[data-id="CommonInstanceContainer"]');
    };

    svc.isViewOpen = function(viewId) {
      var xWidth = jQuery('[data-id="' + viewId + '"]').width();
      if (parseInt(xWidth) > 100) {
        return true;
      }
      return false;
    };

    // rename
    svc.toggleInstanceView = function() {
      if (svc.isViewOpen('CommonInstanceContainer')){
        svc.closeContainer('[data-id="CommonInstanceContainer"]');
      }
      else {
        svc.openContainer('[data-id="CommonInstanceContainer"]');
      }

    };
    svc.openModal = function(config) {
      return $modal.open(config);
    };
    return svc;
  }
]);
