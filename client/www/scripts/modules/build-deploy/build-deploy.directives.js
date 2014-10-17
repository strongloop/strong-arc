// Copyright StrongLoop 2014
BuildDeploy.directive('slBuildForm', [
  function () {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/build-deploy/templates/build-deploy.build-form.html',
      controller: function($scope, $attrs, $log, BuildDeployService){
        $scope.buildGit = function(form){
          $scope.build.git.submitted = true;
          $log.log(form);

          if ( form.$valid ) {
            var buildData = {
              type: "git",
              branch: $scope.build.git.deploy
            };

            BuildDeployService.buildGit(buildData)
              .then(function(data){
                $log.log(data);
              });
          }
        };

        $scope.buildUniversal = function(form){
          $scope.build.universal.submitted = true;
          $log.log(form);

          if ( form.$valid ) {
            var buildData = {
              type: "universal",
              archive: $scope.build.universal.archive
            };

            BuildDeployService.buildUniversal(buildData)
              .then(function(data){
                $log.log(data);
              });
          }
        };
      },
      link: function(scope, el, attrs){
        scope.$watch('build.git.url', function(newVal){
          scope.deploy.git.url = newVal;
        });

        scope.$watch('build.git.deploy', function(newVal){
          scope.deploy.git.deploy = newVal;
        });

//        //@deprecated user has to upload file
//        scope.$watch('build.universal.archive', function(newVal){
//          scope.deploy.universal.archive = newVal;
//        });
      }
    };
  }
]);

BuildDeploy.directive('slDeployForm', [
  function () {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/build-deploy/templates/build-deploy.deploy-form.html',
      controller: function($scope, $attrs, $log, $upload){

        function uploadFile(file, uploadUrl){
          $scope.upload = $upload.upload({
            url: uploadUrl, //upload.php script, node.js route, or servlet url
            //method: 'POST' or 'PUT',
            //headers: {'header-key': 'header-value'},
            //withCredentials: true,
            //data: {myObj: $scope.myModelObj},
            file: file, // or list of files ($files) for html5 only
            //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
            // customize file formData name ('Content-Disposition'), server side file variable name.
            //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
            // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
            //formDataAppender: function(formData, key, val){}
          }).progress(function(evt) {
            $log.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success(function(data, status, headers, config) {
            // file is uploaded successfully
            $log.log(data);
          });
          //.error(...)
          //.then(success, error, progress);
          // access or attach event listeners to the underlying XMLHttpRequest.
          //.xhr(function(xhr){xhr.upload.addEventListener(...)})

        }


        $scope.deployGit = function(form){
          $scope.deploy.git.submitted = true;
          $log.log(form);
        };

        $scope.deployUniversal = function(form){
          $scope.deploy.universal.submitted = true;
          $log.log(form);

          var hostname = $scope.deploy.host.hostname;
          var port = $scope.deploy.host.port;
          var uploadUrl = 'https://' + hostname + ':' + port;

          if ( form.$valid ) {
            uploadFile($scope.deploy.universal.file, uploadUrl);
          }
        };


        //save file in memory
        $scope.onFileSelect = function($files){
          for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $scope.deploy.universal.file = file;
            $scope.deploy.universal.archive = file.name;
          }
        };


        $scope.clickUploadFile = function(e){
          angular.element('#upload').trigger('click');
        };
      }
    };
  }
]);

BuildDeploy.directive('slBuildDeployNav', [
  function () {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/build-deploy/templates/build-deploy.nav.html'
    }
  }
]);

BuildDeploy.directive('slConsoleLog', [
  function () {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/build-deploy/templates/build-deploy.console.html'
    }
  }
]);
