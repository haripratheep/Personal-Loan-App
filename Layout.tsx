import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  title,
  children,
  showBackButton = true,
  rightAction,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-bg-light font-roboto">
      {/* Header */}
      <div className="bg-white-custom shadow-sm border-b border-card-grey">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="mr-3 p-2 hover:bg-card-grey rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-black-custom" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
          </div>
          {rightAction && (
            <div className="flex items-center">
              {rightAction}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        {children}
      </div>
    </div>
  );
};

export default Layout;