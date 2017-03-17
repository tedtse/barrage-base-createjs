module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist/',
    filename: 'barrage.js'
  },
  module: {
    loaders: [
      {
        test: /\.tpl$/,
        loader: 'string'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['es2015', 'stage-2']
        }
      }
    ]
  }
}