import React from 'react';

interface ReminderToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ReminderToggle: React.FC<ReminderToggleProps> = ({
  label,
  description,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex-1">
        <h3 className="font-medium" style={{ color: '#231917' }}>{label}</h3>
        <p className="text-sm" style={{ color: '#3D3D3D' }}>{description}</p>
      </div>
      <div className="ml-4">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
          />
          <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
            checked ? '' : ''
          }`}>
            style={{ backgroundColor: checked ? '#3D3D3D' : '#E6E6E6' }}>
            <div className={`w-5 h-5 bg-white-custom rounded-full shadow-md transition-transform duration-200 ${
              checked ? 'translate-x-6' : 'translate-x-0.5'
            } mt-0.5`} style={{ backgroundColor: '#FFFFFF' }} />
          </div>
        </label>
      </div>
    </div>
  );
};

export default ReminderToggle;