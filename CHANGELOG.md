# [3.1.0](https://github.com/prantlf/nomnoml-cli/compare/v3.0.0...v3.1.0) (2022-01-30)


### Features

* Support JPG and PDF as additional output formats ([5e67b16](https://github.com/prantlf/nomnoml-cli/commit/5e67b16386c603e5b028b87a1a60eac942d0822c))

# [3.0.0](https://github.com/prantlf/nomnoml-cli/compare/v2.0.0...v3.0.0) (2022-01-30)


### Bug Fixes

* Upgrade dependencies ([7ab6b54](https://github.com/prantlf/nomnoml-cli/commit/7ab6b541fef2b740e68d983add4d744f7b506fc7))


### BREAKING CHANGES

* * The minimum version of Node.js is 12 instead of 8. The `commander` dependency requires at least that version.
* The command line parameter to set the image height is `-H, --height`. The `h` conflicted with the `-h, --help` option.

## 2019-09-22   v2.0.0

Dropped support of Node.js 6

## 2018-04-27   v1.0.0

Dropped support of Node.js 4

## 2017-05-01   v0.6.1

Enable automatic versioning by semantic-release

## 2017-05-01   v0.6.0

Add support for the #import directive

## 2017-05-01   v0.5.1

Swith the nomnoml dependency from my fork to the upstream

## 2017-04-22   v0.5.0

Return exit code 1 in case of failure

## 2017-04-16   v0.4.7

Update dependencies

## 2017-02-23   v0.4.6

Update dependencies

## 2016-12-19   v0.4.3

Add --format to be able to select between PNG and SVG (thanks, Emanuele Aina)

## 2016-26-08   v0.3.0

Upgrade to Grunt 1.x

## 2016-01-09   v0.2.2

Upgrade development dependencies, fix e-mail, update copyright year

## 2015-10-24   v0.2.2

Upgrade development dependencies, test with the latest prantlf/nomnoml#combined

## 2015-08-06   v0.2.1

Fix code coverage computation

## 2015-08-05   v0.2.0

Add the `resultType` option and tests

## 2015-07-31   v0.1.1

Improve the documentation

## 2015-07-30   v0.1.0

Initial release
