var sass     = require('node-sass');
var CleanCSS = require('clean-css');
var dirname  = require('path').dirname;
var post     = require('postcss')([require('autoprefixer')]);

/**
 * Process SASS
 * @param deferred
 * @param opts - task specific options
 * @param ctx
 */
function processSass (deferred, opts, ctx) {

    var log = deferred.log;

    var min = new CleanCSS({
        relativeTo: dirname(opts.input)
    });

    /**
     * Kick it all off
     */
    sass.render({file: ctx.path.make(opts.input)}, handleSassComplete);

    /**
     * Handle SASS Errors nicely
     */
    function handleError (err) {
        err.silent = true;
        deferred.onError(err);
        log.error('{cyan:Message:}', String(err.message));
        log.error('{cyan:   File:}', String(err.file));
        log.error('{cyan:   Line:}', String(err.line));
        log.error('{cyan: Column:}', String(err.column));
    }

    /**
     * Minify & Write the file to disk following
     * completion of Autoprefixer
     * @param {Object} result
     */
    function handleAutoPrefixerComplete (result) {
        ctx.file.write(
            opts.output,
            minify(result)
        );
        deferred.onCompleted();
    }

    /**
     * Minify output
     */
    function minify (result) {
        return min.minify(result.css.toString()).styles;
    }

    /**
     * @param err
     * @param result
     * @returns {*}
     */
    function handleSassComplete (err, result) {
        if (err) {
            return handleError(err);
        }

        post.process(result.css)
            .then(handleAutoPrefixerComplete)
            .catch(deferred.onError.bind(deferred));
    }
}

module.exports.tasks = [processSass];

