import React from 'react';

interface SliderBlockProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
  ariaLabel?: string;
}

const SliderBlock: React.FC<SliderBlockProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  ariaLabel,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="bg-white-custom rounded-lg p-4 shadow-sm border border-card-grey">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-medium text-black-custom">{label}</label>
        <span className="text-lg font-bold text-text-primary">{formatValue(value)}</span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={ariaLabel || `${label} slider`}
          className="w-full h-2 bg-card-grey rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black-custom focus:ring-opacity-50"
          style={{
            background: `linear-gradient(to right, #3D3D3D 0%, #3D3D3D ${percentage}%, #E6E6E6 ${percentage}%, #E6E6E6 100%)`,
          }}
        />
        <div
          className="absolute w-5 h-5 bg-black-custom rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 hover:scale-110"
          style={{
            left: `${percentage}%`,
            top: '50%',
            pointerEvents: 'none',
          }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-black-custom mt-2">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
};

export default SliderBlock;