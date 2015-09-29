module.exports = function(session, redis_config){
  var environment = (process.env.NODE_ENV || 'development');
  function getStore() {
    var redis = require('redis');
    var client = redis.createClient(
      redis_config.port,
      redis_config.host,
      {no_ready_check: true});
    var RedisStore = require('connect-redis')(session);

    if(redis_config.pass){
      client.auth(redis_config.pass, function (err) {
          if (err)
            throw err;
      });
    }

    return new RedisStore({
      client: client
    });
  }

  if(environment === 'development'){
    var store;

    try {
      store = getStore();
    } catch (e) {
      console.log(e);
      console.log("falling back to MemoryStore");
      store = new session.MemoryStore();
    }

    return store;
  } else {
    return getStore();
  }
}
