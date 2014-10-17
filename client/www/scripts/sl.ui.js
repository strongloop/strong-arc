// Copyright StrongLoop 2014
var setUI = function() {
  var headerHeight = jQuery('[data-id="AppHeaderContainer"]').outerHeight();
  var mainControlsHeight = jQuery('[data-id="MainControlsContainer"]').outerHeight();
  var windowHeight = $(window).outerHeight();
  var navHeight = (windowHeight - headerHeight - mainControlsHeight);
  var contentHeight = (windowHeight - headerHeight);

  $('[data-id="MainNavContainer"]').css('height', navHeight);
  $('.common-instance-view-container').css('height', contentHeight);

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
// localStorage support test
(function() {
  if (window.localStorage) {
    window.isLocalStorageEnabled = true;
    return true;
  }
  console.warn('window.localStorage is not enabled');
  window.isLocalStorageEnabled = false;
  return false;
})();
