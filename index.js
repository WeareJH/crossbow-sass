var sass     = require('node-sass');
var CleanCSS = require('clean-css');
var dirname  = require('path').dirname;
var Rx       = require('rx');

/**
 * Process SASS
 * @param deferred
 * @param previous
 * @param ctx
 */
function processSass (obs, opts, ctx) {

    var log = obs.log;

    var min      = new CleanCSS({relativeTo: dirname(opts.input)});
    var process  = Rx.Observable.fromNodeCallback(sass.render);
    var prefixer = require('postcss')([require('autoprefixer')]);

    /**
     * Kick it all off by running through SASS first
     */
    process({file: ctx.path.make(opts.input)})
        .concatMap(function (x) {
            return Rx.Observable.fromPromise(prefixer.process(x.css))
        })
        .map(function (x) { return x.css })
        .map(min.minify.bind(min))
        .map(function (x) { return x.styles })
        .subscribe(function (x) {
            ctx.file.write(opts.output, x);
        }, handleError, obs.onCompleted.bind(obs))

    /**
     * Handle SASS Errors nicely
     */
    function handleError (err) {
        if (err.file && err.line) {
            err.silent = true;
            log.error('{cyan:Message:}', String(err.message));
            log.error('{cyan:   File:}', String(err.file));
            log.error('{cyan:   Line:}', String(err.line));
            log.error('{cyan: Column:}', String(err.column));
        }
        obs.onError(err);
    }
}

module.exports.tasks = [processSass];

