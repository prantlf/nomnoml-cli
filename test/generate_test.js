'use strict';

var fs = require('fs'),
    path = require('path'),
    generateDiagram = require('../lib/generate');

exports.when = {

  'called on the command line': function (test) {
    var name = path.join(__dirname, 'piracy'),
        output = fs.statSync(name + '.png');
    test.ok(output.isFile() && output.size > 0, 'creates a PNG file');
    fs.unlinkSync(name + '.png');
    test.done();
  },

  'required': function (test) {
    test.equal('function', typeof generateDiagram, 'returns a generator function');
    test.done();
  },

  'called': function (test) {
    var promise = generateDiagram();
    test.equal('object', typeof promise, 'returns a promise');
    test.equal('function', typeof promise.then, 'returns a complete promise');
    test.done();
  },

  'called without arguments': function (test) {
    var promise = generateDiagram();
    promise
      .then(function () {
        test.ok(false, 'should fail');
        test.done();
      })
      .catch(function (error) {
        test.ok(true, 'fails');
        test.ok(error instanceof Error, 'returns an error');
        test.equal('Missing arguments', error.message, 'describes the failure: "Missing arguments"');
        test.done();
      });
  },

  'called without input': function (test) {
    var promise = generateDiagram({});
    promise
      .then(function () {
        test.ok(false, 'should fail');
        test.done();
      })
      .catch(function (error) {
        test.ok(true, 'fails');
        test.ok(error instanceof Error, 'returns an error');
        test.equal('Missing input', error.message, 'describes the failure: "Missing input"');
        test.done();
      });
  },

  'called with invalid arguments': function (test) {
    var promise = generateDiagram(1);
    promise
      .then(function () {
        test.ok(false, 'should fail');
        test.done();
      })
      .catch(function (error) {
        test.ok(true, 'fails');
        test.ok(error instanceof Error, 'returns an error');
        test.equal('Invalid arguments', error.message, 'describes the failure: "Invalid arguments"');
        test.done();
      });
  },

  'called with a string': function (test) {
    var promise = generateDiagram('[nomnoml]is->[awesome]');
    promise
      .then(function (result) {
        test.ok(true, 'succeeds');
        test.ok(result instanceof Buffer, 'returns a buffer');
        test.done();
      })
      .catch(function (error) {
        test.ok(false, error);
        test.done();
      });
  },

  'called with a string expecting a stream': function (test) {
    var promise = generateDiagram({
          input: '[nomnoml]is->[awesome]',
          resultType: 'stream'
        });
    promise
      .then(function (result) {
        var constructor = typeof result === 'object' &&
              Object.getPrototypeOf(result).constructor || {};
        test.ok(true, 'succeeds');
        test.equal('PNGStream', constructor.name, 'returns a PNG stream');
        test.done();
      })
      .catch(function (error) {
        test.ok(false, error);
        test.done();
      });
  },

  'called with input and output streams': function (test) {
    var name = path.join(__dirname, 'piracy'),
        promise = generateDiagram({
          input: fs.createReadStream(name + '.nomnoml'),
          output: fs.createWriteStream(name + '.png')
        });
    promise
      .then(function (result) {
        var output = fs.statSync(name + '.png');
        test.ok(true, 'succeeds');
        test.ok(output.isFile() && output.size > 0, 'creates a PNG file');
        fs.unlinkSync(name + '.png');
        test.done();
      })
      .catch(function (error) {
        test.ok(false, error);
        test.done();
      });
  },

  'called with correct input and ouptut file names': function (test) {
    var name = path.join(__dirname, 'piracy'),
        promise = generateDiagram({
          inputFile: name + '.nomnoml',
          output: name + '.png'
        });
    promise
      .then(function (result) {
        var output = fs.statSync(name + '.png');
        test.ok(true, 'succeeds');
        test.ok(output.isFile() && output.size > 0, 'creates a PNG file');
        fs.unlinkSync(name + '.png');
        test.done();
      })
      .catch(function (error) {
        test.ok(false, error);
        test.done();
      });
  },

  'called with an invalid input file name': function (test) {
    var promise = generateDiagram({
          inputFile: 'nonsense'
        });
    promise
      .then(function () {
        test.ok(false, 'should fail');
        test.done();
      })
      .catch(function (error) {
        test.ok(true, 'fails');
        test.ok(error instanceof Error, 'returns an error');
        test.equal('ENOENT', error.code, 'describes the failure: "ENOENT"');
        test.done();
      });
  },

  'called with an invalid output file name': function (test) {
    var name = path.join(__dirname, 'piracy'),
        promise = generateDiagram({
          inputFile: name + '.nomnoml',
          output: ':/?*'
        });
    promise
      .then(function () {
        test.ok(false, 'should fail');
        test.done();
      })
      .catch(function (error) {
        test.ok(true, 'fails');
        test.ok(error instanceof Error, 'returns an error');
        test.equal('ENOENT', error.code, 'describes the failure: "ENOENT"');
        test.done();
      });
  }

};
