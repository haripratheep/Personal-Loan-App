import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoanProvider } from './context/LoanContext';
import Login from './pages/Login';
import Home from './pages/Home';
import LoanOverview from './pages/LoanOverview';
import Planner from './pages/Planner';
import Simulator from './pages/Simulator';
import UpdatedSchedule from './pages/UpdatedSchedule';
import ReminderSettings from './pages/ReminderSettings';

function App() {
  return (
    <LoanProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/loan/:loanId" element={<LoanOverview />} />
            <Route path="/loan/:loanId/planner" element={<Planner />} />
            <Route path="/loan/:loanId/simulator" element={<Simulator />} />
            <Route path="/loan/:loanId/updated-schedule" element={<UpdatedSchedule />} />
            <Route path="/loan/:loanId/reminder-settings" element={<ReminderSettings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </LoanProvider>
  );
}

export default App;