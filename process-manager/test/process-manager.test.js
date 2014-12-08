var processManager = require('../server');
var request = require('supertest');

describe('process-manager-proxy', function() {
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
//  it('should restart local instance', function(done) {
//    request(processManager)
//      .post('/api/ServiceInstances/1')
//      .set('accept', 'application/json')
//      .expect(200)
//      .end(done);
//  });
});
