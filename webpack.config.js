var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var nodeExternals = require('webpack-node-externals');
var version = require('./package.json').version;

module.exports = {
  externals: [
    nodeExternals({
      whitelist: [
        'webpack-dev-server/client?http://localhost:8080/',
        'webpack/hot/dev-server',
        'material-design-lite/material.min.css',
        'material-design-lite/material.min.js',
        'material-design-lite/dist/material.cyan-light_blue.min.css',
        'flag-icon-css/css/flag-icon.min.css'
      ],
      modulesFromFile: false,
      modulesDir: path.resolve(__dirname, 'app', 'node_modules')
    }),
    {
      fs: 'commonjs fs',
      electron: 'commonjs electron',
      JSONStream: 'commonjs JSONStream'
    }
  ],
  entry: [
    './app/src/index.tsx'
  ],
  output: {
    path: path.resolve(__dirname, 'app', 'generated'),
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.ts(x?)$/,
        exclude: [ /node_modules/ ],
        loaders: ['babel-loader', 'ts-loader']
      },
      {
        test: /\.css$/,
        include: /(node_modules|bower_components)/,
        loader: ExtractTextPlugin.extract('style', 'css')
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url?prefix=font/&limit=5000'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: './app/src/index.html'
    }),
    new ExtractTextPlugin('styles_[hash].css', {
      allChunks: true
    }),
    new webpack.NoErrorsPlugin(),
    require('webpack-fail-plugin'),
    new webpack.DefinePlugin({
      __DEVELOP__: process.env.NODE_ENV === 'development',
      __PRODUCTION__: process.env.NODE_ENV === 'production',
      __VERSION__: JSON.stringify(version)
    })
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.ts', '.tsx', '.js'],
    modulesDirectories: ['node_modules', 'bower_components']
  }
};
