import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import sparkleIcon from './assets/sparkle.png'; // adjust path if needed
function StudentView() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (name.trim()) {
      sessionStorage.setItem('studentName', name);
      navigate('/student/poll'); // route to actual poll page
    }
  };

  return (
    <div className="student-landing">
      <div className="badge">
        <img src={sparkleIcon} alt="sparkles" className="icon" />
        Intervue Poll
      </div>

      <h1>Let’s <span className="highlight">Get Started</span></h1>
      <p className="subtitle">
        If you’re a student, you’ll be able to <strong>submit your answers</strong>, participate in live polls,
        and see how your responses compare with your classmates
      </p>

      <label className="label" style={{ marginBottom: '8px' }}>Enter your Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name..."
        className="name-input"
      />

      <button
        className="continue-button"
        onClick={handleContinue}
        disabled={!name.trim()}
      >
        Continue
      </button>
    </div>
  );
}

export default StudentView;
