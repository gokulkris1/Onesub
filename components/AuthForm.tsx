
import React, { useState, FormEvent } from 'react';
import { Route } from '../types'; // For navigateTo prop

interface AuthFormProps {
  formType: 'login' | 'signup';
  onSubmit: (credentials: { email: string; password: string; isProviderLogin?: boolean }) => Promise<any>; // any to allow signup to return User
  isLoading: boolean;
  error: string | null;
  onSuccessSignup?: (email: string) => Promise<void>; // For mock verification
  navigateTo?: (page: Route) => void; // For forgot password
}

const AuthForm: React.FC<AuthFormProps> = ({ formType, onSubmit, isLoading, error, onSuccessSignup, navigateTo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProviderLogin, setIsProviderLogin] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [signupSuccessEmail, setSignupSuccessEmail] = useState<string | null>(null);


  const title = formType === 'login' ? 'Welcome Back!' : 'Create Your Account';
  const buttonText = formType === 'login' ? 'Login' : 'Sign Up';
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null); 
    setSignupSuccessEmail(null);
    if (!email.trim() || !password.trim()) {
        setFormError("Email and password cannot be empty.");
        return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setFormError("Please enter a valid email address.");
        return;
    }
    if (password.length < 6) {
        setFormError("Password must be at least 6 characters long.");
        return;
    }
    
    try {
        const result = await onSubmit({ email, password, isProviderLogin: formType === 'login' ? isProviderLogin : undefined });
        if (formType === 'signup' && result && result.email) { // Check if signup returned new user
            setSignupSuccessEmail(result.email); // Show verification prompt
        }
    } catch (err: any) {
        // Error prop from AuthContext should cover this
        if (!error) { 
             setFormError(err.message || "An unexpected error occurred.");
        }
    }
  };
  
  const handleForgotPasswordClick = () => {
    if (navigateTo) {
        navigateTo('forgot-password');
    }
  };

  const handleMockVerifyClick = async () => {
    if (signupSuccessEmail && onSuccessSignup) {
        try {
            await onSuccessSignup(signupSuccessEmail);
            // Message about successful verification can be shown in App.tsx after modal closes
            setSignupSuccessEmail(null); // Clear this state
        } catch (verificationError: any) {
            setFormError(verificationError.message || "Mock verification failed.");
        }
    }
  };


  const testUserCredentials = "Test User: amurphy1@example.ie / UserPass01!";
  const testProviderCredentials = "Test Provider: streamtast1@provider.example.com / ProviderPass01!";
  const signupHint = "Sign up with any new email and a password of at least 6 characters.";


  if (signupSuccessEmail) {
    return (
        <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-slate-800">Verify Your Email</h2>
            <p className="text-sm text-slate-600">
                A verification email has been sent to <span className="font-semibold">{signupSuccessEmail}</span>.
                Please check your inbox. (This is a mock process).
            </p>
            <button
                onClick={handleMockVerifyClick}
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-green-500 disabled:opacity-50 transition-colors"
            >
                {isLoading ? 'Verifying...' : 'Mock: Click Here to Verify Now'}
            </button>
            { (error || formError) && (
                <div className="p-2 bg-red-100 rounded-md">
                    <p className="text-xs text-red-700">{error || formError}</p>
                </div>
            )}
        </div>
    );
  }


  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-slate-800">{title}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email address
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
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
            </label>
            {formType === 'login' && navigateTo && (
                <button 
                    type="button" 
                    onClick={handleForgotPasswordClick}
                    className="text-xs text-blue-600 hover:text-blue-500 font-medium"
                >
                    Forgot password?
                </button>
            )}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={formType === 'login' ? 'current-password' : 'new-password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        {formType === 'login' && (
          <div className="flex items-center">
            <input
              id="isProviderLogin"
              name="isProviderLogin"
              type="checkbox"
              checked={isProviderLogin}
              onChange={(e) => setIsProviderLogin(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isProviderLogin" className="ml-2 block text-sm text-slate-700">
              Log in as Provider
            </label>
          </div>
        )}
        
        {(error || formError) && (
          <div className="p-3 bg-red-100 rounded-md text-center">
            <p className="text-sm text-red-700">{error || formError}</p>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : buttonText}
          </button>
        </div>
      </form>
      
       <div className="text-center mt-2">
        <p className="text-xs text-slate-500">
            {formType === 'login' ?
              (isProviderLogin ? testProviderCredentials : testUserCredentials)
              : signupHint
            }
        </p>
       </div>
    </div>
  );
};

export default AuthForm;
