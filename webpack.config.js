const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './test/index.jsx'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist')
    },
    mode: 'development',
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    plugins: ["@babel/plugin-transform-runtime"]
                }
            },
          },
        ],
      },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'test/index.html'
        })
    ]
}