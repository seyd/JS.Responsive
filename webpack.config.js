var webpack = require('webpack'),
  path = require('path'),
    JsDocPlugin = require('jsdoc-webpack-plugin');

var entry = __dirname + '/tmp/JS.Responsive.entryDefault.js';

var config = {
  entry: {
    "JS.Responsive": entry,
    "JS.Responsive.min": entry,
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    library: 'JS.Responsive',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules|bower_components/
      }
    ]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    }),
    new JsDocPlugin({
      conf: './jsdoc.json'
    })
  ]
};

module.exports = config;
