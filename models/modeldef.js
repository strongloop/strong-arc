// Copyright StrongLoop 2014
var loopback = require('loopback');
var app = require('../app');
var request = require('request');
var baseModels = require('../models.json');
var ModelDefs = app.models.modeldef;
var ds = require('loopback-datasource-juggler').DataSource;

ModelDefs.beforeRemote('find', function(ctx, user, next) {

  ctx.res.send(200, [baseModels]);

});
