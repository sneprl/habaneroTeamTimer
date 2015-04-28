module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        //DEFAULT DEVELOPMENT
        watch: {
            less: {
                files: 'src/less/*.less',
                tasks: ["less"]
            },
            jshint: {
                files: 'src/app/**/*.js',
                tasks: ["jshint"]
            }
        },
        less: {
            development: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/less',
                        src: ['screen.less'],
                        dest: 'src/css/',
                        ext: '.css'
                    }
                ]
            }

        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            all: ['src/app/**/*.js']

        },
        //BUILD
        clean: {
            start: ["build/"],
            end: ["build/js/app.js", "build/css/screen.css"]
        },
        copy: {
            assets: {
                expand: true,
                cwd: 'app',
                src: [
                    //ANGULAR VIEWS
                    'js/views/**/*.html',
                    //IMAGES
                    'img/**',
                    //STATIC ASSETS
                    'humans.txt',
                    'robots.txt'
                ],
                dest: 'build/'
            },
            modernizr: {
                expand: true,
                cwd: 'app/bower_components/html5-boilerplate/js/vendor/',
                src: ['modernizr-2.6.2.min.js'],
                dest: 'build/js/'
            },
            angularRouteMap: {
                expand: true,
                cwd: 'app/bower_components/angular-route/',
                src: ['angular-route.min.js.map'],
                dest: 'build/js/'
            },
            bootFonts: {
                expand: true,
                cwd: 'app/bower_components/bootstrap/dist/',
                src: ['fonts/**'],
                dest: 'build/'
            }
        },
        concat: {
            vendorJS: {
                src: [
                    'app/bower_components/jquery/dist/jquery.min.js',
                    'app/bower_components/angular/angular.min.js',
                    'app/bower_components/angular-route/angular-route.min.js',
                    'app/bower_components/bootstrap/dist/js/bootstrap.min.js'
                ],
                dest: 'build/js/lib.js'
            },
            appJS: {
                options: {
                    separator: ';'
                },
                src: [
                    'app/js/**/*.js'
                ],
                dest: 'build/js/app.js'
            },
            css: {
                src: [
                    "app/bower_components/html5-boilerplate/css/normalize.css",
                    "app/bower_components/html5-boilerplate/css/main.css",
                    "app/bower_components/bootstrap/dist/css/bootstrap.min.css",
                    "app/css/screen.css"
                ],
                dest: 'build/css/screen.css'
            }
        },
        uglify: {
            my_target: {
                files: {
                    'build/js/app.min.js': ['build/js/app.js']
                }
            }
        },
        cssmin: {
            my_target: {
                src: 'build/css/screen.css',
                dest: 'build/css/screen.min.css'
            }
        },
        processhtml: {
            dist: {
                files: {
                    'build/index.html': ['app/index.html']
                }
            }
        },
        wiredep: {

            task: {
                src: ['src/index.html'],
                options: {

                }
            }
        },
        html2js: {
            options: {
                base: "src",
                module: "app.templates"
            },
            dev: {
                src: ['src/app/*.dev'],
                dest: 'src/app/resources/templates.js'
            },
            build: {
                src: ['src/app/**/*.html'],
                dest: 'src/app/resources/templates.js'
            }
        },
        includeSource: {
            options: {
                basePath: "src/app",
                baseUrl: 'app/'
            },
            mytarget: {
                files: {
                    'src/index.html': 'src/index.html'
                }
            }
        }


    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.loadNpmTasks('grunt-html2js');

    // task(s).
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('develop', ['wiredep', 'html2js:dev', 'includeSource', 'less']);
    grunt.registerTask('reset', ['clean:start']);
    grunt.registerTask('build', [
        'clean:start',          //Remove all files in build directory
        'copy:assets',          //Copy all static assets
        'copy:modernizr',       //Copy modernizr js
        'copy:angularRouteMap', //Copy angular route map
        'copy:bootFonts',       //Copy bootstrap fonts
        'concat:vendorJS',      //Concatenate all vendor javascript files
        'concat:appJS',         //Concatenate all application javascript files
        'uglify',               //uglify javascript files
        'less',                 //Compile all less files in css format
        'concat:css',           //Concatenate all css files
        'cssmin',               //Minify css files
        'processhtml',          //Process html to replace production assets
        'clean:end'             //Remove all concatenated temp files
    ]);

};