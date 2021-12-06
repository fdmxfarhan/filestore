var mongoose = require('mongoose');

var EstateSchema = new mongoose.Schema({
  name: String,
  area: String,
  address: String,
  phone: String,
  creationDate: Date,
  planType: {
    type: String,
    default: 'trial'
  },
  payDate: Date,
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
});

var Estate = mongoose.model('Estate', EstateSchema);

module.exports = Estate;
