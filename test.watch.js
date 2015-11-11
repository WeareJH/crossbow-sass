var assert = require('assert');
var rim = require('rimraf');
var exists = require('fs').existsSync;
var read   = require('fs').readFileSync;

rim.sync('test/fixtures/dist/main.css');
var cb = require('crossbow-cli');
cb({
    input: ['watch', 'sass']
}, {
    crossbow: {
        watch: {
            tasks: {
                sass: {
                    "test/fixtures/**/*.scss": ['./index.js']
                }
            }
        },
        config: {
            "./index.js": {
                input: "test/fixtures/main.scss",
                output: "test/fixtures/dist/main.css"
            }
        }
    }
});


