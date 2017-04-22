'use strict';

var exec = require('child_process').exec,
    coverage = process.env.NOMNOML_CLI_COVERAGE,
    generateDiagram = require(coverage ?
      '../coverage/lib/generate' : '../lib/generate');

function checkFailure(test, error, stdout, stderr) {
  test.ok(error != null, 'fails');
  test.ok(stdout.length === 0, 'prints nothing to stdout');
  test.ok(stderr.length > 0, 'prints message to stderr');
  test.ok(error && error.code === 1, 'returns exit code 1');
  test.done();
}

exports.when = {

  'command-line tool called with wrong arguments': function (test) {
    exec('node ./bin/nomnoml -a',
        checkFailure.bind(null, test));
  },

  'command-line tool called with missing input file': function (test) {
    exec('node ./bin/nomnoml -i bad.nomnoml',
        checkFailure.bind(null, test));
  },

  'command-line tool called with malformed input file': function (test) {
    exec('node ./bin/nomnoml -i ./test/invalid.nomnoml',
        checkFailure.bind(null, test));
  }

};
