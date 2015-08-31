var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './components/Notification.js',
  output: {
    filename: 'dist/ReactWebNotification.js',
    libraryTarget: 'umd',
    library: 'ReactWebNotification'
  },
  externals: [{
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  }],
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', include: path.join(__dirname, 'components') }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ]
};
