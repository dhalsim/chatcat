module.exports.extend = function (origin, add) {
  // Don't do anything if add isn't an object
  if (!add || typeof add !== 'object') return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

module.exports.shortid = function () {
  return require('shortid').generate();
}

module.exports.objToFlattenArray = function (obj) {
  var flatten = require('flat');

  var keysAndValues = [];
  var flattened = flatten(obj);
  for (var property in flattened) {
      if (flattened.hasOwnProperty(property)) {
          keysAndValues.push(property);
          keysAndValues.push(flattened[property]);
      }
  }

  return keysAndValues;
}

module.exports.unflatten = function (obj) {
  return require('flat').unflatten(obj);
};
