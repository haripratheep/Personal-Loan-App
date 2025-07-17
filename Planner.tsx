import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Home, FileText, CreditCard, HelpCircle, User, AlertTriangle } from 'lucide-react';
import { useLoan } from './src/context/LoanContext';
import { mockApi } from './src/services/mockApi';
import SliderBlock from './src/components/common/SliderBlock';
import GraphChart from './src/components/common/GraphChart';
import StickyCTAButton from './src/components/common/StickyCTAButton';
import ConfirmModal from './src/components/common/ConfirmModal';

interface PaymentScheduleItem {
  date: string;
  month: number;
  principal: number;
  interest: number;
  totalAmount: number;
  status: 'paid' | 'upcoming' | 'updated';
}

const Planner: React.FC = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useLoan();
  const [activeTab, setActiveTab] = useState<'schedule' | 'simulator'>('schedule');
  const [activeBottomTab, setActiveBottomTab] = useState('payments');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loanId) return;

    const loadEMISchedule = async () => {
      try {
        const schedule = await mockApi.getEMISchedule(loanId);
        dispatch({ type: 'SET_EMI_SCHEDULE', payload: schedule });
      } catch (error) {
        console.error('Failed to load EMI schedule:', error);
      }
    };

    loadEMISchedule();
  }, [loanId, dispatch]);

  useEffect(() => {
    if (activeTab === 'simulator') {
      const runSimulation = async () => {
        if (state.simulationInput.extraPayment === 0 && state.simulationInput.paymentDelay === 0) {
          dispatch({ type: 'SET_SIMULATION_RESULT', payload: {
            interestSaved: 0,
            termReduction: 0,
            newTotalInterest: 4000,
          }});
          return;
        }

        try {
          const result = await mockApi.simulateLoan(state.simulationInput);
          dispatch({ type: 'SET_SIMULATION_RESULT', payload: result });
        } catch (error) {
          console.error('Simulation failed:', error);
        }
      };

      const debounceTimer = setTimeout(runSimulation, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [state.simulationInput, dispatch, activeTab]);

  const loanData = {
    amount: 180000,
    interestRate: 10.5,
    tenure: 20,
    emiAmount: 8329
  };

  const formatCurrency = (amount: number): string => {
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

  const handleExtraPaymentChange = (value: number) => {
    dispatch({ type: 'UPDATE_SIMULATION_INPUT', payload: { extraPayment: value } });
  };

  const handlePaymentDelayChange = (value: number) => {
    dispatch({ type: 'UPDATE_SIMULATION_INPUT', payload: { paymentDelay: value } });
  };

  const handleApplyToPlan = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmApply = async () => {
    if (!state.simulationResult) return;

    setLoading(true);
    try {
      await mockApi.updateLoanPlan(loanId!, state.simulationResult);
      dispatch({ type: 'APPLY_SIMULATION_TO_PLAN' });
      setShowConfirmModal(false);
      navigate(`/loan/${loanId}/updated-schedule`);
    } catch (error) {
      console.error('Failed to apply simulation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/loan/${loanId}`);
  };

  const renderPaymentItem = (item: any) => (
    <div key={item.id} className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div style={{ color: '#231917' }} className="font-medium text-base">{new Date(item.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
          <div style={{ color: '#3D3D3D' }} className="text-sm">Month {item.id}</div>
        </div>
        <div className="text-right">
          <div style={{ color: '#231917' }} className="font-semibold text-lg">
            {formatCurrency(item.emi)}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(item.status)}`}>
            {getStatusText(item.status)}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between">
        <div className="flex-1 mr-2">
          <div style={{ color: '#3D3D3D' }} className="text-sm mb-1">Principal</div>
          <div style={{ color: '#231917' }} className="font-medium">{formatCurrency(item.principal)}</div>
        </div>
        <div className="flex-1">
          <div style={{ color: '#3D3D3D' }} className="text-sm mb-1">Interest</div>
          <div style={{ color: '#231917' }} className="font-medium">{formatCurrency(item.interest)}</div>
        </div>
      </div>
    </div>
  );

  const showWarning = state.simulationResult?.warningMessage;

  return (
    <div className="min-h-screen max-w-md mx-auto" style={{ backgroundColor: '#FBFBFB', fontFamily: 'Roboto, sans-serif' }}>
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-sm font-medium" style={{ backgroundColor: '#FFFFFF', color: '#231917' }}>
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-black rounded-sm"></div>
          <div className="w-4 h-2 bg-black rounded-sm"></div>
          <div className="w-2 h-4 bg-black rounded-sm"></div>
        </div>
      </div>

      {/* Header */}
      <div style={{ backgroundColor: '#FFFFFF' }} className="px-4 py-4 border-b" style={{ borderColor: '#E6E6E6' }}>
        <div className="flex items-center">
          <button className="p-2 -ml-2 rounded-full hover:bg-gray-100" onClick={handleBack}>
            <ArrowLeft size={24} style={{ color: '#3D3D3D' }} />
          </button>
          <h1 className="text-xl font-semibold ml-2" style={{ color: '#231917' }}>Repayment Planner</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ backgroundColor: '#FFFFFF' }} className="border-b" style={{ borderColor: '#E6E6E6' }}>
        <div className="flex">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'schedule'
                ? 'border-b-2 border-black'
                : 'hover:text-gray-900'
            }`}
            style={{ color: activeTab === 'schedule' ? '#231917' : '#3D3D3D' }}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'simulator'
                ? 'border-b-2 border-black'
                : 'hover:text-gray-900'
            }`}
            style={{ color: activeTab === 'simulator' ? '#231917' : '#3D3D3D' }}
          >
            Simulator
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {activeTab === 'schedule' && (
          <>
            {/* Loan Summary Card */}
            <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: '#E6E6E6' }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div style={{ color: '#3D3D3D' }} className="text-sm mb-1">Loan Amount</div>
                  <div style={{ color: '#231917' }} className="font-semibold text-lg">
                    {formatCurrency(loanData.amount)}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#3D3D3D' }} className="text-sm mb-1">Interest Rate</div>
                  <div style={{ color: '#231917' }} className="font-semibold text-lg">
                    {loanData.interestRate}% p.a.
                  </div>
                </div>
                <div>
                  <div style={{ color: '#3D3D3D' }} className="text-sm mb-1">Tenure</div>
                  <div style={{ color: '#231917' }} className="font-semibold text-lg">
                    {loanData.tenure} months{' '}
                    <span style={{ color: '#3D3D3D' }} className="text-sm font-normal">(remaining)</span>
                  </div>
                </div>
                <div>
                  <div style={{ color: '#3D3D3D' }} className="text-sm mb-1">EMI Amount</div>
                  <div style={{ color: '#231917' }} className="font-semibold text-lg">
                    {formatCurrency(loanData.emiAmount)}/month
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Schedule */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#231917' }}>Payment Schedule</h2>
              {state.emiSchedule.map(renderPaymentItem)}
            </div>
          </>
        )}

        {activeTab === 'simulator' && (
          <div className="space-y-6">
            {/* Warning Banner */}
            {showWarning && (
              <div className="border rounded-lg p-4 animate-fade-in" style={{ backgroundColor: '#E6E6E6', borderColor: '#E6E6E6' }}>
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" style={{ color: '#231917' }} />
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: '#231917' }}>Payment Delay Warning</h3>
                    <p className="text-sm" style={{ color: '#231917' }}>{state.simulationResult?.warningMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Sliders */}
            <div className="space-y-4">
              <SliderBlock
                label="Extra Payment"
                value={state.simulationInput.extraPayment}
                min={0}
                max={10000}
                step={100}
                onChange={handleExtraPaymentChange}
                formatValue={formatCurrency}
                ariaLabel={`Extra Payment is ${formatCurrency(state.simulationInput.extraPayment)}`}
              />

              <SliderBlock
                label="Payment Delay (days)"
                value={state.simulationInput.paymentDelay}
                min={0}
                max={30}
                step={1}
                onChange={handlePaymentDelayChange}
                formatValue={(value) => `${value} days`}
                ariaLabel={`Payment delay is ${state.simulationInput.paymentDelay} days`}
              />
            </div>

            {/* Graph */}
            <GraphChart simulationInput={state.simulationInput} />

            {/* Results Summary */}
            {state.simulationResult && (
              <div className="rounded-lg p-4 shadow-sm border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E6E6' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#231917' }}>Simulation Results</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#E6E6E6' }}>
                    <p className="text-sm mb-1" style={{ color: '#3D3D3D' }}>Interest Saved</p>
                    <p className="text-xl font-bold" style={{ color: '#231917' }}>
                      {formatCurrency(state.simulationResult.interestSaved)}
                    </p>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#E6E6E6' }}>
                    <p className="text-sm mb-1" style={{ color: '#3D3D3D' }}>Term Reduced</p>
                    <p className="text-xl font-bold" style={{ color: '#231917' }}>
                      {state.simulationResult.termReduction} months
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={{ backgroundColor: '#FFFFFF' }} className="border-t" style={{ borderColor: '#E6E6E6' }}>
        <div className="flex">
          <button
            onClick={() => setActiveBottomTab('overview')}
            className={`flex-1 py-3 px-2 flex flex-col items-center justify-center transition-colors`}
            style={{ color: activeBottomTab === 'overview' ? '#231917' : '#3D3D3D' }}
          >
            <Home size={20} className="mb-1" />
            <span className="text-xs">Overview</span>
          </button>
          
          <button
            onClick={() => setActiveBottomTab('loans')}
            className={`flex-1 py-3 px-2 flex flex-col items-center justify-center transition-colors`}
            style={{ color: activeBottomTab === 'loans' ? '#231917' : '#3D3D3D' }}
          >
            <FileText size={20} className="mb-1" />
            <span className="text-xs">My Loans</span>
          </button>
          
          <button
            onClick={() => setActiveBottomTab('payments')}
            className={`flex-1 py-3 px-2 flex flex-col items-center justify-center transition-colors`}
            style={{ color: activeBottomTab === 'payments' ? '#231917' : '#3D3D3D' }}
          >
            <CreditCard size={20} className="mb-1" />
            <span className="text-xs">Payments</span>
            <div className="w-12 h-1 rounded-full mt-1" style={{ backgroundColor: '#231917' }}></div>
          </button>
          
          <button
            onClick={() => setActiveBottomTab('support')}
            className={`flex-1 py-3 px-2 flex flex-col items-center justify-center transition-colors`}
            style={{ color: activeBottomTab === 'support' ? '#231917' : '#3D3D3D' }}
          >
            <HelpCircle size={20} className="mb-1" />
            <span className="text-xs">Support</span>
          </button>
          
          <button
            onClick={() => setActiveBottomTab('profile')}
            className={`flex-1 py-3 px-2 flex flex-col items-center justify-center transition-colors`}
            style={{ color: activeBottomTab === 'profile' ? '#231917' : '#3D3D3D' }}
          >
            <User size={20} className="mb-1" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>

      {/* Sticky CTA Button for Simulator Tab */}
      {activeTab === 'simulator' && (
        <StickyCTAButton
          text="Apply to Plan"
          onClick={handleApplyToPlan}
          disabled={!state.simulationResult || (state.simulationInput.extraPayment === 0 && state.simulationInput.paymentDelay === 0)}
        />
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmApply}
        title="Apply Simulation to Plan"
        message="Are you sure you want to apply these simulation results to your loan plan? This will update your EMI schedule."
        confirmText={loading ? 'Applying...' : 'Confirm'}
        cancelText="Cancel"
      />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Planner;