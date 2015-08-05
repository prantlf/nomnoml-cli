# nomnoml-cli [![NPM version](https://badge.fury.io/js/nomnoml-cli.png)](http://badge.fury.io/js/nomnoml-cli) [![Build Status](https://travis-ci.org/prantlf/nomnoml-cli.png)](https://travis-ci.org/prantlf/nomnoml-cli) [![Dependency Status](https://david-dm.org/prantlf/nomnoml-cli.svg)](https://david-dm.org/prantlf/nomnoml-cli) [![devDependency Status](https://david-dm.org/prantlf/nomnoml-cli/dev-status.svg)](https://david-dm.org/prantlf/nomnoml-cli#info=devDependencies) [![Code Climate](https://codeclimate.com/github/prantlf/nomnoml-cli/badges/gpa.svg)](https://codeclimate.com/github/prantlf/nomnoml-cli) [![Codacy Badge](https://www.codacy.com/project/badge/f3896e8dfa5342b8add12d50390edfcd)](https://www.codacy.com/public/prantlf/nomnoml-cli) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[![NPM Downloads](https://nodei.co/npm/nomnoml-cli.png?downloads=true&stars=true)](https://www.npmjs.com/package/nomnoml-cli)

Generates images from [nomnoml](http://www.nomnoml.com/) diagram sources
on the command line and provides a library for a programmatic usage from
[NodeJS] modules

## Getting Started

Make sure that you have [NodeJS] >= 0.12 installed.

1. Install [pre-requisites](https://github.com/Automattic/node-canvas/wiki/_pages)
   of the [node-canvas](https://github.com/Automattic/node-canvas) module depending
   on your operating system

2. Install the command-line tool and generate a testing image:

```bash
npm install -g nomnoml-cli
echo '[nomnoml]is->[awesome]' | nomnoml > awesome.png
```

Read the documentation about the [nomnoml source format](https://github.com/skanaar/nomnoml#example)

## Command-Line Usage

The `nomnoml` script generates a PNG image from the nomnoml source text.
Both file names and standard input and output are supported as parameters.

```text
$ nomnoml --help

  Usage: nomnoml [option]

    Generates PNG images from nomnoml diagram sources

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -i, --input <path>     file with nomnoml source to read from
    -o, --output <path>    file for the image output to write to
    -w, --width <pixels>   width of the canvas to draw on
    -h, --height <pixels>  height of the canvas to draw on

  The output format is PNG.  The default canvas size is 640x480 pixels.
  If the input file is omitted, the source is read from the standard input.
  If the output file is omitted, the image is written to the standard output.

  Examples:

    $ echo '[nomnoml]is->[awesome]' | nomnoml > awesome.png
    $ nomnoml -i source.nomnoml -o target.png
```

## Programmatic Usage

The main module exports a function which generates the image:

```javascript
var generateDiagram = require('nomnoml-cli'),
    options = ...;
generateDiagram(options);
```

Supported properties in the `options` parameter are:

* `input`: source to read the nomnoml text from; either a [Stream] or a
    `string` with the actual nomnoml text
* `inputFile`: source file path to read the nomnoml source from
* `output`: target to write the image to; either a [Stream] or a `string`
    with the file path (undefined by default)
* `width`: canvas width in pixels (640 by default)
* `height`: canvas height in pixels (480 by default)

The function retuns a [Promise].

The nomnoml source text can be passed into the function instead of the
`options` object directly to be treated as the `ipnput` option.

Either `input` or `inputFile` has to be provided, otherwise the function
fails.  If `output` is not provided, the function resolves the promise
with a [Buffer] containing the image.  If `output` is provided, the
function returns a promise resolved when the output has been written.

### Code Samples

```javascript
var generateDiagram = require('nomnoml-cli');

// Get Buffer with the image
generateDiagram('[nomnoml]is->[awesome]')
  .then(function (buffer) {
    ...
  });
  .catch(function (error) {
    console.log(error);
  });

// Convert the standard input to standard output
generateDiagram({
  input: process.stdin,
  output: process.stdout
});

// Create a PNG file from a nomnoml source file
generateDiagram({
    inputFile: 'source.nomnoml',
    output: 'target.png'
  })
  .then(function () {
    ...
  });
  .catch(function (error) {
    console.log(error);
  });
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding
style.  Add unit tests for any new or changed functionality. Lint and test
your code using Grunt.

## Release History

 * 2015-07-31   v0.1.1   Improve the documentation
 * 2015-07-30   v0.1.0   Initial release

## License

Copyright (c) 2015 Ferdinand Prantl

Licensed under the MIT license.

[Buffer]: https://nodejs.org/api/buffer.html
[NodeJS]: http://nodejs.org/
[Stream]: https://nodejs.org/api/stream.html
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
