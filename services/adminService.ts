

import * as notificationService from './notificationService';
import { ProviderApplicationInfo, PlatformUserInfo, AdminProviderInfo, User } from '../types';
import { MOCK_USERS } from '../constants'; // For better user data source

// Mock Data - In a real app, this comes from a backend
const mockProviderAppsData: ProviderApplicationInfo[] = [
  { id: 'app001', businessName: 'StreamNow Global', contactEmail: 'apply@streamnow.com', status: 'pending', dateSubmitted: '2024-03-15' },
  { id: 'app002', businessName: 'FitApp Pro', contactEmail: 'partners@fitapp.co', status: 'approved', dateSubmitted: '2024-03-10' },
];

// Updated to derive from MOCK_USERS for better consistency
let mockPlatformUsersData: PlatformUserInfo[] = MOCK_USERS.map((user, index) => ({
  id: user.id,
  fullName: user.fullName || `User ${user.id}`,
  email: user.email,
  role: user.role as 'user' | 'provider' | 'admin',
  registrationDate: user.role === 'admin' ? '2023-01-01' : `2024-0${(index % 3) + 1}-${String((index % 28) + 1).padStart(2, '0')}`,
  lastLogin: `2024-03-${String((index % 10) + 10).padStart(2, '0')}`,
  status: user.status || 'active', // Use status from FullUserProfile
  creditsAvailable: user.creditsAvailable || 0, 
}));

let mockAdminProvidersData: AdminProviderInfo[] = MOCK_USERS
  .filter(user => user.role === 'provider')
  .map((providerUser, index) => ({
    id: providerUser.id,
    businessName: providerUser.businessName || `Provider Business ${index + 1}`,
    contactEmail: providerUser.email,
    serviceCount: (index % 3) + 1,
    status: providerUser.status || 'active', // Use status from FullUserProfile
  }));

export const getAllMockUsersFullProfile = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // Return a copy to prevent direct modification of MOCK_USERS by reference if components alter it
  return MOCK_USERS.map(user => ({...user}));
}

export const getMockProviderApplications = async (): Promise<ProviderApplicationInfo[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockProviderAppsData];
};

export const getMockPlatformUsers = async (): Promise<PlatformUserInfo[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // Refresh from MOCK_USERS in case statuses or other details changed by other admin actions
   mockPlatformUsersData = MOCK_USERS.map((user, index) => ({
    id: user.id,
    fullName: user.fullName || `User ${user.id}`,
    email: user.email,
    role: user.role as 'user' | 'provider' | 'admin',
    registrationDate: user.role === 'admin' ? '2023-01-01' : `2024-0${(index % 3) + 1}-${String((index % 28) + 1).padStart(2, '0')}`,
    lastLogin: `2024-03-${String((index % 10) + 10).padStart(2, '0')}`,
    status: user.status || 'active', // Get current status from MOCK_USERS (FullUserProfile)
    creditsAvailable: user.creditsAvailable || 0,
  }));
  return [...mockPlatformUsersData];
};

export const getMockApprovedProviders = async (): Promise<AdminProviderInfo[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
   mockAdminProvidersData = MOCK_USERS
    .filter(user => user.role === 'provider')
    .map((providerUser, index) => ({
      id: providerUser.id,
      businessName: providerUser.businessName || `Provider Business ${index + 1}`,
      contactEmail: providerUser.email,
      serviceCount: (index % 3) + 1,
      status: providerUser.status || 'active', // Get current status from MOCK_USERS (FullUserProfile)
    }));
  return [...mockAdminProvidersData];
};

interface NewProviderData {
    businessName: string;
    contactEmail: string;
    taxId: string;
    street: string;
    city: string;
    serviceTypes: string;
}

export const onboardNewProvider = async (newProviderData: NewProviderData, adminEmail: string): Promise<ProviderApplicationInfo> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('ADMIN_SERVICE: Simulating onboarding for provider:', newProviderData.businessName);
  
  notificationService.sendProviderWelcomeEmail(newProviderData.contactEmail, newProviderData.businessName);
  notificationService.sendAdminProviderOnboardedAlert(adminEmail, newProviderData.businessName);

  const mockApplication: ProviderApplicationInfo = {
    id: `app_${Date.now()}`,
    businessName: newProviderData.businessName,
    contactEmail: newProviderData.contactEmail,
    status: 'approved', 
    dateSubmitted: new Date().toISOString().split('T')[0],
  };
  mockProviderAppsData.push(mockApplication); 
   if (mockApplication.status === 'approved') {
    const newProviderUser: User = {
        id: `provider_new_${Date.now()}`,
        email: newProviderData.contactEmail,
        password: `DefaultPass!${Date.now().toString().slice(-4)}`, // Mock password
        role: 'provider',
        fullName: newProviderData.businessName, // Or a contact person
        businessName: newProviderData.businessName,
        isVerified: true, // Auto-verify for admin onboarded
        status: 'active', // New providers are active
        activeSubscriptions: null,
        subscriptionStatus: 'none',
        totalCreditsEarned: 0,
        creditsAvailable: 0,
        creditsRedeemed: 0,
    };
    MOCK_USERS.push(newProviderUser); // Add to main MOCK_USERS list

    mockAdminProvidersData.push({
      id: newProviderUser.id, 
      businessName: newProviderData.businessName,
      contactEmail: newProviderData.contactEmail,
      serviceCount: 0, 
      status: 'active',
    });
  }
  return mockApplication;
};

