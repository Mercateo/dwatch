var path = require('path');
var webpack = require('webpack');
var conf = require('./webpack.config');

conf.devtool = 'inline-source-map';
conf.externals.shift();

for(var i = 1; i < conf.module.loaders.length; i++) {
  conf.module.loaders[i].loader = 'null-loader';
}

conf.module.loaders.push({
  test: /\.css$/,
  loader: 'null-loader',
  exclude: /(node_modules|bower_components)/
});

delete conf.entry;
delete conf.output;

conf.entry = [
  './app/tests/tests.index.js'
];

conf.output = {
  path: path.resolve(__dirname, 'app', 'generated'),
  devtoolModuleFilenameTemplate: './[resource-path]',
  filename: 'tests.js'
};

conf.plugins.shift();
conf.plugins.shift();
conf.plugins.shift();
conf.plugins.shift();

module.exports = conf;
