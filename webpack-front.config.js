const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const WebpackProvideGlobalPlugin = require('webpack-provide-global-plugin');

const CompressionPlugin = require('compression-webpack-plugin');

var webpack = require('webpack');

// This is main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = {

  //watch: true,
  cache: true,
  // Path to your entry point. From this file Webpack will begin his work
  entry: {
    index: './app/scripts/index.js',
  },

  // Path and filename of your result bundle.
  // Webpack will bundle all JavaScript into this file
  output: {
    //publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].bundle.js'
  },

  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    hot: true,
    allowedHosts: '*',
    // watchContentBase: true,
    // disableHostCheck: true,
  },



  module: {
    rules: [
      {
        test: /\.css?$/, include: /node_modules/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.scss?$/,

        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],


      },

      { test: /\.json$/, type: 'javascript/auto', use: [{loader: 'json-loader' }] },
      { test: /\.tsx?$/,  use: [{loader: "ts-loader"}] },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"]
            }
          }
        ],

      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [{loader: 'url-loader?limit=10000&mimetype=application/font-woff'}]
      },
      {
        test: /\.(ttf|otf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?|(jpg|gif)$/,
        use: [{loader: "file-loader?name=img/[name].[ext]"}]
      },
      { test: /\.(png|jpg)$/, use: [{loader: "file-loader?name=img/[name].[ext]"}] }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    fallback: {
      fs: false,
      http: false,
      https: false,
      url: false,
      buffer: false
    }
  },

  performance: {
    hints: false
  },

  plugins: [

    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './app//html/index.html',
      chunks: ["index"],
    }),
    new MiniCSSExtractPlugin({
      filename: 'css/[name].css',
      template: './app/styles/main.scss'
    }),
    new CompressionPlugin()
  ],
  // node: {
  //   fs: "empty"
  // },


  mode: 'production'


};