import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useLoan } from './src/context/LoanContext';
import Layout from './Layout';
import StickyCTAButton from './StickyCTAButton';

const UpdatedSchedule: React.FC = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const navigate = useNavigate();
  const { state } = useLoan();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'updated':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'updated':
        return 'Updated via Simulator';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleSetReminder = () => {
    navigate(`/loan/${loanId}/reminder-settings`);
  };

  return (
    <Layout title="Payment Schedule">
      <div className="p-4 bg-bg-light min-h-screen">
        {/* Success Message */}
        <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: '#E6E6E6', border: '1px solid #E6E6E6' }}>
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 mr-3" style={{ color: '#231917' }} />
            <div>
              <h3 className="font-semibold" style={{ color: '#231917' }}>Plan Updated Successfully</h3>
              <p className="text-sm" style={{ color: '#231917' }}>Your simulation has been applied to your loan plan</p>
            </div>
          </div>
        </div>

        {/* Updated Schedule */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#231917' }}>Updated EMI Schedule</h3>
          {state.emiSchedule.map((item) => (
            <div key={item.id} className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E6E6' }}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold" style={{ color: '#231917' }}>{item.month}</h4>
                  <p className="text-sm" style={{ color: '#3D3D3D' }}>Due: {new Date(item.dueDate).toLocaleDateString('en-IN')}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(item.status)}`}>
                  {getStatusText(item.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm" style={{ color: '#3D3D3D' }}>EMI Amount</p>
                  <p className="font-semibold" style={{ color: '#231917' }}>{formatCurrency(item.emi)}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#3D3D3D' }}>Principal</p>
                  <p className="font-semibold" style={{ color: '#231917' }}>{formatCurrency(item.principal)}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#3D3D3D' }}>Interest</p>
                  <p className="font-semibold" style={{ color: '#231917' }}>{formatCurrency(item.interest)}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#3D3D3D' }}>Balance</p>
                  <p className="font-semibold" style={{ color: '#231917' }}>{formatCurrency(item.balance)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <StickyCTAButton
        text="Set EMI Reminders"
        onClick={handleSetReminder}
      />
    </Layout>
  );
};

export default UpdatedSchedule;