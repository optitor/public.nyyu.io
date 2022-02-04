const path = require('path');
const fs = require('fs').promises;
const glob = require('glob');

exports.onPostBuild = async () => {
  const publicPath = path.join(__dirname, 'public');

   const htmlAndJSFiles = glob.sync(`${publicPath}/**/*.{html,js}`);
  console.log(
    '[onPostBuild] Replacing page-data.json references in the following files:'
  );
  for (let file of htmlAndJSFiles) {
    const stats = await fs.stat(file, 'utf8');
    if (!stats.isFile()) return;
    console.log(file);
    var content = await fs.readFile(file, 'utf8');
    var result = content.replace(
      'https://static.datacamp.com/page-data',
      '/page-data'
    );
    await fs.writeFile(file, result, 'utf8');
  }
};

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
    if (stage === "build-html" || stage === "develop-html") {
        actions.setWebpackConfig({
            module: {
                rules: [
                    {
                        test: /bad-module/,
                        use: loaders.null(),
                    },
                ],
            },
        })
    }
    actions.setWebpackConfig({
        module: {
            rules: [
                {
                    test: /\.html$/,
                    loader: require.resolve('html-loader'),
                    options: {
                        minimize: false,
                    },
                },
            ],
        },
        optimization: {
            splitChunks: false,
        },
        plugins: [plugins.provide({
            Buffer: ['buffer/', 'Buffer'],
        })]
    });
};
