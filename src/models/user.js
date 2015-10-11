module.exports = function(mongoose){
  return mongoose.Schema({
    profileID: String,
    fullName: String,
    profilePictureURL: String
  });
};
