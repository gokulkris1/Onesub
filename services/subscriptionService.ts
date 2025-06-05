

import { User, ActiveSubscription, Bundle as BundleType } from '../types';
import * as notificationService from './notificationService';

const getNextBillingDate = (subscribedDate: Date, cycle: 'monthly' | 'annually'): string => {
    const nextDate = new Date(subscribedDate);
    if (cycle === 'monthly') {
        nextDate.setMonth(nextDate.getMonth() + 1);
    } else {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
    }
    return nextDate.toISOString().split('T')[0];
};


export const addSubscription = (
  currentUser: User,
  bundleId: string,
  cycle: 'monthly' | 'annually',
  pricePaid: number, // This is the price for the chosen cycle
  bundlesData: BundleType[]
): User => {
  if (!currentUser) {
    throw new Error("User not logged in");
  }
  if (currentUser.isVerified === false) {
    throw new Error("Email not verified. Please verify your email before subscribing.");
  }

  const bundleDetails = bundlesData.find(b => b.id === bundleId);
  if (!bundleDetails) {
    throw new Error(`Bundle with ID ${bundleId} not found.`);
  }

  const currentSubscriptions = currentUser.activeSubscriptions || [];
  if (currentSubscriptions.some(sub => sub.bundleId === bundleId && sub.status === 'active')) {
    console.warn(`User already actively subscribed to bundle ${bundleId}`);
    return currentUser; 
  }

  const subscribedDate = new Date().toISOString().split('T')[0];
  let monthlyAmountForCredits = 0;
  if (cycle === 'monthly') {
    monthlyAmountForCredits = pricePaid; // pricePaid is already the monthly price
  } else if (cycle === 'annually') {
    // pricePaid is the annual price (potentially discounted if annualPriceMultiplier was used)
    // So, monthly equivalent for credit calculation is pricePaid / 12
    monthlyAmountForCredits = pricePaid / 12;
  }
  
  const newSubscription: ActiveSubscription = {
    bundleId,
    cycle,
    subscribedDate,
    pricePaid: parseFloat(pricePaid.toFixed(2)),
    status: 'active',
    nextBillingDate: getNextBillingDate(new Date(subscribedDate), cycle),
    linkedDate: subscribedDate, // Assume linked for credits upon subscription
    creditRate: 0.01, // Standard 1% credit rate
    monthlyAmountForCredits: parseFloat(monthlyAmountForCredits.toFixed(2)),
  };

  const updatedUser: User = {
    ...currentUser,
    activeSubscriptions: [...currentSubscriptions.filter(s => s.bundleId !== bundleId), newSubscription],
    subscriptionStatus: 'active',
  };

  if (currentUser.email) {
    notificationService.sendSubscriptionConfirmation(currentUser.email, bundleDetails.name, cycle, pricePaid);
    notificationService.sendAdminSubscriptionAlert(currentUser.email, bundleDetails.name, 'subscribed');
    notificationService.sendProviderSubscriptionAlert(undefined, currentUser.email, bundleDetails.name);
  }

  return updatedUser;
};

export const removeSubscription = ( // This is effectively Cancel
  currentUser: User,
  bundleIdToRemove: string,
  bundlesData: BundleType[]
): User => {
  if (!currentUser || !currentUser.activeSubscriptions) {
    throw new Error("User not logged in or no active subscriptions");
  }

  const updatedActiveSubscriptions = currentUser.activeSubscriptions.filter(
    sub => sub.bundleId !== bundleIdToRemove
  );

  const updatedUser: User = {
    ...currentUser,
    activeSubscriptions: updatedActiveSubscriptions.length > 0 ? updatedActiveSubscriptions : null,
    subscriptionStatus: updatedActiveSubscriptions.length > 0 ? 'active' : 'canceled', // Or 'none' if no subs ever
  };

  const bundleCanceled = bundlesData.find(b => b.id === bundleIdToRemove);
  if (bundleCanceled && currentUser.email) {
    notificationService.sendSubscriptionCancellation(currentUser.email, bundleCanceled.name);
    notificationService.sendAdminSubscriptionAlert(currentUser.email, bundleCanceled.name, 'canceled');
  }

  return updatedUser;
};


export const pauseUserSubscription = (
  currentUser: User,
  bundleIdToPause: string,
  pauseDurationDays: number,
  bundlesData: BundleType[]
): User => {
  if (!currentUser || !currentUser.activeSubscriptions) {
    throw new Error("User not logged in or no active subscriptions");
  }

  const subscriptions = currentUser.activeSubscriptions.map(sub => {
    if (sub.bundleId === bundleIdToPause && sub.status === 'active') {
      const pauseEndDate = new Date();
      pauseEndDate.setDate(pauseEndDate.getDate() + pauseDurationDays);
      
      const bundlePaused = bundlesData.find(b => b.id === bundleIdToPause);
      if (bundlePaused && currentUser.email) {
        notificationService.sendSubscriptionPausedEmail(currentUser.email, bundlePaused.name, pauseEndDate.toISOString().split('T')[0]);
      }
      
      return { ...sub, status: 'paused' as 'paused', pauseEndDate: pauseEndDate.toISOString().split('T')[0] };
    }
    return sub;
  });

  return { ...currentUser, activeSubscriptions: subscriptions };
};

export const resumeUserSubscription = (
  currentUser: User,
  bundleIdToResume: string,
  bundlesData: BundleType[]
): User => {
  if (!currentUser || !currentUser.activeSubscriptions) {
    throw new Error("User not logged in or no active subscriptions");
  }

  const subscriptions = currentUser.activeSubscriptions.map(sub => {
    if (sub.bundleId === bundleIdToResume && sub.status === 'paused') {
      let nextBillingDate = sub.nextBillingDate;
      if (sub.pauseEndDate && sub.nextBillingDate) {
          const pauseEnd = new Date(sub.pauseEndDate);
          const originalNextBilling = new Date(sub.nextBillingDate);
          if (pauseEnd > originalNextBilling) { 
              const difference = pauseEnd.getTime() - originalNextBilling.getTime();
              const newNextBilling = new Date(originalNextBilling.getTime() + difference);
              const tempNextBilling = new Date(pauseEnd);
               if (sub.cycle === 'monthly') {
                    tempNextBilling.setMonth(tempNextBilling.getMonth() + 1); 
                } else {
                    tempNextBilling.setFullYear(tempNextBilling.getFullYear() + 1); 
                }
                nextBillingDate = tempNextBilling.toISOString().split('T')[0];
          }
      }

      const bundleResumed = bundlesData.find(b => b.id === bundleIdToResume);
      if (bundleResumed && currentUser.email) {
        notificationService.sendSubscriptionResumedEmail(currentUser.email, bundleResumed.name);
      }

      return { ...sub, status: 'active' as 'active', pauseEndDate: undefined, nextBillingDate };
    }
    return sub;
  });

  return { ...currentUser, activeSubscriptions: subscriptions };
};