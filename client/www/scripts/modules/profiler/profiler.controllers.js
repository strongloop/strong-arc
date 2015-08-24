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

    function detectChanges(oldSet, newSet) {
      var exitSet = [];
      var enterSet = [];
      var changeSet = [];
      var oldMap = {};
      var queue = [].concat(newSet);

      oldSet.map(function(d) {
        oldMap[d.id] = {
          found: false,
          data: d
        };
      });

      while (queue.length) {
        var obj = queue.pop();

        if (oldMap[obj.id] != null) {
          changeSet.push([obj, oldMap[obj.id].data]);
          oldMap[obj.id].found = true;
        } else {
          enterSet.push(obj);
        }
      }

      exitSet = oldSet
        .filter(function(d) {
          return oldMap[d.id].found === false;
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
            cb(change[0], change[1]);
          });

          return this;
        }
      };
    }

    function removeFromSet(set, obj) {
      for (var idx = set.length - 1; idx >= 0; --idx) {
        if (set[idx].id === obj.id) {
          return set.splice(idx, 1);
        }
      }
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

              detectChanges($scope.profiles, profiles.filter(isValidTarget))
                .exit(function(profile) {
                  if (profile.status !== 'profiling') {
                    growl.addInfoMessage('Profile ' + profile.targetId + ' removed.');
                    removeFromSet($scope.profiles, profile);
                  }
                })
                .enter(function(profile) {
                  growl.addInfoMessage('Profile ' + profile.targetId + ' added.');
                  $scope.profiles.push(profile);
                })
                .change(function(newVal, oldVal) {
                  if (newVal.status !== oldVal.status &&
                      oldVal.status !== 'loaded' &&
                      oldVal.status !== 'downloading') {
                    growl.addInfoMessage('Profile ' + newVal.targetId + ' changed.');
                    angular.extend(oldVal, newVal);
                  }
                });

              $scope.isRemoteValid = true;
            });
        });
    };

    $scope.refreshProcesses = function() {
      if (!$scope.refreshProcessesCallback) {
        return;
      }

      $scope.refreshProcessesCallback()
        .then(function(processes) {
          detectChanges($scope.processes, processes)
            .exit(function(pid) {
              growl.addInfoMessage('PID ' + pid.pid + ' removed.');
              removeFromSet($scope.processes, pid);
            })
            .enter(function(pid) {
              growl.addInfoMessage('PID ' + pid.pid + ' added.');
              $scope.processes.push(pid);
            })
            .change(function(newVal, oldVal) {
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
      $scope.activeProcess = null;
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

        $scope.isRemoteValid = true;
        $scope.activeProcess = newVal[0];

        $scope.processes.map(function(process) {
          if (process.id === $scope.activeProcess.id) {
            process.isActive = true;
          }
        });

        $scope.updateProcesses($scope.processes);
        return;
      }
      $scope.activeProcess = null;

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

    $scope.deleteProfile = function(profile) {
      ProfilerService.deleteProfile($scope.host, 1, profile)
        .then(function(err, res) {
          if (!err) {
            removeFromSet($scope.profiles, profile);
            growl.addInfoMessage('Profile ' + profile.targetId + ' deleted.');
          }
        })
        .catch(function(err) {
          growl.addInfoMessage('Profile ' + profile.targetId + ' deleted.');
        });
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