export const getMockAdminOverviewMetrics = async (): Promise<{
  totalUsers: number;
  totalActiveProviders: number;
  totalActiveSubscriptions: number;
  mockMRR: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  let totalSubs = 0;
  MOCK_USERS.forEach(u => {
      if(u.activeSubscriptions) totalSubs += u.activeSubscriptions.filter(s => s.status === 'active').length;
  });
  const mrr = MOCK_USERS.reduce((acc, user) => {
    if (user.activeSubscriptions) {
      user.activeSubscriptions.forEach(sub => {
        if (sub.status === 'active') {
          acc += sub.cycle === 'monthly' ? sub.pricePaid : sub.pricePaid / 12;
        }
      });
    }
    return acc;
  }, 0);

  return {
    totalUsers: MOCK_USERS.filter(u => u.role === 'user' || u.role === 'provider').length,
    totalActiveProviders: MOCK_USERS.filter(p => p.role === 'provider' && p.status !== 'suspended').length, 
    totalActiveSubscriptions: totalSubs,
    mockMRR: parseFloat(mrr.toFixed(2)),
  };
};

const updateUserStatusInMockUsers = (userId: string, newStatus: 'active' | 'suspended'): User | null => {
  const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    MOCK_USERS[userIndex].status = newStatus; 
    return MOCK_USERS[userIndex];
  }
  return null;
};


export const suspendUser = async (userId: string, adminUserEmail: string): Promise<PlatformUserInfo> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = updateUserStatusInMockUsers(userId, 'suspended');
  if (!user) throw new Error("User not found");
  notificationService.sendUserSuspendedEmail(user.email, user.fullName || user.email);
  notificationService.sendAdminUserStatusChangeAlert(adminUserEmail, user.email, user.fullName || user.email, 'suspended');
  // Return PlatformUserInfo compatible object
  return {
    id: user.id,
    fullName: user.fullName || `User ${user.id}`,
    email: user.email,
    role: user.role as 'user' | 'provider' | 'admin',
    registrationDate: user.role === 'admin' ? '2023-01-01' : `2024-01-01`, // Use actual or better mock
    status: user.status as 'active' | 'suspended', // Safe now as User has status
    creditsAvailable: user.creditsAvailable || 0,
  };
};

export const activateUser = async (userId: string, adminUserEmail: string): Promise<PlatformUserInfo> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = updateUserStatusInMockUsers(userId, 'active');
  if (!user) throw new Error("User not found");
  notificationService.sendUserActivatedEmail(user.email, user.fullName || user.email);
  notificationService.sendAdminUserStatusChangeAlert(adminUserEmail, user.email, user.fullName || user.email, 'activated');
  return {
    id: user.id,
    fullName: user.fullName || `User ${user.id}`,
    email: user.email,
    role: user.role as 'user' | 'provider' | 'admin',
    registrationDate: user.role === 'admin' ? '2023-01-01' : `2024-01-01`,
    status: user.status as 'active' | 'suspended', // Safe now
    creditsAvailable: user.creditsAvailable || 0,
  };
};

export const suspendProvider = async (providerId: string, adminUserEmail: string): Promise<AdminProviderInfo> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const providerUser = updateUserStatusInMockUsers(providerId, 'suspended'); // Provider is also a user
  if (!providerUser || providerUser.role !== 'provider') throw new Error("Provider user not found");

  const providerAdminInfoIndex = mockAdminProvidersData.findIndex(p => p.id === providerId);
  if (providerAdminInfoIndex === -1) throw new Error("Provider admin info not found");
  
  mockAdminProvidersData[providerAdminInfoIndex].status = 'suspended';
  
  notificationService.sendProviderSuspendedEmail(providerUser.email, providerUser.businessName || providerUser.email);
  notificationService.sendAdminProviderStatusChangeAlert(adminUserEmail, providerUser.email, providerUser.businessName || providerUser.email, 'suspended');
  return mockAdminProvidersData[providerAdminInfoIndex];
};

export const activateProvider = async (providerId: string, adminUserEmail: string): Promise<AdminProviderInfo> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const providerUser = updateUserStatusInMockUsers(providerId, 'active');
  if (!providerUser || providerUser.role !== 'provider') throw new Error("Provider user not found");

  const providerAdminInfoIndex = mockAdminProvidersData.findIndex(p => p.id === providerId);
   if (providerAdminInfoIndex === -1) throw new Error("Provider admin info not found");

  mockAdminProvidersData[providerAdminInfoIndex].status = 'active';

  notificationService.sendProviderActivatedEmail(providerUser.email, providerUser.businessName || providerUser.email);
  notificationService.sendAdminProviderStatusChangeAlert(adminUserEmail, providerUser.email, providerUser.businessName || providerUser.email, 'activated');
  return mockAdminProvidersData[providerAdminInfoIndex];
};