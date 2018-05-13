
 const base64 = require('gulp-base64');
 const browserSync = require('browser-sync');
 const reload = require('browser-sync').reload;
 const cssbeautify = require('gulp-cssbeautify');
 const cssnano = require('gulp-cssnano');
 const cache = require('gulp-cached');
 const del = require('del');
 const gulp = require('gulp');
 const gulpIf = require('gulp-if');
 const imagemin = require('gulp-imagemin');
 const path= require('path');
 const pngquant = require('imagemin-pngquant');
 const postcss = require('gulp-postcss');
 const sass = require('gulp-sass');
 const sourcemaps = require('gulp-sourcemaps');
 const ttf2woff = require('gulp-ttf2woff');
 const ttf2woff2 = require('gulp-ttf2woff2');
 const watch = require('gulp-watch');
 const webpack = require('webpack');
 const webpackStream = require('webpack-stream');
 const config = require('./config.js');
 const argv = require('yargs').argv;
 const { srcDir, buildDir, distDir, cssDir, imgDir, sassDir, fontsDir, jsDir } = config.dir;

 const stream = argv.watch ? true : false;
 const production = argv.prod ? true : false;
 const destDir =  production ? distDir : buildDir;

 // Browser sync
 gulp.task('browser_sync', () => {
     browserSync({
         server: {
             baseDir: buildDir
         },
         port: config.server.port,
         online: true
     });

     watch(buildDir + jsDir + '*.js', () => reload());
     watch(buildDir + imgDir + '*', () => reload());
     watch(buildDir + '*.html', () => reload());
 });



 // Sass
 gulp.task('sass', () => {

     let customFonts = {},
         weights = [],
         fonts = config.fonts.custom;

     weights[300] = 'Light';
     weights[400] = 'Regular';
     weights[600] = 'SemiBold';
     weights[700] = 'Bold';
     weights[800] = 'ExtraBold';

     for(let font in fonts) {
         customFonts[font] = {variants: {}};
         fonts[font].map(weight => {
             let url = {};
             config.fonts.formats.split(' ').map(format => {
                 url[format] = `./../fonts/${font.replace(/\s+/g, '')}/${font.replace(/\s+/g, '')}-${weights[weight]}.${format}`;
             });
             customFonts[font]['variants'][weight] = {
                 normal: { url: url }
             };
         });
     }

     gulp.src(srcDir + sassDir + '*.scss')
         .pipe(sass.sync().on('error', sass.logError))
         .pipe(postcss([
             require('autoprefixer')({
                 browsers: config.css.autoprefixer
             }),
             require('postcss-font-magician')({
                 custom: customFonts,
                 formats: config.fonts.formats
             })
         ]))
         .pipe(gulpIf(stream, cssbeautify()))
         .pipe(gulpIf(stream, sourcemaps.write('.')))
         .pipe(gulpIf(production, base64({ extensions: ['svg', 'png', 'jpg'] })))
         .pipe(gulpIf(production, cssnano()))
         .pipe(gulp.dest(destDir + cssDir))
         .pipe(gulpIf(stream, reload({ stream })));
 });



 // Babel
 gulp.task('js', () => {
     let entry = {};
     config.javascript.entry.map(item => {
         entry = { entry: 'index.js', [item]: `${config.dir.srcDir}${config.dir.jsDir}${item}` };
     });

     gulp.src(`${srcDir + jsDir}*.js`)
         .pipe(webpackStream({
             devtool: 'source-map',
             entry: entry,
             output: {
                 path: destDir + config.dir.jsDir,
                 filename: '[name]'
             },
             resolve: {
                 extensions: ['', '.js'],
                 modulesDirectories: [
                     'node_modules',
                     'src/js/',
                     'src/js/components',
                     'src/js/utils'
                 ]
             },
             watch: stream,
             module: {
                 loaders: [{
                     loader: 'babel-loader',
                     query: config.javascript.babel,
                     exclude: [
                         path.resolve(__dirname, 'node_modules/'),
                         path.resolve(__dirname, 'src/js/vendors/')
                     ],
                 }]
             },
             plugins: [
                  new webpack.NoErrorsPlugin()
              ].concat(
                  production ? [
                      new webpack.optimize.UglifyJsPlugin(),
                  ] : []
              )
         }))
         .pipe(gulp.dest(destDir + jsDir));
 });



 // Images
 gulp.task('img', () => {
     gulp.src([srcDir + imgDir + '**'])
         .pipe(cache('img'))
         .pipe(imagemin({
             progressive: true,
             svgoPlugins: [],
             use: [pngquant()]
         }))
         .pipe(gulp.dest(destDir + imgDir));
 });



 // HTML
 gulp.task('html', () => {
     gulp.src(srcDir + '*.html')
         .pipe(cache('html'))
         .pipe(gulp.dest(destDir));
 });



 // Cleaner
 gulp.task('clean', () => del(buildDir + '**/*', {
     force: true
 }));



 // Fonts
 gulp.task('fonts', () => {

     gulp.src(srcDir + 'fonts/**/*.ttf')
         .pipe(gulp.dest(destDir + fontsDir));

 });



 // Dev
 gulp.task('dev', ['clean'], () => {
     gulp.start('fonts', 'sass', 'img', 'js', 'html');

     if(stream) {
         gulp.start('browser_sync');
         watch(srcDir + sassDir + '**/*.scss',  () => gulp.start('sass'));
         watch(srcDir + imgDir + '*',  () => gulp.start('img'));
         watch(srcDir + '*.html',  () => gulp.start('html'));
     }
 });



 // Clean dist dir
 gulp.task('clean-dist', () => {
     del(distDir + '**/*', {
         force: true
     });
 });



 // Prod
 gulp.task('build', ['clean-dist'], () => {
     gulp.start('fonts', 'sass', 'img', 'js', 'html');
 });




 /*

       _____       _
      / ____|     | |
     | |  __ _   _| |_ __
     | | |_ |  | | | |  _ \
     | |__| | |_| | | |_) |
      \_____|\__,_|_|  __/  .
                    | |
                    |_|

 */
