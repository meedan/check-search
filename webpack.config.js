const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./config');
const NODE_ENV = process.env.NODE_ENV || 'production';
const BUNDLE_PREFIX = process.env.BUNDLE_PREFIX
  ? `.${process.env.BUNDLE_PREFIX}`
  : '';
const nodeModulesPrefix = path.resolve(__dirname, 'node_modules') + '/';

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
  },
  devServer: {
    port: config.selfHostPort,
    host: '0.0.0.0',
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  mode: 'development',
  optimization: {
    splitChunks: {
      minSize: 99999999,
      name: false,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          filename: `vendor.bundle${BUNDLE_PREFIX}.js`,
          chunks: 'all',
          enforce: true,
          test({ resource }) {
            return resource && resource.startsWith(nodeModulesPrefix);
          },
        },
      },
    },
  },
  resolve: {
    symlinks: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
};
