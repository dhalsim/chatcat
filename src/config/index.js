var environmentConfig = require('./' +
  (process.env.NODE_ENV || 'development') + '.json');
var commons = require('./commons.json');

module.exports = require('src/lib/utils').extend(environmentConfig, commons);
