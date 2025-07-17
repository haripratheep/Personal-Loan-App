import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoanProvider } from './src/context/LoanContext';
import Login from './src/pages/Login';
import Home from './src/pages/Home';
import LoanOverview from './src/pages/LoanOverview';
import Planner from './src/pages/Planner';
import Simulator from './src/pages/Simulator';
import UpdatedSchedule from './src/pages/UpdatedSchedule';
import ReminderSettings from './src/pages/ReminderSettings';

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