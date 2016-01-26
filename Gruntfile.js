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
                    "public/stylesheets/main.css"
                ],
                dest: "public/dist/dist.css"
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'public/', src: ['fonts/*.ttf'], dest: 'public/dist/', filter: 'isFile'},
                    {expand: true, cwd: 'public/', src: ['img/**'], dest: 'public/dist/'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['bower', 'bower_concat', 'concat_css', 'copy']);
    grunt.registerTask('dev', ['build']);
};