import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, CheckCircle } from 'lucide-react';
import { useLoan } from './src/context/LoanContext';
import Layout from './Layout';
import ReminderToggle from './ReminderToggle';
import StickyCTAButton from './StickyCTAButton';

const ReminderSettings: React.FC = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useLoan();
  const [showSuccess, setShowSuccess] = useState(false);

  const isAnyReminderEnabled = Object.values(state.reminderSettings).some(
    (value, index) => index < 4 && value === true
  );

  const handleToggleChange = (key: keyof typeof state.reminderSettings, value: boolean) => {
    dispatch({
      type: 'UPDATE_REMINDER_SETTINGS',
      payload: { [key]: value },
    });
  };

  const handleTimeChange = (time: string) => {
    dispatch({
      type: 'UPDATE_REMINDER_SETTINGS',
      payload: { reminderTime: time },
    });
  };

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };

  return (
    <Layout title="Set Your EMI Reminders">
      <div className="p-4 bg-bg-light min-h-screen">
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-card-grey border border-card-grey rounded-lg p-4 mb-6 animate-fade-in">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-text-primary mr-3" />
              <div>
                <h3 className="font-semibold text-text-primary">Reminders Set Successfully</h3>
                <p className="text-text-primary text-sm">You'll receive notifications as configured</p>
              </div>
            </div>
          </div>
        )}

        {/* Reminder Options */}
        <div className="bg-white-custom rounded-lg shadow-sm border border-card-grey divide-y divide-card-grey">
          <ReminderToggle
            label="Reminder for next payment"
            description="Get reminded 3 days before EMI due date"
            checked={state.reminderSettings.beforeDueDate}
            onChange={(checked) => handleToggleChange('beforeDueDate', checked)}
          />
          
          <ReminderToggle
            label="On EMI due date"
            description="Get notified on the day of EMI payment"
            checked={state.reminderSettings.onDueDate}
            onChange={(checked) => handleToggleChange('onDueDate', checked)}
          />
          
          <ReminderToggle
            label="After EMI due date"
            description="Get reminded if payment is missed"
            checked={state.reminderSettings.afterDueDate}
            onChange={(checked) => handleToggleChange('afterDueDate', checked)}
          />
          
          <ReminderToggle
            label="Monthly overview"
            description="Get monthly summary of all your loans"
            checked={state.reminderSettings.weeklyOverview}
            onChange={(checked) => handleToggleChange('weeklyOverview', checked)}
          />
        </div>

        {/* Time Picker */}
        {isAnyReminderEnabled && (
          <div className="mt-6 bg-white-custom rounded-lg p-4 shadow-sm border border-card-grey">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-black-custom mr-2" />
              <h3 className="font-semibold text-text-primary">Notification Time</h3>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm text-black-custom">
                Choose when you'd like to receive reminders
              </label>
              <input
                type="time"
                value={state.reminderSettings.reminderTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full px-4 py-3 border border-card-grey rounded-lg focus:ring-2 focus:ring-black-custom focus:border-black-custom"
                style={{ minHeight: '44px' }}
              />
              <p className="text-xs text-black-custom">
                Time format: 24-hour (e.g., 09:00 for 9:00 AM)
              </p>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="mt-6 bg-card-grey border border-card-grey rounded-lg p-4">
          <h3 className="font-semibold text-text-primary mb-2">About Reminders</h3>
          <ul className="text-text-primary text-sm space-y-1">
            <li>• Reminders will be sent via push notifications</li>
            <li>• You can modify these settings anytime</li>
            <li>• Enable at least one reminder to receive notifications</li>
          </ul>
        </div>
      </div>

      <StickyCTAButton
        text="Save Reminders"
        onClick={handleSave}
        disabled={!isAnyReminderEnabled}
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

export default ReminderSettings;