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

    resize();

    function deploy(err){
      if (err) return cb(err);

      if(deployment.type === 'local') {
        // args are: baseUrl, localdir, config, callback
        performLocalDeployment(baseURL, cwd, 'process-manager', done);
      } else if(deployment.type === 'git') {
        // args are: workingDir, baseUrl, config, branch, callback
        performGitDeployment(cwd, baseURL, DEFAULT, deployment.branch, done);
      } else {
        // args are: baseURL, config, npmPkg, callback
        performHttpPutDeployment(baseURL, DEFAULT, deployment.archive, done);
      }
    }

    function done(err) {
      cb(err, deployment);
    }

    function resize() {
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
