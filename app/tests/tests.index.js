/// <reference path="../../node_modules/inversify-dts/inversify/inversify.d.ts" />
/// <reference path="../../node_modules/inversify-dts/inversify-binding-decorators/inversify-binding-decorators.d.ts" />

var testsContext = require.context(".", true, /\.ts(x?)$/);
testsContext.keys().forEach(testsContext);

