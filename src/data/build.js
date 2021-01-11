require('dotenv').config();

module.exports = {
  env: process.env.ELEVENTY_ENV || 'development',
  timestamp: new Date(),
  url: process.env.URL || 'http://localhost:8081'
};
