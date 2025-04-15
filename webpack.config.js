const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    open: true,
    port: 8080,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './dist/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
};
console.log("1111111Webpack config loaded");

