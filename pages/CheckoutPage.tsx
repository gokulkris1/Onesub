

import React, { useState, useEffect, FormEvent, Dispatch, SetStateAction } from 'react';
import { Bundle, MockPaymentMethodDetails, Route } from '../types';
import { formatCurrency } from '../utils';
import ServiceItem from '../components/ServiceItem';
import { useAuth } from '../contexts/AuthContext';
import * as paymentService from '../services/paymentService'; 
import { formatCredits } from '../services/creditService';

interface CheckoutPageProps {
  bundle: Bundle;
  onConfirmSubscription: (cycle: 'monthly' | 'annually', pricePaid: number) => Promise<void>;
  navigateTo: (page: Route) => void;
  setLastPaymentError: Dispatch<SetStateAction<string | null>>;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ bundle, onConfirmSubscription, navigateTo, setLastPaymentError }) => {
  const { currentUser, applyCreditsAtCheckout, isLoading: authIsLoading, error: authError } = useAuth();
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'annually'>('monthly');
  const [basePrice, setBasePrice] = useState<number>(bundle.bundlePrice); // Price before credits
  const [effectiveMonthlyPrice, setEffectiveMonthlyPrice] = useState<number | null>(null);
  
  const [paymentIsProcessing, setPaymentIsProcessing] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [mockClientSecret, setMockClientSecret] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<MockPaymentMethodDetails>({
    cardholderName: currentUser?.fullName || '',
    cardNumber: '',
    expiryDate: '', 
    cvc: '',
  });

  const [creditsToApply, setCreditsToApply] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(bundle.bundlePrice);

  useEffect(() => {
    let currentBasePrice = 0;
    if (selectedCycle === 'annually' && bundle.annualPriceMultiplier) {
      currentBasePrice = bundle.bundlePrice * 12 * bundle.annualPriceMultiplier;
      setEffectiveMonthlyPrice(currentBasePrice / 12);
    } else if (selectedCycle === 'annually') { 
      currentBasePrice = bundle.bundlePrice * 12;
      setEffectiveMonthlyPrice(bundle.bundlePrice);
    } else { 
      currentBasePrice = bundle.bundlePrice;
      setEffectiveMonthlyPrice(null);
    }
    setBasePrice(currentBasePrice);
  }, [selectedCycle, bundle]);

  useEffect(() => {
    // Recalculate final price when basePrice or creditsToApply changes
    const priceAfterCredits = Math.max(0, basePrice - creditsToApply);
    setFinalPrice(parseFloat(priceAfterCredits.toFixed(2)));
  }, [basePrice, creditsToApply]);


  useEffect(() => {
    // Create payment intent whenever the final price changes
    // (This would typically happen on the server side after final amount is known)
    const createIntent = async () => {
        setPaymentIsProcessing(true);
        setPaymentError(null);
        try {
            // In a real scenario, the intent amount should be the finalPrice.
            // For mock, we're creating it with the current finalPrice.
            const intent = await paymentService.createMockPaymentIntent(finalPrice, 'EUR'); 
            setMockClientSecret(intent.clientSecret);
        } catch (err: any) {
            setPaymentError(err.message || "Failed to initialize payment.");
        } finally {
            setPaymentIsProcessing(false);
        }
    };
    if (finalPrice > 0 || (finalPrice === 0 && basePrice > 0) ) { // Only create intent if there's a price or if credits cover full price
       createIntent();
    } else if (finalPrice === 0 && basePrice === 0) {
       setMockClientSecret(null); // No payment needed for free bundle
    }
  }, [finalPrice, basePrice]);

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentError(null); 
    let { name, value } = e.target;
    if (name === 'cardNumber') {
        value = value.replace(/\D/g, '').slice(0, 16); 
    } else if (name === 'expiryDate') {
        value = value.replace(/\D/g, '').slice(0, 4); 
        if (value.length > 2) {
            value = value.slice(0,2) + '/' + value.slice(2);
        }
    } else if (name === 'cvc') {
        value = value.replace(/\D/g, '').slice(0, 4); 
    }
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateCardDetails = (): boolean => {
    if (finalPrice === 0 && creditsToApply >= basePrice) return true; // No card details needed if fully paid by credits
    if (!cardDetails.cardholderName.trim()) { setPaymentError("Cardholder name is required."); return false; }
    if (cardDetails.cardNumber.length < 13 || cardDetails.cardNumber.length > 16) { setPaymentError("Invalid card number length."); return false; }
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) { setPaymentError("Expiry date must be MM/YY."); return false; }
    const [month, year] = cardDetails.expiryDate.split('/');
    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt(`20${year}`, 10);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (expiryMonth < 1 || expiryMonth > 12) { setPaymentError("Invalid expiry month."); return false;}
    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) { setPaymentError("Card has expired."); return false; }
    if (cardDetails.cvc.length < 3 || cardDetails.cvc.length > 4) { setPaymentError("Invalid CVC length."); return false; }
    return true;
  };

  const handleConfirm = async (e: FormEvent) => {
    e.preventDefault();
    // If finalPrice is 0 due to credits, paymentIntent might not be needed / different flow
    if (finalPrice > 0 && !mockClientSecret) {
        setPaymentError("Payment not initialized. Please wait or refresh.");
        return;
    }
    if (!validateCardDetails()) return;

    setPaymentIsProcessing(true);
    setPaymentError(null);
    try {
      let paymentSuccessful = false;
      if (finalPrice === 0 && creditsToApply >= basePrice) { // Fully paid by credits
          paymentSuccessful = true;
      } else if (finalPrice > 0 && mockClientSecret) { // Normal payment
          const paymentResult = await paymentService.confirmMockPayment(mockClientSecret, cardDetails);
          if (paymentResult.success) {
            paymentSuccessful = true;
          } else {
            const errorMessage = paymentResult.error || "Payment failed. Please check your details and try again.";
            setPaymentError(errorMessage); 
            setLastPaymentError(errorMessage);
            navigateTo('payment-failure');
          }
      } else if (finalPrice === 0 && basePrice === 0) { // Free bundle
          paymentSuccessful = true;
      }


      if (paymentSuccessful) {
        if (creditsToApply > 0) {
            await applyCreditsAtCheckout(creditsToApply);
        }
        await onConfirmSubscription(selectedCycle, finalPrice); // Pass final price paid
        navigateTo('payment-success'); 
      }
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred during payment processing.";
      setPaymentError(errorMessage); 
      setLastPaymentError(errorMessage);
      navigateTo('payment-failure');
    } finally {
      setPaymentIsProcessing(false);
    }
  };

  const handleCreditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0) value = 0;
    const maxApplicable = Math.min(currentUser?.creditsAvailable || 0, basePrice);
    value = Math.min(value, maxApplicable);
    setCreditsToApply(parseFloat(value.toFixed(2)));
  };

  const applyMaxCredits = () => {
    const maxApplicable = Math.min(currentUser?.creditsAvailable || 0, basePrice);
    setCreditsToApply(parseFloat(maxApplicable.toFixed(2)));
  };

  const originalTotalPrice = bundle.services.reduce((sum, service) => sum + service.originalPrice, 0);
  const monthlySavings = originalTotalPrice - bundle.bundlePrice;

  return (
    <form onSubmit={handleConfirm} className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-6 text-center border-b border-slate-200 pb-4">
        Confirm Your Subscription
      </h2>
      
      <div className="mb-6 p-6 bg-slate-50 rounded-lg">
        <h3 className="text-2xl font-bold text-blue-600 mb-3">{bundle.name}</h3>
        <p className="text-sm text-slate-600 mb-4">{bundle.description}</p>
        
        <h4 className="text-md font-semibold text-slate-700 mb-2">Services Included:</h4>
        <ul className="space-y-1 mb-4">
          {bundle.services.map(service => (
            <ServiceItem key={service.id} service={service} />
          ))}
        </ul>
      </div>

      <div className="mb-6 p-6 bg-slate-50 rounded-lg">
        <h4 className="text-lg font-semibold text-slate-800 mb-3">Choose Billing Cycle:</h4>
        <div className="flex space-x-4 mb-4">
          {['monthly', 'annually'].map((cycle) => (
            <button
              key={cycle}
              type="button"
              onClick={() => setSelectedCycle(cycle as 'monthly' | 'annually')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all
                ${selectedCycle === cycle 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
            >
              {cycle === 'monthly' ? 'Monthly' : `Annually ${bundle.annualPriceMultiplier && bundle.annualPriceMultiplier < 1 ? `(Save ${((1 - bundle.annualPriceMultiplier) * 100).toFixed(0)}%)` : ''}`}
            </button>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-4 mt-4">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-slate-600">Original Monthly Total:</span>
            <span className="text-lg line-through text-slate-500">{formatCurrency(originalTotalPrice)}</span>
          </div>
           <div className="flex justify-between items-baseline mb-1">
            <span className="text-slate-600">Monthly Bundle Price:</span>
            <span className="text-lg text-slate-700">{formatCurrency(bundle.bundlePrice)}</span>
          </div>
          {effectiveMonthlyPrice && selectedCycle === 'annually' && (
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-slate-600">Effective Monthly (Annual Plan):</span>
              <span className="text-lg text-green-600">{formatCurrency(effectiveMonthlyPrice)}</span>
            </div>
          )}
           <div className="flex justify-between items-baseline my-2">
            <span className="text-slate-600">
              {selectedCycle === 'monthly' ? 'Base Price Today:' : 'Base Price for 1 Year:'}
            </span>
            <span className="text-xl text-slate-700">
              {formatCurrency(basePrice)}
            </span>
          </div>
          {monthlySavings > 0 && (
            <p className="text-md font-semibold text-green-700 text-right">
              Monthly Saving: {formatCurrency(monthlySavings)}!
            </p>
          )}
        </div>
      </div>

      {/* Credit Redemption Section */}
      {(currentUser?.creditsAvailable ?? 0) > 0 && (
        <div className="mb-6 p-6 bg-emerald-50 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-emerald-700 mb-3">Apply Your OneSub Credits</h4>
            <p className="text-sm text-emerald-600 mb-2">You have <span className="font-bold">{formatCredits(currentUser?.creditsAvailable)}</span> available.</p>
            <div className="flex items-center space-x-3">
                <label htmlFor="creditsToApply" className="text-sm text-emerald-700">Apply Credits:</label>
                <input 
                    type="number" 
                    id="creditsToApply"
                    name="creditsToApply"
                    value={creditsToApply}
                    onChange={handleCreditInputChange}
                    min="0"
                    max={Math.min(currentUser?.creditsAvailable || 0, basePrice)}
                    step="0.01"
                    className="w-28 p-2 border border-emerald-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button 
                    type="button"
                    onClick={applyMaxCredits}
                    className="px-3 py-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-md transition-colors"
                >
                    Apply Max
                </button>
            </div>
            {creditsToApply > 0 && (
                 <p className="text-sm text-emerald-700 mt-2 font-semibold">
                    Discount from Credits: -{formatCurrency(creditsToApply)}
                </p>
            )}
        </div>
      )}

      <div className="flex justify-between items-center my-4 p-4 bg-slate-100 rounded-lg">
        <span className="text-xl font-semibold text-green-600">
            Final Amount Due Today:
        </span>
        <span className="text-3xl font-extrabold text-green-600">
            {formatCurrency(finalPrice)}
        </span>
      </div>


      {finalPrice > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 text-center">Payment Details</h3>
            <div className="p-6 bg-slate-100 rounded-lg space-y-4">
                <div>
                    <label htmlFor="cardholderName" className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name</label>
                    <input type="text" name="cardholderName" id="cardholderName" value={cardDetails.cardholderName} onChange={handleCardDetailsChange} className="w-full checkout-input-style" required={finalPrice > 0} />
                </div>
                <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                    <input type="text" name="cardNumber" id="cardNumber" value={cardDetails.cardNumber} onChange={handleCardDetailsChange} className="w-full checkout-input-style" placeholder="•••• •••• •••• ••••" required={finalPrice > 0} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-700 mb-1">Expiry Date (MM/YY)</label>
                        <input type="text" name="expiryDate" id="expiryDate" value={cardDetails.expiryDate} onChange={handleCardDetailsChange} className="w-full checkout-input-style" placeholder="MM/YY" required={finalPrice > 0} />
                    </div>
                    <div>
                        <label htmlFor="cvc" className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                        <input type="text" name="cvc" id="cvc" value={cardDetails.cvc} onChange={handleCardDetailsChange} className="w-full checkout-input-style" placeholder="123" required={finalPrice > 0} />
                    </div>
                </div>
                {finalPrice > 0 && !mockClientSecret && !paymentIsProcessing && <p className="text-sm text-yellow-600">Initializing payment gateway...</p>}
            </div>
          </div>
      )}

      {(paymentError || (!paymentError && authError && !paymentIsProcessing) ) && (
          <div className="mb-4 p-3 bg-red-100 rounded-md text-center">
            <p className="text-sm text-red-700">{paymentError || authError}</p>
          </div>
      )}

      <button
        type="submit"
        disabled={authIsLoading || paymentIsProcessing || (finalPrice > 0 && !mockClientSecret)}
        className={`w-full ${bundle.themeColor ? bundle.themeColor.replace('border-', 'bg-') : 'bg-blue-600'} 
                    hover:${bundle.themeColor ? bundle.themeColor.replace('border-', 'bg-').replace(/\d00$/, (match) => `${Math.min(9, parseInt(match, 10) / 100 + 1)}00`) : 'hover:bg-blue-700'} 
                    text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white 
                    ${bundle.themeColor ? bundle.themeColor.replace('border-', 'focus:ring-') : 'focus:ring-blue-500'}
                    disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {(authIsLoading || paymentIsProcessing) ? (
          <svg className="animate-spin mx-auto h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : `Confirm & Pay ${formatCurrency(finalPrice)} ${selectedCycle === 'annually' ? ' (Annual)' : '(Monthly)'}`}
      </button>
      <p className="text-xs text-slate-500 mt-4 text-center">
        By clicking "Confirm & Pay", you agree to OneSub's Terms of Service and Privacy Policy.
        (This is a mock action and uses mock card details).
      </p>
      <style>{`
        .checkout-input-style {
          padding: 0.625rem 1rem; 
          background-color: #f8fafc; /* slate-50 */
          border: 1px solid #cbd5e1; /* slate-300 */
          color: #0f172a; /* slate-900 */
          border-radius: 0.375rem; /* rounded-md */
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
        }
        .checkout-input-style:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          border-color: #3b82f6; /* blue-500 */
          box-shadow: 0 0 0 2px #3b82f6; /* ring-2 ring-blue-500 */
        }
      `}</style>
    </form>
  );
};

export default CheckoutPage;