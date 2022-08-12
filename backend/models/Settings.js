var mongoose = require('mongoose');

var SettingsSchema = new mongoose.Schema({
    oneMonth: {type: Number, default: 170000},
    threeMonth: {type: Number, default: 470000},
    sixMonth: {type: Number, default: 680000},
    oneYear: {type: Number, default: 1469000},
    
    oneMonthText: {type: String, default: '170 هزار تومان'},
    threeMonthText: {type: String, default: '470 هزار تومان'},
    sixMonthText: {type: String, default: '680 هزار تومان'},
    oneYearText: {type: String, default: '1 میلیون و 469 هزار تومان'},
    
    oneMonthFullText: {type: String, default: '170 هزار تومان'},
    threeMonthFullText: {type: String, default: '510 هزار تومان'},
    sixMonthFullText: {type: String, default: '1 میلیون و 20 هزار تومان'},
    oneYearFullText: {type: String, default: '2 میلیون و 40 هزار تومان'},
    
    areas: {type: [String], default: ['22', '5', '2']},

    discountPerUser1: {type: Number, default: 0.005},
    discountPerUser2: {type: Number, default: 0.005},
    discountPerUser3: {type: Number, default: 0.005},
    discountPerUser4: {type: Number, default: 0.005},
});

var Settings = mongoose.model('Settings', SettingsSchema);

module.exports = Settings;
