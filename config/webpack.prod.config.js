const path = require('path');

const merge = require('webpack-merge');

const common = require('./webpack.common.config.js');

const config = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '..', 'dist'),
  },
};

module.exports = merge(common, config);
