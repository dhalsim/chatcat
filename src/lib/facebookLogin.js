var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy;

module.exports.init = function(config) {
  var facebook_config = config.fb,
    mongoose = require('mongoose'),
    User = require('src/models/user.js')(mongoose),
    userModel = mongoose.model('loginUser', User),
    mongoConnection = false;

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
    var promise;

    if(!mongoConnection){
      promise = require('src/lib/mongoConnection.js')(mongo_config, mongoose).then(function() {
        mongoConnection = true;
      }).catch(function (err) {
        console.error(err);
        done(err);
      });
    } else {
      promise = new Promise(function(resolve, reject){ resolve(); });
    }

    promise.then(function() {
      return userModel.findOne({profileID: profile.id}).exec();
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
