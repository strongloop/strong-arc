var expect = require('chai').expect;
var request = require('supertest');
var app = require('../server.js');

describe('Studio', function() {
  it('serves an HTML page on "/" URL', function(done) {
    request(app).get('/')
      .expect(200)
      .expect('Content-Type', /html/)
      .end(done);
  });
});
