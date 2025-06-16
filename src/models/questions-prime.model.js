const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  value: { type: String},    
  label: { type: String},    
  comment: { type: String },
},{_id: false});

const QuestionSchema = new mongoose.Schema({
  quiz_no:{type:Number},
  questionText: { type: String},
  type: { type: String, enum: ['option', 'text','range'], default: 'option' },
  options: [OptionSchema],
  system_greetings: [String] 

},{timestamps:true});

let primeQuestionsModel = mongoose.model('prime-questions', QuestionSchema);
module.exports = primeQuestionsModel
