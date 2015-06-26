// Copyright StrongLoop 2014
BuildDeploy.directive('slBuildDeployBuildForm', [
  function () {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/build-deploy/templates/build-deploy.build-form.html',
      controller: function($scope, $attrs, $log, BuildDeployService){
        $scope.buildGit = function(form){
          $scope.build.git.submitted = true;
          $scope.build.git.message = '';
          $scope.viewConsole.logs = [];
          $log.log(form);

          if ( form.$valid ) {
            var buildData = {
              type: "git",
              branch: $scope.build.git.deploy
            };

            $scope.build.git.loading = true;

            BuildDeployService.buildGit(buildData, $scope.viewConsole)
              .then(function(data){
                $log.log(data);
                $scope.build.git.message = 'Successfully built using git';
                $scope.build.git.messageType = 'success';
                $scope.build.git.loading = false;
              })
              .catch(function(err){
                $log.log(err);
                $scope.build.git.message = 'Unable to build using git';
                $scope.build.git.messageType = 'error';
                $scope.build.git.loading = false;
              });
          }
        };

        $scope.buildUniversal = function(form){
          $scope.build.universal.submitted = true;
          $scope.build.universal.message = '';
          $scope.viewConsole.logs = [];
          //$log.log(form);

          if ( form.$valid ) {
            var buildData = {
              type: 'universal',
              archive: $scope.build.universal.archive
            };

            $scope.build.universal.loading = true;

            BuildDeployService.buildUniversal(buildData, $scope.viewConsole)
              .then(function(data){
                $log.log(data);
                $scope.build.universal.message = 'Successfully built using tar file';
                $scope.build.universal.messageType = 'success';
                $scope.deploy.universal.archive = data.archive;
                $scope.build.universal.loading = false;
              })
              .catch(function(err){
                $log.log(err);
                $scope.build.universal.message = 'Unable to build using tar file';
                $scope.build.universal.messageType = 'error';
                $scope.build.universal.loading = false;
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
      }
    };
  }
]);

BuildDeploy.directive('slBuildDeployDeployForm', [
  'ManagerServices',
  '$timeout',
  function (ManagerServices, $timeout) {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/build-deploy/templates/build-deploy.deploy-form.html',
      controller: function($scope, $attrs, $log, Upload, BuildDeployService){
        $scope.selectedPMHost = {};
        $scope.managerHosts = ManagerServices.getManagerHosts(function(hosts) {
          $scope.$apply(function () {
            $scope.managerHosts = hosts;
            if ($scope.managerHosts.length) {
              $scope.selectedPMHost = $scope.managerHosts[0];
              $scope.deploy.host.hostname = $scope.selectedPMHost.host;
              $scope.deploy.host.port = $scope.selectedPMHost.port;
              $scope.deploy.host.processes = 1;
            }
          });
        });
        $scope.changePMHost = function(host) {
          if (host.host && host.port) {
            $timeout(function() {
              $scope.selectedPMHost = host;
              $scope.deploy.host.hostname = host.host;
              $scope.deploy.host.port = host.port;
              $scope.deploy.host.processes = 1;

            });
          }
        };
          //todo waiting for StromPM to support multi-part uploads (currently not in use)
        function uploadFile(file, uploadUrl){
          $scope.upload = Upload.upload({
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
            $scope.deploy.git.message = 'Successfully deployed using universal';

          });
          //.error(...)
          //.then(success, error, progress);
          // access or attach event listeners to the underlying XMLHttpRequest.
          //.xhr(function(xhr){xhr.upload.addEventListener(...)})

        }


        $scope.deployGit = function(form){
          $scope.deploy.git.submitted = true;
          $scope.deploy.git.message = '';

          if ( form.$valid ) {
            var deployData = {
              type: "git",
              branch: $scope.deploy.git.deploy,
              host: $scope.deploy.host.hostname,
              port: $scope.deploy.host.port,
              processes: $scope.deploy.host.processes
            };

            $scope.deploy.git.loading = true;

            BuildDeployService.deployGit(deployData, $scope.viewConsole)
              .then(function(data){
                $log.log('deploy done!', data);
                $scope.deploy.git.message = 'Successfully being deployed using git';
                $scope.deploy.git.messageType = 'success';
                $scope.deploy.git.loading = false;
              })
              .catch(function(err){
                $log.error(err);
                $scope.deploy.git.message = 'Unable to deploy using git';
                $scope.deploy.git.messageType = 'error';
                $scope.deploy.git.loading = false;
              });
          }

        };

        $scope.deployUniversal = function(form){
          $scope.deploy.universal.submitted = true;
          $scope.deploy.universal.message = '';

          if ( form.$valid ) {

            var deployData = {
              type: 'universal',
              archive: $scope.deploy.universal.archive,
              host: $scope.deploy.host.hostname,
              port: $scope.deploy.host.port,
              processes: $scope.deploy.host.processes
            };

            $scope.deploy.universal.loading = true;

            BuildDeployService.deployUniversal(deployData, $scope.viewConsole)
              .then(function(data){
                $log.log('deploy done!', data);
                $scope.deploy.universal.message = 'Successfully deployed using tar file';
                $scope.deploy.universal.messageType = 'success';
                $scope.deploy.universal.loading = false;
              })
              .catch(function(err){
                $log.log(err);
                $scope.deploy.universal.message = 'Unable to deploy using tar file';
                $scope.deploy.universal.messageType = 'error';
                $scope.deploy.universal.loading = false;
              });
          }
        };

        //not implemented yet
        $scope.deployUniversalStrongPM = function(form){
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
        //for strongPM implementation (not used yet)
        $scope.onFileSelect = function($files){
          for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $scope.deploy.universal.file = file;
            $scope.deploy.universal.archive = file.name;
          }
        };

        //for strongPM implementation (not used yet)
        $scope.clickUploadFile = function(e){
          angular.element('#deploy-file-upload').trigger('click');
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


