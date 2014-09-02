// Copyright StrongLoop 2014
var setUI = function() {
  var headerHeight = jQuery('[data-id="AppHeaderContainer"]').outerHeight();
  var mainControlsHeight = jQuery('[data-id="MainControlsContainer"]').outerHeight();
  var windowHeight = $(window).outerHeight();
  var navHeight = (windowHeight - headerHeight - mainControlsHeight);
  var contentHeight = (windowHeight - headerHeight);

  jQuery('[data-id="MainNavContainer"]').css('height', navHeight);
  jQuery('.common-instance-view-container').css('height', contentHeight);

};
var triggerResizeUpdate = function() {
  var that = this;
  that.working = false;
  setTimeout(function(event) {
    if (that.working !== true) {
      setUI();
      that.working = true;
    }
  }, 250);
};
window.onresize = function(event) {
  this.triggerResizeUpdate(event);
};
