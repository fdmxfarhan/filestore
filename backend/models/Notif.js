var mongoose = require('mongoose');

var NotifSchema = new mongoose.Schema({
  type: String,
  text: String,
  date: Date,
  seen: {type: Boolean, default: false},
});

var Notif = mongoose.model('Notif', NotifSchema);

module.exports = Notif;
