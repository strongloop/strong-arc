Profiler.controller('ProfilerMainController', [
  '$scope',
  '$log',
  '$timeout',
  '$interval',
  'ProfilerService',
  'PMServiceProcess',
  'PMServiceInstance',
  'growl',
  function($scope, $log, $timeout, $interval, ProfilerService, PMServiceProcess,
    PMServiceInstance, growl) {

    $scope.activeProcess = null;
    $scope.hasIframe = true;
    $scope.isRemoteValid = false;
    $scope.profiles = [];

    var profilerModes = {
      full: {
        name: 'Full'
      },
      smart: {
        name: 'Smart'
      }
    };

    $scope.processes = [];
    $scope.multiple = false;

    function isValidTarget(profile) {
      return profile.completed || $scope.processes.some(function(worker) {
        return worker.id === profile.targetId;
      });
    }

    function getProfileStatus(profile) {
      if (profile.completed && profile.errored == null) {
        return 'ready';
      }

      if (profile.errored == null) {
        return 'profiling';
      }

      return profile.errored || 'invalid';
    }

    $scope.updateProfiles = function() {
      PMServiceInstance.find($scope.host)
        .then(function(instances) {
          ProfilerService.getCpuProfiles($scope.host, 1)
            .then(function(profiles) {
              profiles.forEach(function(profile) {
                profile.startTime = new Date(profile.startTime);
                profile.status = getProfileStatus(profile);
              });

              $scope.profiles = profiles.filter(isValidTarget);
              $scope.isRemoteValid = true;
            });
        });
    };

    $scope.refreshProcesses = function() {
      var detectChanges = function(oldPids, newPids) {
        var exitSet = [];
        var enterSet = [];
        var changeSet = [];
        var pidMap = {};
        var queue = [].concat(newPids);

        oldPids.map(function(pid) {
          pidMap[pid.id] = {
            found: false,
            pid: pid
          };
        });

        while (queue.length) {
          var pid = queue.pop();

          if (pidMap[pid.id] != null) {
            changeSet.push([pid, pidMap[pid.id].pid]);
            pidMap[pid.id].found = true;
          } else {
            enterSet.push(pid);
          }
        }

        exitSet = oldPids
          .filter(function(d) {
            return pidMap[d.id].found === false;
          });

        return {
          enter: function(cb) {
            enterSet.forEach(cb);
            return this;
          },
          exit: function(cb) {
            exitSet.forEach(cb);
            return this;
          },
          change: function(cb) {
            changeSet.forEach(function(change) {
              cb(change[1], change[0]);
            });

            return this;
          }
        };
      };

      if (!$scope.refreshProcessesCallback) {
        return;
      }

      $scope.refreshProcessesCallback()
        .then(function(processes) {
          detectChanges($scope.processes, processes)
            .exit(function(pid) {
              growl.addInfoMessage('PID ' + pid.pid + ' removed.');
              for (var i = $scope.processes.length - 1; i >= 0; --i) {
                if ($scope.processes[i].id === pid.id) {
                  $scope.processes.splice(i, 1);
                  break;
                }
              }
            })
            .enter(function(pid) {
              growl.addInfoMessage('PID ' + pid.pid + ' added.');
              $scope.processes.push(pid);
            })
            .change(function(oldVal, newVal) {
              if (oldVal.isProfiling !== newVal.isProfiling) {
                growl.addInfoMessage('PID ' + newVal.pid + ' changed status.');
                angular.extend(oldVal, newVal);
                oldVal.status = oldVal.isProfiling ? 'Profiling' : 'Running';
              }
            });

          $scope.updateProfiles();
        });
    };

    $scope.startAutomaticUpdates = function() {
      var pollingInterval = 2000;

      (function update() {
        $scope.refreshProcesses();
        $timeout(update, pollingInterval);
      })();
    };

    function getProcessByPid(pid) {
      var processes = $scope.processes;
      var idx;

      for (idx = 0; idx < processes.length; ++idx) {
        if (processes[idx].pid === pid) {
          return processes[idx];
        }
      }

      return null;
    }

    $scope.checkOptionsSupport = function(cb) {
      PMServiceProcess.capabilities($scope.host, $scope.processes[0].id)
        .then(function(response) {
          var feature = response.capabilities.watchdog;
          cb(feature.status, feature.reasons);
        })
        .catch(function(error) {
          cb(false, ['PM does not support smart profiling']);
        });
    };

    $scope.updateHost = function(host) {
      $scope.host = host;
      $scope.isRemoteValid = false;
      $scope.startAutomaticUpdates();
    };

    $scope.profilerModes = profilerModes;
    $scope.smartProfilingSupport = false;

    $scope.$watch('processes', function(newVal) {
      if (newVal && newVal.length > 0) {
        $scope.checkOptionsSupport(function(supported, reasons) {
          $scope.smartProfilingSupport = supported;
          if (!supported) {
            $scope.profilerSettings.mode = 'full';
            growl.addWarnMessage('Smart profiling is not available: ' + reasons[0]);
          }
        });
      }
    });

    $scope.$watch('profilerSettings.mode', function(newValue) {
      if ($scope.smartProfilingSupport === false &&
          newValue === 'smart') {
        $scope.profilerSettings.mode = 'full';
      }
    });

    $scope.profilerModeOpts = [
      { id: 'smart', label: 'Smart', activeId: 'profilerSettings.mode' },
      { id: 'full', label: 'Full', activeId: 'profilerSettings.mode' }
    ];

    $scope.profilerSettings = {
      templateUrl: '/scripts/modules/profiler/templates/profiler.settings.html',
      mode: 'smart',
      timeout: 20,
      limit: 10
    };

    $scope.selectMultiple = function() {
      return $scope.profilerSettings.mode === 'smart';
    };

    $scope.hidePopover = function() {
      $timeout(function() {
        $('.sl-profiler-settings-btn').click();
      });
    };

    $scope.initProfiler = function(){
      if ( $scope.hasIframe ) {
        var iframe = window.frames['devtools'];

        if ( iframe.SL ) {
          iframe.SL.child.profiler.slInit();
        }
      }
    };

    $scope.$watch('activeProcess', function(newVal) {
      if ( $scope.hasIframe ) {
        var iframe = window.frames['devtools'];

        if ( iframe.SL ) {
          iframe.SL.child.profiler.slInit();
          iframe.SL.child.profiler.setServer($scope.host);
          iframe.SL.child.profiler.setActiveProcess(newVal);
        }
      }
    });

    var selectedProfile = null;

    $scope.selectProfile = function(profile) {
      if (selectedProfile) {
        selectedProfile.isSelected = false;
      }

      selectedProfile = profile;
      selectedProfile.isSelected = true;
    };

    $scope.loadProfile = function(profile) {
      var fileName = profile.filename || 'profile-' + profile.id + '.' + profile.type;
      var iframe = window.frames['devtools'];

      $scope.selectProfile(profile);

      $scope.$apply(function() {
        $scope.processes.forEach(function(process) {
          process.isActive = (process.pid == profile.targetId);
          if (process.isActive) {
            $scope.activeProcess = [process];
          }
        });
      });

      if (profile.status === 'loaded') {
        iframe.SL.child.profiler.showProfile(fileName);
      } else if (profile.status === 'ready') {
        profile.status = 'downloading';
        ProfilerService.downloadFile($scope.host, profile.downloadUrl, fileName)
          .catch(function(err) {
            $scope.$apply(function() {
              profile.status = 'error';
            });
          })
          .then(function(file) {
            if (iframe.SL && profile.status !== 'error') {
              iframe.SL.child.profiler.loadFile(file);

              // the panel needs a short delay to ensure the profile is in the
              // panel's list.
              $timeout(function() {
                profile.status = 'loaded';
                iframe.SL.child.profiler.showProfile(fileName);
              }, 1000);
            }
          });
      }
    };

    // layout resizing to help control layout with devtools iframe
    $scope.setProfilerLayout = function() {
      var headerHeight = $('[data-id="AppHeaderContainer"]').outerHeight();
      var profilerNavHeight = $('#ProfilerNavBar').outerHeight();
      var windowHeight = $(window).outerHeight();
      var devToolsHeight = (windowHeight - headerHeight - profilerNavHeight);
      $('#ProfilerDevtoolsContainer').css('height', devToolsHeight);
    };
  }
]);
