"use strict";

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);
	var fs = require("fs");
	
    grunt.initConfig({
        // Wipe out previous builds and test reporting.
        clean: ["dist/"],

        // Move vendor and app logic during a build.
        copy: {
            html: {
                files: [
                    { src: ["client/index.html"], dest: "dist/index.html"}
                ]
            },
            img: {
                files: [
                    { expand: true, cwd: 'client/img', src: ['*'], dest:'dist/img/'}
                ]
            }
        },

        useminPrepare: {
            options: {
                dest: 'dist',
                flow: {
                    steps: {
                        js: ['uglify'],
                        css: ['cssmin']
                    }
                }
            },
            html: ['client/index.html']
        },

        usemin: {
            html: "dist/index.html"
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'dist/index.html'
                }
            }
        },

        compress: {
            dist: {
                options: {
                    mode: 'gzip'
                },
                expand: true,
                cwd: 'dist/',
                src: ['**/*'],
                dest: 'dist/',
                rename: (dest, src) => dest + src + ".gz",
                filter: (f) => !/\.(jpg|png|gz)$/.test(f)
            }
        },

        uglify: {
            options: {
                sourceMap: true,
				mangle: {
                    toplevel: true,
                    except: ['initMap']
                },
                compress: {
                    drop_console: true
                }
            },

            headOptions: {
                compress: false,
                mangle: false
            }
        },

        sass: {
            dist: {
                files: {
                    'client/styles/style.css': 'client/styles/style.sass'
                }
            }
        },

        handlebars: {
            compilerOptions: {
                knownHelpersOnly: false
            },
            options: {
                namespace: 'Templates',
                processName: filePath => filePath.replace(/^client\/templates\//, '').replace(/\.hbs$/, '').replace(/-(\w)/g, (_m, letter) => letter.toUpperCase()),
                processContent: (content, filepath) => content.replace(/\s{4,}/mg, '')
            },
            all: {
                files: {
                    "client/templates/templates.js": ["client/templates/*.hbs"]
                }
            }
        },

        text_include: {
            options: {
                namespace: 'Templates',
                processName: filePath => filePath.replace(/^client\/templates\//, '').replace(/\.html$/, '').replace(/-(\w)/g, (_m, letter) => letter.toUpperCase()),
                processContent: (content, filepath) => content.replace(/\s{4,}/mg, '')
            },
            all: {
                files: {
                    "client/templates/html.js": ["client/templates/*.html"]
                }
            }
        },

        watch: {
            options: {
                atBegin: true
            },
            text_include: {
                files: ['client/templates/*.html'],
                tasks: ['text_include', "orderedUgly"]
            },
            handlebars: {
                files: ['client/templates/*.hbs'],
                tasks: ['handlebars:all', "orderedUgly"]
            }
        }
    });

    grunt.registerTask("headJsDifferentSettings", function () {
        var config = grunt.config("uglify")
        var headFile = config.generated.files.shift()
        config.head = { files: [headFile], options: config.headOptions }
        grunt.config.set("uglify", config)
        grunt.task.run("uglify:head")
    })
	
	grunt.registerTask("minJs", function () {
        var config = grunt.config("uglify")
        config.generated.files = config.generated.files.map((destSrc) => {
            return { dest: destSrc.dest, src: destSrc.src.map((src) => {
                if(src.indexOf('bower_components')) {
                    var replacement = src.replace(/\.js$/,".min.js")
                    if(fs.existsSync(replacement))
                        return replacement
                }
                return src
            })}
        })
        grunt.config.set("uglify", config)
    })
	
	grunt.registerTask("orderedUgly", [
        "useminPrepare",
		"minJs",
        "headJsDifferentSettings",
        "uglify:generated",
        "copy:html",
        "cssmin:generated",
        "usemin"
    ]);

    grunt.registerTask("templating", [
        "handlebars",
        "text_include"
    ])

    grunt.registerTask("default", [
        "clean",
        "templating",
        "orderedUgly",
		"sass",
        "cssmin:generated",
        "htmlmin",
        "copy:img",
		"compress"
    ]);
};
