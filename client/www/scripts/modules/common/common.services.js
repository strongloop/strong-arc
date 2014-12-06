// Copyright StrongLoop 2014
Common.service('StringService', [
  'UserPreferenceService',
  function(UserPreferenceService) {
    var svc = {};

    svc.normalizeString = function(origString) {

      var retVal = origString;
      var normalizationStrategy = 'dasherize';

      if (UserPreferenceService.getUserPref('modelNameNormalizationStrategy')) {
        normalizationStrategy = UserPreferenceService.getUserPref('modelNameNormalizationStrategy');
      }

      switch(normalizationStrategy){
        case 'camelize':
          retVal = window.S(retVal).camelize().s;
          break;
        case 'dasherize':
          retVal = window.S(retVal).dasherize().s;
          break;
        default:
          retVal = window.S(retVal).camelize().s;
      }
      return retVal;

    };
    svc.decodeHTMLEntities = function(origString) {
      return window.S(origString).decodeHTMLEntities().s;
    };
    svc.isOnlyAlpha =  function(origString){
      return window.S(origString).isAlpha();
    };
    svc.escapeHTML = function(origString) {
      return window.S(origString).escapeHTML().s;
    };
    svc.humanize = function(origString) {
      return window.S(origString).humanize().s;
    };
    svc.isAlphaNumeric = function(origString) {
      return window.S(origString).isAlphaNumeric();
    };
    svc.slugify = function(origString) {
      return window.S(origString).slugify().s;
    };
    svc.trim = function(origString) {
      return window.S(origString).trim().s;
    };
    svc.underscore = function(origString) {
      return window.S(origString).underscore().s;
    };
    svc.unescapeHTML = function(origString) {
      return window.S(origString).unescapeHTML().s;
    };
    return svc;
  }
]);
Common.service('SampleDataService', [



  function() {
    var svc = {};
    var self = this;

    var defaultIntMin = 1;
    var defaultIntMax = 100;
    var defaultFloatDecimalCount = 2;
    var firstNamesSrc = [
      'Maria',
      'John',
      'Xing',
      'Deng',
      'Nitin',
      'Jamal',
      'Ardan',
      'Avellana',
      'Tracy',
      'Geronimo'
    ];
    var lastNamesSrc = [
      'Smith',
      'Ping',
      'Tsang',
      'Martinez',
      'Dhaliwal',
      'Goldberg',
      'Wilson',
      'Tanner',
      'Van Der Wall',
      'Woodcock'
    ];
    var emailSrc = [
      'tim@tinyhouse.com',
      'jack.brown@megacorp.com',
      'tackytack@godaddy.com',
      'mynameisnotsue@johnycash.io',
      'happyhour777@kmail.com',
      '12344321@numberhaus.dr.gov',
      'wonderbread@simplehost.ca'
    ];
    var booleanSrc = [true, false];


    function randomIntFromInterval(min, max) {
      if (!min){
        min = defaultIntMin;
      }
      if (!max) {
        max = defaultIntMax;
      }
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    svc.getWord = function(options) {
      return chance.word(options);

    };

    svc.getTextSample = function (options) {
      var retVar = svc.getWord(options);
      if (options.fieldName) {

      /*
      * check the fieldName value to see if any patterns exist:
      *
      * - street
      * - first*name
      * - fname
      * - lname
      * - last*name
      * - email
      * - description
      * - phone
      * - mobile
      *
      *
      * */

        // test for a pattern match
        // first name
        if ((options.fieldName.toLowerCase().indexOf('name') > -1) && (options.fieldName.toLowerCase().indexOf('first') > -1)) {
          retVar = svc.getFirstName();
        }
        // last name
        if ((options.fieldName.toLowerCase().indexOf('name') > -1) && (options.fieldName.toLowerCase().indexOf('last') > -1)) {
          retVar = svc.getLastName();
        }
        // email
        if (options.fieldName.toLowerCase().indexOf('email') > -1) {
          retVar = svc.getEmailAddress();
        }
        // description
        if (options.fieldName.toLowerCase().indexOf('description') > -1) {
          retVar = chance.paragraph();
        }
        // phone

      }

      return retVar;
    };

    // note there is reduncancy here
    svc.getEmailSample = function(options) {
      var retVal = svc.getEmailAddress();
      return retVal;
    };

    svc.getNumberSample = function(options) {
      return randomIntFromInterval();
    };

    svc.getDateSample = function(options) {
      return chance.date({string: true})
    };

    svc.getSelectSample = function(options) {
      var retVal = [
        {
          id:'1',
          name:'Option 1',
          value:'option_1'
        },
        {
          id:'2',
          name:'Option 2',
          value:'option_2'
        },
        {
          id:'3',
          name:'Option 3',
          value:'option_3'
        },
        {
          id:'4',
          name:'Option 4',
          value:'option_4'
        }
      ];
      return retVal;
    };

    /*
    *
    *         var newOption = {
     "option_id" : option_id,
     "option_title" : "Option " + option_id,
     "option_value" : option_id
     };
    *
    * */
    svc.getSelectValue = function(options) {
      return String(2);
    };

    svc.getValueFromOptions = function(options) {
      if (options instanceof Array) {
        var arrayLen = options.length;
        var index = randomIntFromInterval(0, (arrayLen - 1));
        var rawValue = options[index];
        if (rawValue.id) {
          return rawValue.id;
        }
        if (rawValue.value) {
          return rawValue.value;
        }
        return options[index];
      }
    };

    /*
    *
    * Number
    *
    * */
    // integer
    svc.getInteger = function(min, max) {
      return randomIntFromInterval(min, max);
    };
    // range / random
    // length
    // float
    svc.getFloat = function(options) {
      var innerOptions = {};
      if (options){
        innerOptions = options;
      }
      if (!innerOptions.decimalPlaces) {
        innerOptions.decimalPlaces = defaultFloatDecimalCount;
      }
      var sourceInt = randomIntFromInterval();
      var sourceFloat = sourceInt / randomIntFromInterval();

      return parseFloat(sourceFloat).toFixed(innerOptions.decimalPlaces);

    };
    // number of decimals
    // size of number
    // range / random
    // percent
    // cost/price

    /*
    *
    * string
    *
    * */
    // json
    // names
    svc.getFirstName = function() {
      var maxIndex = (firstNamesSrc.length - 1);
      var index = randomIntFromInterval(0, maxIndex);
      return firstNamesSrc[index];
    };
    svc.getLastName = function() {
      var maxIndex = (lastNamesSrc.length - 1);
      var index = randomIntFromInterval(0, maxIndex);
      return lastNamesSrc[index];
    };
    // emails
    svc.getEmailAddress = function() {
      var maxIndex = (emailSrc.length - 1);
      var index = randomIntFromInterval(0, maxIndex);
      return emailSrc[index];
    };
    // title

    // markup/markdown/json
    // code example
    // big chunks
    // phone number
    // uuid

    /*
    *
    * id
    *
    * */
    // uuid
    // incrementing number

    /*
    *
    * boolean
    *
    * */
    // true/false on/off checked/unchecked enabled/disabled
    svc.getBoolean = function() {
      var index = randomIntFromInterval(0, 1);
      return booleanSrc[index];
    };

    /*
    *
    * array
    *
    * */
    // select
    // multiple choice

    /*
    *
    * buffer
    *
    * */
    // file upload

    /*
    *
    * Object
    *
    * */
    // ?

    /*
    *
    * date
    *
    * */
    // use moment?
    svc.getDate  = function(options){
      return Date.now();
    };

    svc.getSampleSelectOptions = function(options) {
      return svc.getSelectSample(options);
    };

    svc.getSampleValue = function(options) {
      var innerObj = {
        dataType: 'text',
        options: {}
      };
      if (options.dataType) {
        innerObj.dataType = options.dataType;
      }
      if (options.options) {
        innerObj.options = options.options;
      }
      if (options.fieldName) {
        innerObj.options.fieldName = options.fieldName;
      }

      switch(innerObj.dataType) {

        case 'text':
          return svc.getTextSample(innerObj.options);
          break;

        case 'email':
          return svc.getEmailSample(innerObj.options);
          break;

        case 'number':
          return svc.getNumberSample(innerObj.options);
          break;

        case 'textarea':
          innerObj.options.fieldName += 'description';
          return svc.getTextSample(innerObj.options);
          break;

        case 'date':
          return svc.getDateSample(innerObj.options);
          break;

        case 'select':
          return svc.getSelectValue(innerObj.options);
          break;



        default:
          return svc.getTextSample(innerObj.options);

      }
    };

     return svc;
  }
]);

Common.service('WorkspaceService', [
  'Workspace',
  'Facet',
  '$q',
  function WorkspaceService(Workspace, Facet, $q) {
    var svc = this;

    svc.validate = function() {
      return Facet.find()
        .$promise
        .then(function(list) {
          var facetNames = list.map(function(f) { return f.name; });
          var errorMessage;
          if (facetNames.indexOf('server') === -1) {
            errorMessage = 'Missing `server` facet.';
          } else if (facetNames.indexOf('common') === -1) {
            errorMessage = 'Missing `common` facet.';
          }

          if (!errorMessage) {
            svc.validationError = null;
            return true;
          }

          var error = new Error(errorMessage);
          error.code = 'E_INVALID_WORKSPACE';
          svc.validationError = error;
          return false;
        });
    };
    svc.stopApp = function() {
      return Workspace.stop().$promise;
    };
    svc.startApp = function() {
      return Workspace.start().$promise;
    };
    svc.isAppRunning = function() {
      return Workspace.isRunning().$promise;
    };
  }
]);
// TODO migrate the strong-pm to its own module (part of start/stop story)
/*
*
* A set of services to add convenience to the user by remembering a list of
* last used strong-pm server host/ports
*
* this is used in Common PID selector component help the user preserved context
* accrsss the app modules
*
* currently it only shows the last successful server reference but it does store
* each unique reference for further enhancement:
* i.e choosing from a list of previously used host/port combos
*
* */
Common.service('CommonPMService', [
  '$log',
  function($log) {
    var svc = this;

    svc.getPMServers = function() {
      var pmServers = JSON.parse(window.localStorage.getItem('pmServers'));
      if (pmServers) {
        return pmServers;
      }
      return [];
    };
    svc.clearPMServers = function() {
      window.localStorage.removeItem('pmServers');
      return [];
    };
    svc.addPMServer = function(serverConfig) {
      // check the list to see if it exists
      // if it does then make it the most recent
      // dont' add dup
      var pmServers = JSON.parse(window.localStorage.getItem('pmServers'));
      if (!pmServers) {
        pmServers = [];
      }
      if (serverConfig.host && serverConfig.port) {
        for (var i = 0;i < pmServers.length;i++) {
          if ((serverConfig.host === pmServers[i].host) && (serverConfig.port === pmServers[i].port)) {
            pmServers.splice(i,1);
            break;
          }
        }
        pmServers.push(serverConfig);
      }
      window.localStorage.setItem('pmServers', JSON.stringify(pmServers));
      return serverConfig;
    };
    svc.getLastPMServer = function() {
      // get the last entry in the array
      var pmServers = JSON.parse(window.localStorage.getItem('pmServers'));

      if (pmServers) {
        return pmServers[pmServers.length - 1];
      }
      return {
        server: '',
        port: 0
      };
    };

    return svc;
  }
]);
Common.service('CommonPidService', [
  '$log',
  'growl',
  'CommonPMServerService',
  'CommonPMServiceInstance',
  'CommonPMServiceProcess',
  function($log, growl, CommonPMServerService, CommonPMServiceInstance, CommonPMServiceProcess) {

    var svc = this;

    /**
     * Initial integration with strong-pm
     * - assumes first service and instance 'instance'
     * */
    svc.getDefaultPidData = function(serverConfig, id) {
      return CommonPMServerService.find(serverConfig, {id:id})
        .then(function(response) {
          if (!response.length) {
            $log.warn('no services found for id: ' + id);
            growl.addWarnMessage('no services found for id: ' + id)
            return [];
          }
          else {
            // assume first found for now
            var firstService = response[0];

            return CommonPMServiceInstance.find(serverConfig, {serverServiceId: firstService.id})
              .then(function(instances) {
                // first child
                var firstInstance = instances[0];

                return CommonPMServiceProcess.find(serverConfig, {serviceInstanceId: firstInstance.id})
                  .then(function(response) {
                    for (var i = 0;i < response.length;i++) {
                      response[i].status = 'Running';
                    }
                    return response;
                  })
                  .catch(function(error) {
                    $log.error('no service processes returned: ' + error.message);
                  });
              });
          }
        })
        .catch(function(error) {
          $log.error('no service found for id: ' + id + ' ' + error.message);
          throw error;
        });
    };

    return svc;
  }

]);

/**
 *
 * Abstractions in lieu of Angular SDK interface
 *
 * */
Common.service('CommonPMServerService', ['$http', '$log',
  function($http, $log) {
    return {
      find: function(serverConfig, filter) {
        var apiRequestPath = 'http://' + serverConfig.host + ':' + serverConfig.port + '/api/Services';
        return $http({
          url: apiRequestPath,
          method: "GET",
          params: {where:filter}
        })
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            $log.error(error.message + ':' + error);
            return error;
          });
      }
    }
  }
]);
Common.service('CommonPMServiceInstance', ['$http', '$log',
  function($http, $log) {
    return {
      find: function(serverConfig, filter) {
        var apiRequestPath = 'http://' + serverConfig.host + ':' + serverConfig.port + '/api/ServiceInstances';
        return $http({
          url: apiRequestPath,
          method: "GET",
          params: {where:filter}
        })
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            $log.error(error.message + ':' + error);
            return error;
          });
      }
    }
  }

]);
Common.service('CommonPMServiceProcess', ['$http', '$log',
  function($http, $log) {
    return {
      find: function(serverConfig, filter) {
        var apiRequestPath = 'http://' + serverConfig.host + ':' + serverConfig.port + '/api/ServiceProcesses';
        return $http({
          url: apiRequestPath,
          method: "GET",
          params: {where:filter}
        })
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            $log.error(error.message + ':' + error);
            return error;
          });
      }
    }
  }

]);
Common.service('CommonPMServiceMetric', [
  '$http', '$log',
  function($http, $log) {
    return {
      find: function(serverConfig, filter) {
        var apiRequestPath = 'http://' + serverConfig.host + ':' + serverConfig.port + '/api/ServiceMetrics';
        return $http({
          url: apiRequestPath,
          method: "GET",
          params: {where:filter}
        })
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            $log.error(error.message + ':' + error);
            return error;
          });
      }
    }
  }

]);
