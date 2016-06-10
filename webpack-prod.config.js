var conf = require('./webpack.config');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

conf.output.filename = 'app_[hash].js';

conf.module.loaders.push({
  test: /\.css$/,
  loader: ExtractTextPlugin.extract('style', 'css?importLoaders=1&modules&localIdentName=[name]__[local]___[hash:base64:5]'),
  exclude: /(node_modules|bower_components)/
});

conf.plugins.push(new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  }
}));

module.exports = conf;
