#!/usr/bin/env node

var async = require('async');
var mysql = require('mysql');
var gutil = require('gulp-util');

// Run this script once to setup your MySQL database for unit-tests
// The script creates a database and login credentials

var DATABASE = 'strong_studio_test';
var USER = 'studio';
var PASSWORD = 'zh59jeol';

module.exports = function(ROOT_PASSWORD, callback) {
  var connection;
  async.series([
    function setupConnection(next) {
      connection = mysql.createConnection({
        user: 'root',
        password: ROOT_PASSWORD
      });

      gutil.log('Connecting');
      connection.connect(next);
    },
    function createDatabase(next) {
      gutil.log('Creating database ' + DATABASE);
      connection.query('CREATE DATABASE IF NOT EXISTS ' + DATABASE, next);
    },
    function createUser(next) {
      gutil.log('Creating user ' + USER + ' with password ' + PASSWORD);
      connection.query('GRANT ALL PRIVILEGES  ON ' + DATABASE + '.*' +
          ' TO "' + USER + '"@"localhost" IDENTIFIED BY "' + PASSWORD + '"' +
          ' WITH GRANT OPTION',
        next);
    },
  ], function(err) {
    connection.end();
    callback(err);
  });
};
