const TerserPlugin = require('terser-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');
// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = async ({ page, actions }) => {
    const { createPage } = actions;
    // page.matchPath is a special key that's used for matching pages
    // only on the client.
    if (page.path.match(/^\/app/)) {
        page.matchPath = "/app/*"
        // Update the page.
        createPage(page)
    }
    else if (page.path.match(/^\/oauth2/)) {
        page.matchPath = "/oauth2/*"
        // Update the page.
        createPage(page)
    }
    else if (page.path.match(/^\/admin/)) {
        page.matchPath = "/admin/*";
        // Update the page.
        createPage(page);
    }
};

exports.onCreateWebpackConfig = ({ stage, loaders, actions, plugins }) => {
    actions.setWebpackConfig({
        resolve: {
            fallback: {
                "crypto": false,
                "stream": require.resolve("stream-browserify"),
                "assert": false,
                "util": false,
                "http": require.resolve('stream-http'),
                "https": require.resolve('https-browserify'),
                "os": false
            },
        },
        module: {
            rules: [
                {
                    test: /\.html$/,
                    loader: require.resolve('html-loader'),
                    options: {
                        minimize: false,
                    },
                },
                {
                    test: /bad-module/,
                    use: loaders.null(),
                },
            ],
        },
        optimization: {
            splitChunks: false,
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                }),
            ],
        },
        plugins: [
            new NodePolyfillPlugin(),
            new webpack.ProvidePlugin({
                Buffer: [require.resolve("buffer/"), "Buffer"],
            }),
        ],
        externals: [
            (function () {
                var IGNORES = [
                    'electron'
                ];
                return function (context, request, callback) {
                if (IGNORES.indexOf(request) >= 0) {
                    return callback(null, "require('" + request + "')");
                }
                return callback();
                };
            })()
            ]
    });
};
