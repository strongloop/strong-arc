var performGitDeployment = require('strong-deploy/lib/git').performGitDeployment;
var performHttpPutDeployment = require('strong-deploy/lib/put-file').performHttpPutDeployment;
var request = require('request');

module.exports = function(Deployment) {
  Deployment.create = function(deployment, cb) {
    // TODO(ritch) handle custom CWDs
    var baseURL = 'http://' + deployment.host + ':' + deployment.port;
    if(deployment.type === 'git') {
      performGitDeployment(baseURL, deployment.branch, resize);
    } else {
      performHttpPutDeployment(baseURL, '', deployment.archive, resize);
    }

    function resize(err) {
      request.post(baseURL + '/api/Services/1/actions', {
        json: true,
        body: {
          request: {
            cmd: 'current',
            sub: 'set-size',
            size: deployment.processes
          }
        }
      }, cb);
    }
  }

  Deployment.remoteMethod('create', {
    http: {verb: 'post', path: '/'},
    accepts: {arg: 'deployment', type: 'Deployment', http: {source: 'body'}},
    returns: {arg: 'deployment', type: 'Deployment', root: true}
  });
};
