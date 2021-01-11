/* eslint-disable import/no-extraneous-dependencies */
const htmlmin = require('html-minifier');

module.exports = {
  htmlmin: (content, outputPath) => {
    if (process.env.ELEVENTY_ENV === 'production' && outputPath && outputPath.endsWith('.html')) {
      const minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });

      return minified;
    }

    return content;
  }
};
