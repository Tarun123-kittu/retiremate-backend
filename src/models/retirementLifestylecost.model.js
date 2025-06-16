const mongoose = require('mongoose');

const lifestyleRangeSchema = new mongoose.Schema({
  min: Number,
  max: Number,
  mean: Number
}, { _id: false });

const stateLifestyleSchema = new mongoose.Schema({
  state: { type: String, required: true, unique: true },

  budget: lifestyleRangeSchema,
  comfort: lifestyleRangeSchema,
  luxury: lifestyleRangeSchema,

  medianLifestyle: Number
}, { timestamps: true });

module.exports = mongoose.model('retirement-lifestyle-cost', stateLifestyleSchema);
