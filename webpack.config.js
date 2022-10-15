const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack')
const path = require('path');

const dotenv = require('dotenv')
dotenv.config();

const isDevelopment = process.env.NODE_ENV !== 'production';
const isWebpackAnaysis = process.env.WEBPACK_ANALYSIS


module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  devServer: {
    hot: isDevelopment,
    historyApiFallback: {
      rewrites: [
        {from: /.*/, to: `/${process.env.PUBLIC_URL ? process.env.PUBLIC_URL + '/' : ''}index.html`}
      ]
    },
    client: { overlay: true }
  },
  entry: {
    index: './src/index.tsx'
  },
  devtool: isDevelopment ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        include: path.join(__dirname, 'src'),
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  optimization: {
    splitChunks: {
      name: 'vendors',
      cacheGroups: {
        frameworkVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|.*redux.*|.*router.*|immer)[\\/]/,
          name: 'framework',
          chunks: 'all',
        },
        headlessUiVendor: {
          test: /[\\/]node_modules[\\/]@headlessui[\\/]/,
          name: 'headless',
          chunks: 'all',
        }
      },
      chunks: 'all'
    }
  },
  plugins: [
    isDevelopment && new ReactRefreshPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.' },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
    isWebpackAnaysis && new BundleAnalyzerPlugin()
  ].filter(Boolean),
  output: {
    publicPath: process.env.PUBLIC_URL ? `/${process.env.PUBLIC_URL}/` : '/',
    chunkFilename: 'js/[name].[contenthash:6].bundle.js',
    filename: 'js/[name].[contenthash:6].js',
    path: path.resolve(__dirname, 'build'),
    clean: true
  }
};
