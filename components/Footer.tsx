import React from 'react';
import NewsletterSignup from './NewsletterSignup';
import { Route } from '../types';

interface FooterProps {
  navigateTo: (page: Route) => void;
}

const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  
  const handleLinkClick = (page: Route) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigateTo(page);
  };

  return (
    <footer className="py-12 mt-16 bg-slate-100 border-t border-slate-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h5 className="font-semibold text-slate-800 mb-3">OneSub</h5>
            <p className="text-sm text-slate-600">
              Saving you money, one bundle at a time. Discover curated subscription bundles.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800 mb-3">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" onClick={handleLinkClick('home')} className="text-slate-600 hover:text-blue-600 transition-colors">Home</a></li>
              <li><a href="#" onClick={handleLinkClick('contact')} className="text-slate-600 hover:text-blue-600 transition-colors">Contact Us</a></li>
              {/* Add more links as needed, e.g., About Us, FAQ */}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800 mb-3">Legal</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" onClick={handleLinkClick('terms')} className="text-slate-600 hover:text-blue-600 transition-colors">Terms & Conditions</a></li>
              <li><a href="#" onClick={handleLinkClick('privacy')} className="text-slate-600 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mb-8 pt-8 border-t border-slate-300">
          <NewsletterSignup />
        </div>

        <div className="text-center text-slate-600 border-t border-slate-300 pt-8">
          <p>&copy; {new Date().getFullYear()} OneSub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;