
import { MockPaymentMethodDetails } from '../types';

// Mock Payment Service

export const createMockPaymentIntent = async (amount: number, currency: string = 'EUR'): Promise<{ clientSecret: string; amount: number; currency: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const clientSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;
  console.log(`PAYMENT_SERVICE: Mock PaymentIntent created. Amount: ${currency}${amount}, ClientSecret: ${clientSecret}`);
  
  return { clientSecret, amount, currency };
};

export const confirmMockPayment = async (
  clientSecret: string,
  paymentDetails: MockPaymentMethodDetails
): Promise<{ success: boolean; paymentIntentId?: string; error?: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log(`PAYMENT_SERVICE: Attempting to confirm payment for ClientSecret: ${clientSecret} with details:`, paymentDetails);

  // Basic mock validation (very simplified)
  if (!paymentDetails.cardholderName || !paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvc) {
    console.error("PAYMENT_SERVICE: Mock payment failed - Missing card details.");
    return { success: false, error: "Missing card details." };
  }
  if (paymentDetails.cardNumber.endsWith('0000')) { // Simulate a declined card
    console.warn("PAYMENT_SERVICE: Mock payment declined for card ending in 0000.");
    return { success: false, error: "Your card was declined (mock)." };
  }

  // Simulate successful payment
  const paymentIntentId = clientSecret.split('_secret_')[0]; // Extract ID part
  console.log(`PAYMENT_SERVICE: Mock payment successful for PaymentIntent: ${paymentIntentId}`);
  return { success: true, paymentIntentId };
};
