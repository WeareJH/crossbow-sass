var sass     = require('node-sass');
var CleanCSS = require('clean-css');
var dirname  = require('path').dirname;

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
 * Add prefixes automatically
 * @param deferred
 * @param previous
 */
function autoprefix (deferred, previous) {
    require('postcss')([require('autoprefixer')])
        .process(previous)
        .then(deferred.resolve)
        .catch(deferred.reject);
}

/**
 * Minify CSS output
 * @param deferred
 * @param previous
 * @param ctx
 */
function minifyCss (deferred, previous, ctx) {

    var minified = new CleanCSS({
        relativeTo: dirname(ctx.path.make('sass.input'))
    }).minify(previous.css.toString()).styles;

    deferred.resolve({css: minified});
}

/**
 * @param deferred
 * @param previous
 * @param ctx
 */
function writeFile (deferred, previous, ctx) {
    try {
        ctx.file.write('sass.output', previous.css);
        deferred.notify({level: 'debug', msg: 'CSS File written to ' + ctx.path.make('sass.output')});
        deferred.resolve(previous);
    } catch (e) {
        deferred.reject(e);
    }
}

module.exports.tasks = tasks;

