const path = require('path');
const webpack = require('webpack');
const SRC = path.resolve(__dirname, "src");

const isDev = process.env.NODE_ENV !== 'production';

const config = module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: 'build/',
    libraryTarget: "var",
    library: "ReactTask"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: SRC,
        use: [
          {loader: 'babel-loader', options: {babelrc: true}}
        ]
      },
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader', options: {sourceMap: isDev}},
          {loader: 'css-loader', options: {modules: false}},
        ]
      },
      {
        test: /fonts\/.*\.(eot|ttf|svg|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        use: [
          {loader: 'file-loader', options: {name: 'fonts/[name].[ext]'}}
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.js",
      minChunks: function (module) { return /node_modules/.test(module.resource); }
    })
  ],
  externals: { /* TODO: clean this up by not having a dual browser/node module */
    fs: true,
    mime: true
  }
};

if (isDev) {
  config.devtool = 'inline-source-map';
} else {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
}
