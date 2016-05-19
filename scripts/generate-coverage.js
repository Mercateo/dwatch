var istanbul = require('istanbul');
var collector = new istanbul.Collector();
var reporter = new istanbul.Reporter();
var remappedJson = require('./../app/generated/coverage-final.json');
var keys = Object.keys(remappedJson);
var coverage = {};

for (var i = 0; i < keys.length; i++) {
  if (keys[ i ].startsWith('app/src/')) {
    coverage[ keys[ i ] ] = remappedJson[ keys[ i ] ];
  }
}

collector.add(coverage);

switch (process.argv[ 2 ]) {
  case 'html':
    reporter.add('html');
    break;
  case 'lcovonly':
    reporter.add('lcovonly');
    break;
  case 'lcov':
    reporter.add('lcov');
    break;
  case 'text':
  default:
    reporter.add('text');
}

reporter.write(collector, true, function() {});
