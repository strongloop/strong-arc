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
        return window.localStorage.setItem('ApiModels', JSON.stringify(existingModels));

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
    svc.getAllModelsBak = function() {
      return Modeldef.query({},
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
          return models;
        },
        function(response) {
          console.log('bad get model defs');

        }

      );
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
    svc.getExistingModelNames = function() {
      return [
        'test',
        'testModel',
        'thisIsMyTestModel',
        'helloNewModel',
        'testTest',
        'testTset',
        'newModel'

      ];
    };
    svc.translateToObjectDialect = function(struct) {
      var returnObj = {};
      var objName = '';
      if (struct.name) {
        objName = struct.name;
        // this looks like a
        returnObj[objName] = Object.create(struct);
      }
      if (!returnObj[objName]){
        return struct;
      }
      if (returnObj[objName].properties && (returnObj[objName].properties instanceof Array)) {

        // iterate over each property and create an object for it
        var currPropertiesArray = returnObj[objName].properties;
        returnObj[objName].properties = {};
        for (var i = 0; i< currPropertiesArray.length;i++) {
          var tProperty = currPropertiesArray[i];
          if (tProperty.name) {
            returnObj[objName].properties[tProperty.name] = tProperty;
            //delete returnObj[objName].properties[tProperty][name].name;
          }
        }

      }

      delete returnObj.name;
      return returnObj;

    };
    svc.translateToArrayDialect = function(struct) {
      var returnObj = [];
      var log = {};
      var originalObj = Object.create(struct);
      if (!struct.name) {
        // good sign we are dealing with a named object
        // we need the object name
        angular.forEach(struct, function(value, key){
          returnObj.push({name:key,props:value});
        }, log);
      }


      if (!returnObj[0]){
        return struct;
      }
      if (returnObj[0].props && returnObj[0].props.properties){
        returnObj[0].properties = [];
        var testProps = returnObj[0].props.properties;

        angular.forEach(testProps, function(value, key){
          var newObj = value;
          newObj.name = key;
          returnObj[0].properties.push(newObj);
        }, log);
      }
      delete returnObj[0].props;
      return returnObj[0];

    };
    svc.isModelUnique = function(modelRef) {

      if(modelRef && modelRef.name){
        var newNameLen = modelRef.name.length;
        // iterate over a list of existing model names
        // to confirm this is a unique model name
        // question as to whether the model name should
        // be unique within the api or across your projects
        var existingModelNameList = svc.getExistingModelNames(); // synchronous for now
        var isUnique = true;
        for (var i = 0;i < existingModelNameList.length;i++) {
          var xModelName = existingModelNameList[i];
          if (newNameLen <= xModelName.length){
            if (xModelName.substr(0, newNameLen) === modelRef.name) {
              return false;
            }
          }
        }
        return isUnique;

      }
      return false;
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
      props: {
        public:true,
        options:{},
        properties:[]
      }
    };
    svc.createNewModelInstance = function() {
      return Object.create(defaultModelSchema);
    };
    return svc;
  }
]);
Model.service('ModelDefinitionService', [
  function() {
    var svc = {};
    var defaultModelSchema = {
      type: 'model',
      props: {
        public:true,
        options:{},
        properties:[]
      }
    };
    // get relation types
    svc.getModelRelationTypes = function() {
      return [
        {
          name:'hasMany',
          display:'has many'
        },
        {
          name:'belongsTo',
          display:'belongs to'
        },
        {
          name:'hasAndBelongsToMany',
          display:'has and belongs to many'
        }
      ]
    };
    svc.getModelDataTypes = function() {
      return [
        {
          name:'string',
          number:'1'
        },
        {
          name:'number',
          number:'2'
        },
        {
          name:'boolean',
          number:'3'
        },
        {
          name:'object',
          number:'4'
        },
        {
          name:'array',
          number:'5'
        },
        {
          name:'buffer',
          number:'6'
        },
        {
          name:'date',
          number:'7'
        }
      ];
    };
    svc.getModelBaseProperties = function() {
      return [
        {
          name:'properties',
          type:'object'
        },
        {
          name:'plural',
          type:'string'
        },
        {
          name:'datasource',
          type:'string'
        },
        {
          name:'options',
          type:'object'
        },
        {
          name:'public',
          type:'boolean'
        }

      ];
    };
    svc.getNewModelInstance = function() {
      return Object.create(defaultModelSchema);
    };


    return svc;
  }
]);
