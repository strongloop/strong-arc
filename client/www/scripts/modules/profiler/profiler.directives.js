Profiler.directive('slProfilerNavbar', [
    '$http',
    '$log',
    '$q',
    'ProfilerService', function($http, $log, $q, ProfilerService){
      return {
        restrict: 'E',
        replace: true,
        templateUrl: './scripts/modules/profiler/templates/profiler.navbar.html',
        controller: function($scope, $attrs) {

          $scope.profilerId = 'remote';
          $scope.activeProcess = null;
          $scope.processes = [];
          $scope.refreshProcessesCallback = null;

          $scope.updateProcesses = function(processes, refresh) {
            $scope.processes = processes;

            if (refresh) {
              $scope.refreshProcessesCallback = refresh;
            } else {
              $log.warn('updateProcesses called without update function');
            }

            $scope.processes.forEach(function(process) {
              if (process.isProfiling) {
                process.status = 'Profiling';
              }
            });
            $scope.activeProcess = processes;
          };

          $scope.updateProcessSelection = function(processes) {
            $scope.activeProcess = processes;
          };

          $scope.profilerTogglers = [
            { id: 'remote', label: 'Server', activeId: 'profilerId'},
            { id: 'file', label: 'File', activeId: 'profilerId' }
          ];

          //clear out active processes and remote state when going back to file
          $scope.resetRemoteState = function(){
            $scope.isRemoteValid = false;
            $scope.activeProcess = null;
            $scope.updateProcesses([]);
          };

          $scope.$watch('profilerId', function(newVal, oldVal) {
            if ( newVal !== oldVal ) {
              $scope.resetRemoteState();
              $scope.initProfiler();
            }
          });

          $scope.$watch('form.$valid', function(newVal, oldVal) {
            if ( newVal !== oldVal && !newVal ) {
              $scope.resetRemoteState();
            }
          });

          $scope.$watch('profilerSettings.mode', function(newVal, oldVal) {
            $scope.enableMultiple = newVal === 'smart';
          });

          $scope.fetchHeapFile = function(){
            if ( !$scope.activeProcess.length ) return;

            var activeProcess = $scope.activeProcess[0];
            activeProcess.status = 'Saving';

            return ProfilerService.fetchHeapSnapshot($scope.host, activeProcess)
              .then(function(data) {
                var fileUrl = 'http://' + $scope.host.host + ':' + $scope.host.port + data.data.result.url;
                var pid = activeProcess.pid;
                var fileName = pid + '.heapsnapshot';
                var profile = {
                  id: data.data.result.profileId,
                  targetId: pid,
                  startTime: new Date(),
                  status: 'profiling',
                  type: 'heapsnapshot',
                  downloadUrl: fileUrl
                };

                activeProcess.status = 'Running';

                return profile;
              })
              .catch(function(err){
                activeProcess.status = 'Running';
                $log.error(err);
              });
          };

          $scope.startCpuProfilingProcess = function(process) {
            return ProfilerService
              .startCpuProfiling(
                $scope.host, process, $scope.profilerSettings
              )
              .then(function(res) {
                var data = res.data;

                process.status = 'Profiling';
                process.isProfiling = true;

                $scope.profiles.push({
                  targetId: data.request.target,
                  startTime: new Date(data.timestamp),
                  status: 'profiling'
                });
                return data;
              })
              .catch(function(data) {
                $log.log('error', data);
              });
          };

          $scope.startCpuProfiling = function() {
            var promises = [];

            $scope.processes.forEach(function(process) {
              if (process.isActive) {
                promises.push($scope.startCpuProfilingProcess(process));
              }
            });

            return $q.all(promises);
          };

          $scope.fetchCpuFileProcess = function(process) {
            //stop cpu profiling
            return ProfilerService.stopCpuProfiling(
                $scope.host, process
              )
              .then(function(data) {
                process.status = 'Running';
                $scope.updateProfiles();
              })
              .catch(function(err){
                $log.error(err);
              });
          };

          $scope.fetchCpuFile = function() {
            var promises = [];

            $scope.processes.forEach(function(process) {
              if (process.isActive) {
                promises.push($scope.fetchCpuFileProcess(process));
              }
            });

            return $q.all(promises);
          };

          //cross-iframe methods
          window.SL = window.SL || {};
          SL.parent = SL.parent || {};
          SL.parent.profiler = SL.parent.profiler || {};

          SL.parent.profiler.getActiveProcess = function(){
            return $scope.activeProcess;
          };

          SL.parent.profiler.fetchHeapFile = function(cb){
            $scope.fetchHeapFile()
              .then(function(profile) {
                $scope.profiles.push(profile);
                cb(null);
              });
          };
          // fix profiler header disappearing when files are loaded in the iframe, etc
          SL.parent.profiler.setProfilerLayout = function(cb){
            $scope.setProfilerLayout();
          };

          SL.parent.profiler.getProfilerId = function(){
            return $scope.profilerId;
          };

          SL.parent.profiler.fetchCpuFile = function(cb){
            $scope.fetchCpuFile()
              .then(function(files){
                cb(files);
              });
          },

          SL.parent.profiler.startCpuProfiling = function(cb){
            $scope.startCpuProfiling()
              .then(function(data){
                cb(data);
              });
          };

          SL.parent.profiler.addProfileForFile = function(file) {
            var fileParts = file.name.split('.');
            var profile = {
              id: $scope.profiles.length,
              targetId: 'From File',
              startTime: new Date(),
              status: 'loaded',
              filename: file.name,
              type: fileParts.pop()
            };

            $scope.$apply(function() {
              $scope.profiles.push(profile);
            });
          }
        }
      }
    }
]);
Profiler.directive('slProfilerDevtools', [
  '$log',
  function($log) {
    return {
      template: '<iframe id="DevToolsIFrame" src="/devtools" name="devtools"' +
        'ng-class="{ disabled: (profilerId == \'remote\' && !isRemoteValid) || !activeProcess }"' +
        'sl-iframe-onload="initProfiler()"></iframe>',
      link: function(scope, el, attrs) {
        window.onresize = function(event) {
          scope.setProfilerLayout();
        };

        scope.setProfilerLayout();
      }
    }
  }
]);
Profiler.directive('slProfilerProfile', [
  function() {
    return {
      scope: {
        profile: '=',
        onClick: '&',
        onDelete: '&'
      },
      templateUrl: './scripts/modules/profiler/templates/profiler.profile.html',
      link: function(scope, el, attrs) {
        $(el).on('click', function() {
          scope.onClick({
            profile: scope.profile
          });
        });

        scope.delete = function() {
          var deleteFn = scope.onDelete;

          if (deleteFn) {
            deleteFn({
              profile: scope.profile
            });
          }
        };
      }
    };
  }
]);
