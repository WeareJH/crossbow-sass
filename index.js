/**
 * Process SASS
 */
module.exports = function processSass (options, ctx, done) {

    var sourcemaps = require('gulp-sourcemaps');
    var post       = require('gulp-postcss');
    var cssnano    = require('cssnano');
    var pre        = require('autoprefixer');
    var sass       = require('gulp-sass');
    sass.compiler  = require('sass');
    var imp        = require('postcss-import');
    var vfs        = require('vinyl-fs');
    var rename     = require('gulp-rename');
    var through    = require('through2');
    var path       = require('path');
    var fs         = require('fs');
    var assert     = require('assert');
    var gulpif     = require('gulp-if');
    var Fiber      = require('fibers');

    var productionPlugins = [imp, pre, cssnano];
    var devPlugins   = [imp, pre];
    var manifestFile = 'css-manifest.json';

    assert((typeof options.input === 'string' || Array.isArray(options.input)), '`input` should be a string, or array of strings');

    return vfs.src(options.input)
        .pipe(sourcemaps.init())
        .pipe(sass({fiber: Fiber}).on('error', done))
        .pipe(post(options.production ? productionPlugins : devPlugins))
        .pipe(rename(function (path) {
            if (options.production) {
                if (path.extname === '.css') {
                    return path.basename += '.min';
                }
            }
            return path;
        }))
        .pipe(gulpif(options.rev, require('gulp-rev')()))
        .pipe(sourcemaps.write('.'))
        .pipe(vfs.dest(options.output || process.cwd))
        .pipe(gulpif(options.rev && options.manifest, through.obj(function (file, enc, cb) {
            if (file.revOrigPath) {
                const key      = path.basename(file.revOrigPath);
                const result   = path.basename(file.path);
                const dir      = path.dirname(file.path);
                const manifest = path.join(dir, manifestFile);
                const existing = fs.existsSync(manifest) ? JSON.parse(fs.readFileSync(manifest, 'utf8')) : {};
                existing[key] = result;
                fs.writeFileSync(manifest, JSON.stringify(existing, null, 2));
            }
            cb();
        })))
};
