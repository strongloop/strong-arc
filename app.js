var loopback = require('loopback');
var path = require('path');
var app = module.exports = loopback();
var workspace = require('loopback-workspace');

// boot the loopback app
app.boot(__dirname);

// basic middleware
app.use(loopback.favicon());
app.use(loopback.logger(app.get('env') === 'development' ? 'dev' : 'default'));
app.use(loopback.cookieParser(app.get('cookieSecret')));
app.use(loopback.token({model: app.models.accessToken}));

// REST APIs
app.use(app.get('restApiRoot'), loopback.rest());
app.use('/workspace', workspace);

// express router
app.use(app.router);

// static files
app.use(loopback.static(path.join(__dirname, 'client/www')));

// error handlers
app.use(loopback.urlNotFound());
app.use(loopback.errorHandler());