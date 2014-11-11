var app = require('../server/server');
var Build = app.models.Build;
var sandbox = require('./util/sandbox');


describe('Build', function () {
  beforeEach(function (done) {
    sandbox.createAndChdir(done);
  });
  beforeEach(function (done) {
    sandbox.createEmptyLoopBackApp(done);
  });
  beforeEach(function (done) {
    Build.destroyAll(done);
  });
  describe('.start(build, cb)', function () {
    it('should create and start a build', function (done) {
      Build.start({
        type: 'archive'
      }, function(err, build) {
        expect(build.id).to.be.a.number;
        expect(build.started).to.be.a.date;
        Build.findById(build.id, function(err, buildFound) {
          expect(build.id).to.equal(buildFound.id);
          done();
        });
      });
    });
  });
});
