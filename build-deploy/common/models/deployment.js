var debug = require('debug')('strong-arc:deploy');
var performGitDeployment = require('strong-deploy/lib/git').performGitDeployment;
var performHttpPutDeployment = require('strong-deploy/lib/put-file').performHttpPutDeployment;
var performLocalDeployment = require('strong-deploy/lib/post-json').performLocalDeployment;
var request = require('request');
var DEFAULT = 'default'; // the config for strong-deploy

module.exports = function(Deployment) {
  Deployment.create = function(deployment, cb) {
    var baseURL;
    var cwd = process.cwd();

    if(deployment.type === 'local') {
      deployment.processes = deployment.processes || -1;
      baseURL = 'http://localhost:'
              + process.server.address().port
              + '/process-manager';
    } else {
      baseURL = 'http://' + deployment.host + ':' + deployment.port;
    }

    debug('deploy to %s: %j', baseURL, deployment);

    deploy();

    function deploy(){
      if(deployment.type === 'local') {
        performLocalDeployment(
          {
            baseURL: baseURL,
            serviceName: cwd,
            branchOrPack: 'process-manager',
            clusterSize: deployment.processes,
          },
          done);
      } else if(deployment.type === 'git') {
        performGitDeployment(
          {
            workingDir: cwd,
            baseURL: baseURL,
            serviceName: DEFAULT,
            branchOrPack: deployment.branch,
            clusterSize: deployment.processes,
          },
          done);
      } else {
        performHttpPutDeployment(
          {
            baseURL: baseURL,
            serviceName: DEFAULT,
            branchOrPack: deployment.archive,
            clusterSize: deployment.processes,
          },
          done);
      }
    }

    function done(err) {
      cb(err, deployment);
    }
  };

  Deployment.remoteMethod('create', {
    http: {verb: 'post', path: '/'},
    accepts: {arg: 'deployment', type: 'Deployment', http: {source: 'body'}},
    returns: {arg: 'deployment', type: 'Deployment', root: true}
  });
};
