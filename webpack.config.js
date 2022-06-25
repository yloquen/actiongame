const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: {
        app: path.join(__dirname, 'src', 'index.ts')
    },
    target: 'web',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    devServer: {
        static: './dist',
        historyApiFallback:true
    },
    module: {
        rules:
        [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: ['/node_modules/', '/']
            },
/*            {
                test: /\.(s(a|c)ss)$/,
                use: ['style-loader','css-loader', 'sass-loader']
            }*/
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    plugins:
    [
        new HtmlWebpackPlugin({template: path.join(__dirname, 'src', 'index.html')}),
        new webpack.ProvidePlugin({process: 'process/browser'}),
        new CopyPlugin({
            patterns: [
                { from: "static", to: "." }
            ]
        })

    ],
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};
