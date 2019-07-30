const webpack = require('webpack');

const merge = require('webpack-merge');

const common = require('./webpack.common.config.js');

const config = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './src/index.js',
  ],
  output: {
    publicPath: '/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};

module.exports = merge(common, config);
