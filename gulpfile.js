var gulp = require('gulp');
var concat = require('gulp-concat');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');
var haml = require('gulp-haml');
var merge = require('merge-stream');
var through = require('through2');
var path = require('path');
var js_escape = require('js-string-escape');

gulp.task('default', ['build']);

gulp.task('build', ['js', 'css']);

gulp.task('css', function() {
    return gulp.src('src/stylesheets/**/*.sass')
        .pipe(sass())
        .pipe(concat('kahlua.css'))
        .pipe(gulp.dest('dist/css/'));
});

// register the compiled template with the JST object
var jst_register = through.obj(function(file, enc, cb) {
    var parsed = path.parse(path.relative('src/views', file.path));
    var templ_name = parsed.dir.replace(/\//g, '-') + '-' + parsed.name;

    file.contents = new Buffer('(window.JST || (window.JST = {}))["' + templ_name + '"] = function() { return "' + js_escape(file.contents) + '"; };');
    this.push(file);
    cb();
});


gulp.task('js', function() {
    var view_model = gulp.src(['src/javascripts/kahlua.js', 'src/javascripts/**/*.coffee'])
            .pipe(coffee());

    var view = gulp.src('src/views/**/*.jhaml')
            .pipe(haml())
            .pipe(jst_register);

    var combined = merge(view, view_model);

    return combined
        .pipe(concat('kahlua.js'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('watch', function() {
        gulp.watch('src/javascripts/**/*', ['js']);
});
