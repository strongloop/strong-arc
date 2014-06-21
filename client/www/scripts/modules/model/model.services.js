// Copyright StrongLoop 2014
Model.service('ModelService', [
  'Modeldef',
  '$q',
  function(Modeldef, $q) {
    var svc = {};

  //  var deferred = $q.defer();
    svc.createModel = function(config) {
      Modeldef.create(config, function(response) {
          console.log('good create model def: ' + response);

      },
      function(response){
        console.log('bad create model def: ' + response);
      });
    };
    svc.getAllModels = function() {
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
      return Modeldef.upsert(model);
    };
    svc.generateModelsFromSchema = function(schemaCollection) {
      if (schemaCollection && schemaCollection.length > 0) {
        for (var i = 0;i < schemaCollection.length;i++) {
          console.log('create this Model: ' + JSON.stringify(schemaCollection[i]));
        }
      }
    };
    svc.getModelByName = function(name) {
      var targetModel = null;
      if (window.localStorage.getItem('ApiModels')) {
        var currModelCollection = JSON.parse(window.localStorage.getItem('ApiModels'));
        //var targetModel = currModelCollection[name];
        for (var i = 0;i < currModelCollection.length;i++) {
          if (currModelCollection[i].name === name) {
            targetModel = currModelCollection[i];
            targetModel.name = name;
            break;
          }
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
//    svc.translateToObjLitDialtect = function(struct) {
//
//    };
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
    return svc;
  }
]);
Model.service('ModelDefinitionService', [
  function() {
    var svc = {};
    var defaultModelSchema = {
      public:true,
      options:{},
      properties:{},
      datasource:'db'
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
