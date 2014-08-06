// Copyright StrongLoop 2014
Model.service('ModelService', [
  'Modeldef',
  'ModelDefinition',
  '$q',
  'AppStorageService',
  function(Modeldef, ModelDefinition, $q, AppStorageService) {
    var svc = {};
    svc.createModel = function(config) {
      var deferred = $q.defer();
      if (config.name) {



        ModelDefinition.create(config, function(response) {
            console.log('good create model def: ' + response);
            deferred.resolve(response);

          },
          function(response){
            console.log('bad create model def: ' + response);
          });
      }
      return deferred.promise;

    };

    svc.getAllModels = function() {
      var deferred = $q.defer();
      var p = ModelDefinition.find({},
        function(response) {

          //   console.log('good get model defs: '+ response);

          // add create model to this for new model

          var core = response;
          var log = [];
          var models = [];
          angular.forEach(core, function(value, key){
            // this.push(key + ': ' + value);
            var lProperties = [];
            if (value.properties) {
              angular.forEach(value.properties, function(value, key){
                lProperties.push({name:key,props:value});
              });
              value.properties = lProperties;
            }
            var lOptions = [];
            if (value.options) {
              angular.forEach(value.options, function(value, key){
                lOptions.push({name:key,props:value});
              });
              value.options = lProperties;
            }
            models.push({name:key,props:value});
          }, log);


          // $scope.models = models;
          window.localStorage.setItem('ApiModels', JSON.stringify(core));
          //window.localStorage.setItem('ApiModels', JSON.stringify(x));

          deferred.resolve(core);
        },
        function(response) {
          console.log('bad get model defs: ' + response);

        }
      );

      return deferred.promise;
//      return ModelDefinition.query({},
//        function(response) {
//
//          //   console.log('good get model defs: '+ response);
//
//          // add create model to this for new model
//
//          var core = response;
//          var log = [];
//          var models = [];
//          angular.forEach(core, function(value, key){
//            // this.push(key + ': ' + value);
//            var lProperties = [];
//            if (value.properties) {
//              angular.forEach(value.properties, function(value, key){
//                lProperties.push({name:key,props:value});
//              });
//              value.properties = lProperties;
//            }
//            var lOptions = [];
//            if (value.options) {
//              angular.forEach(value.options, function(value, key){
//                lOptions.push({name:key,props:value});
//              });
//              value.options = lProperties;
//            }
//            models.push({name:key,props:value});
//          }, log);
//
//
//          // $scope.models = models;
//          window.localStorage.setItem('ApiModels', JSON.stringify(core));
//          return models;
//        },
//        function(response) {
//          console.log('bad get model defs');
//
//        }
//
//      );
    };

    svc.isNewModelNameUnique = function(name) {
      var retVar = true;

      var existingModels = JSON.parse(window.localStorage.getItem('ApiModels'));
      if (existingModels) {
        for (var i = 0;i < existingModels.length;i++) {
          if (existingModels[i].name === name) {
            retVar = false;
            break;
          }
        }
      }

      return retVar;
    };


     svc.updateModelInstance = function(model) {
      var apiModels = AppStorageService.getItem('ApiModels');
      for (var i = 0;i < apiModels.length;i++) {
        if (apiModels[i].name === model.name) {
          apiModels[i] = model;
          break;
        }
      }
      AppStorageService.setItem('ApiModels', apiModels);
      return Modeldef.upsert(model);
    };
    svc.generateModelsFromSchema = function(schemaCollection) {
      if (schemaCollection && schemaCollection.length > 0) {

        var openInstances = AppStorageService.getItem('openInstanceRefs');
        if (!openInstances) {
          openInstances = [];
        }

        for (var i = 0;i < schemaCollection.length;i++) {
          var sourceDbModelObj = schemaCollection[i];
          // model definition object generation from schema
          // TODO map db source name here
          var newLBModel = {
            name: sourceDbModelObj.name,
            type:'model'

          };
          // open instances reset
          openInstances.push({
            name: sourceDbModelObj.name,
            type:'model'
          });

          var modelProps = {
            public: true,
            plural: sourceDbModelObj.name + 's',
            properties: []
          };
          newLBModel.props = modelProps;


          if (sourceDbModelObj.properties) {
            for (var k = 0;k < sourceDbModelObj.properties.length;k++){
              var sourceProperty = sourceDbModelObj.properties[k];
              var targetDataType = 'string';

              // lock the varchar type
              if (sourceProperty.dataType.toLowerCase().indexOf('varchar') > -1) {
                sourceProperty.dataType = 'varchar';
              }

              // TODO hopefully this conversion will happen in the API
              switch (sourceProperty.dataType) {

                case 'int':
                  targetDataType = 'Number';
                  break;

                case 'varchar':
                  targetDataType = 'String';
                  break;

                case 'datetime':
                  targetDataType = 'Date';
                  break;

                case 'timestamp':
                  targetDataType = 'Date';
                  break;

                case 'char':
                  targetDataType = 'String';
                  break;

                case 'tinytext':
                  targetDataType = 'String';
                  break;

                case 'longtext':
                  targetDataType = 'String';
                  break;

                case 'point':
                  targetDataType = 'GeoPoint';
                  break;

                default:
                  targetDataType = 'String';

              }

              var propertyProps = {
                type:targetDataType
              };
              newLBModel.props.properties.push({
                name:sourceProperty.columnName,
                props:propertyProps
              });

            }

            svc.createModel(newLBModel);

          }


        }
        // open the new models
        AppStorageService.setItem('openInstanceRefs', openInstances);
        // activate the last one
        AppStorageService.setItem('activeInstance', newLBModel);
        // activate the first of the index
        // IAService.activeInstance = svc.activate
        //var nm = IAService.activateInstanceByName(newOpenInstances[0], 'model');

      }
    };
    svc.getModelByName = function(name) {
      var targetModel = null;
      var currModelCollection = [];
      if (window.localStorage.getItem('ApiModels')) {
        currModelCollection = JSON.parse(window.localStorage.getItem('ApiModels'));
        //var targetModel = currModelCollection[name];
        for (var i = 0;i < currModelCollection.length;i++) {
          if (currModelCollection[i].name === name) {
            targetModel = currModelCollection[i];
            targetModel.name = name;
            break;
          }
        }
      }
      else {

          console.log('request to get model data from localstorage cache failed so no model is returned');

      }

      return targetModel;
    };
    svc.getModelById = function(modelId) {
      var targetModel = {};
      var deferred = $q.defer();

      ModelDefinition.findById({id:modelId},
        // success
        function(response) {
          targetModel = response;
          ModelDefinition.properties({id:targetModel.id}, function(response) {
            targetModel.properties = response;
            deferred.resolve(targetModel);
          });

        },
        // fail
        function(response) {
          console.log('bad get model definition');
        }
      );

      return deferred.promise;
    };
    svc.isPropertyUnique = function(modelRef, newPropertyName) {
      var isUnique = true;
      var newNameLen = newPropertyName.length;
      if (!modelRef.properties) {
        modelRef.properties = [];
      }
      for (var i = 0;i < modelRef.properties.length;i++) {
        var xModelProp = modelRef.properties[i];
        if (xModelProp.name.substr(0, newNameLen) === newPropertyName) {
          return false;
        }
      }
      return isUnique;

    };
    var defaultModelSchema = {
      type: 'model',
      facetName: 'common',
      strict: false,
      public: true,
      name:'new-model',
      idInjection: false
    };





    svc.createNewModelInstance = function() {
      var openInstanceRefs = AppStorageService.getItem('openInstanceRefs');
      if (!openInstanceRefs) {
        openInstanceRefs = [];
      }
      var doesNewModelExist = false;
      for (var i = 0;i < openInstanceRefs.length;i++) {
        if (openInstanceRefs[i].name === 'new-model') {
          doesNewModelExist = true;
          break;
        }
      }
      // create new model schema
      if (!doesNewModelExist) {
        openInstanceRefs.push({
          name: defaultModelSchema.name,
          type: 'model'
        });
        AppStorageService.setItem('openInstanceRefs', openInstanceRefs);
      }
      return defaultModelSchema;
    };
    return svc;
  }
]);

