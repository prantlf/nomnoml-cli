'use strict';

const { statSync, unlinkSync, createReadStream, createWriteStream } = require('fs');
const { join } = require('path');
const { NOMNOML_CLI_COVERAGE: coverage } = process.env;
const generateDiagram = require(coverage ? '../coverage/lib/generate' : '../lib/generate');

function readStream (stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
    stream.on('error', error => reject(error));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

exports.when = {
  'called on the command line': function (test) {
    const name = join(__dirname, 'piracy');
    const output = statSync(name + '.png');
    test.ok(output.isFile() && output.size > 0, 'creates a PNG file');
    unlinkSync(name + '.png');
    test.done();
  },

  'called on the command line with format=svg': function (test) {
    const name = join(__dirname, 'piracy');
    const output = statSync(name + '.svg');
    test.ok(output.isFile() && output.size > 0, 'creates a SVG file');
    unlinkSync(name + '.svg');
    test.done();
  },

  'required': function (test) {
    test.equal('function', typeof generateDiagram, 'returns a generator function');
    test.done();
  },

  'called without arguments': function (test) {
    generateDiagram()
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
    generateDiagram({})
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
    generateDiagram(1)
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

  'called with a string expecting a PNG buffer': function (test) {
    generateDiagram('[nomnoml]is->[awesome]')
      .then(function (result) {
        test.ok(true, 'succeeds');
        test.ok(result instanceof Buffer, 'returns a PNG buffer');
        test.done();
      })
      .catch(function (error) {
        test.ok(false, error);
        test.done();
      });
  },

  'called with a string expecting a SVG buffer': function (test) {
    generateDiagram({
      input: '[nomnoml]is->[awesome]',
      format: 'svg'
    })
      .then(function (result) {
        test.ok(true, 'succeeds');
        test.ok(result instanceof Buffer, 'returns a SVG buffer');
        test.done();
      })
      .catch(function (error) {
        test.ok(false, error);
        test.done();
      });
  },

  'called with a string expecting a PNG stream': function (test) {
    generateDiagram({
      input: '[nomnoml]is->[awesome]',
      resultType: 'stream'
    })
      .then(async function (result) {
        test.ok(true, 'succeeds');
        const buffer = await readStream(result);
        test.equal('P'.charCodeAt(0), buffer[1], 'returns "P" in a PNG stream');
        test.equal('N'.charCodeAt(0), buffer[2], 'returns "N" in a PNG stream');
        test.equal('G'.charCodeAt(0), buffer[3], 'returns "G" in a PNG stream');
        test.done();
      })
      .catch(function (error) {
        test.ok(false, error);
        test.done();
      });
  },

  'called with a string expecting a JPG stream': function (test) {
    generateDiagram({
      input: '[nomnoml]is->[awesome]',
      format: 'jpg',
      resultType: 'stream'
    })
      .then(async function (result) {
        test.ok(true, 'succeeds');
        const buffer = await readStream(result);
        test.equal('J'.charCodeAt(0), buffer[6], 'returns "J" in a JPG stream');
        test.equal('F'.charCodeAt(0), buffer[7], 'returns "F" in a JPG stream');
        test.equal('I'.charCodeAt(0), buffer[8], 'returns "I" in a JPG stream');
        test.equal('F'.charCodeAt(0), buffer[9], 'returns "F" in a JPG stream');
        test.done();
      })
      .catch(function (error) {
        test.ok(false, error);
        test.done();
      });
  },

  'called with a string expecting an SVG stream': function (test) {
    generateDiagram({
      input: '[nomnoml]is->[awesome]',
      format: 'svg',
      resultType: 'stream'
    })
      .then(async function (result) {
        test.ok(true, 'succeeds');
        const buffer = await readStream(result);
        test.equal('<'.charCodeAt(0), buffer[0], 'returns "<" in a SVG stream');
        test.equal('?'.charCodeAt(0), buffer[1], 'returns "?" in a SVG stream');
        test.equal('x'.charCodeAt(0), buffer[2], 'returns "x" in a SVG stream');
        test.equal('m'.charCodeAt(0), buffer[3], 'returns "m" in a SVG stream');
        test.equal('l'.charCodeAt(0), buffer[4], 'returns "l" in a SVG stream');
        test.done();
      })
      .catch(function (error) {
        test.ok(false, error);
        test.done();
      });
  },

  'called with a string expecting an PDF stream': function (test) {
    generateDiagram({
      input: '[nomnoml]is->[awesome]',
      format: 'pdf',
      resultType: 'stream'
    })
      .then(async function (result) {
        test.ok(true, 'succeeds');
        const buffer = await readStream(result);
        test.equal('%'.charCodeAt(0), buffer[0], 'returns "%" in a PDF stream');
        test.equal('P'.charCodeAt(0), buffer[1], 'returns "P" in a PDF stream');
        test.equal('D'.charCodeAt(0), buffer[2], 'returns "D" in a PDF stream');
        test.equal('F'.charCodeAt(0), buffer[3], 'returns "F" in a PDF stream');
        test.done();
      })
      .catch(function (error) {
        test.ok(false, error);
        test.done();
      });
  },

  'called with input and output streams': function (test) {
    const name = join(__dirname, 'piracy');
    generateDiagram({
      input: createReadStream(name + '_process-paths.nomnoml'),
      output: createWriteStream(name + '.png')
    })
      .then(function (/*result*/) {
        const output = statSync(name + '.png');
        test.ok(true, 'succeeds');
        test.ok(output.isFile() && output.size > 0, 'creates a PNG file');
        unlinkSync(name + '.png');
        test.done();
      })
      .catch(function (error) {
        test.ok(false, error);
        test.done();
      });
  },

  'called with input and output streams, with format=svg': function (test) {
    const name = join(__dirname, 'piracy');
    generateDiagram({
      input: createReadStream(name + '.nomnoml'),
      format: 'svg',
      output: createWriteStream(name + '.svg')
    })
      .then(function (/*result*/) {
        const output = statSync(name + '.svg');
        test.ok(true, 'succeeds');
        test.ok(output.isFile() && output.size > 0, 'creates a SVG file');
        unlinkSync(name + '.svg');
        test.done();
      })
      .catch(function (error) {
        test.ok(false, error);
        test.done();
      });
  },

  'called with correct input and output file names': function (test) {
    const name = join(__dirname, 'piracy');
    generateDiagram({
      inputFile: name + '_imports.nomnoml',
      output: name + '.png'
    })
      .then(function (/*result*/) {
        const output = statSync(name + '.png');
        test.ok(true, 'succeeds');
        test.ok(output.isFile() && output.size > 0, 'creates a PNG file');
        unlinkSync(name + '.png');
        test.done();
      })
      .catch(function (error) {
        test.ok(false, error);
        test.done();
      });
  },

  'called with correct input and output file names, with format=svg': function (test) {
    const name = join(__dirname, 'piracy');
    generateDiagram({
      inputFile: name + '.nomnoml',
      format: 'svg',
      output: name + '.svg'
    })
      .then(function (/*result*/) {
        const output = statSync(name + '.svg');
        test.ok(true, 'succeeds');
        test.ok(output.isFile() && output.size > 0, 'creates a SVG file');
        unlinkSync(name + '.svg');
        test.done();
      })
      .catch(function (error) {
        test.ok(false, error);
        test.done();
      });
  },

  'called with an invalid input file name': function (test) {
    generateDiagram({
      inputFile: 'nonsense'
    })
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
    const name = join(__dirname, 'piracy');
    generateDiagram({
      inputFile: name + '.nomnoml',
      output: ':/?*'
    })
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
