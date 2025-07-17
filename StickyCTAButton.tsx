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
    <div className="fixed bottom-0 left-0 right-0 bg-white-custom border-t border-card-grey p-4 shadow-lg">
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={onClick}
        disabled={disabled || loading}
        className="shadow-lg"
      >
        {loading ? 'Processing...' : text}
      </Button>
    </div>
  );
};

export default StickyCTAButton;