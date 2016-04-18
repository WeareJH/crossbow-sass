var sourcemaps = require('gulp-sourcemaps');
var post       = require('gulp-postcss');
var cssnano    = require('cssnano');
var pre        = require('autoprefixer');
var sass       = require('gulp-sass');
var imp        = require('postcss-import');
var vfs        = require('vinyl-fs');

/**
 * Process SASS
 */
module.exports = function processSass (options) {
    var productionPlugins = [imp, pre, cssnano];
    var devPlugins = [pre];
    
    return vfs.src(options.input)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(post(options.production ? productionPlugins : devPlugins))
        .pipe(sourcemaps.write('.'))
        .pipe(vfs.dest(options.output));
};
