require('app-module-path').addPath(__dirname);

var express = require('express');
var path = require('path');
var config = require('src/config');
var passport = require('src/lib/facebookLogin').init(config.fb);
var logger = require('src/lib/logging');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// template'ler için .html uzantısını kullan
app.engine('html', require('hogan-express'));

app.use(express.static(path.join(__dirname, 'public')));

if(process.env.NODE_ENV === 'development') {
  app.use(require('connect-livereload')());
}

var session = require('express-session');
var store =  require('src/lib/sessionStore.js')(session, config.redis);
var sessionMiddleware = session({
  secret: config.cookie_secret,
  store: store,
  resave: false,
  saveUninitialized: true,
  cookie: config.cookie
});
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(logger.loggerMiddleware);
app.use(logger.exceptionMiddleware);
process.on('uncaughtException', logger.logAndCrash);

require('src/lib/socket')(io);
require('src/routes').init(express, app, config);

server.listen(config.port, function () {
  console.log('chatcat ' + config.port + ' portunda çalışıyor');
});

module.exports = app;
