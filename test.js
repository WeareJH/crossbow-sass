// var assert = require('assert');
// var rim = require('rimraf');
// var exists = require('fs').existsSync;
// var read   = require('fs').readFileSync;
//
// rim.sync('test/fixtures/dist/main.css');
// var cb = require('crossbow-cli');
//
// var runner = cb.getRunner(['./index.js', './index.js --production'], {
//     options: {
//         "./index.js": {
//             input: "test/fixtures/main.scss",
//             output: "test/fixtures/dist"
//         }
//     }
// });
//
// runner
//     .runner
//     .series()
//     .subscribe(function (reports) {
//     }, function (err) {
//         console.log('as', err.stack);
//     }, function () {
//         assert(exists('test/fixtures/dist/main.css'));
//         assert(exists('test/fixtures/dist/main.min.css'));
//         assert(exists('test/fixtures/dist/main.css.map'));
//         assert(exists('test/fixtures/dist/main.min.css.map'));
//         assert(read('test/fixtures/dist/main.css', 'utf-8').indexOf('normalize.css') > -1);
//     });
//
