
import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import ToastNotification from './ToastNotification';

const ToastContainer: React.FC = () => {
  const { toasts } = useNotification();

  if (!toasts.length) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end sm:justify-start z-[100]" // High z-index
    >
      <div className="w-full max-w-sm space-y-3">
        {toasts.map(toast => (
          <ToastNotification key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
