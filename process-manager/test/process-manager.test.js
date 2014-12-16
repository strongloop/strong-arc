var processManager = require('../server');
var request = require('supertest');

describe('process-manager-proxy', function() {
  processManager.start();
  this.timeout(10000);
  it('should proxy requests to the underlying process-manager', function(done) {
    request(processManager)
      .get('/')
      .set('accept', 'application/json')
      .expect(200)
      .end(done);
  });
  it('should get pm service api ServiceInstances id 1', function(done) {
    request(processManager)
      .get('/api/ServiceInstances/1')
      .set('accept', 'application/json')
      .expect(200)
      .end(done);
  });
  it('should return local services', function(done) {
    request(processManager)
      .get('/api/Services')
      .set('accept', 'application/json')
      .expect(200)
      .end(done);
  });
  it('should return local instance actions', function(done) {
    request(processManager)
      .get('/api/ServiceInstances/1/actions')
      .set('accept', 'application/json')
      .expect(200)
      .end(done);
  });
});
