const path = require('path')
var webpack = require('webpack');

const HtmlWebpackPlugin =  require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    
    entry: {
        popup: './src/popup/popup.jsx',
        content: './src/content/content.js',
        background: './src/background/background.js',
        permission: './src/permission/permission.jsx',
        injectforeground: './src/content/foreground/injectforeground.jsx',
        foreground: './src/content/foreground/foreground.jsx'
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js'
    },
    module: {
        rules: [
          {
            test: /\.js|jsx $/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/react'],
                plugins: [
                  [
                    "@babel/plugin-transform-runtime",
                    {
                      "regenerator": true,
                      "corejs": 3
                    }
                  ]
                ]
              }
            }
          },
          {
            test: /\.css$/,
            include: /src/,
            use: [
              'style-loader', // last, inject css to the dom
              {
                loader: 'css-loader', options: { importLoaders: 1}
              },
              'postcss-loader'
            ]
          }
    ]},
    
    plugins: [
        new HtmlWebpackPlugin({
          template: './src/popup/popup.html',
          filename: 'popup.html',
          chunks: ['popup']
        }),
        new HtmlWebpackPlugin({
          template: './src/permission/permission.html',
          filename: 'permission.html',
          chunks: ['permission']
        }), 
        new HtmlWebpackPlugin({
          template: './src/content/foreground/foreground.html',
          filename: 'foreground.html',
          chunks: ['foreground']
        }),
        new CopyPlugin({
          patterns: [
            {from: 'public'},
          ]
        }), 
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery'
      })
    ]
}
