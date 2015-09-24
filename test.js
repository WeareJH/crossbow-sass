var assert = require('assert');
var exists = require('fs').existsSync;
var read   = require('fs').readFileSync;

assert(exists('test/fixtures/dist/main.css'));
assert(read('test/fixtures/dist/main.css', 'utf-8').indexOf('normalize.css') > -1);