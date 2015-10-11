var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports.init = function(config) {
  var facebook_config = config.fb;
  var mongoose = require('mongoose');
  var User = require('src/models/user.js')(mongoose);
  var userModel = mongoose.model('loginUser', User);

  // user, id property'si ile serialize ediliyor
  // session'a yazılacak
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // user, id'si kullanılarak deserialize ediliyor
  passport.deserializeUser(function(id, done) {
    userModel.findById(id, function(err, user) {
      done(err, user);
    });
  });

  var verifyCallback = function(accessToken, refreshToken, profile, done) {
    var mongo_config = config.mongo;
    var connectionPromise = require('src/lib/mongoConnection.js')(mongo_config, mongoose);
    connectionPromise.then(function() {
      var query = userModel.findOne({profileID: profile.id});
      return query.exec();
    }).then(function(dbUser) {
      if(!dbUser){
        dbUser = new userModel();
        dbUser.profileID = profile.id;
        dbUser.fullName = profile.displayName;
        dbUser.profilePictureURL = profile.photos[0].value;

        dbUser.save();
      }

      done(null, dbUser);
    });
  };

  var strategy = new FacebookStrategy({
    clientID: facebook_config.appId,
    clientSecret: facebook_config.appSecret,
    callbackURL: facebook_config.callbackURL,
    profileFields: ['id', 'displayName', 'photos']
  }, verifyCallback);

  passport.use(strategy);

  return passport;
};
