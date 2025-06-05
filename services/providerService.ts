
import * as notificationService from './notificationService';
import { ProviderStats, ProviderServiceInfo } from '../types';

// Mock data for provider dashboard - In a real app, this comes from a backend
const mockProviderServices: ProviderServiceInfo[] = [
  { id: 'service001', name: 'Premium Music Streaming Tier', participatingBundles: ['Ultimate Harmony Pack', 'Lifestyle Booster Pack'] },
  { id: 'service002', name: 'Ad-Free News Access', participatingBundles: ['Digital Explorer Kit'] },
];
const mockProviderStatsData: ProviderStats = {
  totalSubscribers: 123, // Example
  monthlyRevenueShare: 250.50, // Example
  popularBundles: [
    { name: 'Ultimate Harmony Pack', subscriberCount: 80 },
    { name: 'Lifestyle Booster Pack', subscriberCount: 43 },
  ],
};

export const getMockProviderDashboardData = async (providerId: string): Promise<{ services: ProviderServiceInfo[], stats: ProviderStats }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`PROVIDER_SERVICE: Fetching mock dashboard data for provider ${providerId}`);
  return {
    services: mockProviderServices, // Could be filtered/customized by providerId
    stats: mockProviderStatsData,    // Could be filtered/customized by providerId
  };
};

export const triggerProviderInwardPayment = (providerEmail: string | undefined, bundleName: string, amount: number, date: string): void => {
  notificationService.sendProviderInwardPaymentNotice(providerEmail, bundleName, amount, date);
};

export const triggerProviderUpcomingPayout = (providerEmail: string | undefined, amount: number, date: string): void => {
  notificationService.sendProviderUpcomingPayoutNotice(providerEmail, amount, date);
};
