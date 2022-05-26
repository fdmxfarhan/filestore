var mongoose = require('mongoose');

var NewsSchema = new mongoose.Schema({
  title: String,
  text: String,
  date: Date,
  seen: {type: Number, default: 0},
  seenBy: {type: [Object], default: []},
});

var News = mongoose.model('News', NewsSchema);

module.exports = News;
