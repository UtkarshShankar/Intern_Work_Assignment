import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeacherView from './TeacherView';
import StudentView from './StudentNameView';
import StudentPoll from './StudentPoll';
import LandingPage from './LandingPage';
import './styles.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/teacher" element={<TeacherView />} />
        <Route path="/student" element={<StudentView />} />
        <Route path="/student/poll" element={<StudentPoll />} />

      </Routes>
    </Router>
  );
}

export default App;