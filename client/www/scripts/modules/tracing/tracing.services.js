Tracing.service('TracingServices', [
  '$rootScope',
  '$log',
  'LicensesService',
  '$location',
  function($rootScope, $log, LicensesService, $location) {
    var svc = this;
    var currTraceHosts = [];
    var currentTimelineTimestamp;

    svc.getCurrentTimelineTimestamp = function() {
      return currentTimelineTimestamp;
    };
    svc.alertNoProcesses = function(){

        $rootScope.$emit('message', {
          body: 'No processes found.  Please try another host.',
          links: [{
              link: '/#process-manager',
              linkText: 'go to Process Manager view'
            },
            {
              link: 'http://docs.strongloop.com/display/SLC/Tracing',
              linkText: 'more info...'
            }
          ]
        });
    };
    svc.alertProcessLoadProblem = function(){

      $rootScope.$emit('message', {
          body: 'Not all processes are coming up.  Please check the pm host status.',
          links: [{
            link: '/#process-manager',
            linkText: 'go to Process Manager view'
          },
          {
            link: 'http://docs.strongloop.com/display/SLC/Tracing',
            linkText: 'more info...'
          }
        ]
      });
    };

    svc.alertUnlicensedPMHost = function() {
      $rootScope.$emit('message', {
        body: 'The processes came up but they are not tracing.  You may need to push a license to your PM Host via the Process Manager view. Or you could try stopping and starting tracing again to reset.',
        links: [{
          link: '/#process-manager',
          linkText: 'go to Process Manager view'
        },
          {
            link: 'http://docs.strongloop.com/display/SL/Managing+your+licenses#Managingyourlicenses-Settingyourlicensekeyonaremotehost',
            linkText: 'more info...'
          }
        ]
      });
    };
    svc.alertNoHosts = function() {
      $rootScope.$emit('message', {
        body: 'No hosts found.  Please add a Strong PM host via the Process Manager view.',
        stateOnClose: 'process-manager',
        links: [{
            link: '/#process-manager',
            linkText: 'go to Process Manager view'
          },
          {
            link: 'http://docs.strongloop.com/display/SLC/Tracing',
            linkText: 'more info...'
          }
        ]

      });
    };
    svc.convertTimeseries = function(t){
      var ret = {};
      // note: item values are displayed in chart legend
      ret.cpu = t.map(function(d){
        var item = {
          _t: moment(d.ts).unix()*1000,
          'Memory Used': d['p_mu'],
          'Load Average': d['s_la'],
          '__data': d
        };
        return item;
      });
      ret.cpu = ret.cpu.sort(function(a,b){ return a._t - b._t;});
      return ret.cpu;
    };


    svc.getMappedTransactions = function(transactions) {
      var collectionData = Object.keys(transactions)
        .filter(function (key) {
          if (key === 'strongtrace.send') return false
          if (key === 'strongtrace.assemble') return false
          return transactions.hasOwnProperty(key)
        })
        .map(function (key) {
          return {
            id: key,
            stats: transactions[key].stats,
            waterfalls: transactions[key].waterfalls
          }
        })
        .filter(function(d){
          return d.waterfalls
        })
        .sort(function (a, b) {
          //waterfalls can be null if they did not happen in this trace file
          if( a.waterfalls && b.waterfalls ){
            return b.waterfalls.summary_stats.totalMicros - a.waterfalls.summary_stats.totalMicros
          } else if( a.waterfalls ){
            return -1
          } else if( b.waterfalls ){
            return 1
          } else if( a.stats && b.stats ){
            return b.stats.mean - a.stats.mean
          } else {
            return a.id.localeCompare(b.id)
          }
        });
      return collectionData;
    };

    svc.validateLicense = function() {
      return LicensesService.validateModuleLicense('Tracing', 'agent')
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('exception validating tracing license');
          return false;
        });
    };

    // get first index for prototype
    svc.getFirstHost = function() {
      return currTraceHosts[0];
    };
    return svc;
  }
]);
Tracing.service('TracingFormat', [
  function() {
    var svc = this;

    svc.format = function(string) {
      return string;
    };

    svc.mb = function mb(val){
      return numeral(val).format('0.0 b')
    };

    svc.ms = function millisecond(ms){
      return prettyms(ms)
    };

    svc.s = function second(s){
      return prettyms(s*1000)
    };

    svc.num = function num(val){
      return numeral(val).format('0.0 a')
    };

    svc.truncate = function truncate(str, front, back, options) {
      var opts = options || (typeof back === 'object') ? back : {}
      var ret = ''
      if (!str || (str.length <= front + back)) return str
      ret += str.slice(0, front)
      ret += opts.seperator || '...'
      if (typeof back == 'number') ret += str.slice(-back)
      return ret
    };
    return svc;
  }

]);
