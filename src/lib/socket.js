var roomAdapter = require('src/lib/redisAdapters/roomAdapter'),
  Promise = require('bluebird'),
  rooms = null,
  moment = require('moment');

module.exports = function (io) {
  var channel = io.of('/roomlist').on('connection', function (socket) {
    console.log('socket connection established on server', socket.id);
    var passport = socket.request.session.passport;
    var userId = passport ? passport.user : null;
    console.log('socket user id', userId);

    function broadcastClient (data) {
      var stringified = JSON.stringify(data);
      socket.emit('room_update', stringified);
      rooms = data;
    }

    var promise = rooms ? Promise.resolve(rooms) : roomAdapter.getRooms();
    promise.then(broadcastClient);

    socket.on('create_room', function (room) {
      console.log('create room');
      room.createdBy = userId;
      room.createdAt = moment.utc().format();
      roomAdapter.createRoom(room);
    });
  });

  function broadcastAll (data) {
    var stringified = JSON.stringify(data);
    channel.emit('room_update', stringified);
    rooms = data;
  }

  roomAdapter.subscribeRooms(function () {
    roomAdapter.getRooms().then(broadcastAll);
  });
};
