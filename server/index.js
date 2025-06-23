const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

const pollRoutes = require('./routes/pollRoutes');
app.use('/api/poll', pollRoutes);
const Poll = require("./models/Poll");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

let activePoll = null; // track latest poll in memory
let submissionSet = new Set(); // track submitted studentNames

// Util: Count results
const calculateResults = (poll) => {
  const total = poll.answers.length;
  const counts = Array(poll.options.length).fill(0);
  poll.answers.forEach(a => {
    if (a.selectedOptionIndex !== null) {
      counts[a.selectedOptionIndex]++;
    }
  });

  return counts.map(c => total === 0 ? 0 : Math.round((c / total) * 100));
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('startPoll', async ({ question, options, duration }) => {
    const newPoll = new Poll({ question, options, duration, isActive: true });
    await newPoll.save();

    activePoll = newPoll;
    submissionSet.clear();
    io.emit('poll:new', {
      _id: newPoll._id,
      question,
      options,
      duration
    });

    setTimeout(async () => {
      const updatedPoll = await Poll.findByIdAndUpdate(newPoll._id, { isActive: false }, { new: true });
      const results = calculateResults(updatedPoll);
      io.emit('poll:end', { results });
      activePoll = null;
    }, duration * 1000);
  });

  socket.on('submit-answer', async ({ pollId, studentName, selectedOptionIndex }) => {
    const poll = await Poll.findById(pollId);
    if (!poll || !poll.isActive) return;

    // Prevent duplicate submissions
    if (submissionSet.has(studentName)) return;
    submissionSet.add(studentName);

    poll.answers.push({ studentName, selectedOptionIndex });
    await poll.save();

    // Optional: emit live updates (not necessary if hiding)
    // io.emit('update-results', calculateResults(poll));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
