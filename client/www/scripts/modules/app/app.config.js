app.factory('Config', function(){
  return {
    ElasticSearch: {
      host: 'es1.strongloop.com:9200',
      log: 'trace',
      version: '1.2'
    }
  };
});
