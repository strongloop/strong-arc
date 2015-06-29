var debug = require('debug')('strong-arc:subscription');
module.exports = function provisionSubscriptions(server) {
  server.models.Subscription.provisionSubscriptions(function(err) {
    if (!err) {
      debug('Subscriptions are reloaded from the server.');
    } else {
      debug('Error: ', err);
    }
  });
};
