var redis = require('redis'),
  redis_config = require('src/config').redis,
  client = null;

module.exports.getClient = function (getNew) {
  if(getNew) {
    return redis.createClient(
      redis_config.port,
      redis_config.host,
      {no_ready_check: true});
  }

  if(!client) {
    client = redis.createClient(
      redis_config.port,
      redis_config.host,
      {no_ready_check: true});
  }

  return client;
}
