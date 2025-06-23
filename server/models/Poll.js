const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  studentName: String,
  selectedOptionIndex: Number,
  answeredAt: { type: Date, default: Date.now },
});

const pollSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answers: [answerSchema],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  duration: Number,
});

module.exports = mongoose.model("Poll", pollSchema);
