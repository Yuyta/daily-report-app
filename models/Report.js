const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ユーザーモデルと関連付け
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  workingHours: {
    type: String,
    required: true,
  },
  workStatus: {
    type: String,
    enum: ['出社', '在宅', '出張', '休暇'],
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  accomplishment: {
    type: String,
    required: true,
  },
  futurePlan: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Report', ReportSchema);
