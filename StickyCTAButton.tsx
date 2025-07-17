import React from 'react';
import Button from './Button';

interface StickyCTAButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const StickyCTAButton: React.FC<StickyCTAButtonProps> = ({
  text,
  onClick,
  disabled = false,
  loading = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 shadow-lg" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E6E6E6' }}>
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className="w-full py-3 px-4 rounded-lg font-medium shadow-lg disabled:opacity-50"
        style={{ 
          backgroundColor: disabled || loading ? '#E6E6E6' : '#3D3D3D', 
          color: disabled || loading ? '#3D3D3D' : '#FFFFFF',
          minHeight: '44px'
        }}
      >
        {loading ? 'Processing...' : text}
      </button>
    </div>
  );
};

export default StickyCTAButton;