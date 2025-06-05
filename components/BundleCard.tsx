
import React from 'react';
import { Bundle } from '../types';
import { formatCurrency } from '../utils';
import ServiceItem from './ServiceItem';
import { SparklesIcon } from '../constants';
import { useAuth } from '../contexts/AuthContext';


interface BundleCardProps {
  bundle: Bundle;
  onChooseBundle: (bundle: Bundle) => void; // For logged-in users
  onOpenAuthModal: (type: 'login' | 'signup') => void; // For logged-out users
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle, onChooseBundle, onOpenAuthModal }) => {
  const { currentUser } = useAuth();
  const originalTotalPrice = bundle.services.reduce((sum, service) => sum + service.originalPrice, 0);
  const savings = originalTotalPrice - bundle.bundlePrice;
  const savingsPercentage = originalTotalPrice > 0 ? (savings / originalTotalPrice) * 100 : 0;

  const defaultAccentColor = 'blue-600';
  const defaultBorderColor = `border-${defaultAccentColor}`;
  const defaultRingColor = `ring-${defaultAccentColor}`;
  const defaultBgColor = `bg-${defaultAccentColor}`;
  const defaultTextAccent = `text-red-600`; // Adjusted for better visibility if themeColor is light

  const cardBaseClasses = "relative flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 h-full";
  const highlightClasses = bundle.highlight 
    ? `border-4 ${bundle.themeColor || defaultBorderColor} ring-4 ring-offset-white ring-offset-2 ${bundle.themeColor ? bundle.themeColor.replace('border-', 'ring-') : defaultRingColor}` 
    : `border border-slate-200`;
  
  const buttonBaseBg = bundle.themeColor ? bundle.themeColor.replace('border-', 'bg-') : defaultBgColor;
  const buttonHoverBg = bundle.themeColor 
    ? bundle.themeColor.replace('border-', 'bg-').replace(/\d00$/, (match) => `${Math.min(9, parseInt(match, 10) / 100 + 1)}00`) // Darken slightly
    : defaultBgColor.replace(/\d00$/, (match) => `${Math.min(9, parseInt(match, 10) / 100 + 1)}00`);


  const badgeBgColor = bundle.highlight 
    ? (bundle.themeColor ? bundle.themeColor.replace('border-','bg-') : defaultBgColor) 
    : 'bg-red-500'; // Kept red for badge

  const cardHeaderBg = bundle.themeColor 
    ? bundle.themeColor.replace('border-', 'bg-').replace(/\d00$/, (match) => { // make it lighter for header
        const currentStrength = parseInt(match, 10);
        return currentStrength > 300 ? `${Math.max(1, currentStrength / 100 - 2)}00` : `${Math.max(1, currentStrength / 100 - 1)}00`;
      })
    : 'bg-slate-100'; 
    
  const priceTextColor = bundle.themeColor 
    ? bundle.themeColor.replace('border-', 'text-').replace(/-\d+$/, (match) => `${Math.min(900, parseInt(match.slice(1), 10) + 200)}`) // Darken if themed
    : defaultTextAccent;

  const handleChooseBundleClick = () => {
    if (currentUser) {
      onChooseBundle(bundle);
    } else {
      onOpenAuthModal('login');
    }
  };

  return (
    <div className={`${cardBaseClasses} ${highlightClasses}`}>
      {bundle.badge && (
        <div className={`absolute top-0 right-0 mt-3 mr-3 px-3 py-1 text-xs font-semibold text-white ${badgeBgColor} rounded-full shadow-md z-10 flex items-center`}>
          {bundle.highlight && <SparklesIcon className="w-4 h-4 mr-1 text-white"/>}
          {bundle.badge}
        </div>
      )}
      
      <div className={`p-6 ${cardHeaderBg} bg-opacity-30`}>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{bundle.name}</h3>
        <p className="text-sm text-slate-600 mb-4 min-h-[3.5rem]">{bundle.description}</p>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div> 
            <h4 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">What's Included:</h4>
            <ul className="space-y-1 mb-6">
            {bundle.services.map(service => (
                <ServiceItem key={service.id} service={service} />
            ))}
            </ul>

            <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-slate-500">Original Total:</span>
                    <span className="text-lg line-through text-slate-400">{formatCurrency(originalTotalPrice)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className={`text-xl font-semibold ${priceTextColor}`}>Bundle Price:</span>
                    <span className={`text-3xl font-extrabold ${priceTextColor}`}>
                    {formatCurrency(bundle.bundlePrice)}
                    </span>
                    <span className="text-sm text-slate-500">/ month</span>
                </div>
                
                {savings > 0 && (
                    <div className={`text-center p-3 rounded-lg bg-green-100 mb-6`}>
                    <p className="font-semibold text-green-700">
                        You Save {formatCurrency(savings)} ({savingsPercentage.toFixed(0)}%)
                    </p>
                    </div>
                )}
            </div>
        </div>
      
        <div className="mt-auto pt-6">
            <button 
            onClick={handleChooseBundleClick}
            className={`w-full ${buttonBaseBg} hover:${buttonHoverBg} text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${bundle.themeColor ? bundle.themeColor.replace('border-', 'focus:ring-') : `focus:ring-${defaultAccentColor}`}`}
            >
            Choose This Bundle
            </button>
        </div>
      </div>
    </div>
  );
};

export default BundleCard;