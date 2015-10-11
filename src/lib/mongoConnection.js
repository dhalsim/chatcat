module.exports = function(mongo_config, mongoose) {
  var q = require('q');

  var promise = new Promise(function(resolve, reject) {
    mongoose.connect(mongo_config.url);
    var db = mongoose.connection;

    db.on('error', function(error) {
      reject(error);
    });
    db.once('open', function() {
      resolve();
    });
  });

  return q(promise);
};
