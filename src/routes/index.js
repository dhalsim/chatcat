module.exports.init = function (express, app, config) {
  var router = express.Router(),
    passport = require('passport'),
    roomAdapter = require('src/lib/redisAdapters/roomAdapter');

  router.get('/', function (req, res) {
    res.render('index', {title: 'Welcome to ChatCAT'});
  });

  function securePage(req, res, next){
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/');
    }
  }

  router.get('/chatrooms', securePage, function (req, res, next) {
    res.render('chatrooms', {title: 'Chatrooms',
      user:req.user, socket_host: config.socket_host});
  });

  router.get('/room/:id', securePage, function (req, res, next) {
    var roomId = req.params.id;
    roomAdapter.getRoomById(roomId).then(function (room) {
      req.session.room = room;

      res.render('room', {
        user: JSON.stringify(req.user),
        room: JSON.stringify(room),
        socket_host: config.socket_host
      });
    }).catch(function (err) {
      next(err);
    }).done();
  });

  router.get('/auth/facebook',
    passport.authenticate('facebook', { scope : 'email' })
  );

  // facebook authenticate olduktan sonra
  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      // authentication başarılı
      res.redirect('/chatrooms');
    }
  );

  router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
  });

  app.use('/', router);
};
