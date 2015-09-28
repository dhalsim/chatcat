module.exports = function (express, app) {
  var router = express.Router();

  router.get('/', function (req, res) {
    res.render('index', {title: 'Welcome to ChatCAT'});
  });

  router.get('/chatrooms', function (req, res) {
    res.render('chatrooms', {title: 'Chatrooms'});
  });

  app.use('/', router);
};
