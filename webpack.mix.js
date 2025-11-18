const path = require('path');
const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.js('resources/js/app.js', 'public/js')
    .react()
    .sass('resources/scss/style.scss', 'public/css')
    .alias({
        '@': path.join(__dirname, 'resources'),
        '@app': path.join(__dirname, 'resources/js'),
    })
    .copy('resources/images/task_voting.svg', 'public/images')
    .version();
