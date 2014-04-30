// Copyright StrongLoop 2014
var loopback = require('loopback');
var app = require('../app');
var request = require('request');
var baseModels = require('../models.json');
var ModelDefs = app.models.modeldef;

ModelDefs.beforeRemote('find', function(ctx, user, next) {

  console.log('|        return base models');
//  console.log('|  ' + JSON.stringify(baseModels));

  ctx.res.send(200, [baseModels]);

});
