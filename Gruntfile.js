'use strict';

module.exports = function (grunt) {

  var coverage = process.env.NOMNOML_CLI_COVERAGE;

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
      createPNG: {
        command: 'node ./bin/nomnoml -i ./test/piracy.nomnoml -o ./test/piracy.png'
      },
      createSVG: {
        command: 'node ./bin/nomnoml -i ./test/piracy.nomnoml -o ./test/piracy.svg -f svg'
      }
    },

    nodeunit: {
      tests:   ['test/*_test.js']
    },

    clean: {
      tests:    ['test/piracy.png'],
      coverage: ['coverage']
    },

    instrument: {
      files: 'lib/*.js',
      options: {
        lazy: true,
        basePath: 'coverage/'
      }
    },

    storeCoverage: {
      options: {
        dir: 'coverage'
      }
    },

    makeReport: {
      src: 'coverage/coverage.json',
      options: {
        type: 'lcov',
        dir: 'coverage',
        print: 'detail'
      }
    },

    coveralls: {
      tests: {
        src: 'coverage/lcov.info'
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', coverage ?
    ['jshint', 'clean', 'instrument', 'shell', 'nodeunit',
     'storeCoverage', 'makeReport'] :
    ['jshint', 'clean:tests', 'shell', 'nodeunit']);

};
