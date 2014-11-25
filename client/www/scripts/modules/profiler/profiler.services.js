// Copyright StrongLoop 2014
Profiler.service('ProfilerService', [
  '$q',
  '$http',
  '$log',
  '$interval',
  '$q',
  function ($q, $http, $log, $interval, $q) {
    var svc = this;

    //@deprecated moved to CommonPidService.getDefaultPidData
    //svc.getProcessIds = function (url) {
    //  return $http.get(url)
    //    .then(function (res) {
    //      var data = res.data;
    //
    //      //All pids have a status of running by default
    //      data.processes.forEach(function(p){
    //        p.status = 'Running';
    //      });
    //
    //      return data.processes;
    //    });
    //};

    svc.startCpuProfiling = function(server, process){
      var api = 'http://' + server.host + ':' + server.port;
      var url = api + '/api/ServiceInstances/1/actions';
      var postData = {
        request: {
          cmd: 'current',
          sub: 'start-cpu-profiling',
          target: process.pid
        },
        serverServiceId: 1
      };

      //send start profiling request
      return $http.post(url, postData);
    },

    svc.downloadFile = function(server, fileUrl, fileName){
      var api = 'http://' + server.host + ':' + server.port;
      var downloadUrl = api + fileUrl;
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
              var file = new File([data.data], fileName, { type: "text/plain" });

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

    svc.stopCpuProfiling = function(server, process){
      var api = 'http://' + server.host + ':' + server.port;
      var url = api + '/api/ServiceInstances/1/actions';
      var postData = {
        request: {
          cmd: 'current',
          sub: 'stop-cpu-profiling',
          target: process.pid
        },
        serverServiceId: 1
      };

      //send stop profiling request
      return $http.post(url, postData);
    },

    svc.fetchHeapSnapshot = function(server, process){
      var api = 'http://' + server.host + ':' + server.port;
      var url = api + '/api/ServiceInstances/1/actions';
      var postData = {
        request: {
          cmd: 'current',
          sub: 'heap-snapshot',
          target: process.pid
        },
        serverServiceId: 1
      };

      //send heap-snapshot request
      return $http.post(url, postData);
    };

    return svc;
  }
]);
