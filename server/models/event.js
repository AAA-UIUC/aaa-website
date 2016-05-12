var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EventSchema = new Schema({
  name: String,
  date: Number,
  image: String,
  link: String,
  form: String
});

module.exports = mongoose.model('Event', EventSchema);