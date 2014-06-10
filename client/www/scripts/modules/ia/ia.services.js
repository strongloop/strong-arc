// Copyright StrongLoop 2014
IA.service('IAService', [
  'AppStorageService',
  'ModelService',
  function(AppStorageService, ModelService) {
    var svc = {};

    svc.setPreviewModelInstance = function(instance) {
      return AppStorageService.setItem('previewInstance', instance);
    };
    svc.clearPreviewModelInstance = function() {
      return AppStorageService.removeItem('previewInstance');
    };
    svc.getPreviewModelInstance = function() {
      return AppStorageService.getItem('previewInstance');
    };
    svc.setActiveModelInstance = function(instance) {
      return AppStorageService.setItem('activeModelInstance', instance);
    };
    svc.getActiveModelInstance = function() {
      var instance = AppStorageService.getItem('activeModelInstance');
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
    svc.getCurrentModelSelections = function() {
      var currentSelectedModelNames = AppStorageService.getItem('currentSelectedModelNames');
      if (!currentSelectedModelNames) {
        currentSelectedModelNames = [];
      }
      return currentSelectedModelNames;
    };
    svc.clearSelectedModelNames = function() {
      var currentSelectedModelNames = [];
      AppStorageService.setItem('currentSelectedModelNames', currentSelectedModelNames);
      return currentSelectedModelNames;
    };
    svc.getOpenModelNames = function() {
      var retModels = AppStorageService.getItem('currentOpenModelNames');
      if (!retModels) {
        retModels = [];
      }
      return retModels;
    };
    svc.closeModelByName = function(name) {
      var currentOpenModelNames = AppStorageService.getItem('currentOpenModelNames');
      if (currentOpenModelNames && (currentOpenModelNames.length > 0)) {
        currentOpenModelNames.splice(currentOpenModelNames.indexOf(name), 1);
        AppStorageService.setItem('currentOpenModelNames', currentOpenModelNames);
      }
      return currentOpenModelNames;
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
    return svc;
  }
]);
