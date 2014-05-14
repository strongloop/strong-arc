// Copyright StrongLoop 2014
app.directive('greetingMain', [
  function() {
    return {
      templateUrl: './scripts/modules/app/templates/home.main.html'
    }
  }
]);
app.directive('instanceSearch', [
  function() {
    return  {
      templateUrl: './scripts/modules/app/templates/instance.search.html'
    }
  }
]);
app.directive('mainNavTree', [
  '$timeout',
  function($timeout) {
    return {
      templateUrl: './scripts/modules/app/templates/nav.tree.html',
      link: function(scope, element, attrs) {
        console.log('Main Nav Tree Directive');

        scope.list = [
          {
            "id": 1,
            "title": "models",
            "items": []
          },
          {
            "id": 2,
            "title": "datasources",
            "items": [
              {
                "id": 21,
                "title": "item2.1",
                "items": [
                  {
                    "id": 211,
                    "title": "item2.1.1",
                    "items": []
                  },
                  {
                    "id": 212,
                    "title": "item2.1.2",
                    "items": []
                  },
                  {
                    "id": 213,
                    "title": "item2.1.3",
                    "items": []
                  }
                ],
              },
              {
                "id": 22,
                "title": "item2.2",
                "items": [],
              }
            ]
          },
          {
            "id": 3,
            "title": "relations",
            "items": [
              {
                "id": 31,
                "title": "item3.1",
                "items": []
              },
              {
                "id": 32,
                "title": "item3.2",
                "items": []
              },
              {
                "id": 33,
                "title": "item3.3",
                "items": [
                  {
                    "id": 331,
                    "title": "item3.3.1",
                    "items": []
                  },
                  {
                    "id": 332,
                    "title": "item3.3.2",
                    "items": []
                  },
                  {
                    "id": 333,
                    "title": "item3.3.3",
                    "items": []
                  }
                ]
              }
            ]
          }
        ];





      }
    }
  }
]);
app.directive('mainContentRegion', [
  function() {
    return {
      transclude: true,
      template: '<div class="container-fluid" ng-transclude></div>',
      link: function(scope, element, attrs) {

      }
    }
  }
]);
app.directive('draggable', function() {
  return function(scope, element) {
    // this gives us the native JS object
    var el = element[0];

    el.draggable = true;

    el.addEventListener(
      'dragstart',
      function(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('Text', this.id);
        this.classList.add('drag');
        return false;
      },
      false
    );

    el.addEventListener(
      'dragend',
      function(e) {
        this.classList.remove('drag');
        return false;
      },
      false
    );
  }
});

app.directive('droppable', function() {
  return {
    scope: {
      drop: '&' // parent
    },
    link: function(scope, element) {
      // again we need the native object
      var el = element[0];

      el.addEventListener(
        'dragover',
        function(e) {
          e.dataTransfer.dropEffect = 'move';
          // allows us to drop
          if (e.preventDefault) e.preventDefault();
          this.classList.add('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'dragenter',
        function(e) {
          this.classList.add('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'dragleave',
        function(e) {
          this.classList.remove('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'drop',
        function(e) {
          // Stops some browsers from redirecting.
          if (e.stopPropagation) e.stopPropagation();

          this.classList.remove('over');

          var item = document.getElementById(e.dataTransfer.getData('Text'));
          this.appendChild(item);

          // call the drop passed drop function
          scope.$apply('drop()');

          return false;
        },
        false
      );
    }
  }
});

