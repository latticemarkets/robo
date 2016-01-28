/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 *
 */

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['public/app/app.js', 'public/app/**/*.js'],
                dest: 'public/dist/app.js'
            }
        },
        bower_concat: {
            all: {
                dest: 'public/dist/bower.js'
            }
        },
        bower: {
            install: {
                options: {
                    install: true,
                    copy: false,
                    targetDir: '.libs',
                    cleanTargetDir: true
                }
            }
        },
        concat_css: {
            options: {},
            all: {
                src: [
                    "bower_components/bootstrap/dist/css/bootstrap.min.css",
                    "bower_components/font-awesome/css/font-awesome.min.css",
                    "public/stylesheets/main.css"
                ],
                dest: "public/dist/dist.css"
            }
        },
        watch: {
            dev: {
                files: [ 'Gruntfile.js', 'public/app/**/*.js', 'public/**/*.html', 'public/stylesheets/*.css' ],
                tasks: [ 'build' ]
            }
        },
        bowercopy: {
            options: {
                runBower: false,
                srcPrefix: 'bower_components'
            },
            bootstrap: {
                options: {
                    destPrefix: 'public/fonts'
                },
                files: {
                    'glyphicons-halflings-regular.ttf': 'bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
                    'glyphicons-halflings-regular.woff': 'bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
                    'glyphicons-halflings-regular.woff2': 'bootstrap/dist/fonts/glyphicons-halflings-regular.woff2'
                }
            },
            fontawesome: {
                options: {
                    destPrefix: 'public/fonts'
                },
                files: {
                    'fontawesome-webfont.woff': 'font-awesome/fonts/fontawesome-webfont.woff',
                    'fontawesome-webfont.woff2': 'font-awesome/fonts/fontawesome-webfont.woff2',
                    'fontawesome-webfont.ttf': 'font-awesome/fonts/fontawesome-webfont.ttf'
                }
            }
        },
        jshint: {
            all: [ 'Gruntfile.js', 'public/app/*.js', 'public/app/**/*.js' ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['bower', 'bower_concat', 'concat_css', 'concat', 'bowercopy', 'jshint']);
    grunt.registerTask('dev', ['build', 'watch']);
};