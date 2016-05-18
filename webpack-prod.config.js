var conf = require('./webpack.config');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var version = require('./package.json').version;

conf.output.filename = 'app_[hash].js';

conf.module.loaders.push({
  test: /\.css$/,
  loader: ExtractTextPlugin.extract('style', 'css?importLoaders=1&modules&localIdentName=[name]__[local]___[hash:base64:5]'),
  exclude: /(node_modules|bower_components)/
});

conf.plugins.push(new webpack.DefinePlugin({
  __PRODUCTION__: true,
  __DEVELOP__: false,
  __VERSION__: JSON.stringify(version)
}));

module.exports = conf;
