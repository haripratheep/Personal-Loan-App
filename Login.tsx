import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, Shield } from 'lucide-react';
import { useLoan } from './src/context/LoanContext';
import { mockApi } from './src/services/mockApi';
import Button from './src/components/common/Button';

const Login: React.FC = () => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { dispatch } = useLoan();

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (pin.length !== 4) return;
    
    setLoading(true);
    setError('');
    
    try {
      const isAuthenticated = await mockApi.authenticateUser(pin);
      if (isAuthenticated) {
        dispatch({ type: 'AUTHENTICATE', payload: true });
        navigate('/home');
      } else {
        setError('Invalid PIN. Please try again.');
        setPin('');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometric = () => {
    // Simulate biometric authentication
    dispatch({ type: 'AUTHENTICATE', payload: true });
    navigate('/home');
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

  React.useEffect(() => {
    if (pin.length === 4) {
      handleSubmit();
    }
  }, [pin]);

  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center p-4 font-roboto">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-black-custom rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white-custom" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Welcome Back</h1>
          <p className="text-black-custom">Please authenticate to continue</p>
        </div>

        {error && (
          <div className="bg-card-grey border border-card-grey rounded-lg p-3 mb-6">
            <p className="text-text-primary text-sm text-center">{error}</p>
          </div>
        )}

        <div className="bg-white-custom rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <p className="text-sm text-black-custom mb-4">Enter your 4-digit PIN</p>
            <div className="flex justify-center space-x-3">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    pin.length > index ? 'bg-black-custom' : 'bg-card-grey'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {digits.map((digit, index) => (
              <button
                key={index}
                onClick={() => {
                  if (digit === '⌫') {
                    handleBackspace();
                  } else if (digit !== '') {
                    handlePinInput(digit);
                  }
                }}
                disabled={loading || digit === ''}
                className={`h-14 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  digit === ''
                    ? 'invisible'
                    : digit === '⌫'
                    ? 'bg-card-grey text-black-custom hover:bg-gray-300 active:scale-95'
                    : 'bg-card-grey text-text-primary hover:bg-gray-300 active:bg-gray-400 active:scale-95'
                } disabled:opacity-50`}
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                {digit}
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleBiometric}
          disabled={loading}
          fullWidth
          className="flex items-center justify-center gap-2 bg-card-grey text-text-primary border-card-grey hover:bg-gray-300"
        >
          <Fingerprint className="w-5 h-5" />
          Use Biometric Authentication
        </Button>

        <p className="text-xs text-black-custom text-center mt-6">
          Use PIN: 1234 or 0000 for demo
        </p>
      </div>
    </div>
  );
};

export default Login;