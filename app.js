require('app-module-path').addPath(__dirname);

var express = require('express');
var path = require('path');
var config = require('src/config');
var passport = require('src/lib/facebookLogin.js').init(config);

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// template'ler için .html uzantısını kullan
app.engine('html', require('hogan-express'));

app.use(express.static(path.join(__dirname, 'public')));

var session = require('express-session');
var store =  require('src/lib/sessionStore.js')(session, config.redis);

app.use(session({
  secret: config.cookie_secret,
  store: store,
  resave: false,
  saveUninitialized: true,
  cookie: config.cookie
}));

app.use(passport.initialize());
app.use(passport.session());

require('src/routes').init(express, app, config);

app.listen(3000, function () {
  console.log('chatcat 3000 portunda çalışıyor');
});

module.exports = app;
