'use strict';

module.exports = function (grunt) {

  var coverage = process.env.GRUNT_EMBED_FONTS_COVERAGE;

  require('time-grunt')(grunt);

  grunt.initConfig({

    jshint: {
      all:     [
        'Gruntfile.js',
        'lib/*.js',
        'bin/nomnoml',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
    },

    shell: {
      create: {
        command: 'node ./bin/nomnoml -i ./test/piracy.nomnoml -o ./test/piracy.png'
      }
    },

    nodeunit: {
      tests:   ['test/*_test.js'],
      options: {
        reporter: coverage ? 'lcov' : 'verbose',
        reporterOutput: coverage ? 'coverage/tests.lcov' : undefined
      }
    },

    clean: {
      tests:    ['test/piracy.png'],
      coverage: ['coverage']
    },

    jscoverage: {
      all: {
        expand: true,
        src:    'lib/*.js',
        dest:   'coverage/'
      }
    },

    coveralls: {
      tests: {
        src: 'coverage/tests.lcov'
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', ['jshint', 'clean:tests', 'shell', 'nodeunit']);
  grunt.registerTask('instrument', ['jshint', 'clean', 'jscoverage']);
  grunt.registerTask('post_coverage', ['test', 'coveralls']);
  grunt.registerTask('default', ['test']);

};
