
import React, { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Route } from '../types';

interface ForgotPasswordPageProps {
  navigateTo: (page: Route) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ navigateTo }) => {
  const { requestPasswordResetLink, isLoading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setFormError("Email address is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    try {
      await requestPasswordResetLink(email);
      setSuccessMessage("If an account exists for this email, a password reset link has been sent. (This is a mock process).");
      setEmail(''); // Clear field
    } catch (err: any) {
      // AuthError from context should display, but set formError for specific issues if needed
      if (!authError) setFormError(err.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-6 text-center">Forgot Password</h2>
      <p className="text-sm text-slate-600 mb-6 text-center">
        Enter your email address and we'll send you a (mock) link to reset your password.
      </p>

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
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <button
          onClick={() => navigateTo('home')} // Or login modal
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          Back to Login/Home
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
