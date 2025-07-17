import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  CreditCard, 
  Grid3x3, 
  Calendar, 
  CalendarDays, 
  FileText, 
  Bell,
  Info,
  AlertTriangle
} from 'lucide-react';
import { useLoan } from './src/context/LoanContext';
import { mockApi } from './src/services/mockApi';

interface LoanData {
  outstandingBalance: string;
  nextEmiDue: string;
  loanType: string;
  loanId: string;
  interestRate: string;
  nextEmiDate: string;
  emisPaid: string;
  totalEmis: string;
  totalPrincipal: string;
  outstandingAmount: string;
  nextEmiAmount: string;
}

const LoanOverview: React.FC = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useLoan();
  const [activeTab, setActiveTab] = useState<'overview' | 'statements' | 'calendar'>('overview');

  useEffect(() => {
    if (!loanId) return;

    const loadLoanDetails = async () => {
      try {
        const loan = await mockApi.getLoanById(loanId);
        if (loan) {
          dispatch({ type: 'SET_CURRENT_LOAN', payload: loan });
        }
      } catch (error) {
        console.error('Failed to load loan details:', error);
      }
    };

    loadLoanDetails();
  }, [loanId, dispatch]);

  const loan = state.currentLoan;

  if (!loan) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading loan details...</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const loanData: LoanData = {
    outstandingBalance: formatCurrency(loan.currentBalance),
    nextEmiDue: formatCurrency(loan.emi),
    loanType: `${loan.type} - ${loan.bank}`,
    loanId: `#${loan.id}2345`,
    interestRate: `${loan.interestRate}% p.a.`,
    nextEmiDate: new Date(loan.nextDueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    emisPaid: '4',
    totalEmis: '24',
    totalPrincipal: formatCurrency(loan.amount),
    outstandingAmount: formatCurrency(loan.currentBalance),
    nextEmiAmount: formatCurrency(loan.emi)
  };

  const handleRepaymentPlanner = () => {
    navigate(`/loan/${loanId}/planner`);
  };

  const handleBack = () => {
    navigate('/home');
  };

  const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ 
    icon, 
    label, 
    onClick 
  }) => (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center rounded-lg p-4 w-full aspect-square hover:opacity-80 transition-opacity"
      style={{ backgroundColor: '#E6E6E6' }}
    >
      <div className="mb-2" style={{ color: '#3D3D3D' }}>
        {icon}
      </div>
      <span className="text-sm font-medium text-center leading-tight" style={{ color: '#231917' }}>
        {label}
      </span>
    </button>
  );

  const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ 
    label, 
    isActive, 
    onClick 
  }) => (
    <button
      onClick={onClick}
      className={`pb-3 px-4 border-b-2 font-medium text-sm transition-colors ${
        isActive 
          ? 'border-black' 
          : 'border-transparent hover:border-gray-300'
      }`}
      style={{ color: isActive ? '#231917' : '#3D3D3D' }}
    >
      {label}
    </button>
  );

  const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-3">
      <span className="text-sm" style={{ color: '#3D3D3D' }}>{label}</span>
      <span className="font-medium" style={{ color: '#231917' }}>{value}</span>
    </div>
  );

  const NotificationCard: React.FC<{ 
    icon: React.ReactNode; 
    message: string; 
    type?: 'info' | 'warning' 
  }> = ({ icon, message, type = 'info' }) => (
    <div 
      className="flex items-start p-4 rounded-lg mb-3"
      style={{ backgroundColor: '#E6E6E6' }}
    >
      <div className="mr-3 mt-0.5" style={{ color: '#3D3D3D' }}>
        {icon}
      </div>
      <span className="text-sm flex-1" style={{ color: '#231917' }}>
        {message}
      </span>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto min-h-screen" style={{ backgroundColor: '#FBFBFB', fontFamily: 'Roboto, sans-serif' }}>
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4 text-sm" style={{ color: '#231917' }}>
        <span className="font-medium">9:41</span>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
          <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.415 5 5 0 017.07 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
          </svg>
          <div className="w-6 h-3 border border-black rounded-sm">
            <div className="w-4 h-full bg-black rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center px-4 pb-6">
        <button className="mr-4 p-1" onClick={handleBack}>
          <ChevronLeft className="w-6 h-6" style={{ color: '#231917' }} />
        </button>
        <h1 className="text-xl font-medium" style={{ color: '#231917' }}>
          Loan Overview
        </h1>
      </div>

      {/* Top Stats */}
      {/* Loan Summary Cards */}
      <div className="px-4 space-y-4">
        {/* Current Loan Card */}
        <div className="rounded-lg p-4" style={{ backgroundColor: '#E6E6E6' }}>
          <div className="mb-4">
            <h2 className="font-bold text-lg" style={{ color: '#231917' }}>
              {loan.type} - {loan.bank}
            </h2>
            <p className="text-sm" style={{ color: '#3D3D3D' }}>
              Loan ID: {loanData.loanId}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span style={{ color: '#3D3D3D' }}>Outstanding Balance</span>
              <span className="font-bold text-lg" style={{ color: '#231917' }}>
                {loanData.outstandingBalance}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span style={{ color: '#3D3D3D' }}>Interest Rate</span>
              <span className="font-medium" style={{ color: '#231917' }}>
                {loanData.interestRate}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span style={{ color: '#3D3D3D' }}>Next Due</span>
              <span className="font-medium" style={{ color: '#231917' }}>
                {loanData.nextEmiDate}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span style={{ color: '#3D3D3D' }}>Total Principal</span>
              <span className="font-medium" style={{ color: '#231917' }}>
                {loanData.totalPrincipal}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span style={{ color: '#3D3D3D' }}>Paid EMI count</span>
              <span className="font-medium" style={{ color: '#231917' }}>
                {loanData.emisPaid} of {loanData.totalEmis}
              </span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button 
              onClick={handleRepaymentPlanner}
              className="px-6 py-2 rounded-lg font-medium"
              style={{ backgroundColor: '#3D3D3D', color: '#FFFFFF' }}
            >
              Repayment Planner
            </button>
          </div>
        </div>
        
        {/* Additional loan cards would go here */}
      </div>
      
      {/* My Loans Button */}
      <div className="px-4 mt-6">
        <button 
          className="w-full py-3 px-4 rounded-lg font-medium"
          style={{ backgroundColor: '#3D3D3D', color: '#FFFFFF' }}
        >
          My Loans
        </button>
      </div>

      {/* Bottom Indicator */}
      <div className="flex justify-center pb-4">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export default LoanOverview;