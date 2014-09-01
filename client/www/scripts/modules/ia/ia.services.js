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
    * Exception Handling
    *
    * */
    svc.setGlobalException = function(config) {
      if (config.message) { // barrier to entry
        // Provide a better description for well-known
        // testConnection & autoupdate errors
        if (config.name === 'InvocationError') {
          var help;
          switch (config.code) {
            case 'MODULE_NOT_FOUND':
              help = 'Run `npm install` in your project and try again.';
              break;
            case 'ER_INVALID_CONNECTOR':
              help = 'Add the connector to your project and try again.';
              break;
          }
          if (help) {
            if (config.message[config.message.length-1] !== '.')
              config.message += '.';
            config.message += ' ' + help;
          }
        }

        // Push the exception on the stack.
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

    svc.activateInstanceById = function(id, type) {
      var openInstanceRefs = AppStorageService.getItem('openInstanceRefs');

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

        case CONST.MODEL_TYPE:
          // may be new model instance
          if (id === CONST.NEW_MODEL_PRE_ID) {
            // so don't try to initialize against server
            return $q.when(ModelService.createNewModelInstance());
          }
          else {
            return ModelService.getModelById(id)
              .then(setNewActiveInstance);
          }


          break;

        case CONST.DATASOURCE_TYPE:
          // may be new model instance
          if (id === CONST.NEW_DATASOURCE_PRE_ID) {
            // so don't try to initialize against server
            return $q.when(DataSourceService.createNewDataSourceInstance());
          }
          else {
            return DataSourceService.getDataSourceById(id)
              .then(setNewActiveInstance);
          }



          break;

        default:
          // there is no instance type
          console.warn('trying to open instance by name but no type available: ' + id);
          // return a promise that is never finished
          return $q.defer().promise;

      }

      function setNewActiveInstance(instance) {
        svc.setActiveInstance(instance, instanceType);
        if (!isOpen) {
          var currRefs = AppStorageService.getItem('openInstanceRefs');
          if (!currRefs) {
            currRefs = [];
            AppStorageService.setItem('openInstanceRefs', currRefs);
          }
          currRefs.push({id: instance.id, name:instance.name,type:instanceType});
          AppStorageService.setItem('openInstanceRefs', currRefs);
        }
        return instance;
      }

    };

    svc.setActiveInstance = function(instance, type, id) {
      // no type if everything is closed
      if (type) {
        instance.type = type;
      }
      AppStorageService.setItem('activeInstance', instance);
      svc.updateOpenInstanceRef(id, type, instance);
      return instance;
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
            ModelService.getModelById(instance.id).
              then(function(response) {
                deferred.resolve(response);
              });
            break;

          case CONST.DATASOURCE_TYPE:
            // get the model definition from the api
            DataSourceService.getDataSourceById(instance.id).
              then(function(response) {
                deferred.resolve(response);
              });
            break;

          default:
            deferred.reject(new Error(
                'Invalid activeInstance type ' + instance.type));
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

    svc.openModal = function(config) {
      return $modal.open(config);
    };
    return svc;
  }
]);
