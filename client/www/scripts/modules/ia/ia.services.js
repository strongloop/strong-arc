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

    /*
    *
    * Global Exception Handling
    *
    * */
    svc.setGlobalException = function(errorObj) {
      if (errorObj.message) { // barrier to entry
        // Provide a better description for well-known
        // testConnection & autoupdate errors
        if (errorObj.name === 'InvocationError') {
          switch (errorObj.code) {
            case 'MODULE_NOT_FOUND':
              errorObj.help = 'Run `npm install` in your project and try again.';
              break;
            case 'ER_INVALID_CONNECTOR':
              if (/\boracle\b/.test(errorObj.message)) {
                errorObj.help = [
                  { text: 'Add the connector to your project, configure the environment variables,' },
                  { text: 'restart Arc and try again.' },
                  { text: 'See' },
                  { link: 'http://docs.strongloop.com/display/LB/Installing+the+Oracle+connector',
                    text: 'docs: Installing the Oracle connector' },
                  { text: 'for more information.' }
                ];
                break;
              }

              errorObj.help = [
                { text: 'Add the connector to your project and try again.' },
                { text: 'See' },
                { link: 'http://docs.strongloop.com/display/LB/Connecting+models+to+data+sources#Connectingmodelstodatasources-Installingaconnector',
                  text: 'docs: Installing a connector' },
                { text: 'for more information' }
              ];
              break;
          }
        }
        // Push the exception on the stack.
        globalExceptionStack.push(errorObj);
      }
      return globalExceptionStack;
    };
    svc.clearGlobalExceptionStack = function() {
      return globalExceptionStack = [];
    };
    svc.getGlobalExceptionStack = function() {
      return globalExceptionStack;
    };

    /*
    *
    * End Global Exception
    *
    * --------------------------------
    * */


    /*
    * ---------------------------------
    *
    *
    * Open Instance Refs
    *
    * */
    svc.getOpenInstanceRefs = function() {
      var retRefs = AppStorageService.getItem('openInstanceRefs');
      var activeInstance = AppStorageService.getItem('activeInstance');
      // TODO Sean clean this up
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
          // in case a full blown object gets passed in
          // only persist the relevant parts
          currOpenInstanceRefs.push({
            id: instanceRefObj.id,
            name: instanceRefObj.name,
            type: instanceRefObj.type
          });
          svc.updateOpenInstanceRefs(currOpenInstanceRefs);
          return currOpenInstanceRefs;

        }
      }
    };
    svc.updateOpenInstanceRefs = function(instanceRefs) {
      AppStorageService.setItem('openInstanceRefs', instanceRefs);
    };
    svc.updateOpenInstanceRef = function(id, type, instance) {
      if (id !== undefined) {
        var allInstances = svc.getOpenInstanceRefs();
        allInstances.forEach(function(ref) {
          if (ref.id === id && ref.type === type) {
            // Note that when an instance is renamed,
            // both id and name are changed
            ref.id = instance.id;
            ref.name = instance.name;
          }
        });
        AppStorageService.setItem('openInstanceRefs', allInstances);
      }
    };
    svc.resetActiveToFirstOpenInstance = function(refId) {
      var openInstanceRefs = svc.closeInstanceById(refId);
      var activeInstance = svc.getActiveInstance();
      // reset activeInstace if this is it
      if (activeInstance && (activeInstance.id === refId)) {
        if (openInstanceRefs.length === 0) {
          activeInstance = svc.clearActiveInstance();
          return activeInstance;
        }
        else {
          // active the first instance by default
          return svc.activateInstanceById(openInstanceRefs[0].id, openInstanceRefs[0].type).
            then(function(instance) {
              return instance;
            }
          );
        }
      }
      else {
        console.warn('resetActiveToFirstOpenInstance called where either activeInstance does not exist or activeInstance.id does not equal refId: [' + refId + ']');
        return {};
      }
    };















    /*
    *
    *
    * ACTIVE INSTANCE
    *
    *
    *
    * */
    /*
    *
    * ACTIVATE BY ID
    *
    * - get an instance (model/datasource)
    * -
    *
    * */
    svc.activateInstanceById = function(id, type) {
      var deferred = $q.defer();
      if (type) {
        switch(type) {

          case CONST.MODEL_TYPE:
            // may be new model instance
            if (id === CONST.NEW_MODEL_PRE_ID) {
              // so don't try to initialize against server
              var newInstance = ModelService.createNewModelInstance();
              svc.setActiveInstance(newInstance);
              deferred.resolve(newInstance);
            }
            else {
              ModelService.getModelInstanceById(id).
                then(function(instance) {
                  svc.setActiveInstance(instance);
                  deferred.resolve(instance);
                }).
                catch(function(error) {
                  deferred.reject(error);
                });
            }
            break;

          case CONST.DATASOURCE_TYPE:
            // may be new model instance
            if (id === CONST.NEW_DATASOURCE_PRE_ID) {
              // so don't try to initialize against server
              var newInstance = DataSourceService.createNewDataSourceInstance();
              svc.setActiveInstance(newInstance);
              deferred.resolve(newInstance);
            }
            else {
              DataSourceService.getDataSourceInstanceById(id)
                .then(function(instance) {
                  svc.setActiveInstance(instance);
                  deferred.resolve(instance);
                });
            }
            break;

          default:
            // there is no instance type
            console.warn('trying to open instance by name but no type available: ' + id);
        }
      }
      else {
        console.warn('activateInstanceById called without type argument: ' + id);
      }
      return deferred.promise;
    };
    /*
    *
    * CLEAR ACTIVE INSTANCE
    *
    * */
    svc.clearActiveInstance = function() {
      AppStorageService.clearActiveInstance();
      return {};
    };
     /*
     *
     * SET ACTIVE INSTANCE
     *
     * */
    svc.setActiveInstance = function(instance) {
      AppStorageService.setItem('activeInstance', instance);
      return instance;
    };
    /*
     *
     * GET ACTIVE INSTANCE
     *
     * */
    svc.getActiveInstance = function() {
      // getting the active instance
      // should already pre-exist
      // may already have properties
      //
      return AppStorageService.getItem('activeInstance');


    };
    /*
    *
    * CLEAR ACTIVE INSTANCE
    *
    * */



    /*
    *
    * HELPERS
    *
    * */
    /*
     *
     * Check for existing New Views
     *
     * */
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




    /*
    *
    * MODEL WINDOW
    *
    *
    * */
    svc.openModal = function(config) {
      return $modal.open(config);
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


    return svc;
  }
]);
