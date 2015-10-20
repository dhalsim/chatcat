var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy;

module.exports.init = function(facebook_config) {
    var userAdapter = require('src/lib/mongoAdapters/userAdapter');

  // user, id property'si ile serialize ediliyor
  // session'a yazılacak
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // user, id'si kullanılarak deserialize ediliyor
  passport.deserializeUser(function(id, done) {
    userAdapter.getUserById(id).then(function (user) {
      done(null, user);
    }).catch(function (err) {
      done(err);
    });
  });

  var verifyCallback = function(accessToken, refreshToken, profile, done) {
    userAdapter.getUserByProfileId(profile.id).then(function (dbUser) {
      if(dbUser) {
        done(null, dbUser);
      } else {
        userAdapter.createUser(profile).then(function (user) {
          done(null, user);
        }).catch(function (err) {
          done(err);
        });
      }
    }).catch(function (err) {
      done(err);
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
