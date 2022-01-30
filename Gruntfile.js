'use strict';

module.exports = function (grunt) {
  const { NOMNOML_CLI_COVERAGE: coverage } = process.env;

  require('time-grunt')(grunt);

  grunt.initConfig({
    eslint: {
      target:     [
        'Gruntfile.js',
        'lib/*.js',
        'bin/nomnoml',
        '<%= nodeunit.tests %>'
      ]
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
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', coverage ?
    ['eslint', 'clean', 'instrument', 'shell', 'nodeunit',
     'storeCoverage', 'makeReport'] :
    ['eslint', 'clean:tests', 'shell', 'nodeunit']);
};
