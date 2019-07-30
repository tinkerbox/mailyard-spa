const express = require('express');
const webpack = require('webpack');

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./config/webpack.dev.config');

const compiler = webpack(config);

const app = express();
const port = process.env.PORT || 3000;

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: { colors: true },
}))

app.use(webpackHotMiddleware(compiler, {
  log: console.log
}))

app.listen(port, () => console.log(`Mailyard SPA listening on port ${port}!`));
