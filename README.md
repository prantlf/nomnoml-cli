# nomnoml-cli [![NPM version](https://badge.fury.io/js/nomnoml-cli.png)](http://badge.fury.io/js/nomnoml-cli) [![Build Status](https://travis-ci.org/prantlf/nomnoml-cli.png)](https://travis-ci.org/prantlf/nomnoml-cli) [![Coverage Status](https://coveralls.io/repos/prantlf/nomnoml-cli/badge.svg)](https://coveralls.io/r/prantlf/nomnoml-cli) [![Dependency Status](https://david-dm.org/prantlf/nomnoml-cli.svg)](https://david-dm.org/prantlf/nomnoml-cli) [![devDependency Status](https://david-dm.org/prantlf/nomnoml-cli/dev-status.svg)](https://david-dm.org/prantlf/nomnoml-cli#info=devDependencies) [![Greenkeeper badge](https://badges.greenkeeper.io/prantlf/nomnoml-cli.svg)](https://greenkeeper.io/) [![Code Climate](https://codeclimate.com/github/prantlf/nomnoml-cli/badges/gpa.svg)](https://codeclimate.com/github/prantlf/nomnoml-cli) [![Codacy Badge](https://www.codacy.com/project/badge/f3896e8dfa5342b8add12d50390edfcd)](https://www.codacy.com/public/prantlf/nomnoml-cli) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


[![NPM Downloads](https://nodei.co/npm/nomnoml-cli.png?downloads=true&stars=true)](https://www.npmjs.com/package/nomnoml-cli)

Generates images from [nomnoml](http://www.nomnoml.com/) diagram sources
on the command line and provides a library for a programmatic usage from
[NodeJS] modules

## Getting Started

Make sure that you have [NodeJS] >= 6 installed.

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

The `nomnoml` script generates a PNG or SVG image from the nomnoml source text.
Both file names and standard input and output are supported as parameters.
If generating the image fails, exit code 1 is returned to the caller.

```text
$ nomnoml --help

  Usage: nomnoml [option]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -i, --input <path>     file with nomnoml source to read from
    -o, --output <path>    file for the image output to write to
    -f, --format <format>  output format (png or svg)
    -w, --width <pixels>   width of the canvas to draw on
    -h, --height <pixels>  height of the canvas to draw on

  The default output format is PNG.  The default canvas size is 640x480 pixels.
  If the input file is omitted, the source is read from the standard input.
  If the output file is omitted, the image is written to the standard output.

  Examples:

    $ echo '[nomnoml]is->[awesome]' | nomnoml > awesome.png
    $ nomnoml -i source.nomnoml -f svg -o target.svg
```

## Programmatic Usage

The main module exports a function which generates the image:

```javascript
var generateDiagram = require('nomnoml-cli'),
    options = ...;
generateDiagram(options)
  .then(function (...) {
    ...
  })
  .catch(function (error) {
    ...
  });
```

Supported properties in the `options` parameter are:

* `input`: source to read the nomnoml text from; either a [Stream] or a
    `string` with the actual nomnoml text
* `inputFile`: source file path to read the nomnoml source from
* `output`: target to write the image to; either a [Stream] or a `string`
    with the file path (undefined by default)
* `resultType`: type of the object to resolve the promise with if the
    `output` parameter is not provided ('buffer' or 'stream'; the former
    is default)
* `format`: output image format ('png' or 'svg'; the former is default)
* `width`: canvas width in pixels (640 by default)
* `height`: canvas height in pixels (480 by default)

The function returns a [Promise] to wait for the success or failure.

The nomnoml source text can be passed into the function directly instead
of the `options` object and it will be treated as the `input` option.

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
  })
  .catch(function (error) {
    console.error(error);
  });

// Convert the standard input to standard output
generateDiagram({
    input: process.stdin,
    output: process.stdout
  })
  .catch(function (error) {
    console.error(error);
  });

// Create a PNG file from a nomnoml source file
generateDiagram({
    inputFile: 'source.nomnoml',
    output: 'target.png'
  })
  .then(function () {
    ...
  })
  .catch(function (error) {
    console.error(error);
  });
```

## Notes

Contents of other `.nomnoml` files can be imported to the input file using
the [`#import` directive](https://github.com/skanaar/nomnoml#directives).
You can use it for sharing style definitions or parts of diagrams among
multiple diagram sources.

```text
#import: /usr/local/share/nomnoml/style.nomnoml
#import: shared/style.nomnoml
#import: ./sub-diagram.nomnoml
```

If the imported file path is relative and starts with `./` or `../`, it will
be appended to the path of the "parent" file, which the specified file is
being imported to. Otherwise the relative path will be appended to the
current (executing) directory.

File import directives are processed recursively. However, a single file can
be imported only once. If imported once more, scond and other occurrences
will be replaced by an empty string.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding
style.  Add unit tests for any new or changed functionality. Lint and test
your code using Grunt.

## Release History

 * 2018-04-27   v1.0.0   Dropped support of Node.js 4
 * 2017-05-01   v0.6.1   Enable automatic versioning by semantic-release
 * 2017-05-01   v0.6.0   Add support for the #import directive
 * 2017-05-01   v0.5.1   Swith the nomnoml dependency from my fork to the upstream
 * 2017-04-22   v0.5.0   Return exit code 1 in case of failure
 * 2017-04-16   v0.4.7   Update dependencies
 * 2017-02-23   v0.4.6   Update dependencies
 * 2016-12-19   v0.4.3   Add --format to be able to select between PNG
                         and SVG (thanks, Emanuele Aina)
 * 2016-26-08   v0.3.0   Upgrade to Grunt 1.x
 * 2016-01-09   v0.2.2   Upgrade development dependencies, fix e-mail,
                         update copyright year
 * 2015-10-24   v0.2.2   Upgrade development dependencies, test with
                         the latest prantlf/nomnoml#combined
 * 2015-08-06   v0.2.1   Fix code coverage computation
 * 2015-08-05   v0.2.0   Add the `resultType` option and tests
 * 2015-07-31   v0.1.1   Improve the documentation
 * 2015-07-30   v0.1.0   Initial release

## License

Copyright (c) 2015-2018 Ferdinand Prantl

Licensed under the MIT license.

[Buffer]: https://nodejs.org/api/buffer.html
[NodeJS]: http://nodejs.org/
[Stream]: https://nodejs.org/api/stream.html
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
