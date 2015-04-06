Manager.controller('ManagerMainController', [
  '$scope',
  '$log',
  '$location',
  'ManagerServices',
  'PMHostService',
  'growl',
  '$timeout',
  '$q',
  '$modal',
  function($scope, $log, $location, ManagerServices, PMHostService, growl,
           $timeout, $q, $modal) {
    $scope.mesh = require('strong-mesh-client')('http://' + $location.host() + ':' + $location.port() + '/manager');
    $scope.currentPM = {};
    var x = 42;
    $scope.loc = {
      host:$location.host(),
      port:$location.port()
    };
    $scope.loading = false;
    $scope.isHostProblem = false;

    $scope.isShowAddHostForm = false;
    $scope.appContext = {
      name:'',
      version: ''
    };

    $scope.isAddHostButtonDisabled = false;
    $scope.addHostTooltipText = '';
    $scope.editHost = {
      host: null,
      env: {}
    };

    $scope.$watch('isAddHostButtonDisabled', function(newVal){
      if ( newVal ) {
        $scope.addHostTooltipText = 'Please finish adding host';
      } else {
        $scope.addHostTooltipText = '';
      }
    });



    $scope.hideHostProblemTooltip = function(host) {
      if (host.hideProblemTooltip === undefined) {
        return host.hideProblemTooltip = true;
      }
      return host.hideProblemTooltip;
    };
    /*
    *
    * Load Balancer
    *
    * */
    $scope.showManagerLoadBalancer = false;
    $scope.toggleManagerLoadBalancer = function() {
      return $scope.showManagerLoadBalancer = !$scope.showManagerLoadBalancer
    };

    $scope.loadBalancer = {};
    $scope.loadLoadBalancer = function() {
      $scope.loadBalancer = $scope.mesh.models.LoadBalancer.find({}, function(err, response) {
        $log.debug('LOAD BALANCER');
        if (err) {
          $log.warn('bad get load balancer');
          return;
        }
        $scope.$apply(function() {
          $scope.loadBalancer = response[0];
        });
      });
    };
    $scope.saveLoadBalancer = function(){
      if ($scope.loadBalancer.host && $scope.loadBalancer.port) {
        $scope.mesh.models.LoadBalancer.create($scope.loadBalancer, function(err, response) {
          growl.addSuccessMessage('load balancer config saved');

          $scope.loadLoadBalancer();

        });
      }

    };
    $scope.deleteLoadBalancer = function(loadBalancer) {
      if (confirm('delete load balancer config?')) {

        $scope.mesh.models.LoadBalancer.deleteById($scope.loadBalancer.id, function(err) {
          if (err) {
            $log.warn('bad load balancer delete: ' + err.message);
          }
        });
        growl.addSuccessMessage('load balancer config removed');
        $scope.loadLoadBalancer();
      }

    };









    /*
    *
    *
    * Status Problem
    *
    * */
    var setAppContext = function() {
      for (var i = 0;i < $scope.hosts.length;i++) {
        if ($scope.hosts[i].app && $scope.hosts[i].app.name) {
          $scope.appContext = {
            name: $scope.hosts[i].app.name,
            version: $scope.hosts[i].app.version
          };
          break;
        }
      }
    };


    $scope.isShowHostActionList = function(host) {
      if (host.isShowActionList === undefined) {
        return host.isShowActionList = false;
      }
      return host.isShowActionList;
    };

    /*
    *
    * Process Host Status
    * - set display text
    * - set display variables
    * - configure problem messages
    *
    * */
    $scope.processHostStatus = function(host) {

      host.status = {
        isProblem: true,
        isActive: false,
        isInactive: false,
        display: 'Problem',
        actionLabel: 'Activate',
        problem: {
          title: '',
          description: ''
        }
      };

      // is there an exception present

      /*
       * non exception problem states
       *
       * - app is failing to start but pm is continuing to try to start app
       * - the wrong app is running
       * - the app is not running on the pm (it has been stopped)
       *
       * */
      /*
      *
      *
      * Exception Present
      *
      *
      * */
      if (host.errorType) {


        $log.warn('- ERROR: ' + host.error.message);
        // connection
        // - connection refused
        // - connection timeout
        switch(host.errorType) {
          case 'connection': {

            switch (host.error.message) {

              case 'getaddrinfo ENOTFOUND':
                host.status.problem.title = 'No PM Host Server';
                host.status.problem.description = 'There does not seem to be a server at this address';

                break;

              case 'connect ECONNREFUSED':
                host.status.problem.title = 'No Server';
                host.status.problem.description = 'There was no response from this address. Confirm the server has been provisioned as is currently running at the address.';

                break;

              case 'connect ENETDOWN':

                host.status.problem.title = 'connect ENETDOWN';
                host.status.problem.description = 'connect ENETDOWN';

                break;

              default:
                host.status.problem.title = 'connection error';
                host.status.problem.description = host.error.message;

            }

            break;
          }
          default:
            host.status.problem.title = 'unknown exception: ' + host.errorType;
            host.status.problem.description = host.error.message;

        }

      }
      /*
      *
      *
      * Non Exception Problems
      *
      * */
      else {

        // we have an app
        if (host.app) {

          if (host.app.name === $scope.appContext.name) {
            if (host.app.version === $scope.appContext.version) {
              /*
               *
               * Ding ding ding
               *
               * */
              if (host.processes.pids.length > 0) {
                growl.addSuccessMessage("status change: 'Active'");
                host.status = {
                  isProblem: false,
                  isActive: true,
                  display: 'Active',
                  actionLabel: '',
                  problem: {
                    title: '',
                    description: ''
                  }
                };
              }
              else {
                host.status.isProblem = false;
                host.status.isActive = false;
                host.status.isInactive = true;
                host.status.display = 'Inactive';
                host.status.problem.title = 'The app is not running';
                host.status.problem.description = 'The app is not running. Click start in the action menu to start it';
              }
            }
            // app version doesn't match
            else {
              host.status.problem.title = 'The wrong app version';
              host.status.problem.description = 'The app version running on this host instance does not match the current context';
            }
          }
          // app name doesn't match
          else {
            host.status.problem.title = 'The wrong app name';
            host.status.problem.description = 'The app name running on this host instance does not match the current context';
          }

        }
        // there is no app here
        else {

          host.status.problem.title = 'No app found';
          host.status.problem.description = 'There is no app here. Try clicking start in the action menu to start it';
        }
      }

      growl.addSuccessMessage("status change: " + host.status.display);
      return host;
    };

    $scope.toggleHostActions = function(host) {
      if (host.isShowActionList === undefined) {
        host.isShowActionList = true;
      }
      else {
        host.isShowActionList = !host.isShowActionList
      }

    };

    //remove default host from list
    $scope.pmServers = PMHostService.getPMServers().filter(function(item){
      return item.port !== '----';
    });

    //used by 'add new host' row
    $scope.onPMServerSelectAutoCompleted = function(item, model){
      $scope[model].host = item.host;
      $scope[model].port = item.port;
    };

    $scope.hideMenu = function(){
      $scope.isOpen = false;
    };


    /*
    *
    * LOAD HOSTS
    *
    * */
    var actionBlackList = [MANAGER_CONST.DELETE_ACTION, MANAGER_CONST.EDIT_ACTION, MANAGER_CONST.ENV_GET_ACTION, MANAGER_CONST.ENV_SET_ACTION]
    function loadHosts() {
      if (!$scope.loading) {
        $scope.loading = true;

        $scope.mesh.models.ManagerHost.find(function(err, hosts) {

          if (hosts && hosts.map) {
            var addressCollection = [];

            //$scope.hostServers = ManagerServices.getHostServers();


            /*
            *
            * Iterate over the hosts to massage the data mode
            * for the ui
            * - filter actions
            * - process problem messages
            * - count processes
            * - display status
            * - set app context
            * - update typeahead data
            *
            * */
            hosts.map(function(host) {

              addressCollection.push({
                host:host.host,
                port:host.port
              });

              /*
              *
              * App Context
              * - set the first app name and version
              * - as long as it isn't already set
              *
              * */
              if (host.app && host.app.name) {
                if (!$scope.appContext.name) {
                  $scope.appContext = {
                    name: host.app.name,
                    version: host.app.version
                  };
                }
              }


              /*
              *
              * Not all actions should be available
              * - edit
              * - delete
              * - get/set env
              *
              * */
              host.filteredActions = [];
              // actions
              host.actions.map(function(action) {
                var addAction = true;
                actionBlackList.map(function(value) {
                  if (value === action) {
                    addAction = false;
                  }
                });
                if (addAction) {
                  host.filteredActions.push(action);
                }

              });

              // display status
              // add 'status' property
              host = $scope.processHostStatus(host);

              host = $scope.processPids(host);



              // processes
              if ((host.app && host.app.name) && (host.app.name !== $scope.appContext.name)) {
                host.actions = [];
                host.processes = {pids:[]};

              }
            });

            $scope.hosts = hosts;
            setAppContext();
            $scope.loading = false;


          }
          else {
            // no hosts returned
            $log.warn('No hosts returned from the backend');
            $scope.loading = false;

          }

        });
      }

    }

    /*
     *
     * Update Process Count
     *
     * */
    $scope.updateProcessCount = function(host) {

      if (host.targetProcessCount < 1) {
        host.targetProcessCount = 1;
      }

      host.action({cmd:"current","sub": "set-size", "size": host.targetProcessCount }, function(err, res) {
        if (err) {
          $log.warn('bad Strong PM host action ' + cmd + ' error: ' + err.message);
        }
        $log.debug('| update pid count: target[' + host.targetProcessCount + ']   actual[' + host.processCount + ']');

      });

    };
    $scope.getProcessCount = function(host) {
      if (!host.processes) {
        return;
      }
      return host.processes.pids.length;
    };

    $scope.processPids = function(host) {
      var retVar = [];
      host.status.isUpdatingProcessCount = false;
      if (!host.processes) {
        host.processCount = 0;
        return host;
      }
      host.processes.pids.map(function(process) {
        if (process.workerId !== 0) {
          retVar.push(process);
        }
      });
      host.processCount = retVar.length;
      host.targetProcessCount = host.processCount;
      host.processes.pids = retVar;
      return host;
    };


    /*
    *
    * Fire Action
    *
    * */
    $scope.fireHostAction = function(host, cmd) {
      growl.addSuccessMessage('pending action: ' +  cmd);

      var command = {cmd:cmd};
      if (cmd === 'cluster-restart') {
        command = {
          cmd: 'current',
          sub: 'restart'
        };
      }

      host.action(command, function(err, res) {
        if (err) {
          $log.warn('bad Strong PM host action ' + cmd + ' error: ' + err.message);
        }
        $log.debug('| hopefully it: ' + cmd);
        loadHosts();
      });
    };


    /*
    *
    *
    *   SOCKET ON CHANGE
    *
    *
    * */
    // get notifications when hosts change
    $scope.mesh.notifications.on('host changed', function() {
      $log.debug('change happened');
      //growl.addSuccessMessage("change happened");
      loadHosts();
    });



    /*
    *
    * Host Stuff
    *
    *
    * */
    $scope.initAddNewPMHost = function() {
      if ( $scope.isAddHostButtonDisabled ) return;

      if (!$scope.isShowAddHostForm) {
        // start the 'add new PM Host flow
        $scope.isShowAddHostForm = true;
        $scope.isAddHostButtonDisabled = true;
      }
    };
    $scope.killNewPMHostForm = function() {
      // start the 'add new PM Host flow
      if (confirm('clear new PM Host form?')) {
        $scope.killForm();
        $scope.isAddHostButtonDisabled = false;
      }
    };
    $scope.killForm = function() {
      $scope.isShowAddHostForm = false;
      $scope.isAddHostButtonDisabled = false;
      $scope.currentPM = {};
    };

    $scope.deleteHost = function(host) {
      if (confirm('delete host?')) {

        $scope.mesh.models.ManagerHost.deleteById(host.id, function(err) {
          if (err) {
            $log.warn(err.message);
          }
          loadHosts();
        });
      }
    };
    $scope.savePM = function() {
      x++;
      if ($scope.currentPM.host && $scope.currentPM.port) {

        $scope.mesh.models.ManagerHost.create($scope.currentPM,
          function(err, inst) {
            $scope.killForm();
            $log.debug('added: ' + inst);
            loadHosts();
          });
      }

    };
    $scope.isHostActive = function(host) {
      host.isHostProblem = true;
      if (!host.exceptionType) {
        // we have an app
        if (host.app) {

          if (host.app.name === $scope.appContext.name) {
            if (host.app.version === $scope.appContext.version) {
              /*
               *
               * Ding ding ding
               *
               * */
              if (host.processes.pids.length > 0) {
                host.isHostProblem = false;
                return true;
              }
            }
          }
        }
      }
      return false;
    };

    $scope.activateHost = function(host) {
      if (host.host && host.port) {
        /*
        *
        * we need a host 'ui wrapper' similar to the
        * 'activeInstance' in composer to allow for ui
        * metadata to exist alongside core data model data
        * without corrupting the backend
        *
        * */
        delete host.filteredActions;
        delete host.isShowActionList;
        delete host.processCount;
        delete host.targetProcessCount;
        delete host.displayStatus;
        delete host.status;

        growl.addSuccessMessage("activate host ");
        $log.debug('|');
        $log.debug('| MESH CALL [SAVE HOST]');
        $log.debug('|');


        host.save(function(err, response) {
          if (err) {
            $log.warn('bad host save: ' + err.message);
          }
          $log.debug('SAVE RESPONSE: ' + JSON.stringify(response));
          loadHosts();
          return host;
        });
      }
    };

    function updateHostEnv(host, env) {
      var deferred = $q.defer();
      var command =  {
        cmd: 'env-set',
        env: env
      };

      if (host) {
        host.action(command, function(err, res) {
          if (err) {
            deferred.reject(err);
          } else {
            deferred.resolve(env);
          }
        });
      }

      return deferred.promise;
    }

    $scope.editHostEnv = function(host) {
      var command = {
        cmd: 'env-get'
      };

      host.action(command, function(err, res) {
        if (err) {
          growl.addErrorMessage('Error retrieving host environment settings.');
          return;
        }

        var modalDlg = $modal.open({
          templateUrl: '/scripts/modules/manager/templates/manager.env.editor.html',
          controller: 'ManagerEnvEditorController',
          size: 'lg',
          resolve: {
            title: function() {
              return 'Environment Variables - ' + host.host;
            },
            env: function() {
              return res.result.env;
            }
          }
        });

        modalDlg.result.then(function(env) {
          updateHostEnv(host, env).then(function() {
            growl.addSuccessMessage('Environment Updated. Restarting process.');
          });
        });
      });
    };

    /*
    *
    * Layout Resize
    *
    * */
    $scope.$watch('hosts', function() {
      window.setScrollView('.manager-main-layout');

    });
    window.onresize = function() {
      window.setScrollView('.manager-main-layout');
    };

    loadHosts();
    $scope.loadLoadBalancer();

    $scope.updateLicense = function(host){
      ManagerServices.updateLicenses(host)
        .then(function(data){
          $log.log(data);
        });
    };
  }
]);

