// Copyright StrongLoop 2014
(function($) {
  $.fn.drags = function(opt) {

    opt = $.extend({handle:"",cursor:"move"}, opt);

    if(opt.handle === "") {
      var $el = this;
    } else {
      var $el = this.find(opt.handle);
    }

    return $el.css('cursor', opt.cursor).on("mousedown", function(e) {


      // make sure it is the left button before doing anything
      if (e.which === 1) {
        if(opt.handle === "") {
          var $drag = $(this).addClass('draggable');
        } else {
          var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
        }
        var originalY = $drag.offset().top;
        console.log('original y: ' + originalY);
        var z_idx = $drag.css('z-index');
        var drg_h = $drag.outerHeight();
        var drg_w = $drag.outerWidth();
        var pos_y = originalY;
        var pos_x = $drag.offset().left + drg_w - e.pageX;

        console.log('-----------------------------');
        console.log('| leading edge  ' + $drag.offset().left); //($drag.offset().left)
        console.log('| cursor location  ' + e.pageX); //(e.pageX)
        console.log('-----------------------------');
        $drag.css('z-index', 1000);
        $drag.parents().on("mousemove", function(e) {
          if (e.which === 1){
            console.log('-----------------------------');
            console.log('| leading edge ' + $drag.offset().left);
            console.log('| cursor location ' + e.pageX);
            console.log('| pos_x ' + pos_x);
            console.log('| canvas width (static) ' + drg_w);
            console.log('-----------------------------');
            var currX = e.pageX + pos_x - drg_w;
            var sideWidth = jQuery('[data-id="MainSidebarContainer"]').outerWidth();
            if (currX >= sideWidth) {
              $('.draggable').offset({
                top:originalY,
                left:currX
              });

              jQuery('#CoordinateInstrumentationContainer #CanvasX').text(currX);

              jQuery('#CoordinateInstrumentationContainer #SidebarWidth').text(sideWidth);
            }
            else {
              $('.draggable').offset({
                top:originalY,
                left:sideWidth
              });
            }

          }

        });
        $drag.css('z-index', 1000);
        $drag.parents().on("mouseup", function() {
          $(this).removeClass('draggable').css('z-index', z_idx);
          console.log('mouseup y: ' + originalY);

        });






        e.preventDefault(); // disable selection
      }



    }).on("mouseup", function() {
        if(opt.handle === "") {
          $(this).removeClass('draggable');
        } else {
          $(this).removeClass('active-handle').parent().removeClass('draggable');
        }
      });

  }
})(jQuery);
var setUI = function() {
  var headerHeight = 50;
  var searchHeight = jQuery('[data-id="MainSearchContainer"]').height();
  var mainControlsHeight = jQuery('[data-id="MainControlsContainer"]').height();
  var jWindowHeight = $(window).height();
  var navHeight = (jWindowHeight - headerHeight - 12 - mainControlsHeight);
  jQuery('[data-id="MainNavContainer"]').css('height', navHeight);
  // any open views need to follow the width of the container
  var editorWidth = jQuery('[data-id="CommonInstanceContainer"]').width();
  var contentWidth = jQuery('[data-id="IAMainContentContainer"]').width();
  if (editorWidth > 0) {
    // track the container width
    jQuery('[data-id="CommonInstanceContainer"]').css('width', contentWidth);

  }
  var explorerWidth = jQuery('[data-id="ExplorerContainer"]').width();
  if (explorerWidth > 0) {
    // track the container width
    jQuery('[data-id="ExplorerContainer"]').css('width', contentWidth);

  }


};
var triggerResizeUpdate = function(event) {
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

