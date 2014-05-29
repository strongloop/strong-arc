var loopback = require('loopback');
var app = require('../app');
var request = require('request');
var User = app.models.user;


User.beforeRemote('login', function(ctx, user, next) {

  console.log('|           LOGIN REQUEST: ' + JSON.stringify(ctx.req.body));

  var authObj = {
    username: ctx.req.body.email,
    password: ctx.req.body.password
  };
  next();
});
