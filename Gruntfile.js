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
            },
            'test-controllers': {
                files: {
                    'tests/front/unit/controllers.jsx': ['tests/front/unit/controllers/*.js']
                }
            },
            'test-services': {
                files: {
                    'tests/front/unit/services.jsx': ['tests/front/unit/services/*.js']
                }
            },
            'test-directives': {
                files: {
                    'tests/front/unit/directives.jsx': ['tests/front/unit/directives/*.js']
                }
            },
            'test-filters': {
                files: {
                    'tests/front/unit/filters.jsx': ['tests/front/unit/filters/*.js']
                }
            }
        },
        bower_concat: {
            all: {
                dest: 'public/dist/bower.js',
                mainFiles: {
                    Flot: ['jquery.flot.js', 'jquery.flot.pie.js']
                },
                dependencies: {
                    'angular': 'jquery'
                }
            },
            landpage: {
                dest: 'public/dist/landpage.js',
                cssDest: 'public/dist/landpage.css',
                include: ['jquery', 'particles.js', 'toastr']
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
            options: {
                separator: ';\n'
            },
            all: {
                src: [
                    "bower_components/bootstrap/dist/css/bootstrap.min.css",
                    "bower_components/font-awesome/css/font-awesome.min.css",
                    "bower_components/angular-toastr/dist/angular-toastr.css",
                    "bower_components/c3/c3.min.css",
                    "bower_components/sweetalert/dist/sweetalert.css",
                    "bower_components/animate.css/animate.min.css",
                    "bower_components/angularjs-slider/dist/rzslider.min.css",
                    "bower_components/ng-tags-input/ng-tags-input.min.css",
                    "bower_components/ng-tags-input/ng-tags-input.bootstrap.min.css",
                    "bower_components/angular-xeditable/dist/css/xeditable.css",
                    "public/fonts/pe-icon-7-stroke/css/helper.css",
                    "public/fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css",
                    "public/stylesheets/spinners.css",
                    "public/stylesheets/main.css",
                    "bower_components/bootstrap-tour/build/css/bootstrap-tour.min.css",
                    "bower_components/angular-ui-switch/angular-ui-switch.css"
                ],
                dest: "public/dist/dist.css"
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'public/dist/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'public/dist/',
                    ext: '.min.css'
                }]
            }
        },
        watch: {
            dev: {
                files: [ 'Gruntfile.js', 'public/app/**/*.js', 'public/**/*.html', 'public/stylesheets/*.css' ],
                tasks: [ 'build-dev' ]
            },
            test: {
                files: [ 'Gruntfile.js', 'public/app/**/*.js', 'public/**/*.html', 'tests/front/unit/**/*.spec.js' ],
                tasks: [ 'test' ],
                options: {
                    atBegin: true
                }
            },
            'test-controllers': {
                files: [ 'Gruntfile.js', 'public/app/**/*.js', 'public/**/*.html', 'tests/front/unit/controllers/*.spec.js' ],
                tasks: [ 'test-controllers' ],
                options: {
                    atBegin: true
                }
            },
            'test-services': {
                files: [ 'Gruntfile.js', 'public/app/**/*.js', 'public/**/*.html', 'tests/front/unit/services/*.spec.js' ],
                tasks: [ 'test-services' ],
                options: {
                    atBegin: true
                }
            },
            'test-directives': {
                files: [ 'Gruntfile.js', 'public/app/**/*.js', 'public/**/*.html', 'tests/front/unit/directives/*.spec.js' ],
                tasks: [ 'test-directives' ],
                options: {
                    atBegin: true
                }
            },
            'test-filters': {
                files: [ 'Gruntfile.js', 'public/app/**/*.js', 'public/**/*.html', 'tests/front/unit/filters/*.spec.js' ],
                tasks: [ 'test-filters' ],
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
            },
            'test-controllers': {
                files: {
                    'tests/front/unit/controllers.js': 'tests/front/unit/controllers.jsx'
                }
            },
            'test-services': {
                files: {
                    'tests/front/unit/services.js' : 'tests/front/unit/services.jsx'
                }
            },
            'test-directives': {
                files: {
                    'tests/front/unit/directives.js' : 'tests/front/unit/directives.jsx'
                }
            },
            'test-filters': {
                files: {
                    'tests/front/unit/filters.js' : 'tests/front/unit/filters.jsx'
                }
            }
        },
        jasmine : {
            test: {
              src : ['public/dist/bower.js', 'public/dist/app.js'],
              options: {
                  specs : 'tests/front/unit/*.js',
                  summary: true
              }
            },
            controllers: {
                src : ['public/dist/bower.js', 'public/dist/app.js'],
                options: {
                    specs : 'tests/front/unit/controllers.js',
                    summary: true
                }
            },

            directives: {
                src : ['public/dist/bower.js', 'public/dist/app.js'],
                options: {
                    specs : 'tests/front/unit/directives.js',
                    summary: true
                }
            },

            services: {
                src : ['public/dist/bower.js', 'public/dist/app.js'],
                options: {
                    specs : 'tests/front/unit/services.js',
                    summary: true
                }
            },

            filters: {
                src : ['public/dist/bower.js', 'public/dist/app.js'],
                options: {
                    specs : 'tests/front/unit/filters.js',
                    summary: true
                }
            }
        },
        uglify: {
            bower: {
                options: {
                    compress: true
                },
                files: {
                    'public/dist/bower.min.js': ['public/dist/bower.js']
                }
            },
            app: {
                options: {
                    mangle: false,
                    compress: true
                },
                files: {
                    'public/dist/app.min.js': ['public/dist/app.js']
                }
            }
        },
        concurrent: {
            dist: {
                tasks: ['build-bower', 'build-app', 'jshint']
            },
            tests: {
                tasks: ['build-bower', 'build-app', 'jshint', 'build-tests']
            },
            testControllers: {
                tasks: ['build-bower', 'build-app', 'jshint', 'build-tests-controllers']
            },
            testServices: {
                tasks: ['build-bower', 'build-app', 'jshint', 'build-tests-services']
            },
            testDirectives: {
                tasks: ['build-bower', 'build-app', 'jshint', 'build-tests-directives']
            },
            testFilters: {
                tasks: ['build-bower', 'build-app', 'jshint', 'build-tests-filters']
            }
        },
        clean: ["public/dist"]
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
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');

    /**
     * Tasks
     */

    grunt.registerTask('default', ['build-prod']);

    grunt.registerTask('build-bower', ['bower', 'bower_concat', 'bowercopy', 'concat_css']);
    grunt.registerTask('build-app', ['concat:dist', 'babel:dist']);

    grunt.registerTask('build-prod', ['clean', 'concurrent:dist', 'uglify:app', 'uglify:bower', 'cssmin']);
    grunt.registerTask('build-dev', ['clean', 'concurrent:dist']);

    grunt.registerTask('build-tests', ['build-dev', 'concat:test', 'babel:test']);
    grunt.registerTask('build-tests-controllers', ['build-dev', 'concat:test-controllers', 'babel:test-controllers']);
    grunt.registerTask('build-tests-services', ['build-dev', 'concat:test-services', 'babel:test-services']);
    grunt.registerTask('build-tests-directives', ['build-dev', 'concat:test-directives', 'babel:test-directives']);
    grunt.registerTask('build-tests-filters', ['build-dev', 'concat:test-filters', 'babel:test-filters']);

    grunt.registerTask('test', ['concurrent:tests', 'jasmine:test']);
    grunt.registerTask('test-controllers', ['concurrent:testControllers', 'jasmine:controllers']);
    grunt.registerTask('test-services', ['concurrent:testServices', 'jasmine:services']);
    grunt.registerTask('test-directives', ['concurrent:testDirectives', 'jasmine:directives']);
    grunt.registerTask('test-filters', ['concurrent:testFilters', 'jasmine:filters']);

    grunt.registerTask('dev-test', ['watch:test']);
    grunt.registerTask('dev-test-controllers', ['watch:test-controllers']);
    grunt.registerTask('dev-test-services', ['watch:test-services']);
    grunt.registerTask('dev-test-directives', ['watch:test-directives']);
    grunt.registerTask('dev-test-filters', ['watch:test-filters']);

    grunt.registerTask('dev', ['build-dev', 'watch:dev']);
};
