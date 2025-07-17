import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all" style={{ backgroundColor: '#FFFFFF' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid #E6E6E6' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#231917' }}>{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors hover:opacity-80"
            style={{ backgroundColor: '#E6E6E6' }}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" style={{ color: '#3D3D3D' }} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <p className="mb-6" style={{ color: '#3D3D3D' }}>{message}</p>
          
          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium"
              style={{ backgroundColor: '#E6E6E6', color: '#3D3D3D' }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg font-medium"
              style={{ backgroundColor: '#3D3D3D', color: '#FFFFFF' }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;