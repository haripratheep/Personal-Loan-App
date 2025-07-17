import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote, CalendarDays, History, AlertCircle, Home as HomeIcon, User } from 'lucide-react';
import { useLoan } from './src/context/LoanContext';
import { mockApi } from './src/services/mockApi';
import Layout from './src/components/layout/Layout';
import Button from './src/components/common/Button';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useLoan();

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/');
      return;
    }

    const loadLoans = async () => {
      try {
        const loans = await mockApi.getLoans();
        dispatch({ type: 'SET_LOANS', payload: loans });
      } catch (error) {
        console.error('Failed to load loans:', error);
      }
    };

    loadLoans();
  }, [state.isAuthenticated, navigate, dispatch]);

  const handleLoanClick = (loanId: string) => {
    const loan = state.loans.find(l => l.id === loanId);
    if (loan) {
      dispatch({ type: 'SET_CURRENT_LOAN', payload: loan });
      navigate(`/loan/${loanId}`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-card-grey text-text-primary';
      case 'overdue':
        return 'bg-card-grey text-text-primary';
      default:
        return 'bg-card-grey text-text-primary';
    }
  };

  const rightAction = (
    <div className="text-right">
      <p className="text-xs text-black-custom">9:41</p>
    </div>
  );

  return (
    <div className="bg-white-custom min-h-screen font-roboto">
      <div className="p-4 space-y-4">
        <h1 className="text-xl font-bold text-text-primary">My Loans</h1>

        {/* Quick Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 bg-card-grey p-4 rounded-lg flex flex-col items-center text-black-custom">
            <Banknote className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Apply New Loan</span>
          </button>
          <button className="flex-1 bg-card-grey p-4 rounded-lg flex flex-col items-center text-black-custom">
            <CalendarDays className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">View EMI Calendar</span>
          </button>
          <button className="flex-1 bg-card-grey p-4 rounded-lg flex flex-col items-center text-black-custom">
            <History className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Loan History</span>
          </button>
        </div>

        {/* Active Loans */}
        <h2 className="text-lg font-semibold text-text-primary">Active Loans</h2>

        <div className="space-y-3">
          {state.loans.map((loan) => (
            <div 
              key={loan.id}
              onClick={() => handleLoanClick(loan.id)}
              className="bg-card-grey rounded-xl p-4 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-text-primary">{loan.type}</p>
                  <p className="text-sm text-black-custom">{loan.bank}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(loan.status)}`}>
                  {loan.status === 'active' ? 'Active' : loan.status === 'overdue' ? 'Overdue' : loan.status}
                </span>
              </div>
              <div className="flex justify-between text-black-custom text-sm mb-1">
                <span>Outstanding Balance</span>
                <span className="font-bold text-lg text-text-primary">{formatCurrency(loan.currentBalance)}</span>
              </div>
              <div className="flex justify-between text-black-custom text-sm mb-1">
                <span>Interest Rate</span>
                <span className="font-medium">{loan.interestRate}% p.a.</span>
              </div>
              <div className="flex items-center text-black-custom text-sm mt-2">
                <CalendarDays className="w-4 h-4 mr-2" />
                Next EMI due on {new Date(loan.nextDueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          ))}
        </div>

        {/* Documentation Reminder */}
        <div className="bg-card-grey rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-black-custom" />
          <div className="flex-1">
            <p className="font-medium text-text-primary">Let's Complete Your Documentation</p>
            <p className="text-sm text-black-custom">Submit pending documents to continue</p>
          </div>
          <button className="bg-black-custom text-white-custom px-4 py-2 rounded-md text-sm font-medium">Start</button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white-custom border-t border-card-grey flex justify-around py-2">
        <button className="flex flex-col items-center text-black-custom">
          <HomeIcon className="w-5 h-5 mb-1" />
          <span className="text-xs">Overview</span>
        </button>
        <button className="flex flex-col items-center text-text-primary font-bold">
          <Banknote className="w-5 h-5 mb-1" />
          <span className="text-xs">My Loans</span>
        </button>
        <button className="flex flex-col items-center text-black-custom">
          <History className="w-5 h-5 mb-1" />
          <span className="text-xs">Payments</span>
        </button>
        <button className="flex flex-col items-center text-black-custom">
          <AlertCircle className="w-5 h-5 mb-1" />
          <span className="text-xs">Support</span>
        </button>
        <button className="flex flex-col items-center text-black-custom">
          <div className="w-5 h-5 mb-1 bg-card-grey rounded-full"></div>
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Home;