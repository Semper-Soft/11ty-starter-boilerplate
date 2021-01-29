/* eslint-disable import/no-extraneous-dependencies */
const htmlmin = require('html-minifier');

module.exports = {
  htmlmin: (content, outputPath) => {
    if (process.env.NODE_ENV === 'production' && outputPath && outputPath.endsWith('.html')) {
      const minified = htmlmin.minify(content, {
        html5: true,
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      });

      return minified;
    }

    return content;
  }
};
