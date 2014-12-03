var async = require('async');
var fs = require('fs-extra');
var path = require('path');
var request = require('request');
var gutil = require('gulp-util');
var cheerio = require('cheerio');

var CONFLUENCE_URL_BASE = 'http://docs.strongloop.com/';

module.exports = function(confluenceIds, destDir, cb) {
  fs.mkdirsSync(destDir);

  async.each(
    confluenceIds,
    function(id, next) {
      downloadHelpHtml(id, destDir, next);
    },
    cb);
};

function downloadHelpHtml(id, destDir, cb) {
  var url = CONFLUENCE_URL_BASE +
    'rest/api/content/' + id +
    '?expand=body.view';

  request(url, function(err, res, body) {
    if (err) return cb(err);
    if (res.statusCode !== 200) {
      var msg = 'Cannot download help item #' + id + ': ' + res.statusCode;
      gutil.log(gutil.colors.red(msg));
      gutil.log(body || '(empty body)');
      return cb(new Error(msg));
    }

    var data;
    try {
      data = JSON.parse(body);
    } catch (error) {
      var msg = 'Cannot parse help item #' + id + ': ' + error.message;
      gutil.log(gutil.colors.red(msg));
      gutil.log(body || '(empty body)');
      return cb(new Error(msg));
    }

    data.body.view.value = resolveRelativeHrefs(data.body.view.value);

    var fileName = path.join(destDir, id + '.json');

    gutil.log('Creating help file ' + fileName);
    fs.writeJsonFile(fileName, data, 'utf-8', cb);
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
