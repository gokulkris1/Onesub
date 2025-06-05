

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, FullUserProfile, ActiveSubscription, Bundle as BundleType, PlatformUserInfo, AdminProviderInfo, Perk, UserPerkStatus } from '../types';
import { MOCK_USERS, BUNDLES_DATA, MOCK_PERKS_CATALOG } from '../constants'; 
import { useNotification } from './NotificationContext'; 

import * as authService from '../services/authService';
import * as subscriptionService from '../services/subscriptionService';
import * as adminService from '../services/adminService';
import * as creditService from '../services/creditService'; 
import * as perkService from '../services/perkService'; // Import perkService

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  updateUserProfile: (dataToUpdate: Partial<FullUserProfile>, currentPassword?: string, newPassword?: string) => Promise<void>;
  completeMockVerification: (email: string) => Promise<void>;
  requestPasswordResetLink: (email: string) => Promise<string | void>;
  resetUserPassword: (email: string, token: string, newPassword: string) => Promise<void>;
  subscribeToBundle: (bundleId: string, cycle: 'monthly' | 'annually', pricePaid: number) => Promise<void>;
  cancelBundleSubscription: (bundleId: string) => Promise<void>;
  pauseUserSubscription: (bundleId: string, pauseDurationDays: number) => Promise<void>;
  resumeUserSubscription: (bundleId: string) => Promise<void>;
  // Admin actions for users/providers
  adminSuspendUser: (userId: string) => Promise<PlatformUserInfo>;
  adminActivateUser: (userId: string) => Promise<PlatformUserInfo>;
  adminSuspendProvider: (providerId: string) => Promise<AdminProviderInfo>;
  adminActivateProvider: (providerId: string) => Promise<AdminProviderInfo>;
  // Credit System actions
  refreshUserCredits: () => Promise<void>;
  applyCreditsAtCheckout: (amountToRedeem: number) => Promise<void>;
  adminAdjustUserCredits: (targetUserId: string, newAvailableBalance: number) => Promise<User | null>;
  // Perks System actions
  checkAndRefreshPerks: () => Promise<void>;
  claimAndRedeemPerk: (perkId: string) => Promise<void>;
  adminAddPerk: (newPerkData: Omit<Perk, 'id' | 'activeStatus'> & { activeStatus?: boolean }) => Promise<Perk | null>;
  adminEditPerk: (perkId: string, updates: Partial<Omit<Perk, 'id'>>) => Promise<Perk | null>;
  adminDeletePerk: (perkId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useNotification();

  useEffect(() => {
    setIsLoading(true);
    const storedUser = localStorage.getItem('oneSubUser');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        // If user loaded from storage, refresh their perks
        if (parsedUser) {
            const refreshedUserWithPerks = perkService.refreshUserPerkStatuses(parsedUser, MOCK_PERKS_CATALOG, BUNDLES_DATA);
            updateUserSession(refreshedUserWithPerks); // Update session with fresh perk data
        }
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem('oneSubUser');
      }
    }
    setIsLoading(false);
  }, []);

  const updateUserSession = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('oneSubUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('oneSubUser');
      localStorage.removeItem('oneSubNewUser'); 
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      let user = await authService.loginUser(email, password);
      // After successful login, refresh credits and perks
      user = creditService.calculateAndApplyMonthlyCredits(user, BUNDLES_DATA);
      user = perkService.refreshUserPerkStatuses(user, MOCK_PERKS_CATALOG, BUNDLES_DATA);
      updateUserSession(user);
      addToast(`Welcome back, ${user.fullName || user.email}!`, 'success');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
      addToast(err.message || 'Login failed.', 'error');
      throw err; 
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await authService.signupUser(email, password);
      // New user won't have credits or perks yet, but we can initialize fields.
      const userWithInitialPerks = perkService.refreshUserPerkStatuses(newUser, MOCK_PERKS_CATALOG, BUNDLES_DATA);
      // Don't call updateUserSession here as verification is pending.
      addToast('Signup successful! Please verify your email (mock process).', 'success');
      return userWithInitialPerks; 
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
      addToast(err.message || 'Signup failed.', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const completeMockVerification = async (email: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
        await authService.markUserAsVerified(email);
        addToast(`Email ${email} verified successfully! You can now log in.`, 'success');
    } catch (err: any) {
        setError(err.message || "Mock verification failed.");
        addToast(err.message || "Mock verification failed.", 'error');
        throw err;
    } finally {
        setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.logoutUser();
      const userName = currentUser?.fullName || currentUser?.email || "User";
      updateUserSession(null);
      addToast(`Logged out successfully, ${userName}.`, 'info');
    } catch (err: any) {
      setError(err.message || 'Logout failed.');
      addToast(err.message || 'Logout failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUserProfile = async (dataToUpdate: Partial<FullUserProfile>, currentPassword?: string, newPassword?: string): Promise<void> => {
    if (!currentUser) {
        const msg = "You must be logged in to update your profile.";
        setError(msg); addToast(msg, 'error'); throw new Error("User not logged in");
    }
    setIsLoading(true);
    setError(null);
    try {
        const updatedUser = await authService.updateUserProfileData(currentUser, dataToUpdate, currentPassword, newPassword);
        // Profile data change might affect perk eligibility (e.g. registrationDate if it's editable, though not typical)
        const finalUser = perkService.refreshUserPerkStatuses(updatedUser, MOCK_PERKS_CATALOG, BUNDLES_DATA);
        updateUserSession(finalUser);
        addToast('Profile updated successfully!', 'success');
    } catch (err: any) {
        setError(err.message || "Profile update failed.");
        addToast(err.message || "Profile update failed.", 'error');
        throw err;
    } finally {
        setIsLoading(false);
    }
  };

  const requestPasswordResetLink = async (email: string): Promise<string | void> => {
    setIsLoading(true);
    setError(null);
    try {
        const token = await authService.requestPasswordReset(email);
        addToast('If an account exists, a password reset link has been sent (mock).', 'info');
        return token;
    } catch (err: any) {
        setError(err.message || "Requesting password reset failed.");
        addToast(err.message || "Requesting password reset failed.", 'error');
        throw err;
    } finally {
        setIsLoading(false);
    }
  };

  const resetUserPassword = async (email: string, token: string, newPassword: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
        await authService.resetPassword(email, token, newPassword);
        addToast('Password reset successfully! You can now log in.', 'success');
    } catch (err: any) {
        setError(err.message || "Password reset failed.");
        addToast(err.message || "Password reset failed.", 'error');
        throw err;
    } finally {
        setIsLoading(false);
    }
  };

  const subscribeToBundle = async (bundleId: string, cycle: 'monthly' | 'annually', pricePaid: number): Promise<void> => {
    if (!currentUser) {
      const msg = "You must be logged in to subscribe.";
      setError(msg); addToast(msg, 'error'); throw new Error("User not logged in");
    }
    if (currentUser.isVerified === false) {
      const msg = "Please verify your email before subscribing.";
      setError(msg); addToast(msg, 'warning'); throw new Error(msg);
    }
    setIsLoading(true); setError(null);
    try {
      let updatedUser = subscriptionService.addSubscription(currentUser, bundleId, cycle, pricePaid, BUNDLES_DATA);
      updatedUser = creditService.calculateAndApplyMonthlyCredits(updatedUser, BUNDLES_DATA);
      updatedUser = perkService.refreshUserPerkStatuses(updatedUser, MOCK_PERKS_CATALOG, BUNDLES_DATA);
      updateUserSession(updatedUser);
      const bundleName = BUNDLES_DATA.find(b => b.id === bundleId)?.name || "Selected Bundle";
      addToast(`Successfully subscribed to ${bundleName}! Credits & Perks updated.`, 'success');
    } catch (err: any) {
      setError(err.message || "Subscription failed.");
      addToast(err.message || "Subscription failed.", 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBundleSubscription = async (bundleId: string): Promise<void> => {
    if (!currentUser) {
      const msg = "You must be logged in to manage subscriptions.";
      setError(msg); addToast(msg, 'error'); throw new Error("User not logged in");
    }
    setIsLoading(true); setError(null);
    try {
      let updatedUser = subscriptionService.removeSubscription(currentUser, bundleId, BUNDLES_DATA);
      updatedUser = creditService.calculateAndApplyMonthlyCredits(updatedUser, BUNDLES_DATA);
      updatedUser = perkService.refreshUserPerkStatuses(updatedUser, MOCK_PERKS_CATALOG, BUNDLES_DATA);
      updateUserSession(updatedUser);
      const bundleName = BUNDLES_DATA.find(b => b.id === bundleId)?.name || "Selected Bundle";
      addToast(`Subscription to ${bundleName} canceled. Credits & Perks updated.`, 'info');
    } catch (err: any) {
      setError(err.message || "Cancellation failed.");
      addToast(err.message || "Cancellation failed.", 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const pauseUserSubscription = async (bundleId: string, pauseDurationDays: number): Promise<void> => {
    if (!currentUser) {
        const msg = "User not logged in";
        setError(msg); addToast(msg, 'error'); throw new Error(msg);
    }
    setIsLoading(true); setError(null);
    try {
        let updatedUser = subscriptionService.pauseUserSubscription(currentUser, bundleId, pauseDurationDays, BUNDLES_DATA);
        updatedUser = creditService.calculateAndApplyMonthlyCredits(updatedUser, BUNDLES_DATA); // Paused subs don't earn credits
        updatedUser = perkService.refreshUserPerkStatuses(updatedUser, MOCK_PERKS_CATALOG, BUNDLES_DATA); // Refresh perks
        updateUserSession(updatedUser);
        const bundleName = BUNDLES_DATA.find(b => b.id === bundleId)?.name || "Subscription";
        addToast(`${bundleName} paused successfully. Credits & Perks updated.`, 'success');
    } catch (err: any) {
        setError(err.message || "Failed to pause subscription.");
        addToast(err.message || "Failed to pause subscription.", 'error');
        throw err;
    } finally {
        setIsLoading(false);
    }
  };

  const resumeUserSubscription = async (bundleId: string): Promise<void> => {
     if (!currentUser) {
        const msg = "User not logged in";
        setError(msg); addToast(msg, 'error'); throw new Error(msg);
    }
    setIsLoading(true); setError(null);
    try {
        let updatedUser = subscriptionService.resumeUserSubscription(currentUser, bundleId, BUNDLES_DATA);
        updatedUser = creditService.calculateAndApplyMonthlyCredits(updatedUser, BUNDLES_DATA); // Resumed subs earn credits
        updatedUser = perkService.refreshUserPerkStatuses(updatedUser, MOCK_PERKS_CATALOG, BUNDLES_DATA); // Refresh perks
        updateUserSession(updatedUser);
        const bundleName = BUNDLES_DATA.find(b => b.id === bundleId)?.name || "Subscription";
        addToast(`${bundleName} resumed successfully. Credits & Perks updated.`, 'success');
    } catch (err: any) {
        setError(err.message || "Failed to resume subscription.");
        addToast(err.message || "Failed to resume subscription.", 'error');
        throw err;
    } finally {
        setIsLoading(false);
    }
  };

  // Admin Actions for Users/Providers
  const adminSuspendUser = async (userId: string): Promise<PlatformUserInfo> => {
    if (!currentUser || currentUser.role !== 'admin') {
      const msg = "Unauthorized action."; setError(msg); addToast(msg, 'error'); throw new Error(msg);
    }
    setIsLoading(true); setError(null);
    try {
      const updatedUserInfo = await adminService.suspendUser(userId, currentUser.email);
      // If the admin modified a user, that user's perk eligibility might change if their subscriptions are affected.
      // For simplicity, we don't automatically refresh perks for other users here, but a real system might.
      addToast(`User ${updatedUserInfo.fullName || updatedUserInfo.email} suspended.`, 'success');
      return updatedUserInfo;
    } catch (err: any) {
      setError(err.message || "Failed to suspend user."); addToast(err.message || "Failed to suspend user.", 'error'); throw err;
    } finally { setIsLoading(false); }
  };

  const adminActivateUser = async (userId: string): Promise<PlatformUserInfo> => {
    if (!currentUser || currentUser.role !== 'admin') {
      const msg = "Unauthorized action."; setError(msg); addToast(msg, 'error'); throw new Error(msg);
    }
    setIsLoading(true); setError(null);
    try {
      const updatedUserInfo = await adminService.activateUser(userId, currentUser.email);
      addToast(`User ${updatedUserInfo.fullName || updatedUserInfo.email} activated.`, 'success');
      return updatedUserInfo;
    } catch (err: any) {
      setError(err.message || "Failed to activate user."); addToast(err.message || "Failed to activate user.", 'error'); throw err;
    } finally { setIsLoading(false); }
  };

  const adminSuspendProvider = async (providerId: string): Promise<AdminProviderInfo> => {
     if (!currentUser || currentUser.role !== 'admin') {
      const msg = "Unauthorized action."; setError(msg); addToast(msg, 'error'); throw new Error(msg);
    }
    setIsLoading(true); setError(null);
    try {
      const updatedProviderInfo = await adminService.suspendProvider(providerId, currentUser.email);
      addToast(`Provider ${updatedProviderInfo.businessName} suspended.`, 'success');
      return updatedProviderInfo;
    } catch (err: any) {
      setError(err.message || "Failed to suspend provider."); addToast(err.message || "Failed to suspend provider.", 'error'); throw err;
    } finally { setIsLoading(false); }
  };

  const adminActivateProvider = async (providerId: string): Promise<AdminProviderInfo> => {
    if (!currentUser || currentUser.role !== 'admin') {
      const msg = "Unauthorized action."; setError(msg); addToast(msg, 'error'); throw new Error(msg);
    }
    setIsLoading(true); setError(null);
    try {
      const updatedProviderInfo = await adminService.activateProvider(providerId, currentUser.email);
      addToast(`Provider ${updatedProviderInfo.businessName} activated.`, 'success');
      return updatedProviderInfo;
    } catch (err: any) {
      setError(err.message || "Failed to activate provider."); addToast(err.message || "Failed to activate provider.", 'error'); throw err;
    } finally { setIsLoading(false); }
  };

  // Credit System Methods
  const refreshUserCredits = async (): Promise<void> => {
    if (!currentUser) {
      addToast("Please log in to refresh credits.", 'info'); return;
    }
    setIsLoading(true); setError(null);
    try {
      const updatedUser = creditService.calculateAndApplyMonthlyCredits(currentUser, BUNDLES_DATA);
      updateUserSession(updatedUser); // Session update already handles local storage
      addToast("Your credits have been updated based on active subscriptions!", 'success');
    } catch (err: any) {
      setError(err.message || "Failed to refresh credits.");
      addToast(err.message || "Failed to refresh credits.", 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const applyCreditsAtCheckout = async (amountToRedeem: number): Promise<void> => {
    if (!currentUser) {
      const msg = "User not logged in to redeem credits.";
      setError(msg); addToast(msg, 'error'); throw new Error(msg);
    }
    setIsLoading(true); setError(null);
    try {
      const updatedUser = creditService.redeemUserCredits(currentUser, amountToRedeem);
      updateUserSession(updatedUser);
      addToast(`${creditService.formatCredits(amountToRedeem)} successfully applied to your order!`, 'success');
    } catch (err: any) {
      setError(err.message || "Failed to redeem credits.");
      addToast(err.message || "Failed to redeem credits.", 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const adminAdjustUserCredits = async (targetUserId: string, newAvailableBalance: number): Promise<User | null> => {
    if (!currentUser || currentUser.role !== 'admin') {
      const msg = "Unauthorized action: Only admins can adjust credits.";
      setError(msg); addToast(msg, 'error'); throw new Error(msg);
    }
    setIsLoading(true); setError(null);
    try {
      const updatedTargetUser = creditService.adjustUserCreditsByAdmin(currentUser, targetUserId, newAvailableBalance);
      addToast(`Credits for user ${updatedTargetUser.email} adjusted.`, 'success');
      if (currentUser.id === targetUserId) { // If admin adjusts their own user-role credits
        updateUserSession(updatedTargetUser);
      }
      return updatedTargetUser;
    } catch (err: any) {
      setError(err.message || "Failed to adjust credits.");
      addToast(err.message || "Failed to adjust credits.", 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
    return null; 
  };

  // Perks System Methods
  const checkAndRefreshPerks = async (): Promise<void> => {
    if (!currentUser) {
        addToast("Please log in to check your perks.", 'info'); return;
    }
    setIsLoading(true); setError(null);
    try {
        const updatedUser = perkService.refreshUserPerkStatuses(currentUser, MOCK_PERKS_CATALOG, BUNDLES_DATA);
        updateUserSession(updatedUser);
        addToast("Your perks eligibility has been refreshed!", 'success');
    } catch (err: any) {
        setError(err.message || "Failed to refresh perks.");
        addToast(err.message || "Failed to refresh perks.", 'error');
        throw err;
    } finally {
        setIsLoading(false);
    }
  };

  const claimAndRedeemPerk = async (perkId: string): Promise<void> => {
    if (!currentUser) {
        const msg = "User not logged in to claim perks.";
        setError(msg); addToast(msg, 'error'); throw new Error(msg);
    }
    setIsLoading(true); setError(null);
    try {
        const updatedUser = perkService.claimUserPerk(currentUser, perkId);
        updateUserSession(updatedUser);
        const perkTitle = MOCK_PERKS_CATALOG.find(p=>p.id === perkId)?.title || "Perk";
        addToast(`Successfully claimed "${perkTitle}"!`, 'success');
    } catch (err: any) {
        setError(err.message || "Failed to claim perk.");
        addToast(err.message || "Failed to claim perk.", 'error');
        throw err;
    } finally {
        setIsLoading(false);
    }
  };

  const adminAddPerk = async (newPerkData: Omit<Perk, 'id' | 'activeStatus'> & { activeStatus?: boolean }): Promise<Perk | null> => {
    if (!currentUser || currentUser.role !== 'admin') {
      const msg = "Unauthorized: Only admins can add perks.";
      setError(msg); addToast(msg, 'error'); throw new Error(msg);
    }
    setIsLoading(true); setError(null);
    try {
      const addedPerk = perkService.addPerkToCatalog(currentUser, newPerkData);
      addToast(`Perk "${addedPerk.title}" added successfully.`, 'success');
      // Note: MOCK_PERKS_CATALOG is mutated directly by perkService, so no need to update it here.
      // If it were an immutable update, we'd need to re-fetch/update a local copy.
      return addedPerk;
    } catch (err: any) {
      setError(err.message || "Failed to add perk.");
      addToast(err.message || "Failed to add perk.", 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
    return null;
  };
  
  const adminEditPerk = async (perkId: string, updates: Partial<Omit<Perk, 'id'>>): Promise<Perk | null> => {
    if (!currentUser || currentUser.role !== 'admin') {
      const msg = "Unauthorized: Only admins can edit perks.";
      setError(msg); addToast(msg, 'error'); throw new Error(msg);
    }
    setIsLoading(true); setError(null);
    try {
      const updatedPerk = perkService.updatePerkInCatalog(currentUser, perkId, updates);
      addToast(`Perk "${updatedPerk.title}" updated successfully.`, 'success');
      return updatedPerk;
    } catch (err: any) {
      setError(err.message || "Failed to edit perk.");
      addToast(err.message || "Failed to edit perk.", 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const adminDeletePerk = async (perkId: string): Promise<void> => {
    if (!currentUser || currentUser.role !== 'admin') {
      const msg = "Unauthorized: Only admins can delete perks.";
      setError(msg); addToast(msg, 'error'); throw new Error(msg);
    }
    setIsLoading(true); setError(null);
    try {
      perkService.deletePerkFromCatalog(currentUser, perkId);
      addToast(`Perk deleted successfully.`, 'success');
    } catch (err: any) {
      setError(err.message || "Failed to delete perk.");
      addToast(err.message || "Failed to delete perk.", 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateUserProfile,
    completeMockVerification,
    requestPasswordResetLink,
    resetUserPassword,
    subscribeToBundle,
    cancelBundleSubscription,
    pauseUserSubscription,
    resumeUserSubscription,
    // Admin user/provider management
    adminSuspendUser,
    adminActivateUser,
    adminSuspendProvider,
    adminActivateProvider,
    // Credits
    refreshUserCredits,
    applyCreditsAtCheckout,
    adminAdjustUserCredits,
    // Perks
    checkAndRefreshPerks,
    claimAndRedeemPerk,
    adminAddPerk,
    adminEditPerk,
    adminDeletePerk,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};