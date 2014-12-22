Profiler.controller('ProfilerMainController',[
  '$scope',
  '$log',
  function($scope, $log){

    $scope.activeProcess;
    $scope.hasIframe = true;
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
          iframe.SL.child.profiler.setServer($scope.currentServerConfig);
          iframe.SL.child.profiler.setActiveProcess(newVal);
        }
      }
    });


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

