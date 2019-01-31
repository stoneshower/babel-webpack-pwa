const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const prefixer = require('autoprefixer');

module.exports = {
  entry: {
    app: './src/js/index',
  },
  output: {
    path: `${__dirname}/dist`,
    filename: './assets/js/[name].bundle.js',
  },
  devServer: {
    disableHostCheck: true,
  },
  devtool: process.env.NODE_ENV === 'production' ? false : '#eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                prefixer({ browsers: ['> 0%'] }),
              ],
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'compressed',
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './assets/images',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, './dist/index.html'),
      template: 'ejs-compiled-loader!./src/template/index.ejs',
    }),

    new CopyWebpackPlugin([{
      from: './src/images/**/*',
      to: './assets/images',
      flatten: true,
    }]),

    new MiniCssExtractPlugin({
      filename: './assets/css/[name].bundle.css',
    }),
  ],

  devServer: {
    contentBase: path.join(__dirname, 'dist/sp'),
    compress: true,
    port: 5432,
    historyApiFallback: true,
  },

  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.scss', '.css'],
  },
};