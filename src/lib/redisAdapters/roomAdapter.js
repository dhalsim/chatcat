var shortid = require('src/lib/utils').shortid,
  objToArray = require('src/lib/utils').objToFlattenArray,
  unflatten = require('src/lib/utils').unflatten,
  redis = require('redis'),
  redisConnection = require('src/lib/redisAdapters/redisConnection'),
  client = redisConnection.getClient(),
  subscriberClient = redisConnection.getClient(true),
  Promise = require('bluebird');

module.exports.createRoom = function(data) {
  var key = 'room:' + shortid();

  Promise.promisifyAll(redis.Multi.prototype);
  var multi = client.multi();
  multi.hmset(key, objToArray(data));
  multi.sadd('rooms', key);
  return multi.execAsync();
};

module.exports.getRooms = function () {
  var smembers = Promise.promisify(client.smembers, client);
  var hgetall = Promise.promisify(client.hgetall, client);

  return smembers('rooms').then(function (keys) {
    var getJobs = keys.map(function (key) {
      return hgetall(key);
    });

    return Promise.all(getJobs);
  }).then(function (results) {
    return results.map(function (result) {
      return unflatten(result);
    });
  });
};

module.exports.subscribeRooms = function (callback) {
  subscriberClient.subscribe('__keyspace@0__:rooms');

  subscriberClient.on("message", function (key, command) {
    console.log(key, command);
    callback();
  });
};
