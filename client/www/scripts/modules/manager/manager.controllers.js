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
  'LicensesService',
  function($scope, $log, $location, ManagerServices, PMHostService, growl,
           $timeout, $q, $modal, LicensesService) {
    $scope.mesh = require('strong-mesh-client')('http://' + $location.host() + ':' + $location.port() + '/manager');
    $scope.currentPM = {};
    $scope.loc = {
      host:$location.host(),
      port:$location.port()
    };
    $scope.loading = false;
    $scope.isHostProblem = false;

    $scope.isShowAddHostForm = false;


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

    $scope.isShowHostActionList = function(host) {
      if (host.isShowActionList === undefined) {
        return host.isShowActionList = false;
      }
      return host.isShowActionList;
    };

    $scope.toggleHostActions = function(host) {
      if (host.isShowActionList === undefined) {
        host.isShowActionList = true;
      }
      else {
        host.isShowActionList = !host.isShowActionList
      }

    };

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

    // This is used as a prototype for the availableActions entries.
    // Any missing properties will be filled in using the values from
    // here.
    var hostActionDefaults = {
      filter: function(host) {
        return host.actions.indexOf(this.id) >= 0;
      },
      handler: function(host) {
        $scope.fireHostAction(host, this.id);
      }
    };

    // Actions that will available to execute on the managed PMs
    var availableActions = [
        {
          id: MANAGER_CONST.START_ACTION,
          label: 'start'
        },
        {
          id: MANAGER_CONST.STOP_ACTION,
          label: 'stop'
        },
        {
          id: MANAGER_CONST.RESTART_ACTION,
          label: 'restart'
        },
        {
          id: MANAGER_CONST.CLUSTER_RESTART_ACTION,
          label: 'restart cluster'
        },
        {
          id: MANAGER_CONST.ENV_SET_ACTION,
          label: 'edit host environment',
          handler: function(host) {
            $scope.editHostEnv(host);
          }
        },
        {
          id: MANAGER_CONST.LICENSE_PUSH_ACTION,
          label: 'push license',
          handler: function(host) {
            pushLicense(host);
          }
        }
    ];

    function getLicenseKey() {
      var key = $q.defer();

      LicensesService.getLicenses().then(function(licenses) {
        key.resolve(licenses.map(function(s) {
          return s.licenseKey;
        }).join(':'));
      });

      return key.promise;
    }

    function getPmService(host) {
      var deferred = $q.defer();
      var client = host.getPMClient();

      client.serviceList(function(err, service) {
        if (!err && service.length > 0) {
          deferred.resolve(service[0]);
        } else {
          deferred.reject(err);
        }
      });

      return deferred.promise;
    }

    function pushLicense(host) {
      var result = function(err, result) {
        if (err) { $log.log(err); }
      };

      $q.all({service: getPmService(host), licenseKey: getLicenseKey()})
        .then(function(d) {
          if (d.service && d.licenseKey) {
            $timeout(function() {
              d.service.setEnv('STRONGLOOP_LICENSE', d.licenseKey);
            }, 25);
          }
        });
    }

    function loadHosts() {
      if (!$scope.loading) {
        $scope.loading = true;

        $scope.mesh.models.ManagerHost.find(function(err, hosts) {

          if (hosts && hosts.map) {
            var addressCollection = [];

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
              * Not all actions should be available
              * - edit
              * - delete
              * */
              host.filteredActions = availableActions.map(function(action) {
                  return angular.extend({}, hostActionDefaults, action);
                });

              // display status
              // add 'status' property
              host = ManagerServices.processHostStatus(host);
              $timeout(function() {
                $scope.processPids(host);
              }, 10);

            });

            $scope.hosts = hosts;
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
    function updateProcessCount(host) {
      var dfd = $q.defer();
      var action = {
        cmd: 'current',
        sub: 'set-size',
        size: host.targetProcessCount
      };

      host.action(action, function(err, res) {
        if (err) {
          $log.warn('bad Strong PM host action ' + action.sub + ' error: ' + err.message);
          dfd.reject();
          return;
        }

        $log.debug('| update pid count: target[' + host.targetProcessCount + ']   actual[' + host.processCount + ']');
        dfd.resolve(host.targetProcessCount);
      });

      return dfd.promise;
    }

    function resetProcessCountTimeout(host, delay) {
      if (host._processCountTimeout) {
        $timeout.cancel(host._processCountTimeout);
        host._processCountTimeout = null;
      }

      host._processCountTimeout = $timeout(function() {
        host._processCountTimeout = null;
        host.status.isBusy = true;

        updateProcessCount(host).then(function() {
          host.status.isBusy = false;
        });
      }, delay);
    }

    $scope.updateProcessCount = function(host) {
      if (Number.isInteger(host.targetProcessCount)) {
        if (host.targetProcessCount < 1) {
          host.targetProcessCount = 1;
        }

        resetProcessCountTimeout(host, 1000);
      }
    };

    $scope.getProcessCount = function(host) {
      if (!host.processes) {
        return;
      }

      return host.processes.pids.length;
    };

    $scope.isShowPidsLoadingSpinner = function(host) {
      return host.status.isBusy;
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
      if (!host.processSnapshotCount) {
        host.processSnapshotCount = host.processCount;
        host.targetProcessCount = host.processCount;
      }

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
          //if (host.app.name === $scope.appContext.name) {
          //  if (host.app.version === $scope.appContext.version) {
              /*
               *
               * Ding ding ding
               *
               * */
           // }
         // }
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
        delete host.processSnapshotCount;
        delete host.targetProcessCount;
        delete host.displayStatus;
        delete host.status;

        growl.addSuccessMessage("activate host ");

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

      getPmService(host)
        .then(function(service) {
          service.setEnvs(env,
            function(err, result) {
              if (err) {
                deferred.reject(err);
              } else {
                deferred.resolve(result);
              }
            });
        });

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
