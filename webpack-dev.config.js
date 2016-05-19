var conf = require('./webpack.config');
var webpack = require('webpack');

conf.devtool = 'inline-source-map';

conf.entry.unshift('webpack-dev-server/client?http://localhost:8080/');
// conf.entry.unshift('webpack/hot/dev-server');
conf.output.publicPath = 'http://localhost:8080/';
// conf.devServer = {
//   hot: true
// };

conf.module.loaders.push({
  test: /\.css$/,
  loaders: [ 'style-loader', 'css-loader?sourceMap&importLoaders=1&modules&localIdentName=[name]__[local]___[hash:base64:5]' ],
  exclude: /(node_modules|bower_components)/
});

// conf.plugins.push(new webpack.HotModuleReplacementPlugin());

module.exports = conf;
