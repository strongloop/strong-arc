// Copyright StrongLoop 2014
var workspace = require('loopback-workspace');

process.env.WORKSPACE_DIR = __dirname;

workspace.listen(4000);
