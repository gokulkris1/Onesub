

import React from 'react';

export interface Service {
  id: string;
  name: string;
  icon: React.ReactNode;
  originalPrice: number;
  description: string;
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  services: Service[];
  bundlePrice: number;
  highlight?: boolean;
  badge?: string;
  themeColor?: string; // e.g., 'bg-sky-500', 'border-green-500'
  annualPriceMultiplier?: number; // e.g., 0.9 for 10% off annually
}

export interface BillingAddress {
  street: string;
  city: string;
  county: string;
  eircode: string;
  country: string;
}

export interface PaymentDetails {
  cardholderName: string;
  cardNumber: string; // Store only last 4 digits or a token in real app
  expiryDate: string; // MM/YY
  cardType: string; // e.g., "Visa", "Mastercard"
  // CVV should never be stored
}

export interface ActiveSubscription {
  bundleId: string;
  cycle: 'monthly' | 'annually';
  subscribedDate: string; // ISO date string
  pricePaid: number; // Actual price paid for that cycle
  nextBillingDate?: string; // ISO date string
  status: 'active' | 'paused' | 'payment_failed' | 'suspended'; 
  pauseEndDate?: string; // New field for when a paused subscription resumes
  linkedDate: string; // Date subscription was "linked" for credit purposes
  creditRate: number; // e.g., 0.01 for 1%
  monthlyAmountForCredits: number; // Base monthly amount for credit calculation
}

// For Perks System
export interface Partner {
  id: string;
  name: string;
  logoUrl: string; // URL for partner's logo
  website?: string;
}

export type UnlockCriterionType = 
  'MIN_SUBSCRIPTIONS_LINKED' | 
  'MIN_MONTHLY_SPEND' | 
  'SPECIFIC_BUNDLE_SUBSCRIBED' |
  'ACCOUNT_AGE_DAYS'; // New criterion

export interface UnlockCriterion {
  type: UnlockCriterionType;
  value: number | string; // number for counts/amounts/days, string for bundleId
  description: string; // User-facing description of how to unlock
}

export type PerkDeliveryMethod = 'LINK' | 'CODE' | 'MANUAL_EMAIL';

export interface PerkDelivery {
  method: PerkDeliveryMethod;
  value?: string; // The actual link or code
  instructions?: string; // e.g., "Click the link to redeem", "Enter this code at checkout on PartnerSite.com"
}

export interface Perk {
  id: string;
  title: string;
  partnerId: string; // Link to Partner
  description: string;
  longDescription?: string;
  imageUrl?: string; // Optional image for the perk
  unlockCriteria: UnlockCriterion[]; // Can have multiple criteria (e.g., AND logic)
  delivery: PerkDelivery;
  expiryDate?: string; // ISO date string for when the perk offer expires
  activeStatus: boolean; // Is the perk currently available to be earned/redeemed?
  category?: string; // e.g., "Entertainment", "Productivity", "Lifestyle"
}

export interface UserPerkStatus {
  perkId: string;
  status: 'locked' | 'unlocked' | 'redeemed';
  dateUnlocked?: string; // ISO date string
  dateRedeemed?: string; // ISO date string
  redemptionInfo?: PerkDelivery; // Store the delivered code/link here upon unlock
}


export interface FullUserProfile {
  id: string;
  email: string;
  password?: string; // For mock authentication only. DO NOT store in plaintext in real apps.
  role: 'user' | 'provider' | 'admin' | 'guest';
  fullName?: string;
  phone?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  profilePictureUrl?: string;
  isVerified?: boolean; // New field for email verification
  billingAddress?: BillingAddress;
  paymentDetails?: PaymentDetails; // Sensitive, handle with care
  activeSubscriptions?: ActiveSubscription[] | null;
  subscriptionStatus?: 'active' | 'canceled' | 'none'; // This might be derived from activeSubscriptions
  businessName?: string; // Added for provider roles
  status?: 'active' | 'suspended'; // User account status, managed by admin
  registrationDate?: string; // ISO date string, added for account age perk

  // Credit System Fields
  totalCreditsEarned?: number;
  creditsAvailable?: number;
  creditsRedeemed?: number;
  lastCreditUpdateTimestamp?: string; // ISO date string

  // Perks System Fields
  unlockedPerks?: UserPerkStatus[];
}

// Main User type used in the application
export type User = FullUserProfile;

export type Route = 
  'home' | 
  'checkout' | 
  'account' | 
  'admin-dashboard' | 
  'provider-dashboard' | 
  'terms' | 
  'privacy' | 
  'contact' |
  'edit-profile' | 
  'forgot-password' | 
  'reset-password' |
  'payment-success' |
  'payment-failure' |
  'perks-locker'; // New route for Perks Locker

// Placeholder types for dashboard data
export interface ProviderApplicationInfo {
  id: string;
  businessName: string;
  contactEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  dateSubmitted: string;
}

export interface PlatformUserInfo {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'provider' | 'admin';
  registrationDate: string;
  lastLogin?: string;
  status: 'active' | 'suspended'; // Added status field
  creditsAvailable?: number; // For admin display
}

export interface AdminProviderInfo {
    id: string;
    businessName: string;
    contactEmail: string;
    serviceCount: number;
    status: 'active' | 'suspended';
}

export interface ProviderServiceInfo {
    id: string;
    name: string;
    participatingBundles: string[]; // Names or IDs of bundles
}

export interface ProviderStats {
    totalSubscribers: number;
    monthlyRevenueShare: number; // Mocked
    popularBundles: Array<{ name: string; subscriberCount: number }>;
}

export type AIResponseFormat = 'text' | 'json-list';

export interface AISuggestion { // Example for structured AI response
    name: string;
    description: string;
    services?: string[];
    targetAudience?: string;
}

export interface MockPaymentMethodDetails {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

export interface PromoCode {
  id: string; 
  description: string;
  type: 'percentage' | 'fixed_amount';
  value: number; 
  isActive: boolean;
  validUntil?: string; 
  minSpend?: number;
  usageLimit?: number;
  timesUsed?: number;
}