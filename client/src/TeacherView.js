import React, { useState } from 'react';
import './styles.css';
import sparkleIcon from './assets/sparkle.png'; // adjust path if needed
import { io } from 'socket.io-client';
import { useEffect } from 'react';

const socket = io(process.env.REACT_APP_SOCKET_URL);

function TeacherView() {
  const [livePoll, setLivePoll] = useState(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]);
  const [duration, setDuration] = useState(60);
  useEffect(() => {
    socket.on('update-results', (pollData) => {
      setLivePoll(pollData);
    });

    socket.on('poll:end', () => {
      setLivePoll(null);
    });

    return () => {
      socket.off('update-results');
      socket.off('poll:end');
    };
  }, []);
  const calculatePercentages = () => {
    if (!livePoll || livePoll.answers.length === 0) return Array(livePoll.options.length).fill(0);

    const total = livePoll.answers.length;
    const counts = Array(livePoll.options.length).fill(0);
    livePoll.answers.forEach(ans => counts[ans.selectedOptionIndex]++);
    return counts.map(c => Math.round((c / total) * 100));
  };
  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index].text = value;
    setOptions(updated);
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, { text: '', isCorrect: false }]);
    }
  };

  const handleCorrectChange = (index, value) => {
    const updated = [...options];
    updated[index].isCorrect = value;
    setOptions(updated);
  };

  const handleSubmit = () => {
    const optionTexts = options.map((o) => o.text);
    socket.emit('startPoll', { question, options: optionTexts, duration });
    setQuestion('');
    setOptions([
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]);
  };

  return (
    <div className="teacher-container">
      <div className="badge">
        <img src={sparkleIcon} alt="sparkles" className="icon" />
        Intervue Poll
      </div>
      <h1>Let’s <span className="highlight">Get Started</span></h1>
      <p className="subtitle">
        you’ll have the ability to create and manage polls, ask questions, and monitor
        your students' responses in real-time.
      </p>

      <label className="label">Enter your question</label>
      <div className="question-input-wrapper">
        <textarea
          className="question-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={100}
          placeholder="Type your question here..."
        />
        <select
          className="timer-select"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
        >
          <option value={30}>30 seconds</option>
          <option value={45}>45 seconds</option>
          <option value={60}>60 seconds</option>
          <option value={90}>90 seconds</option>
        </select>
      </div>
      <div className="char-count">{question.length}/100</div>

      <label className="label" style={{ marginTop: '30px' }}>Edit Options</label>
      {options.map((option, idx) => (
        <div className="option-row" key={idx}>
          <div className="option-number">{idx + 1}</div>
          <input
            className="option-input"
            type="text"
            value={option.text}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
          />
          <div className="correct-toggle">
            <label><input type="radio" checked={option.isCorrect} onChange={() => handleCorrectChange(idx, true)} /> Yes</label>
            <label><input type="radio" checked={!option.isCorrect} onChange={() => handleCorrectChange(idx, false)} /> No</label>
          </div>
        </div>
      ))}

      {options.length < 4 && (
        <button className="add-option-btn" onClick={addOption}>+ Add More option</button>
      )}

      <div className="footer-bar">
        <button className="ask-question-btn" onClick={handleSubmit}>Ask Question</button>
      </div>
      {
      livePoll && (
        <div className="live-results">
          <h2 className="label">Live Poll Results</h2>
          <p>{livePoll.question}</p>
          {livePoll.options.map((opt, index) => {
            const percentages = calculatePercentages();
            return (
              <div key={index} className="result-bar-wrapper">
                <div className="result-label">{opt}</div>
                <div className="result-bar">
                  <div className="result-fill" style={{ width: `${percentages[index]}%` }}>
                    {percentages[index]}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )
      }

    </div>
  );
}

export default TeacherView;