Manager.controller('ManagerEnvEditorController', [
  '$scope',
  '$modalInstance',
  'env',
  'title',
  function($scope, $modalInstance, env, title) {
    function initKeyValuePairs(env) {
      var kvPairs = [];

      if (env) {
        angular.forEach(env, function(value, key) {
          kvPairs.push({
            key: key,
            origKey: key,
            value: value,
            priority: 0
          });
        });
      }

      return kvPairs;
    }

    function genKVObject(env, kvPairs) {
      var obj = {};

      if (kvPairs) {
        kvPairs.map(function(pair) {
          obj[pair.key] = pair.value;

          if (pair.origKey !== null &&
              pair.origKey !== pair.key) {
            // this keeps the variable from getting cleared if it was renamed,
            // but then a new var was created using the old name.
            obj[pair.origKey] = obj[pair.origKey] || null;
          }
        });

        // clean up any leftover deleted variables
        angular.forEach(env, function(value, key) {
          if (!obj.hasOwnProperty(key)) {
            obj[key] = null;
          }
        });
      }

      return obj;
    }

    var newPriority = 1;

    $scope.envVariables = initKeyValuePairs(env);
    $scope.title = title;

    $scope.delete = function(removeVariable) {
      var idx = 0;

      if (removeVariable) {
        idx = $scope.envVariables.indexOf(removeVariable);

        if (idx !== -1) {
          $scope.envVariables.splice(idx, 1);
        }
      }
    };

    $scope.new = function() {
      $scope.envVariables.push({
        origKey: null,
        key: '',
        value: '',
        priority: newPriority++
      });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

    $scope.save = function() {
      $modalInstance.close(genKVObject(env, $scope.envVariables));
    };
  }
]);
