import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SimulationInput } from '../../context/LoanContext';

interface GraphChartProps {
  simulationInput: SimulationInput;
}

const GraphChart: React.FC<GraphChartProps> = ({ simulationInput }) => {
  // Generate mock data for the chart
  const generateChartData = () => {
    const data = [];
    const baseInterest = 4000;
    const months = 20;
    
    for (let i = 0; i <= months; i++) {
      const currentPlan = baseInterest * (1 - i / months);
      const simulatedPlan = simulationInput.extraPayment > 0 
        ? currentPlan * (1 - simulationInput.extraPayment / 10000)
        : currentPlan;
      
      const adjustedSimulated = simulationInput.paymentDelay > 0
        ? simulatedPlan * (1 + simulationInput.paymentDelay / 1000)
        : simulatedPlan;
      
      data.push({
        month: i,
        currentPlan: Math.max(0, currentPlan),
        simulatedPlan: Math.max(0, adjustedSimulated),
        threshold: baseInterest * 0.8,
      });
    }
    
    return data;
  };

  const data = generateChartData();
  const hasWarning = simulationInput.paymentDelay > 15;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const current = payload[0].value;
      const simulated = payload[1].value;
      const difference = current - simulated;
      
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">{`Month ${label}`}</p>
          <p className="text-sm text-gray-600">
            Current: ₹{current.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-blue-600">
            Simulated: ₹{simulated.toLocaleString('en-IN')}
          </p>
          {difference !== 0 && (
            <p className={`text-sm ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {difference > 0 ? 'Savings' : 'Additional'}: ₹{Math.abs(difference).toLocaleString('en-IN')}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white-custom rounded-lg p-4 shadow-sm border border-card-grey">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Interest Impact</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#808080' }}></div>
            <span style={{ color: '#3D3D3D' }}>Current Plan</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#0066CC' }}></div>
            <span style={{ color: '#3D3D3D' }}>Simulated Plan</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" />
            <XAxis 
              dataKey="month" 
              stroke="#3D3D3D"
              fontSize={12}
              tickFormatter={(value) => `${value}M`}
            />
            <YAxis 
              stroke="#3D3D3D"
              fontSize={12}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            {hasWarning && (
              <ReferenceLine 
                y={data[0]?.threshold} 
                stroke="#ef4444" 
                strokeDasharray="5 5"
                label={{ value: "Warning Threshold", position: "right" }}
              />
            )}
            <Line
              type="monotone"
              dataKey="currentPlan"
              stroke="#808080"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#808080' }}
            />
            <Line
              type="monotone"
              dataKey="simulatedPlan"
              stroke="#0066CC"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#0066CC' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {hasWarning && (
        <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#E6E6E6' }}>
          <p className="text-sm" style={{ color: '#231917' }}>
            ⚠️ Warning: Significant interest increase detected with current delay settings
          </p>
        </div>
      )}
    </div>
  );
};

export default GraphChart;