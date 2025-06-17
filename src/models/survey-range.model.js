const mongoose = require('mongoose');

const surveyRangeValueSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  valueForCalculation: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('survey-range-value', surveyRangeValueSchema);
