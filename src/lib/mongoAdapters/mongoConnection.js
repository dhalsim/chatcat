var connection = false;

function _init(mongo_config, mongoose) {
  var promise = new Promise(function(resolve, reject) {
    if(connection) {
      resolve();
    } else {
      mongoose.connect(mongo_config.url);
      var db = mongoose.connection;

      db.on('error', function(error) {
        reject(error);
      });
      db.once('open', function() {
        connection = true;
        resolve();
      });
    }
  });

  return promise;
};

module.exports.mongoInit = function (mongo_config, mongoose) {
  return _init(mongo_config, mongoose).catch(function (err) {
    console.error('mongo connection: ', err);
  });
};
