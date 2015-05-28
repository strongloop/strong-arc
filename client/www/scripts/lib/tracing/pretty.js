window.parseMs  = function (ms) {
  if (typeof ms !== 'number') {
    throw new TypeError('Expected a number');
  }

  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000 % 24),
    minutes: Math.floor(ms / 60000 % 60),
    seconds: Math.floor(ms / 1000 % 60),
    milliseconds: Math.floor(ms % 1000)
  };
};

function add(ret, val, postfix) {
  if (val > 0) {
    ret.push(val + postfix);
  }

  return ret;
}

window.prettyms = function (ms, opts) {
  if (typeof ms !== 'number') {
    throw new TypeError('Expected a number');
  }

  if (ms < 1000) {
    return Math.ceil(ms) + 'ms';
  }

  opts = opts || {};

  var ret = [];
  var parsed = parseMs(ms);

  ret = add(ret, parsed.days, 'd');
  ret = add(ret, parsed.hours, 'h');
  ret = add(ret, parsed.minutes, 'm');

  if (opts.compact) {
    ret = add(ret, parsed.seconds, 's');
    return '~' + ret[0];
  }

  ret = add(ret, (ms / 1000 % 60).toFixed(1).replace(/\.0$/, ''), 's');

  return ret.join(' ');
};
