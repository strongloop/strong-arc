Profiler
  .directive('slProfilerNavbar', [
    '$http',
    '$log',
    'ProfilerService', function($http, $log, ProfilerService){
      return {
        restrict: 'E',
        replace: true,
        templateUrl: './scripts/modules/profiler/templates/profiler.navbar.html',
        controller: function($scope, $attrs){
          $scope.server = {
            host: '',
            port: ''
          };
          $scope.profilerId = 'file';
          $scope.activeProcess = null;

          $scope.profilerTogglers = [
            { id: 'file', label: 'File', activeId: 'profilerId' },
            { id: 'remote', label: 'Remote', activeId: 'profilerId' }
          ];

          $scope.processes = [];

          $scope.$watch('profilerId', function(newVal, oldVal){
            if ( newVal !== oldVal ) {
              $scope.resetRemoteState();
            }
          });

          //@deprecated moved to common.directives.js
          ////clear out active processes and remote state when going back to file
          //$scope.resetRemoteState = function(){
          //  var iframe = window.frames['devtools'];
          //
          //  $scope.isRemoteValid = false;
          //  $scope.processes = [];
          //  $scope.activeProcess = null;
          //
          //  iframe.SL.child.profiler.slInit();
          //};

          $scope.$watch('form.$valid', function(newVal, oldVal) {
            if ( newVal !== oldVal && !newVal ) {
              $scope.resetRemoteState();
            }
          });

          //@deprecated moved to common.directives.js
          //$scope.$watch('activeProcess', function(process, oldVal){
          //  if ( !process || $scope.activeProcess && $scope.activeProcess.status !== 'Running' ) return false;
          //
          //  var iframe = window.frames['devtools'];
          //
          //  $scope.activeProcess = process;
          //  $log.log('active process', process);
          //  $scope.isRemoteValid = true;
          //
          //  iframe.SL.child.profiler.slInit();
          //  iframe.SL.child.profiler.setServer($scope.server);
          //  iframe.SL.child.profiler.setActiveProcess(process);
          //});

          $scope.fetchHeapFile = function(){
            if ( !$scope.activeProcess ) return;

            $scope.activeProcess.status = 'Saving';

            return ProfilerService.fetchHeapSnapshot($scope.server, $scope.activeProcess)
              .then(function(data){
                var fileUrl = data.data.result.url;
                var pid = $scope.activeProcess.pid;
                var fileName = pid + '.heapsnapshot';

                return ProfilerService.downloadFile($scope.server, fileUrl, fileName)
                  .then(function(file){
                    $scope.activeProcess.status = 'Running';

                    return file;
                  });
              })
              .catch(function(err){
                $log.error(err);
              });
          };

          $scope.startCpuProfiling = function(){
            if ( !$scope.activeProcess ) return;

            return ProfilerService.startCpuProfiling($scope.server, $scope.activeProcess)
              .then(function(data){
                $scope.activeProcess.status = 'Profiling';

                return data;
              })
              .catch(function(data){
                $log.log('error', data);
              });
          };

          $scope.fetchCpuFile = function(){
            if ( !$scope.activeProcess ) return;

            //stop cpu profiling
            return ProfilerService.stopCpuProfiling($scope.server, $scope.activeProcess)
              .then(function(data){
                $scope.activeProcess.status = 'Saving';

                var fileUrl = data.data.result.url;
                var pid = $scope.activeProcess.pid;
                var fileName = pid + '.cpuprofile';

                return ProfilerService.downloadFile($scope.server, fileUrl, fileName)
                  .then(function(file){
                    $scope.activeProcess.status = 'Running';

                    return file;
                  });
              })
              .catch(function(err){
                $log.error(err);
              });
          };

          //cross-iframe methods
          window.SL = window.SL || {};
          SL.parent = SL.parent || {};
          SL.parent.profiler = SL.parent.profiler || {};

          SL.parent.profiler.getActiveProcess = function(){
            return $scope.activeProcess;
          };

          SL.parent.profiler.fetchHeapFile = function(cb){
            //button click in chrome devtools
            if ( !$scope.activeProcess ) return false;

            $scope.fetchHeapFile()
              .then(function(file){
                cb(file);
              });
          };

          SL.parent.profiler.getProfilerId = function(){
            return $scope.profilerId;
          };

          SL.parent.profiler.fetchCpuFile = function(cb){
            if ( !$scope.activeProcess ) return false;

            $scope.fetchCpuFile()
              .then(function(file){
                cb(file);
              });
          },

          SL.parent.profiler.startCpuProfiling = function(cb){
            $scope.startCpuProfiling()
              .then(function(data){
                cb(data);
              });
          }
        }
      }
    }]);
