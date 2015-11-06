var shortid = require('src/lib/utils').shortid,
  objToArray = require('src/lib/utils').objToFlattenArray,
  unflatten = require('src/lib/utils').unflatten,
  redis = require('redis'),
  redisConnection = require('src/lib/redisAdapters/redisConnection'),
  client = redisConnection.getClient(),
  subscriberClient = redisConnection.getClient(true),
  Promise = require('bluebird'),
  smembers = Promise.promisify(client.smembers, client),
  hgetall = Promise.promisify(client.hgetall, client);

Promise.longStackTraces();

var ROOMS = 'rooms',
  ROOM = 'room';

module.exports.createRoom = function(data) {
  var id = shortid();
  var key = ROOMS + ':' + id;

  Promise.promisifyAll(redis.Multi.prototype);
  data.id = id;
  var multi = client.multi();
  multi.hmset(key, objToArray(data));
  multi.sadd(ROOMS, key);
  return multi.execAsync();
};

module.exports.getRoomById = function (roomId) {
  var key = ROOMS + ':' + roomId;
  return hgetall(key).then(function (room) {
    if(!room) {
      throw new Error('Room id not found:' + roomId);
    }

    return unflatten(room);
  });
};

module.exports.getRooms = function () {
  return smembers(ROOMS).then(function (keys) {
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
  subscriberClient.subscribe('__keyspace@0__:' + ROOMS);

  subscriberClient.on("message", function (key, command) {
    console.log(key, command);
    callback();
  });
};
