const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  // The entry point file described above
  entry: './src/index.js',
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  devtool: 'eval-source-map',
  // devServer
  devServer: {
      static: './dist',
      compress: true,
      open: true,
      hot: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: "images/[name][ext]"
        }
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html', // Path to your HTML template
      filename: 'index.html', // Output filename
    }),
    new Dotenv(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/images',
          to: 'images'
        }
      ],
    }),
  ],
  // The location of the build folder described above
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
     assetModuleFilename: 'images/[hash][ext][query]',
     clean: true,
   },
  optimization: {
    runtimeChunk: 'single',
  }
};