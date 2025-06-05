
import React from 'react';
import { Route } from '../types';

interface CookieBannerProps {
  onAccept: () => void;
  navigateTo: (page: Route) => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept, navigateTo }) => {
  const handlePrivacyPolicyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigateTo('privacy');
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 shadow-lg z-50 transform transition-transform duration-500 ease-out translate-y-0"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm mb-3 sm:mb-0 sm:mr-4">
          We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
          By clicking "Accept", you consent to our use of cookies. 
          Please review our <a href="#" onClick={handlePrivacyPolicyClick} className="underline hover:text-slate-300">Privacy Policy</a> for more details.
        </p>
        <button
          onClick={onAccept}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors text-sm flex-shrink-0"
          aria-label="Accept cookies"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
