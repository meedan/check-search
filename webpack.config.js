const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const NODE_ENV = process.env.NODE_ENV || 'production';
const BUNDLE_PREFIX = process.env.BUNDLE_PREFIX
  ? `.${process.env.BUNDLE_PREFIX}`
  : '';
const nodeModulesPrefix = path.resolve(__dirname, 'node_modules') + '/';

module.exports = {
  entry: './src/index.js',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
  },
  devServer: {
    port: 8001,
    host: '0.0.0.0',
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: 'babel-loader',
        exclude: /(node_modules)/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  mode: 'production',
  optimization: {
    splitChunks: {
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
  externals: {
    config: 'config',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new CopyPlugin({
      patterns: [{ from: './config.js', to: 'config.js' }],
    }),
  ],
};
