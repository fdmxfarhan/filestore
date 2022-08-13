var mongoose = require('mongoose');

var PaymentSchema = new mongoose.Schema({
    username: Number,
    EstateID: String,
    paymentfullprice: Number,
    paymentdiscount: Number,
    paymentpayable: Number,
    selectedareas: {type: [String], default: []},
    planusernum: Number,
    plan: Number,
    planName: String,
    date: Date,
    jDate: String,
    authority: String,
    payed: {type: Boolean, default: false},
});

var Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
