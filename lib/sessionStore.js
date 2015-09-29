module.exports = function(session, redis_config){
  var Q = require("q");

  var environment = (process.env.NODE_ENV || 'development');
  function getStore() {
    return new Promise(function(resolve, reject) {
      var redis = require('redis');
      var client = redis.createClient(
        redis_config.port,
        redis_config.host,
        {no_ready_check: true});
      var RedisStore = require('connect-redis')(session);

      client.on('error', function (err) {
        reject(err);
      });

      if(redis_config.pass){
        client.auth(redis_config.pass, function (err) {
            if (err)
              reject(err);
        });
      }

      client.on('ready', function () {
        resolve(new RedisStore({
          client: client
        }));
      });
    });
  }

  var store;

  var promise = Q.fcall(getStore)
    .then(function (value) {
      store = value;
    });

  if(environment === 'development'){
    promise = promise.fail(function (error) {
      console.log(error);
      console.log("falling back to MemoryStore");
      store = new session.MemoryStore();
    });
  }

  promise.done();

  return store;
};
