import React from 'react';
import { CreditCard, Calendar, TrendingUp } from 'lucide-react';
import { Loan } from '../../context/LoanContext';

interface LoanCardProps {
  loan: Loan;
  onClick: () => void;
}

const LoanCard: React.FC<LoanCardProps> = ({ loan, onClick }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{loan.type}</h3>
            <p className="text-sm text-gray-500">{loan.bank}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(loan.status)}`}>
          {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Outstanding Balance</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(loan.currentBalance)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">EMI Amount</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(loan.emi)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Next Due: {new Date(loan.nextDueDate).toLocaleDateString('en-IN')}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>{loan.interestRate}% p.a.</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{loan.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${loan.progress}%` }}
            />
          </div>
        </div>
        <button className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

export default LoanCard;