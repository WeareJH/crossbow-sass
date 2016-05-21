var sourcemaps = require('gulp-sourcemaps');
var post       = require('gulp-postcss');
var cssnano    = require('cssnano');
var pre        = require('autoprefixer');
var sass       = require('gulp-sass');
var imp        = require('postcss-import');
var vfs        = require('vinyl-fs');
var rename     = require('gulp-rename');

/**
 * Process SASS
 */
module.exports = function processSass (options, ctx, done) {
    var productionPlugins = [imp, pre, cssnano];
    var devPlugins = [imp, pre];

    return vfs.src(options.input)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', done))
        .pipe(post(options.production ? productionPlugins : devPlugins))
        .pipe(rename(function (path) {
            if (options.production) {
                if (path.extname === '.css') {
                    return path.basename += '.min';
                }
            }
            return path;
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(vfs.dest(options.output || process.cwd));
};
