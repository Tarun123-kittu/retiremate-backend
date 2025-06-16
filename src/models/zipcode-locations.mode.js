const mongoose = require('mongoose');

const zipCodeLocationSchema = new mongoose.Schema({
  zipCode: Number,
  placeName: String,
  state: String,
  stateAbbreviation: String,
  county: String,
  latitude: Number,
  longitude: Number
});

module.exports = mongoose.model('zip-code-location', zipCodeLocationSchema);
