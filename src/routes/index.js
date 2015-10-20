module.exports.init = function (express, app, config) {
  var router = express.Router(),
    passport = require('passport');

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
    var session = req.session;

    if (!session) {
      // handle error
      return next(new Error('oh no'));
    }

    session.viewCount = session.viewCount
      ? session.viewCount + 1
      : 1;

    res.render('chatrooms', {title: 'Chatrooms ' +
      session.viewCount, user:req.user, socket_host: config.socket_host});
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
