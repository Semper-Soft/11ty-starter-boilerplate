const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const PostCSSPresetEnv = require('postcss-preset-env');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const config = require('./config');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProd ? 'production' : 'development',
  stats: {
    colors: true,
    preset: 'minimal'
  },
  performance: {
    hints: isProd ? 'warning' : false
  },
  devtool: isProd ? 'source-map' : 'cheap-module-source-map',
  entry: [
    path.resolve(__dirname, config.dir.input, 'assets/scripts/main.js'),
    path.resolve(__dirname, config.dir.input, 'assets/styles/main.css')
  ],
  output: {
    filename: isProd ? '[name].[contenthash].js' : '[name].js',
    path: path.resolve(__dirname, config.dir.output, 'assets'),
    publicPath: '/assets/'
  },
  plugins: [
    new WebpackManifestPlugin(),
    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[contenthash].css' : '[name].css'
    })
  ],
  ...(isProd && {
    optimization: {
      minimizer: [new TerserJSPlugin(), new CssMinimizerPlugin()]
    }
  }),
  module: {
    rules: [
      {
        test: /\.s?css/i,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [PostCSSPresetEnv]
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        generator: {
          filename: `images/${isProd ? '[contenthash][ext]' : '[name][ext]'}`
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: `fonts/${isProd ? '[contenthash][ext]' : '[name][ext]'}`
        }
      }
    ]
  },
  resolve: {
    alias: {
      // Helpful alias for importing assets
      assets: path.resolve(__dirname, config.dir.output, 'assets')
    }
  }
};
