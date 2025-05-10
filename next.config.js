const { env } = require("process");
const webpack = require("webpack");

module.exports = {
  env: {
    SECRET_KEY: process.env.SECRET_KEY,
    ADDRESS: process.env.ADDRESS,
    DEVNET: process.env.DEVNET,
    BASE_URL: process.env.BASE_URL,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve("buffer"),
      process: require.resolve("process/browser"),
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
    };

    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
        process: "process/browser",
      })
    );

    return config;
  },
};
