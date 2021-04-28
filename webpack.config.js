const path = require("path");
const os = require('os');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const tinyPngWebpackPlugin = require("tinypng-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;

const addresses = function getLocalIP() {
    const interfaces = os.networkInterfaces();
    const addresses = [];

    Object.keys(interfaces).forEach((netInterface) => {
        interfaces[netInterface].forEach((interfaceObject) => {
            if (interfaceObject.family === 'IPv4' && !interfaceObject.internal) {
                addresses.push(interfaceObject.address);
            }
        });
    });
    return addresses;
}
const paths = [{
    jsEntry: path.resolve(__dirname, './src', 'js', 'main.js'),
    styleEntry: path.resolve(__dirname, './src', 'styles', 'style.scss')
}, {
    jsIndexEntry: path.resolve(__dirname, './src', 'js', 'index.js'),
    styleIndexEntry: path.resolve(__dirname, './src', 'styles', 'index.scss')
}]

console.log({
    from: path.resolve(__dirname, 'src', 'assets', 'fonts'),
    to: path.resolve(__dirname, 'dist', 'fonts'),
})
const entryChanks = paths.reduce((acc, cur) => {
    return Object.assign(acc, cur);
}, {});
console.log(addresses()[0])
console.log(entryChanks)
module.exports = {
    entry: {
        index: [entryChanks.jsIndexEntry, entryChanks.styleIndexEntry],
        app: [entryChanks.jsEntry, entryChanks.styleEntry],
    },
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "dist"),
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        // host: addresses()[0], //your ip address
        host: 'localhost', //your ip address
        port: 9000,
        compress: true,
        open: true,
        // disableHostCheck: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['index'],
            template: path.resolve(__dirname, 'src', 'index.html'),
            filename: path.resolve(__dirname, "dist", 'index.html')
        }),
        new HtmlWebpackPlugin({
            chunks: ['app'],
            template: path.resolve(__dirname, 'src', 'arenas.html'),
            filename: path.resolve(__dirname, "dist", 'arenas.html')
        }),
        new MiniCssExtractPlugin({
            filename: "./css/[name][hash].css",
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src', 'assets', 'fonts'),
                    to: path.resolve(__dirname, 'dist', 'assets', 'fonts'),
                },
                {
                    from: path.resolve(__dirname, 'src', 'assets', 'audio'),
                    to: path.resolve(__dirname, 'dist', 'assets', 'audio'),
                },
                {
                    from:  path.resolve(__dirname, 'src', 'assets', 'images', 'favicon'),
                    to: path.resolve(__dirname, 'dist', 'favicon'),
                },
                {
                    from: path.resolve(__dirname, 'src', 'assets', 'images', 'content'),
                    to: path.resolve(__dirname, 'dist', 'assets', 'images', 'content'),
                }
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "src/js"),
                exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["@babel/preset-flow"],
                            [
                                "@babel/env",
                                {
                                    targets: {
                                        edge: "17",
                                        firefox: "60",
                                        chrome: "67",
                                        safari: "11.1",
                                        ie: "11",
                                    },
                                    useBuiltIns: "usage",
                                },
                            ],
                        ],
                        plugins: ["@babel/plugin-proposal-class-properties"],
                    },
                },
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {},
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            url: false,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            sourceMap: true,
                            plugins: () => [
                                require("cssnano")({
                                    preset: [
                                        "default",
                                        {
                                            discardComments: {
                                                removeAll: true,
                                            },
                                        },
                                    ],
                                }),
                            ],
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            context: path.resolve(__dirname, "src/assets/images"),
                            outputPath: 'dist/',
                            publicPath: '../',
                            useRelativePaths: true
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
};
