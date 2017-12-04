const path = require('path');
const webpack = require('webpack');
const SRC = path.resolve(__dirname, "src");

const config = module.exports = {
  entry: {
    vendor: [],
    index: ['./src/index.js']
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: 'build/',
    libraryTarget: "var",
    library: "ReactTask"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: SRC,
        loader: 'babel'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        loader: 'file?name=fonts/[name].[ext]'
      }
    ]
  },
  resolve: {
    root: path.resolve(__dirname, "node_modules"),
    extensions: ['', '.js']
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.js",
      minChunks: function (module) { return /node_modules/.test(module.resource); }
    })
  ],
  externals: {
    fs: true,
    mime: true
  }
};

if (process.env.NODE_ENV !== 'production') {
  config.devtool = 'inline-source-map';
} else {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
}
