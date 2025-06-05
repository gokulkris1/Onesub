
import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Route } from '../types';

interface ResetPasswordPageProps {
  navigateTo: (page: Route) => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ navigateTo }) => {
  const { resetUserPassword, isLoading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Example: Extract token and email from URL query params if your routing supports it
  // This is a simplified version assuming user might type them or they are passed some other mock way
  useEffect(() => {
    // For a real app, you'd parse window.location.search or use a routing library
    // const queryParams = new URLSearchParams(window.location.search);
    // const urlToken = queryParams.get('token');
    // const urlEmail = queryParams.get('email');
    // if (urlToken) setToken(urlToken);
    // if (urlEmail) setEmail(urlEmail);
  }, []);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!email.trim() || !token.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
      setFormError("All fields are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setFormError("Please enter a valid email address.");
        return;
    }
    if (newPassword !== confirmNewPassword) {
      setFormError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setFormError("New password must be at least 6 characters long.");
      return;
    }

    try {
      await resetUserPassword(email, token, newPassword);
      setSuccessMessage("Password has been reset successfully! You can now log in with your new password.");
      setEmail('');
      setToken('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      if (!authError) setFormError(err.message || "Failed to reset password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-6 text-center">Reset Your Password</h2>
      
      {(authError && !formError && !successMessage) && (
        <div className="mb-4 p-3 bg-red-100 rounded-md text-center">
            <p className="text-sm text-red-700">{authError}</p>
        </div>
      )}
      {formError && !successMessage && (
        <div className="mb-4 p-3 bg-red-100 rounded-md text-center">
            <p className="text-sm text-red-700">{formError}</p>
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 rounded-md text-center">
            <p className="text-sm text-green-700">{successMessage}</p>
            <button 
                onClick={() => navigateTo('home')} // Or open login modal
                className="mt-2 text-sm text-blue-600 hover:text-blue-500 font-semibold"
            >
                Login Now
            </button>
        </div>
      )}

      {!successMessage && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              id="email" name="email" type="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full input-style" placeholder="Registered email address"
            />
          </div>
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-slate-700 mb-1">
              Reset Token (from email)
            </label>
            <input
              id="token" name="token" type="text" required
              value={token} onChange={(e) => setToken(e.target.value)}
              className="w-full input-style" placeholder="Enter the token you received"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <input
              id="newPassword" name="newPassword" type="password" required
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="w-full input-style" placeholder="••••••••"
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword" name="confirmNewPassword" type="password" required
              value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full input-style" placeholder="••••••••"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      )}
       <style>{`
        .input-style {
          padding: 0.625rem 1rem; 
          background-color: #f8fafc; 
          border: 1px solid #cbd5e1; 
          color: #0f172a; 
          border-radius: 0.375rem; 
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); 
        }
        .input-style:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          border-color: #3b82f6; 
          box-shadow: 0 0 0 2px #3b82f6; 
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordPage;
