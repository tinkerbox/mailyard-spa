/* eslint-disable */

const path = require('path');
var loaderUtils = require('loader-utils');
const withOffline = require('next-offline');
const withWorkers = require('@zeit/next-workers');
const withCSS = require('@zeit/next-css');

// TODO: find out if there is a better way

const _getLocalIdent = (loaderContext, localIdentName, localName, options) => {
  if (!options.context) {
    if (loaderContext.rootContext) {
      options.context = loaderContext.rootContext;
    } else if (loaderContext.options && typeof loaderContext.options.context === "string") {
      options.context = loaderContext.options.context;
    } else {
      options.context = loaderContext.context;
    }
  }
  var request = path.relative(options.context, loaderContext.resourcePath);
  options.content = options.hashPrefix + request + "+" + localName;
  localIdentName = localIdentName.replace(/\[local\]/gi, localName);
  var hash = loaderUtils.interpolateName(loaderContext, localIdentName, options);
  return hash.replace(new RegExp("[^a-zA-Z0-9\\-_\u00A0-\uFFFF]", "g"), "-").replace(/^((-?[0-9])|--)/, "_$1");
};

module.exports = withOffline(withWorkers(withCSS({
  distDir: './dist',
  poweredByHeader: false,

  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    getLocalIdent: (loaderContext, localIdentName, localName, options) => {
      const dirname = path.dirname(loaderContext.resourcePath);
      if (dirname.endsWith('antd/dist')) {
        // leave antd css as global
        return localName;
      } else {
        return _getLocalIdent(loaderContext, localIdentName, localName, options);
      }
    },
  },

  webpack: (config, options) => {
    config.output.globalObject = 'this';
    return config;
  },

  publicRuntimeConfig: {
    MAILYARD_WEB_URL: process.env.MAILYARD_WEB_URL,
    MAILYARD_API_URL: process.env.MAILYARD_API_URL,
    SENTRY_FRONTEND_DSN: process.env.SENTRY_FRONTEND_DSN,
    HEROKU_SLUG_COMMIT: process.env.HEROKU_SLUG_COMMIT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_SCOPE: process.env.GOOGLE_SCOPE,
  },

  devSwSrc: path.join(__dirname, 'service-worker.js'),
  dontAutoRegisterSw: true,
})));
