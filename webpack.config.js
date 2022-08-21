const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    library: 'siteswap',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    publicPath: 'public',
    filename: 'siteswap.js',
    path: path.resolve(__dirname, 'public'),
    globalObject: 'this',
  },
};