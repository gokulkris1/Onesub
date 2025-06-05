// Note: Removed React specific types like React.ReactNode as they are not relevant for backend.
// Consider using Firestore Timestamps for date fields for better querying.

export interface Service {
  id: string;
  name: string;
  iconName?: string; // Suggestion: use icon name for backend (e.g., "tv_icon", "music_icon")
  originalPrice: number;
  description: string;
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  serviceIds: string[]; // Store IDs instead of full Service objects
  bundlePrice: number;
  highlight?: boolean;
  badge?: string;
  themeColor?: string;
  annualPriceMultiplier?: number;
}

export interface BillingAddress {
  street: string;
  city: string;
  county: string;
  eircode: string;
  country: string;
}

export interface PaymentDetails { // Typically not stored directly, mostly tokens
  cardholderName?: string;
  last4?: string; // Store only last 4 digits
  expiryMonth?: string; // MM
  expiryYear?: string; // YYYY
  cardType?: string;
  paymentMethodId?: string; // Stripe PaymentMethod ID
}

export interface ActiveSubscription {
  bundleId: string;
  cycle: 'monthly' | 'annually';
  subscribedDate: string; // ISO date string or Firestore Timestamp
  pricePaid: number;
  nextBillingDate?: string; // ISO date string or Firestore Timestamp
  status: 'active' | 'paused' | 'canceled' | 'payment_failed' | 'suspended'; // Added more statuses
  pauseEndDate?: string; // ISO date string or Firestore Timestamp
  stripeSubscriptionId?: string; // If using Stripe
  userId?: string; // Foreign key to user
}

export interface FullUserProfile {
  id: string; // Firebase Auth UID
  email: string; // From Firebase Auth
  emailVerified?: boolean; // From Firebase Auth
  role: 'user' | 'provider' | 'admin' | 'guest';
  fullName?: string;
  phone?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  profilePictureUrl?: string;
  billingAddress?: BillingAddress;
  defaultPaymentMethodId?: string; // Stripe PaymentMethod ID
  subscriptionStatus?: 'active' | 'canceled' | 'none'; // Derived field
  businessName?: string; // For provider roles
  createdAt?: string; // ISO date string or Firestore Timestamp
  updatedAt?: string; // ISO date string or Firestore Timestamp
}

export type User = FullUserProfile; // Keep for consistency with frontend

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
  'payment-failure';

export interface ProviderApplicationInfo {
  id: string;
  businessName: string;
  contactEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  dateSubmitted: string; // ISO date string or Firestore Timestamp
  providerUid?: string; // UID of the provider user account if created
}

export interface PlatformUserInfo {
  id: string; // Firebase Auth UID
  fullName?: string;
  email: string;
  role: 'user' | 'provider' | 'admin';
  registrationDate: string; // ISO date string or Firestore Timestamp
  lastLogin?: string; // ISO date string or Firestore Timestamp
  status: 'active' | 'suspended'; 
}

export interface AdminProviderInfo {
    id: string; // Provider User UID or Business ID
    businessName: string;
    contactEmail: string;
    serviceCount: number;
    status: 'active' | 'suspended';
}

export interface ProviderServiceInfo { // Stored under provider or services collection
    id: string;
    providerId: string; // UID of the provider
    name: string;
    description: string;
}

export interface ProviderStats { // Derived data
    totalSubscribers: number;
    monthlyRevenueShare: number;
    popularBundles: Array<{ bundleId: string; name: string; subscriberCount: number }>;
}

export type AIResponseFormat = 'text' | 'json-list';

export interface AISuggestion {
    name: string;
    description: string;
    services?: string[];
    targetAudience?: string;
}

export interface MockPaymentMethodDetails { // Frontend only type
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

export interface PromoCode {
  id: string; // e.g., "SAVE10"
  description: string;
  type: 'percentage' | 'fixed_amount';
  value: number; // e.g., 10 for 10% or 5 for €5
  isActive: boolean;
  validUntil?: string; // ISO date string or Firestore Timestamp
  minSpend?: number;
  usageLimit?: number;
  timesUsed?: number;
}
