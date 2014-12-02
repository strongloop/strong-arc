Profiler.controller('ProfilerMainController',[
  '$scope',
  '$log',
  function($scope, $log){

    // layout resizing to help control layout with devtools iframe
    $scope.setProfilerLayout = function() {
      var headerHeight = $('[data-id="AppHeaderContainer"]').outerHeight();
      var profilerNavHeight = $('#ProfilerNavBar').outerHeight();
      var windowHeight = $(window).outerHeight();
      var devToolsHeight = (windowHeight - headerHeight - profilerNavHeight);
      $('#ProfilerDevtoolsContainer').css('height', devToolsHeight);
    }
  }
]);

