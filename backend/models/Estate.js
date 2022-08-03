var mongoose = require('mongoose');

var EstateSchema = new mongoose.Schema({
  name: String,
  area: String,
  address: String,
  phone: String,
  creationDate: Date,
  planType: {
    type: String,
    default: 'free', // 1month, 3month, 6month, 1year
  },
  payDate: String,
  payed: {
    type: Boolean,
    default: false,
  },
  payHistory: [Object],
  payAmount: Number, // rial
  active: {
    type: Boolean,
    default: true,
  },
  code: Number,
  password: String,
  authority: String,
  lastRefreshFiles: {type: [Number], default: []},
  windowsKey: {type: String, default: ''},
});

var Estate = mongoose.model('Estate', EstateSchema);

module.exports = Estate;
