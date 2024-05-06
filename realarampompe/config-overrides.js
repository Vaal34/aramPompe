const path = require('path');

module.exports = function override(config, env) {
    // Add fallbacks for Node.js core modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "querystring": require.resolve("querystring-es3"),
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "crypto": require.resolve("crypto-browserify"),
      "buffer": require.resolve("buffer/"),
      "vm": require.resolve("vm-browserify"),
      "stream": require.resolve("stream-browserify"),
      "process": require.resolve("process/browser"),
    };

    // Add alias for react-dom
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom': '@hot-loader/react-dom',
    };

    return config;
};