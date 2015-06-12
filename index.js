var sass     = require('node-sass');
var CleanCSS = require('clean-css');

/**
 * Define the tasks that make up a build
 * @type {Object}
 */
var tasks    = [processSass, autoprefix, minifyCss, writeFile];

/**
 * Process SASS
 * @param deferred
 * @param previous
 * @param ctx
 */
function processSass (deferred, previous, ctx) {
    var out = sass.renderSync({
        file: ctx.path.make('sass.input')
    });
    deferred.resolve(out.css);
}

/**
 * Minify CSS output
 * @param deferred
 * @param previous
 * @param ctx
 */
function minifyCss (deferred, previous, ctx) {

    var minified = new CleanCSS({
        relativeTo: ctx.path.make('sass.root')
    }).minify(previous.toString()).styles;

    deferred.resolve(minified);
}

/**
 * Add prefixes automatically
 * @param deferred
 * @param previous
 */
function autoprefix (deferred, previous) {
    var postcss = require('postcss');
    postcss([require('autoprefixer')])
        .process(previous)
        .then(function (result) {
            deferred.resolve(result.css);
        }).catch(deferred.reject);
}

/**
 * @param deferred
 * @param previous
 * @param ctx
 */
function writeFile (deferred, previous, ctx) {
    try {
        ctx.file.write('sass.output', previous);
        deferred.notify({level: 'debug', msg: 'CSS File written to ' + ctx.path.make('sass.output')});
        deferred.resolve(previous);
    } catch (e) {
        deferred.reject(e);
    }
}

module.exports.tasks = tasks;

