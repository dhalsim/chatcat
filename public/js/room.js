$(function () {
  var data = window.roomPage;
  var user = data.user;
  var room = data.room;
  var host = data.socket_host;
  var roomChannel = io.connect(host + '/messages');

  $('span.fullName').text(user.fullName);
  $('h5.roomName').text(room.name);
  $('img.userPic').attr('src', user.profilePictureURL);

  function insertMessage(message, me){
    var $profilePic = $('<img>');
    $profilePic.attr('src', message.profilePictureURL);
    $profilePic.attr('alt', message.userName);

    var $pic = $('<div>');
    if(me) {
      $pic.attr('class', 'mypic');
    } else {
      $pic.attr('class', 'pic');
    }

    $pic.append($profilePic);

    var $msg = $('<div>');
    if (me) {
      $msg.attr('class', 'mymsg');
    } else {
      $msg.attr('class', 'msg');
    }

    $msg.append($('<p>')).append(message.message);

    var $msgBox = $('<div>');
    $msgBox.attr('class', 'msgbox');
    $msgBox.append($pic).append($msg);
    $msgBox = $('<li>').append($msgBox);

    $msgBox.hide().prependTo($('ul.messages')).slideDown(100);
  }

  function onKeyUp() {
    $(document).on('keyup', '.newmessage', function (e) {
      var value = this.value;
      if(e.which === 13 && value !== ''){
        var messageData = {
          userId: user._id,
          userName: user.fullName,
          profilePictureURL: user.profilePictureURL,
          roomId: room.id,
          message: value
        };

        this.value = '';
        insertMessage(messageData, true);
        roomChannel.emit('sendMessage', messageData);
      }
    });
  }

  function addUsers(users) {
    var $usersList = $('ul.users');
    $usersList.html('');

    users.forEach(function (user) {
      var $user = $('<span>').text(user.fullName);
      var $profilePic = $('<img>').attr('src', user.profilePictureURL);
      var $userName = $('<h5>').text(user.fullName);
      $usersList.append($('<li>').append($profilePic).append($userName));
    });
  }

  roomChannel.on('connect', function () {
    console.log('socket connection established');
    roomChannel.emit('joinroom', user);
    onKeyUp();
  });

  roomChannel.on('receiveMessage', function (data) {
    data = JSON.parse(data);
    insertMessage(data);
  });

  roomChannel.on('receiveUsersList', function (data) {
    users = JSON.parse(data);
    addUsers(users);
  });
});
