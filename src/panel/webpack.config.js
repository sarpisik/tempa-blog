const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const resolveTsconfigPathsToAlias = require('./resolveTsconfigPathToWebpackAlias');

const isProd = process.env.NODE_ENV === 'production';
const mode = isProd ? 'production' : 'development';

// App directory
const appDirectory = fs.realpathSync(process.cwd());

// Gets absolute path of file within app directory
const resolveAppPath = (relativePath) =>
    path.resolve(appDirectory, relativePath);

module.exports = {
    entry: resolveAppPath('src/panel/src/index.tsx'),
    target: 'web',
    devtool: 'inline-source-map',
    mode,
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: isProd ? 'scripts/[name].[chunkhash].bundle.js' : '[name].js',
        // publicPath: '/panel',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        alias: resolveTsconfigPathsToAlias(),
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(sa|sc)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: { hmr: !isProd },
                    },
                    // 'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
        }),
        new MiniCssExtractPlugin({
            filename: isProd ? 'stylesheets/[name].[hash].css' : '[name].css',
            chunkFilename: isProd ? 'stylesheets/[id].[hash].css' : '[id].css',
        }),
    ],
};
