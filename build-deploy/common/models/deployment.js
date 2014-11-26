var performGitDeployment = require('strong-deploy/lib/git').performGitDeployment;
var performHttpPutDeployment = require('strong-deploy/lib/put-file').performHttpPutDeployment;
var request = require('request');

module.exports = function(Deployment) {
  Deployment.create = function(deployment, cb) {
    // TODO(ritch) handle custom CWDs
    var baseURL = 'http://' + deployment.host + ':' + deployment.port;

    resize();

    function deploy(err){
      if ( err ) return cb(err);

      if(deployment.type === 'git') {
        performGitDeployment(baseURL, deployment.branch, cb);
      } else {
        performHttpPutDeployment(baseURL, '', deployment.archive, cb);
      }
    }

    function resize() {
      //todo check status of deploy first
      request.put(baseURL + '/api/ServiceInstances/1', {
        json: true,
        body: {
          cpus: deployment.processes
        }
      }, deploy);
    }
  };

  Deployment.remoteMethod('create', {
    http: {verb: 'post', path: '/'},
    accepts: {arg: 'deployment', type: 'Deployment', http: {source: 'body'}},
    returns: {arg: 'deployment', type: 'Deployment', root: true}
  });
};
