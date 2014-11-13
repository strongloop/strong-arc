var performGitDeployment = require('strong-deploy/lib/git').performGitDeployment;
var performHttpPutDeployment = require('strong-deploy/lib/put-file').performHttpPutDeployment;

module.exports = function(Deployment) {
  Deployment.create = function(deployment, cb) {
    // TODO(ritch) handle custom CWDs
    if(deployment.type === 'git') {
      performGitDeployment(baseURL, deployment.branch, cb);
    } else {
      performHttpPutDeployment(baseURL, deployment.archive, cb);
    }
  }

  Deployment.remoteMethod('create', {
    http: {verb: 'post', path: '/'},
    accepts: {arg: 'deployment', type: 'Deployment', http: {source: 'body'}},
    returns: {arg: 'deployment', type: 'Deployment', root: true}
  });
};
