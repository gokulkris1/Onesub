
import React, { useEffect } from 'react';
import { ToastMessage, useNotification } from '../contexts/NotificationContext';

interface ToastNotificationProps {
  toast: ToastMessage;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ toast }) => {
  const { removeToast } = useNotification();

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, removeToast]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        );
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const bgColorClass = {
    success: 'bg-green-50 border-green-300',
    error: 'bg-red-50 border-red-300',
    info: 'bg-blue-50 border-blue-300',
    warning: 'bg-yellow-50 border-yellow-300',
  }[toast.type];

  const textColorClass = {
    success: 'text-green-700',
    error: 'text-red-700',
    info: 'text-blue-700',
    warning: 'text-yellow-700',
  }[toast.type];

  return (
    <div
      role="alert"
      className={`w-full max-w-sm p-4 mb-3 rounded-lg shadow-lg border ${bgColorClass} flex items-start space-x-3 transition-all duration-300 ease-in-out transform opacity-100 translate-y-0 hover:shadow-xl`}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className={`flex-grow text-sm ${textColorClass}`}>
        {toast.message}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className={`ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg inline-flex h-8 w-8 ${textColorClass} hover:bg-opacity-20 focus:ring-2 focus:ring-offset-1 ${
            toast.type === 'success' ? 'hover:bg-green-100 focus:ring-green-400' :
            toast.type === 'error' ? 'hover:bg-red-100 focus:ring-red-400' :
            toast.type === 'info' ? 'hover:bg-blue-100 focus:ring-blue-400' :
            'hover:bg-yellow-100 focus:ring-yellow-400'
          }`}
        aria-label="Dismiss"
      >
        <span className="sr-only">Dismiss</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default ToastNotification;
