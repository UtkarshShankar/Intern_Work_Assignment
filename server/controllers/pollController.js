// server/controllers/pollController.js

const Poll = require("../models/Poll");

exports.createPoll = async (req, res) => {
  const { question, options } = req.body;
  const poll = new Poll({ question, options });
  await poll.save();
  res.status(201).json(poll);
};

// server/controllers/pollController.js

exports.submitAnswer = async (req, res) => {
  const { pollId, studentName, selectedOptionIndex } = req.body;

  const poll = await Poll.findById(pollId);
  if (!poll) return res.status(404).json({ error: "Poll not found" });

  poll.answers.push({ studentName, selectedOptionIndex });
  await poll.save();

  res.status(200).json({ message: "Answer submitted" });
  
};


exports.getActivePollStatus = async (req, res) => {
  const poll = await Poll.findOne({ isActive: true }).sort({ createdAt: -1 });
  if (!poll) return res.status(204).send(); // No content
  res.json(poll);
  
};

exports.getPollHistory = async (req, res) => {
  const polls = await Poll.find().sort({ createdAt: -1 });
  res.status(200).json(polls);
};
