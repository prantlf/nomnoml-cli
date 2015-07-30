'use strict';

module.exports = function (grunt) {

  require('time-grunt')(grunt);

  grunt.initConfig({

    jshint: {
      all:     [
        'Gruntfile.js',
        'lib/*.js',
        'bin/nomnoml'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['jshint']);

};
