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
                src: ['public/utils/register.js', 'public/app/app.js', 'public/app/**/*.js'],
                dest: 'public/dist/app.jsx'
            },
            test: {
                files: {
                    'tests/front/unit/controllers.jsx': ['tests/front/unit/controllers/*.js'],
                    'tests/front/unit/directives.jsx': ['tests/front/unit/directives/*.js'],
                    'tests/front/unit/filters.jsx': ['tests/front/unit/filters/*.js'],
                    'tests/front/unit/services.jsx': ['tests/front/unit/services/*.js']
                }
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
                    "bower_components/angular-toastr/dist/angular-toastr.css",
                    "bower_components/c3/c3.min.css",
                    "bower_components/animate.css/animate.min.css",
                    "public/fonts/pe-icon-7-stroke/css/helper.css",
                    "public/fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css",
                    "public/stylesheets/main.css"
                ],
                dest: "public/dist/dist.css"
            }
        },
        watch: {
            dev: {
                files: [ 'Gruntfile.js', 'public/app/**/*.js', 'public/**/*.html', 'public/stylesheets/*.css' ],
                tasks: [ 'build' ]
            },
            test: {
                files: [ 'Gruntfile.js', 'public/app/**/*.js', 'public/**/*.html', 'tests/front/unit/**/*.spec.js' ],
                tasks: [ 'test' ],
                options: {
                    atBegin: true
                }
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
            all: [ 'Gruntfile.js', 'public/app/*.js', 'public/app/**/*.js' ],
            options: {
                "esnext": true
            }
        },
        babel: {
            options: {
                presets: ['es2015']
            },
            dist: {
                files: {
                    'public/dist/app.js': 'public/dist/app.jsx'
                }
            },
            test: {
                files: {
                    'tests/front/unit/controllers.js': 'tests/front/unit/controllers.jsx',
                    'tests/front/unit/directives.js' : 'tests/front/unit/directives.jsx',
                    'tests/front/unit/filters.js' : 'tests/front/unit/filters.jsx',
                    'tests/front/unit/services.js' : 'tests/front/unit/services.jsx'
                }
            }
        },
        jasmine : {
            src : ['public/dist/bower.js', 'public/dist/app.js'],
            options: {
                specs : 'tests/front/unit/*.js',
                summary: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['bower', 'bower_concat', 'concat_css', 'concat', 'bowercopy', 'jshint', 'babel']);
    grunt.registerTask('test', ['build', 'concat:test', 'babel:test', 'jasmine']);
    grunt.registerTask('test-dev', ['build', 'watch:test']);
    grunt.registerTask('dev', ['build', 'watch:dev']);
};