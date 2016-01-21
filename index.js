var sourcemaps = require('gulp-sourcemaps');
var post       = require('gulp-postcss');
var cssnano    = require('cssnano');
var pre        = require('autoprefixer');
var sass       = require('gulp-sass');
var imp        = require('postcss-import');

/**
 * Process SASS
 * @param deferred
 * @param previous
 * @param ctx
 */
function processSass (obs, opts, ctx) {
    return ctx.vfs.src(opts.input)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(post([imp, pre, cssnano]))
        .pipe(sourcemaps.write('.'))
        .pipe(ctx.vfs.dest(opts.output));
}

module.exports.tasks = [processSass];

