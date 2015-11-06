var winston = require('winston');
var moment = require('moment');
var redis_config = require('src/config').redis;
var extend = require('src/lib/utils').extend;
require('winston-redis').Redis;

var redisClient = require('src/lib/redisAdapters/redisConnection').getClient();
var os = require('os');

var errorMeta = {
  hostname: os.hostname(),
  pid: process.pid,
  memory: process.memoryUsage(),
  uptime: process.uptime(),
  env: process.env.NODE_ENV || 'development'
};

var redisTransport = new (winston.transports.Redis)({
  redis: redisClient
});

var errorFileTransport = new (winston.transports.File)({
  filename: './logs/errors.log',
  level: 'error',
  colorize: true,
  timestamp: function() {
    return moment.utc().format();
  },
  maxsize: 10000, // 10 KB
  maxFiles: 5,
  //formatter: function () {},
  tailable: true,
  zippedArchive: true
});

// error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'debug',
      colorize: true,
      timestamp: function() {
        return moment.utc().format();
      },
      json: true,
      prettyPrint: true,
      humanReadableUnhandledException: true,
    }),
    errorFileTransport,
    redisTransport
  ]
});

// log fonksiyonunu override ediyorum
// error durumunda meta'ya errorMeta'yı inject edeceğim
logger.log = function(){
  var args = arguments;
  var level = args[0];

  if(level === 'error') {
    var originalMeta = args[2] || {};
    args[2] = extend(originalMeta, errorMeta);
  }

  winston.Logger.prototype.log.apply(this,args);
};

// logger hatası
logger.on('error', function (err) {
  console.error('Error occurred', err);
});

module.exports.log = logger;
module.exports.loggerMiddleware = function (req, res, next) {
  req.logger = logger;
  next();
};
module.exports.exceptionMiddleware = function (err, req, res, next) {
  logger.error(err.message, { stack: err.stack });
  next(err);
};
module.exports.logAndCrash = function (err) {
  logger.error(err.message, { stack: err.stack });
  throw err;
}
