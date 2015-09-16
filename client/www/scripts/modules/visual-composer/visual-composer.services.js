VisualComposer.service('slCanvasService', [
  function(ngStorage) {
    var svc = this;

    svc.getPositionById = function(id, def) {
      var pos = null;

      if (window.localStorage) {
        try {
          pos = JSON.parse(window.localStorage.getItem(id));
        } catch(e) {
          pos = def;
        }
      }

      return pos || def;
    };

    svc.setPositionById = function(id, pos) {
      if (window.localStorage) {
        window.localStorage.setItem(id, JSON.stringify(pos))
      }
    };

    return this;
  }
]);
