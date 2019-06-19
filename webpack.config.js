const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  return {
    entry: [ '@babel/polyfill', path.resolve(__dirname, 'client/index.jsx') ],
    devtool: argv.mode == 'development' ? 'inline-source-map' : false,
    devServer: {
      contentBase: path.resolve(__dirname, 'public'),
      proxy: {
        '/api': 'http://localhost:8081'
      },
    },
    plugins: [
      new CleanWebpackPlugin('public'),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'client/index.html'),
        filename: path.resolve(__dirname, 'public/index.html')
      })
    ],
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'public')
    },
    module: {
      rules: [
        { test: /\.jsx?$/, loader: 'babel-loader' },
        { test: /\.html?$/, loader: 'html-loader' },
        { test: /\.(png|svg|jpg|gif)$/, loader: 'file-loader' },
      ],
    },
    resolve: {
      modules: [ 'node_modules', path.resolve(__dirname, 'client') ],
      extensions: ['.js'],
      alias: {
        'react-native$': 'react-native-web'
      },
    },
  };
}
