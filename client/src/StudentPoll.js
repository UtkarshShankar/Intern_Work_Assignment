import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './styles.css';
import sparkleIcon from './assets/sparkle.png';

const socket = io(process.env.REACT_APP_SOCKET_URL);

function StudentPoll() {
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    socket.on('poll:new', (data) => {
      setPoll(data);
      setSelectedOption(null);
      setTimeLeft(data.duration || 60);
      setShowResults(false);
    });

    socket.on('poll:end', (data) => {
      setResults(data.results);
      setShowResults(true);
    });

    return () => {
      socket.off('poll:new');
      socket.off('poll:end');
    };
  }, []);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleTimeExpiry = () => {
    if (selectedOption === null) {
      socket.emit('submit-answer', {
        pollId: poll._id,
        selectedOptionIndex: null,
        studentName: sessionStorage.getItem('studentName'),
        timedOut: true,
      });
    }
    // Don't clear poll here; wait for `poll:end` from server
  };

  const handleAnswer = (index) => {
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      socket.emit('submit-answer', {
        pollId: poll._id,
        selectedOptionIndex: selectedOption,
        studentName: sessionStorage.getItem('studentName'),
      });
    }
  };
  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };


  if (!poll) {
    return (
      <div className="student-poll-container">
        <div className="badge">
          <img src={sparkleIcon} alt="sparkles" className="icon" />
          Intervue Poll
        </div>
        <div className="custom-spinner"></div>
        <p className="waiting-text">Wait for the teacher to ask questions..</p>
        <button className="chat-btn" onClick={() => setShowChat(!showChat)}>💬</button>
        {showChat && (
          <div className="chat-box">
            <div className="chat-header">
              <div>Chat</div>
              <div>Participants</div>
            </div>
            <div className="chat-body">
              <div className="chat-msg user1">Hey There, how can I help?</div>
              <div className="chat-msg user2">Nothing bro, just chill!!</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showResults && poll) {
    return (
      <div className="student-poll-container">
        <div className="question-header">
          <span><strong>Question 1</strong></span>
          <span className="timer-icon">⏱ <span className="timer-text">{formatTime(timeLeft)}</span></span>
        </div>

        <div className="poll-card">
          <div className="poll-card-header">
            <strong>{poll.question}</strong>
          </div>

          <div className="poll-options">
            {poll.options.map((opt, index) => (
              <div key={index} className="poll-result-bar">
                <div className="result-bar-fill" style={{ width: `${results[index] || 0}%` }}></div>
                <div className="result-label"
                  style={{
                    color: (results[index] || 0) > 20 ? 'white' : 'black' // adjust threshold
                  }}
                >
                  <span className="option-index">{index + 1}</span> {opt}
                </div>

                <div className="result-percent">{results[index] || 0}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="wait-text">
          <strong>Wait for the teacher to ask a new question..</strong>
        </div>
      </div>

    );
  }

  // 👉 This block renders the active question view
  return (
    <div className="student-poll-container">
      <div className="question-header">
        <span className="question-number"><strong>Question 1</strong></span>
        <span className="timer-icon">⏱ <span className="timer-text">{formatTime(timeLeft)}</span></span>
      </div>

      <div className="poll-card">
        <div className="poll-card-header">
          <strong>{poll.question}</strong>
        </div>
        <div className="poll-options">
          {poll.options.map((opt, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedOption !== null}
              className={`poll-option ${selectedOption === index ? 'selected' : ''}`}
            >
              <span className="option-index">{index + 1}</span> {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="submit-container">
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={selectedOption === null}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default StudentPoll;
