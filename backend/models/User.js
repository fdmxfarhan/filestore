var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: String,
  school: String,
  username: String,
  email: String,
  idNumber: String,
  ipAddress: String,
  phone: String,
  education: String,
  fullname: String,
  password: String,
  role: String,
  card: Number,
  sex: String,
  file: {
    type: [Object],
    default: []
  },
  avatar: Number,
  course: [Object],
  addFilePermission: {type: Boolean, default: true},
  removeFilePermission: {type: Boolean, default: true},
  editFilePermission: {type: Boolean, default: true},
  addEstatePermission: {type: Boolean, default: true},
  removeEstatePermission: {type: Boolean, default: true},
  editEstatePermission: {type: Boolean, default: true},
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
