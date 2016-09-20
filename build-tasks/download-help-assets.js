var async = require('async');
var fs = require('fs-extra');
var path = require('path');
var request = require('request');
var gutil = require('gulp-util');
var cheerio = require('cheerio');
var _ = require('lodash');
var CONFLUENCE_URL_BASE = 'http://docs.strongloop.com/';

module.exports = function(names, destDir, cb) {
  var confluenceIds = _.values(names);
  var namesById = _.invert(names);
  fs.mkdirsSync(destDir);

  async.each(
    confluenceIds,
    function(id, next) {
      var name = namesById[id];
      downloadHelpHtml(id, name, destDir, next);
    },
    cb);
};

function downloadHelpHtml(id, name, destDir, cb) {
  var fileName = path.join(destDir, name + '.json');

  // Downloading data from Confluence frequently fails on our CI machines
  // [08:54:55] 'build-help-assets' errored after 5.87 s
  // [08:54:55] Error: read ECONNRESET
  //     at exports._errnoException (util.js:907:11)
  //         at TLSWrap.onread (net.js:557:26)
  // Since we don't have any tests relying on the exact help contents,
  // we can use a dummy placeholder instead.
  if (process.env.CI) {
    var data = {
      id: id,
      type: 'page',
      title: name,
      body: {
        view: {
          value: 'Dummy help contents for ' + name,
          representation: 'view',
        },
      }
    };

    gutil.log('Creating dummy help file ' + fileName);
    return fs.writeJsonFile(fileName, data, {}, cb);
  }

  var url = CONFLUENCE_URL_BASE +
    'rest/api/content/' + id +
    '?expand=body.view';

  request(url, function(err, res, body) {
    var msg;
    if (err) return cb(err);
    if (res.statusCode !== 200) {
      msg = 'Cannot download help item #' + id + ': ' + res.statusCode;
      gutil.log(gutil.colors.red(msg));
      gutil.log(body || '(empty body)');
      return cb(new Error(msg));
    }

    var data;
    try {
      data = JSON.parse(body);
    } catch (error) {
      msg = 'Cannot parse help item #' + id + ', ' + name +': ' + error.message;
      gutil.log(gutil.colors.red(msg));
      gutil.log(body || '(empty body)');
      return cb(new Error(msg));
    }

    data.body.view.value = resolveRelativeHrefs(data.body.view.value);

    gutil.log('Creating help file ' + fileName);
    fs.writeJsonFile(fileName, data, {}, cb);
  });
}

function resolveRelativeHrefs(html) {
  var $ = cheerio.load(html, {
    normalizeWhitespace: false,
    decodeEntities: false
  });

  $('a').each(function() {
    var href = $(this).attr('href');

    if (/^\/display/.test(href)) {
      $(this).attr('href', CONFLUENCE_URL_BASE + href.slice(1));
    }

    $(this).attr('target', '_new');
  });
  return $.html();
}
