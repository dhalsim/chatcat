var roomAdapter = require('src/lib/redisAdapters/roomAdapter'),
  Promise = require('bluebird'),
  rooms = null,
  moment = require('moment');

module.exports = function (io) {
  var chatroomsChannel = io.of('/roomlist').on('connection', function (socket) {
    var passport = socket.request.session.passport;
    var userId = passport ? passport.user : null;

    function broadcastClient (data) {
      var stringified = JSON.stringify(data);
      socket.emit('room_update', stringified);
      rooms = data;
    }

    var promise = rooms ? Promise.resolve(rooms) : roomAdapter.getRooms();
    promise.then(broadcastClient);

    socket.on('create_room', function (room) {
      room.createdBy = userId;
      room.createdAt = moment.utc().format();
      roomAdapter.createRoom(room);
    });
  });

  function broadcastAll (data) {
    var stringified = JSON.stringify(data);
    chatroomsChannel.emit('room_update', stringified);
    rooms = data;
  }

  roomAdapter.subscribeRooms(function () {
    roomAdapter.getRooms().then(broadcastAll);
  });

  var messagesChannel = io.of('/messages').on('connection', function (socket) {
    if(!socket.request.session.room){
      return;
    }

    socket.on('disconnect', function() {
      var roomId = socket.request.session.room.id;
      updateUsersList(roomId);
    });

    socket.on('joinroom', function (user) {
      var roomId = socket.request.session.room.id;

      // bu user'la join olacağız, bu bilgi daha sonra clients'dan alınabilir
      socket.user = user;
      socket.roomId = roomId;
      socket.join(roomId);

      updateUsersList(roomId);
    });

    socket.on('sendMessage', function (data) {
      var stringified = JSON.stringify(data);
      socket.broadcast.to(data.roomId).emit('receiveMessage', stringified);
    });

    function updateUsersList(roomId){
      var clients = messagesChannel.in(roomId).sockets.filter(function(socket) {
        return socket.roomId === roomId;
      });
      var users = clients.map(function(socket) {
        return socket.user;
      });
      messagesChannel.in(roomId).emit('receiveUsersList', JSON.stringify(users));
    }
  });
};
