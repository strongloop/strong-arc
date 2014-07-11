// Copyright StrongLoop 2014
Model.service('ModelService', [
  'Modeldef',
  'ModelDefinition',
  '$q',
  'AppStorageService',
  function(Modeldef, ModelDefinition, $q, AppStorageService) {
    var svc = {};

    svc.createModel = function(config) {
      console.log('good create model def: ' + JSON.stringify(config));

     // var existingModels = AppStorageService.getItem('ApiModels');
      // can't use AppStorageService as the api models are kept in the base localStorage
      var existingModels = JSON.parse(window.localStorage.getItem('ApiModels'));
      if (!existingModels) {
        existingModels = [];
      }
      var isUnique = true;
      for (var i = 0;i < existingModels.length;i++){
        if (existingModels[i].name === config.name) {
          isUnique = false;
          break;
        }
      }
      if (isUnique) {
        existingModels.push(config);
//        return AppStorageService.setItem('ApiModels', existingModels);
        return window.localStorage.setItem('ApiModels', JSON.stringify(existingModels));
//        var existingModels = JSON.parse(window.localStorage.getItem('ApiModels'));

      }

//
//      var existingModels = AppStorageService.getItem('ApiModels');
//      if (!existingModels) {
//        existingModels = [];
//      }
//      existingModels.push(config);
//      return AppStorageService.setItem('ApiModels', existingModels);
//      ModelDefinition.create(config, function(response) {
//          console.log('good create model def: ' + response);
//
//      },
//      function(response){
//        console.log('bad create model def: ' + response);
//      });
    };
    svc.getAllModels = function() {
      //return ModelDefinition.query({},
      var deferred = $q.defer();
      var p = Modeldef.query({},
        function(response){




          var models = [];
          var log = [];
          var modelListObj = response[0];
          angular.forEach(modelListObj, function(value, key){
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
              value.options = lOptions;

            }

            models.push({name:key,props:value});
          }, log);

          var x = JSON.parse(window.localStorage.getItem('ApiModels'));

         // window.localStorage.setItem('ApiModels', JSON.stringify(models));
          //var x = JSON.parse(window.localStorage.getItem('ApiModels'));
          if (!x) {

            x = [];


          }
          window.localStorage.setItem('ApiModels', JSON.stringify(x));

          deferred.resolve(x);
        }
      );

      return deferred.promise;

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

        var newOpenInstances = [];

        for (var i = 0;i < schemaCollection.length;i++) {
          var sourceDbModelObj = schemaCollection[i];
          // model definition object generation from schema
          // TODO map db source name here
          var newLBModel = {
            name: sourceDbModelObj.name,
            type:'model'

          };
          // open instances reset
          newOpenInstances.push({
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
        AppStorageService.setItem('openInstanceRefs', newOpenInstances);
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
      }

      return targetModel;
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
      name:'new-model',
      props: {
        public:true,
        options:{},
        properties:[]
      }
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

