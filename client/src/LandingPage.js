import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import sparkleIcon from './assets/sparkle.png'; // adjust path if needed

function LandingPage() {
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/${selectedRole}`);
    }
  };

  return (
    <div className="landing-page">
      <div className="badge">
        <img src={sparkleIcon} alt="sparkles" className="icon" />
        Intervue Poll
      </div>
      <h1>Welcome to the <span className="highlight">Live Polling System</span></h1>
      <p className="subtitle">Please select the role that best describes you to begin using the live polling system</p>

      <div className="role-selection">
        <div
          className={`role-card ${selectedRole === 'student' ? 'selected' : ''}`}
          onClick={() => setSelectedRole('student')}
        >
          <h3>I’m a Student</h3>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
        </div>

        <div
          className={`role-card ${selectedRole === 'teacher' ? 'selected' : ''}`}
          onClick={() => setSelectedRole('teacher')}
        >
          <h3>I’m a Teacher</h3>
          <p>Submit answers and view live poll results in real-time.</p>
        </div>
      </div>

      <button
        className="continue-button"
        onClick={handleContinue}
        disabled={!selectedRole}
      >
        Continue
      </button>
    </div>
  );
}

export default LandingPage;
