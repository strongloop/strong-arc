// Copyright StrongLoop 2014
Profiler.service('ProfilerService', [
  '$q',
  '$http',
  '$log',
  '$interval',
  '$q',
  function ($q, $http, $log, $interval, $q) {
    var svc = this;

    function getServerInstanceUrl(server, instance)
    {
      var api = 'http://' + server.host + ':' + server.port;

      if (server.host === PM_CONST.LOCAL_PM_HOST_NAME) {
        api = '/process-manager';
      }

      return api + '/api/ServiceInstances/' + instance + '/actions';
    }

    function getServiceUrl(server, instance) {
      var api = 'http://' + server.host + ':' + server.port;

      if (server.host === PM_CONST.LOCAL_PM_HOST_NAME) {
        api = '/process-manager';
      }

      return api + '/api/Services/' + instance;
    }

    svc.getCpuProfiles = function(server, instanceId) {
      var url = getServiceUrl(server, instanceId) + '/ProfileDatas/';
      var addDownloadUrl = function(profile) {
        profile.downloadUrl = url + profile.id + '/download';
        return profile;
      };

      return $http.get(url).then(function(result) {
        return result.data.map(addDownloadUrl);
      });
    };

    svc.startCpuProfiling = function(server, process, settings) {
      var instance = process.serviceInstanceId;
      var api = 'http://' + server.host + ':' + server.port;
      if (server.host === PM_CONST.LOCAL_PM_HOST_NAME) {
        api = '/process-manager';
      }
      var url = api + '/api/ServiceInstances/' + instance + '/actions';
      var postData = {
        request: {
          cmd: 'current',
          sub: 'start-cpu-profiling',
          target: process.pid,
          serviceProcessId: process.id
        },
        serverServiceId: 1
      };

      if (settings.mode === 'smart') {
        postData.request.timeout = settings.timeout;
        postData.request.stallout = settings.limit;
      }

      //send start profiling request
      return $http.post(url, postData);
    },

    svc.deleteProfile = function(server, instance, profile) {
      var deleteUrl = getServiceUrl(server, instance);
      deleteUrl += '/ProfileDatas/' + profile.id;

      return $http.delete(deleteUrl)
        .then(function(resp) {
          return resp;
        });
    },

    svc.downloadFile = function(server, fileUrl, fileName){
      var downloadUrl = fileUrl;
      var def = $q.defer();
      var isRunning = false;
      var intv;

      //ping download url for finished file
      function getDownloadUrl(downloadUrl){

        $http.get(downloadUrl, {
          responseType: 'arraybuffer'
        })
          .then(function(data){
            isRunning = false;

            if ( data.status === 200 ) {
              $interval.cancel(intv);
              var file = new Blob([data.data], { type: "text/plain" });
              file.name = fileName;

              def.resolve(file);
            } else if ( data.status !== 204 ) {
              $interval.cancel(intv);
              def.reject(data);
            }
          })
          .catch(function(data){
            isRunning = false;
            $interval.cancel(intv);
            def.reject(data);
          });
      }

      //query endpoint for 200 status to get file contents
      intv = $interval(function(){
        //flag to stop download requests from piling up
        if ( !isRunning ) {
          $log.log('interval...');
          isRunning = true;
          getDownloadUrl(downloadUrl);
        } else {
          $log.log('skipping interval...');
        }
      }, 5000);

      return def.promise;
    },

    svc.stopCpuProfiling = function(server, process) {
      var instance = process.serviceInstanceId;
      var api = 'http://' + server.host + ':' + server.port;
      if (server.host === PM_CONST.LOCAL_PM_HOST_NAME) {
        api = '/process-manager'
      }
      var url = api + '/api/ServiceInstances/' + instance + '/actions';
      var postData = {
        request: {
          cmd: 'current',
          sub: 'stop-cpu-profiling',
          target: process.pid,
          serviceProcessId: process.id
        },
        serverServiceId: 1
      };

      //send stop profiling request
      return $http.post(url, postData);
    },

    svc.fetchHeapSnapshot = function(server, process){
      var instance = process.serviceInstanceId;
      var api = 'http://' + server.host + ':' + server.port;
      if (server.host === PM_CONST.LOCAL_PM_HOST_NAME) {
        api = '/process-manager'
      }
      var url = api + '/api/ServiceInstances/' + instance + '/actions';
      var postData = {
        request: {
          cmd: 'current',
          sub: 'heap-snapshot',
          target: process.pid,
          serviceProcessId: process.id
        },
        serverServiceId: 1
      };

      //send heap-snapshot request
      return $http.post(url, postData);
    };

    return svc;
  }
]);
