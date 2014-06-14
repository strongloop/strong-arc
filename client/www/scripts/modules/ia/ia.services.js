// Copyright StrongLoop 2014
IA.service('IAService', [
  'AppStorageService',
  'ModelService',
  'DatasourceService',
  function(AppStorageService, ModelService, DatasourceService) {
    var svc = {};

    svc.setPreviewModelInstance = function(instance) {
      return AppStorageService.setItem('previewInstance', instance);
    };
    svc.setPreviewDatasourceInstance = function(instance) {
      return AppStorageService.setItem('previewInstance', instance);
    };
    svc.clearPreviewModelInstance = function() {
      return AppStorageService.removeItem('previewInstance');
    };
    svc.clearPreviewDatasourceInstance = function() {
      return AppStorageService.removeItem('previewInstance');
    };
    svc.getPreviewModelInstance = function() {
      return AppStorageService.getItem('previewInstance');
    };
    svc.getPreviewDatasourceInstance = function() {
      return AppStorageService.getItem('previewInstance');
    };
    svc.setActiveModelInstance = function(instance) {
      return AppStorageService.setItem('activeModelInstance', instance);
    };
    svc.setActiveDatasourceInstance = function(instance) {
      return AppStorageService.setItem('activeDatasourceInstance', instance);
    };
    svc.getActiveModelInstance = function() {
      var instance = AppStorageService.getItem('activeModelInstance');
      if (instance) {
        return instance;
      }
      return {};
    };
    svc.getActiveDatasourceInstance = function() {
      var instance = AppStorageService.getItem('activeDatasourceInstance');
      if (instance) {
        return instance;
      }
      return {};
    };
    svc.addToCurrentModelSelections = function(modelName) {
      var currentSelectedModelNames = AppStorageService.getItem('currentSelectedModelNames');
      var modelRef = {};
      // check if there are already some model instances open
      if (!currentSelectedModelNames) {

        currentSelectedModelNames = [];
      }
      // net new so add to list of open models
      // instantiate model by name
      // set as active model
      if (currentSelectedModelNames.indexOf(modelName) === -1) {
        currentSelectedModelNames.push(modelName);
        AppStorageService.setItem('currentSelectedModelNames', currentSelectedModelNames);
      }
      return currentSelectedModelNames;
    };
    svc.addToCurrentDatasourceSelections = function(datasourceName) {
      var currentSelectedDatasourceNames = AppStorageService.getItem('currentSelectedDatasourceNames');
      // check if there are already some model instances open
      if (!currentSelectedDatasourceNames) {

        currentSelectedDatasourceNames = [];
      }
      // net new so add to list of open models
      // instantiate model by name
      // set as active model
      if (currentSelectedDatasourceNames.indexOf(datasourceName) === -1) {
        currentSelectedDatasourceNames.push(datasourceName);
        AppStorageService.setItem('currentSelectedDatasourceNames', currentSelectedDatasourceNames);
      }
      return currentSelectedDatasourceNames;
    };
    svc.getCurrentModelSelections = function() {
      var currentSelectedModelNames = AppStorageService.getItem('currentSelectedModelNames');
      if (!currentSelectedModelNames) {
        currentSelectedModelNames = [];
      }
      return currentSelectedModelNames;
    };
    svc.getCurrentDatasourceSelections = function() {
      var currentSelectedDatasourceNames = AppStorageService.getItem('currentSelectedDatasourceNames');
      if (!currentSelectedDatasourceNames) {
        currentSelectedDatasourceNames = [];
      }
      return currentSelectedDatasourceNames;
    };
    svc.clearSelectedModelNames = function() {
      var currentSelectedModelNames = [];
      AppStorageService.setItem('currentSelectedModelNames', currentSelectedModelNames);
      return currentSelectedModelNames;
    };
    svc.clearSelectedDatasourceNames = function() {
      var currentSelectedDatasourceNames = [];
      AppStorageService.setItem('currentSelectedDatasourceNames', currentSelectedDatasourceNames);
      return currentSelectedDatasourceNames;
    };
    svc.getOpenModelNames = function() {
      var retModels = AppStorageService.getItem('currentOpenModelNames');
      if (!retModels) {
        retModels = [];
      }
      return retModels;
    };
    svc.getOpenDatasourceNames = function() {
      var retDatasoruces = AppStorageService.getItem('currentOpenDatasourceNames');
      if (!retDatasoruces) {
        retDatasoruces = [];
      }
      return retDatasoruces;
    };
    svc.closeModelByName = function(name) {
      var currentOpenModelNames = AppStorageService.getItem('currentOpenModelNames');
      if (currentOpenModelNames && (currentOpenModelNames.length > 0)) {
        currentOpenModelNames.splice(currentOpenModelNames.indexOf(name), 1);
        AppStorageService.setItem('currentOpenModelNames', currentOpenModelNames);
      }
      return currentOpenModelNames;
    };
    svc.closeDatasourceByName = function(name) {
      var currentOpenDatasourceNames = AppStorageService.getItem('currentOpenDatasourceNames');
      if (currentOpenDatasourceNames && (currentOpenDatasourceNames.length > 0)) {
        currentOpenDatasourceNames.splice(currentOpenDatasourceNames.indexOf(name), 1);
        AppStorageService.setItem('currentOpenDatasourceNames', currentOpenDatasourceNames);
      }
      return currentOpenDatasourceNames;
    };
    svc.activateModelByName = function(name) {
      var currentOpenModelNames = AppStorageService.getItem('currentOpenModelNames');
      var modelRef = {};
      // check if there are already some model instances open
      if (currentOpenModelNames) {
        // net new so add to list of open models
        // instantiate model by name
        // set as active model
        if (currentOpenModelNames.indexOf(name) === -1) {
          currentOpenModelNames.push(name);
          AppStorageService.setItem('currentOpenModelNames', currentOpenModelNames);
        }
      }
      else {
        // there are no current open models
        currentOpenModelNames = [name];
        AppStorageService.setItem('currentOpenModelNames', currentOpenModelNames);

      }
      var newActiveModel = ModelService.getModelByName(name);
      svc.setActiveModelInstance(newActiveModel);
      return newActiveModel;
    };
    svc.activateDatasourceByName = function(name) {
      var currentOpenDatasourceNames = AppStorageService.getItem('currentOpenDatasourceNames');

      // check if there are already some model instances open
      if (currentOpenDatasourceNames) {
        // net new so add to list of open models
        // instantiate model by name
        // set as active model
        if (currentOpenDatasourceNames.indexOf(name) === -1) {
          currentOpenDatasourceNames.push(name);
          AppStorageService.setItem('currentOpenDatasourceNames', currentOpenDatasourceNames);
        }
      }
      else {
        // there are no current open models
        currentOpenDatasourceNames = [name];
        AppStorageService.setItem('currentOpenDatasourceNames', currentOpenDatasourceNames);

      }
      var newActiveDatasource = DatasourceService.getDatasourceByName(name);
      svc.setActiveDatasourceInstance(newActiveDatasource);
      return newActiveDatasource;
    };
    return svc;
  }
]);
