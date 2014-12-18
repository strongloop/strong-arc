Profiler.directive('slProfilerNavbar', [
    '$http',
    '$log',
    'ProfilerService', function($http, $log, ProfilerService){
      return {
        restrict: 'E',
        replace: true,
        templateUrl: './scripts/modules/profiler/templates/profiler.navbar.html',
        controller: function($scope, $attrs){

          $scope.profilerId = 'remote';
          $scope.activeProcess = null;

          $scope.profilerTogglers = [
            { id: 'remote', label: 'Server', activeId: 'profilerId'},
            { id: 'file', label: 'File', activeId: 'profilerId' }
          ];

          //clear out active processes and remote state when going back to file
          $scope.resetRemoteState = function(){

            $scope.isRemoteValid = false;
            $scope.processes = [];
            $scope.activeProcess = null;

          };

          $scope.processes = [];

          $scope.$watch('profilerId', function(newVal, oldVal){
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

          $scope.fetchHeapFile = function(){
            if ( !$scope.activeProcess ) return;

            $scope.activeProcess.status = 'Saving';

            return ProfilerService.fetchHeapSnapshot($scope.currentServerConfig, $scope.activeProcess)
              .then(function(data){
                var fileUrl = data.data.result.url;
                var pid = $scope.activeProcess.pid;
                var fileName = pid + '.heapsnapshot';

                return ProfilerService.downloadFile($scope.currentServerConfig, fileUrl, fileName)
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

            return ProfilerService.startCpuProfiling($scope.currentServerConfig, $scope.activeProcess)
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
            return ProfilerService.stopCpuProfiling($scope.currentServerConfig, $scope.activeProcess)
              .then(function(data){
                $scope.activeProcess.status = 'Saving';

                var fileUrl = data.data.result.url;
                var pid = $scope.activeProcess.pid;
                var fileName = pid + '.cpuprofile';

                return ProfilerService.downloadFile($scope.currentServerConfig, fileUrl, fileName)
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
          // fix profiler header disappearing when files are loaded in the iframe, etc
          SL.parent.profiler.setProfilerLayout = function(cb){
            $scope.setProfilerLayout();
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
    }
]);
Profiler.directive('slProfilerDevtools', [
  '$log',
  function($log) {
    return {
      template: '<iframe id="DevToolsIFrame" src="/devtools" name="devtools" ng-class="{ disabled: profilerId == \'remote\' && !isRemoteValid }" sl-iframe-onload="initProfiler()"></iframe>',
      link: function(scope, el, attrs) {

        window.onresize = function(event) {
          scope.setProfilerLayout();
        };
        scope.setProfilerLayout();
      }
    }
  }
]);
