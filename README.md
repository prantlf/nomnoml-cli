# nomnoml-cli [![NPM version](https://badge.fury.io/js/nomnoml-cli.png)](http://badge.fury.io/js/nomnoml-cli) [![Dependency Status](https://david-dm.org/prantlf/nomnoml-cli.svg)](https://david-dm.org/prantlf/nomnoml-cli) [![devDependency Status](https://david-dm.org/prantlf/nomnoml-cli/dev-status.svg)](https://david-dm.org/prantlf/nomnoml-cli#info=devDependencies) [![Code Climate](https://codeclimate.com/github/prantlf/nomnoml-cli/badges/gpa.svg)](https://codeclimate.com/github/prantlf/nomnoml-cli) [![Codacy Badge](https://www.codacy.com/project/badge/f3896e8dfa5342b8add12d50390edfcd)](https://www.codacy.com/public/prantlf/nomnoml-cli) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[![NPM Downloads](https://nodei.co/npm/nomnoml-cli.png?downloads=true&stars=true)](https://www.npmjs.com/package/nomnoml-cli)

Generates images from [nomnoml](http://www.nomnoml.com/) diagram sources on the command line

## Getting Started

1. Install [pre-requisites](https://github.com/Automattic/node-canvas/wiki/_pages)
   of the [node-canvas](https://github.com/Automattic/node-canvas) module depending
   on your operating system

2. Install the command-line tool and generate a testing image:

```bash
npm install -g nomnoml-cli
echo '[nomnoml]is->[awesome]' | nomnoml > awesome.png
```

3. Read the documentation about the [nomnoml source format](https://github.com/skanaar/nomnoml#example)

## Usage Details

```bash
$ nomnoml --help

  Usage: nomnoml [option]

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
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding
style.  Add unit tests for any new or changed functionality. Lint and test
your code using Grunt.

## Release History

 * 2015-07-30   v0.1.0   Initial release

## License

Copyright (c) 2015 Ferdinand Prantl

Licensed under the MIT license.
