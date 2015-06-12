var cli    = require("./index");
var del    = require('rimraf').sync;
var assert = require('assert');
var exists = require('fs').existsSync;
var read   = require('fs').readFileSync;
var prom   = require('prom-seq');

del('test/fixtures/dist');

var task = prom.create(cli.tasks);

task('', require('crossbow-ctx')()).then(function () {
    assert(exists('test/fixtures/dist/main.css'));
    assert(read('test/fixtures/dist/main.css', 'utf-8').indexOf('normalize.css') > -1);
    console.log('Build complete');
}).done();