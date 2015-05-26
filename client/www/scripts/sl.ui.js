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

var setScrollView = function(selector) {
  var targetView = $(selector);
  if (targetView && targetView.offset()) {
    var offTop = targetView.offset().top;
    var windowHeight = $(window).outerHeight();
    targetView.css('height', (windowHeight - offTop));
  }
  else {
    console.log('warning: setScrollView no offset: ' + selector);
  }
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

// ES6 Number.isInteger polyfil, needed for Safari and older IE.
if (!Number.isInteger) {
  Number.isInteger = function isInteger(nVal) {
    return typeof nVal === 'number'
    && isFinite(nVal)
    && nVal > -9007199254740992
    && nVal < 9007199254740992
    && Math.floor(nVal) === nVal;
  };
}

function rgb2hex(rgb) {
  rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)\)$/); //rgba ,\s*(\.?\d+)
  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
