const config = {
    server: {
        port: 8000
    },
    dir: {
        srcDir: __dirname + '/src/',
        buildDir: __dirname + '/__build__/',
        distDir: __dirname + '/dist/',
        cssDir: 'css/',
        imgDir: 'assets/',
        jsDir: 'js/',
        sassDir: 'sass/',
        fontsDir: 'fonts/'
    },
    fonts: {
        formats: 'woff woff2',
        custom: {
            'Open Sans': [400, 600]
        }
    },
    css: {
        autoprefixer: ['> 98%']
    },
    javascript: {
        entry: ['index.js'],
        babel: { presets: ['es2015', 'stage-0'] }
    }
};

module.exports = config;
