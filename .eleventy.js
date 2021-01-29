const fs = require('fs');
const path = require('path');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const NavigationPlugin = require('@11ty/eleventy-navigation');
const ErrorOverlayPlugin = require('eleventy-plugin-error-overlay');

const config = require('./config');
const filters = require('./utils/filters');
const transforms = require('./utils/transforms');
const shortcodes = require('./utils/shortcodes');

const manifestPath = path.resolve(__dirname, config.dir.output, 'assets/manifest.json');

module.exports = (eleventyConfig) => {
  /**
   * Add plugins
   * @link https://www.11ty.dev/docs/plugins/
   */
  eleventyConfig.addPlugin(ErrorOverlayPlugin);
  eleventyConfig.addPlugin(NavigationPlugin);
  eleventyConfig.addPlugin(lazyImagesPlugin, {
    transformImgPath: (imgPath) =>
      imgPath.startsWith('http://') || imgPath.startsWith('https://') ? imgPath : `./src/${imgPath}`
  });

  /**
   * Add Filters
   * @link https://www.11ty.io/docs/filters/
   */
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });

  /**
   * Add Transforms
   * @link https://www.11ty.io/docs/config/#transforms
   */
  Object.keys(transforms).forEach((transformName) => {
    eleventyConfig.addTransform(transformName, transforms[transformName]);
  });

  /**
   * Add Shortcodes
   * @link https://www.11ty.io/docs/shortcodes/
   */
  eleventyConfig.addNunjucksAsyncShortcode('webpack', shortcodes.webpack);

  /**
   * Passthrough file copy
   * @link https://www.11ty.io/docs/copy/
   */
  // eleventyConfig.addPassthroughCopy({ 'src/assets/scripts/sw.js': 'sw.js' });
  eleventyConfig.addPassthroughCopy('src/assets/images');
  eleventyConfig.addPassthroughCopy('src/assets/fonts');
  // eleventyConfig.addPassthroughCopy('src/site.webmanifest');
  // Everything inside static is copied to dist as is
  eleventyConfig.addPassthroughCopy('src/assets/static');

  /**
   * Add layout aliases
   * @link https://www.11ty.dev/docs/layouts/#layout-aliasing
   */
  eleventyConfig.addLayoutAlias('base', 'base.njk');
  eleventyConfig.addLayoutAlias('page', 'page.njk');

  /**
   * Opts in to a full deep merge when combining the Data Cascade.
   * @link https://www.11ty.dev/docs/data-deep-merge/#data-deep-merge
   */
  eleventyConfig.setDataDeepMerge(true);

  // This allows Eleventy to watch for file changes during local development.
  eleventyConfig.setUseGitIgnore(false);

  /**
   * Override BrowserSync Server options
   * @link https://www.11ty.dev/docs/config/#override-browsersync-server-options
   */
  eleventyConfig.setBrowserSyncConfig({
    ...eleventyConfig.browserSyncConfig,
    // Reload when manifest file changes
    files: [manifestPath],
    // Show 404 page on invalid urls
    callbacks: {
      ready: (err, browserSync) => {
        browserSync.addMiddleware('*', (req, res) => {
          const fourOFour = fs.readFileSync(`${config.dir.output}/404.html`);
          res.write(fourOFour);
          res.end();
        });
      }
    },
    // Speed/clean up build time
    ui: false,
    ghostMode: false
  });

  return {
    dir: config.dir,
    templateFormats: ['md', 'njk', 'md'],
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true
  };
};
