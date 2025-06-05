
import * as notificationService from './notificationService';

interface MockBillingHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
}

// Simulate fetching billing history
export const getMockBillingHistory = async (userId: string): Promise<MockBillingHistoryItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real app, this would fetch data from a backend API based on userId
  // For now, return a static mock list or generate dynamically based on user's subscriptions
  console.log(`BILLING_SERVICE: Fetching mock billing history for user ${userId}`);
  return [
    { id: 'bill_001', date: '2024-03-01', description: 'Ultimate Harmony Pack (Monthly)', amount: 30.00, status: 'Paid' },
    { id: 'bill_002', date: '2024-02-01', description: 'Ultimate Harmony Pack (Monthly)', amount: 30.00, status: 'Paid' },
    { id: 'bill_003', date: '2024-01-15', description: 'Digital Explorer Kit (Annual)', amount: 237.60, status: 'Paid' }, // 22 * 12 * 0.9
  ];
};

// Simulate triggering payment reminder notification
export const triggerPaymentReminder = (userEmail: string, bundleName: string, amount: number, dueDate: string): void => {
  notificationService.sendPaymentReminder(userEmail, bundleName, amount, dueDate);
};

// Simulate triggering payment receipt notification
export const triggerPaymentReceipt = (userEmail: string, bundleName: string, amount: number, paymentDate: string): void => {
  notificationService.sendPaymentReceipt(userEmail, bundleName, amount, paymentDate);
};
