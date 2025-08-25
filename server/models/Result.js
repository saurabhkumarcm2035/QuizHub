const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultSchema = new Schema({
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);