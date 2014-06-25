module.exports = function( grunt ) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    opt: {
      'name': 'jquery.textarea-highlighter',
      'banner': '/**\n' +
                ' * <%= pkg.name %>\n' +
                ' * <%= pkg.description %>\n' +
                ' * version: <%= pkg.version %>\n' +
                ' * update: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * author: <%= pkg.author.name %>\n' +
                ' *\n' +
                ' * MIT license. http://opensource.org/licenses/MIT\n' +
                ' */'
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js', 'src/<%= opt.name %>.js'
        ],
        options: {
          jshintrc: true
        }
      }
    },
    jscs: {
      src: 'src/<%= opt.name %>.js',
      gruntfile: 'Gruntfile.js',
      options: {
        config: '.jscs.json'
      }
    },
    uglify: {
      options: {
        preserveComments: false,
        beautify: {
          ascii_only: true
        }
      },
      plugin: {
        files: {
          '<%= opt.name %>.min.js': [ 'src/<%= opt.name %>.js' ]
        }
      }
    },
    copy: {
      main: {
        nonull: true,
        src: 'src/<%= opt.name %>.js',
        dest: '<%= opt.name %>.js'
      }
    },
    usebanner: {
      main: {
        options: {
          position: 'top',
          banner: '<%= opt.banner %>'
        },
        files: {
          src: [ '<%= opt.name %>.js', '<%= opt.name %>.min.js' ]
        }
      }
    }
  });

  // Load grunt tasks from NPM packages
  require( 'load-grunt-tasks' )( grunt, { pattern: 'grunt-*' });
  grunt.loadNpmTasks('grunt-banner');

  // Tasks
  grunt.registerTask( 'dev', [ 'jshint', 'jscs' ] );
  grunt.registerTask( 'default', [ 'dev', 'uglify', 'copy', 'usebanner' ] );
};
