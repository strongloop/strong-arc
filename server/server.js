var express = require('express');
var path = require('path');
var app = module.exports = express();
var workspace = require('loopback-workspace');

// REST APIs
app.use('/workspace', workspace);

// static files
app.use(express.static(path.join(__dirname, '../client/www')));
