import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  type?: 'delete' | 'form' | 'alert' | 'info' | 'custom';
  extraStyle?: string;
  showCloseIcon?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  type = 'form',
  extraStyle,
  showCloseIcon = true,
  showHeader = true,
  showFooter,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  onConfirm
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const getTypeStyles = () => {
    switch (type) {
      case 'delete':
        return {
          bg: 'bg-red-600',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ),
          button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
      case 'alert':
        return {
          bg: 'bg-yellow-600',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-600',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        };
      case 'form':
        return {
          bg: 'bg-primary',
          iconBg: 'bg-primary-100',
          iconColor: 'text-primary-600',
          icon: null,
          button: 'bg-primary hover:bg-primary-700 focus:ring-primary-500'
        };
      default: // custom
        return {
          bg: extraStyle || 'bg-gray-600',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          icon: null,
          button: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
        };
    }
  };

  const typeStyles = getTypeStyles();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] overflow-y-auto bg-gray-700/30">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

        {/* Modal container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full"
        >
          {/* Header */}
          {showHeader && (
            <div className={`${typeStyles.bg} px-6 py-4 flex justify-between items-center`}>
              <h3 className="text-lg font-medium text-white">
                {title}
              </h3>
              
              {showCloseIcon && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-white hover:bg-black/10 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="bg-white px-6 py-4 text-start">
            {children}
          </div>

          {/* Footer - Only shown if showFooter is true or type is delete/alert */}
          {(showFooter || type === 'delete' || type === 'alert') && (
            <div className="bg-gray-50 px-6 py-4 flex justify-end items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "#f3f4f6" }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                {cancelText}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm || onClose}
                className={`px-5 py-2 text-sm font-medium text-white rounded-md transition-colors ${typeStyles.button}`}
              >
                {confirmText}
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Modal;