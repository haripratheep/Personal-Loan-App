import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoanProvider } from './src/context/LoanContext';
import Login from './Login';
import Home from './Home';
import LoanOverview from './LoanOverview';
import Planner from './Planner';
import Simulator from './Simulator';
import UpdatedSchedule from './UpdatedSchedule';
import ReminderSettings from './ReminderSettings';

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