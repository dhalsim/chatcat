var express = require('express');
var path = require('path');
var config = require('./config/environment.js');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// template'ler için .html uzantısını kullan
app.engine('html', require('hogan-express'));

app.use(express.static(path.join(__dirname, 'public')));

var session = require('express-session');
var store =  require('./lib/sessionStore.js')(session, config.redis);

app.use(session({
  secret: config.cookie_secret,
  store: store,
  resave: false,
  saveUninitialized: true,
  cookie: config.cookie
}));

require('./routes/routes.js')(express, app);

app.listen(3000, function () {
  console.log('chatcat 3000 portunda çalışıyor');
});

module.exports = app;
