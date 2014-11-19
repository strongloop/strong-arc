var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();

app.enableAuth = function() {
  // disable auth
}

boot(app, __dirname);


app.use(loopback.urlNotFound());
app.use(loopback.errorHandler());
