var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index_bundle.js'
    },
    devServer: {
      port: 8001,
      host: '0.0.0.0',
      disableHostCheck: true,
    },
    module: {
        rules: [
            { 
                test: /\.(js)$/, 
                use: 'babel-loader' 
            },
            { 
                test: /\.css$/, 
                use: ['style-loader', 'css-loader'] 
            }
        ]
    },
    mode: 'development',
    resolve: {
      symlinks: true,
    },
    plugins: [

        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
}

