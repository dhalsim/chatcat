module.exports = function (express, app) {
  var router = express.Router();

  router.get('/', function (req, res) {
    res.render('index', {title: 'Welcome to ChatCAT'});
  });

  router.get('/chatrooms', function (req, res, next) {
    var session = req.session;

    if (!session) {
      return next(new Error('oh no')) // handle error
    }

    session.viewCount = session.viewCount
      ? session.viewCount + 1
      : 1;

    res.render('chatrooms', {title: 'Chatrooms ' +
      session.viewCount});
  });

  app.use('/', router);
};
