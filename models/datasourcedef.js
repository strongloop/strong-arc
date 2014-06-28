// Copyright StrongLoop 2014
var loopback = require('loopback');
var app = require('../app');
var request = require('request');
var baseDataSources = require('../datasources.json');
var DataSourceDefs = app.models.datasourcedef;
var DataSource = require('loopback-datasource-juggler').DataSource;


DataSourceDefs.discoverschema = function(fn) {
  var dsName = 'apmDev';

  var ds = app.dataSources[dsName];

  var tableModels = [];
  function show(err, models) {
    if (err) {
      console.error('a1) ' + err);
    } else {
      console.log('b1) ' + models);
      if (models) {
        models.forEach(function (m) {
        //  console.log('c1) ' + JSON.stringify(m));
          var tProps = ds.discoverModelProperties(m.name, function(err, props) {

           // m.properties = tProps;
            m.properties = props;
            tableModels.push(m);

          });

        });
        // had to allow the asynch 'child data' calls to run
        // there is a way to do this but got stuck and had to
        // brute force it for now
        setTimeout(function(){
          fn(err, tableModels);
        }, 5000);

      }
    }
  }
  ds.discoverModelDefinitions({views: true, all:true}, show);
};

loopback.remoteMethod(DataSourceDefs.discoverschema, {
  returns : {arg: 'schema', type: 'array' },
  http: {path: '/discoverschema', verb: 'get'}
});

DataSourceDefs.alldefinitions = function(fn){

  var err = null;

  fn(err, [baseDataSources]);
};
DataSourceDefs.beforeRemote('find', function(ctx, user, next) {

  ctx.res.send(200, [baseDataSources]);

});

loopback.remoteMethod(
  DataSourceDefs.alldefinitions,
  {
    returns: {arg: 'name', type: 'string'},
    http: {path: '/alldefinitions', verb: 'get'}
  }
);
