var mongo_config = require('src/config').mongo,
  mongoose = require('mongoose'),
  init = require('src/lib/mongoAdapters/mongoConnection').mongoInit,
  mongoose = require('mongoose'),
  User = require('src/models/user.js')(mongoose),
  userModel = mongoose.model('loginUser', User);

module.exports.getUserById = function (id) {
  return init(mongo_config, mongoose).then(function () {
    return userModel.findById(id).exec();
  }).catch(function (err) {
    console.error('mongo user adapter getUserById:', err);
    throw err;
  });
};

module.exports.getUserByProfileId = function (profileId) {
  return init(mongo_config, mongoose).then(function () {
    return userModel.findOne({profileID: profileId}).exec();
  }).catch(function (err) {
    console.error('mongo user adapter getUserByProfileId:', err);
    throw err;
  });
};

module.exports.createUser = function (profile) {
  return init(mongo_config, mongoose).then(function (dbUser) {
    if(!dbUser){
      dbUser = new userModel();
      dbUser.profileID = profile.id;
      dbUser.fullName = profile.displayName;
      dbUser.profilePictureURL = profile.photos[0].value;
      dbUser.save();
    }

    return dbUser;
  }).catch(function (err) {
    console.error('mongo user adapter createUser:', err);
    throw err;
  });
};
