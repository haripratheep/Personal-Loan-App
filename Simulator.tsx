import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useLoan } from '../context/LoanContext';
import { mockApi } from '../services/mockApi';
import Layout from '../components/layout/Layout';
import SliderBlock from '../components/common/SliderBlock';
import GraphChart from '../components/common/GraphChart';
import StickyCTAButton from '../components/common/StickyCTAButton';
import ConfirmModal from '../components/common/ConfirmModal';

const Simulator: React.FC = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useLoan();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
  }, [state.simulationInput, dispatch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
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

  const showWarning = state.simulationResult?.warningMessage;

  return (
    <Layout title="Loan Simulator">
      <div className="p-4 space-y-6 bg-bg-light min-h-screen">
        {/* Warning Banner */}
        {showWarning && (
          <div className="bg-card-grey border border-card-grey rounded-lg p-4 animate-fade-in">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-text-primary mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Payment Delay Warning</h3>
                <p className="text-text-primary text-sm">{state.simulationResult?.warningMessage}</p>
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
          <div className="bg-white-custom rounded-lg p-4 shadow-sm border border-card-grey">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Simulation Results</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-card-grey rounded-lg">
                <p className="text-sm text-black-custom mb-1">Interest Saved</p>
                <p className="text-xl font-bold text-text-primary">
                  {formatCurrency(state.simulationResult.interestSaved)}
                </p>
              </div>
              
              <div className="text-center p-3 bg-card-grey rounded-lg">
                <p className="text-sm text-black-custom mb-1">Term Reduced</p>
                <p className="text-xl font-bold text-text-primary">
                  {state.simulationResult.termReduction} months
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <StickyCTAButton
        text="Apply to Plan"
        onClick={handleApplyToPlan}
        disabled={!state.simulationResult || (state.simulationInput.extraPayment === 0 && state.simulationInput.paymentDelay === 0)}
      />

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
    </Layout>
  );
};

export default Simulator;