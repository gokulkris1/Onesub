
// Service for sending (simulated) notifications
// In a production system, this service (or equivalent backend logic)
// would integrate with an actual email service provider (e.g., SendGrid, Mailgun, AWS SES).
// Frontend calls would typically go to a backend API endpoint (e.g., a Firebase Function),
// which then handles the secure sending of emails.

const ADMIN_EMAIL_ADDRESS = "platform.admin@onesub.com"; // Centralized admin email

export const sendWelcomeEmail = (userEmail: string, userName?: string): void => {
  console.log(`%cEMAIL_TO_USER (${userEmail}):%c Welcome to OneSub, ${userName || 'Valued User'}! We're thrilled to have you. Explore our bundles and start saving today.`, "color: blue; font-weight: bold;", "color: default;");
};

export const sendVerificationEmail = (userEmail: string, userName: string | undefined, mockVerificationLink: string): void => {
  console.log(`%cEMAIL_TO_USER (${userEmail}):%c Hi ${userName || 'User'}, please verify your email for OneSub by clicking this mock link: ${mockVerificationLink}. (In a real app, this would be a unique, secure link).`, "color: blue; font-weight: bold;", "color: default;");
};

export const sendNewUserAdminAlert = (newUserEmail: string, role: string): void => {
  console.log(`%cEMAIL_TO_ADMIN (${ADMIN_EMAIL_ADDRESS}):%c New user registered: ${newUserEmail} (Role: ${role}). Needs verification.`, "color: purple; font-weight: bold;", "color: default;");
};

export const sendSubscriptionConfirmation = (userEmail: string, bundleName: string, cycle: 'monthly' | 'annually', price: number): void => {
  console.log(`%cEMAIL_TO_USER (${userEmail}):%c Subscription to '${bundleName}' (${cycle}) confirmed! Amount: €${price.toFixed(2)}. Thank you for choosing OneSub.`, "color: blue; font-weight: bold;", "color: default;");
};

export const sendSubscriptionCancellation = (userEmail: string, bundleName: string): void => {
  console.log(`%cEMAIL_TO_USER (${userEmail}):%c Your subscription to '${bundleName}' has been canceled. We're sorry to see you go.`, "color: blue; font-weight: bold;", "color: default;");
};

export const sendSubscriptionPausedEmail = (userEmail: string, bundleName: string, pauseEndDate: string): void => {
  console.log(`%cEMAIL_TO_USER (${userEmail}):%c Your subscription to '${bundleName}' has been paused until ${new Date(pauseEndDate).toLocaleDateString()}.`, "color: blue; font-weight: bold;", "color: default;");
};

export const sendSubscriptionResumedEmail = (userEmail: string, bundleName: string): void => {
  console.log(`%cEMAIL_TO_USER (${userEmail}):%c Your subscription to '${bundleName}' has been resumed.`, "color: blue; font-weight: bold;", "color: default;");
};

export const sendAdminSubscriptionAlert = (userEmail: string, bundleName: string, actionType: 'subscribed' | 'canceled' | 'paused' | 'resumed'): void => {
  console.log(`%cEMAIL_TO_ADMIN (${ADMIN_EMAIL_ADDRESS}):%c User ${userEmail} has ${actionType} their subscription to bundle '${bundleName}'.`, "color: purple; font-weight: bold;", "color: default;");
};

export const sendProviderSubscriptionAlert = (providerEmail: string | undefined, userEmail: string, bundleName: string): void => {
  if (providerEmail) {
    console.log(`%cEMAIL_TO_PROVIDER (${providerEmail}):%c A user (${userEmail}) has subscribed to '${bundleName}', which includes your services.`, "color: green; font-weight: bold;", "color: default;");
  } else {
    console.log(`%cSIMULATED_PROVIDER_ALERT (No Email):%c User ${userEmail} subscribed to ${bundleName}. (Provider details not available for specific notification).`, "color: orange; font-weight: bold;", "color: default;");
  }
};

export const sendPaymentReminder = (userEmail: string, bundleName: string, amount: number, dueDate: string): void => {
  console.log(`%cEMAIL_TO_USER (${userEmail}):%c Payment Reminder for '${bundleName}'. Amount due: €${amount.toFixed(2)} on ${new Date(dueDate).toLocaleDateString()}.`, "color: blue; font-weight: bold;", "color: default;");
};

export const sendPaymentReceipt = (userEmail: string, bundleName: string, amount: number, paymentDate: string): void => {
  console.log(`%cEMAIL_TO_USER (${userEmail}):%c Payment Processed for '${bundleName}'. Amount: €${amount.toFixed(2)} on ${new Date(paymentDate).toLocaleDateString()}. Thank you! Here is your receipt.`, "color: blue; font-weight: bold;", "color: default;");
};

export const sendPasswordResetEmail = (userEmail: string, userName: string | undefined, mockResetLink: string, mockToken: string): void => {
  console.log(`%cEMAIL_TO_USER (${userEmail}):%c Hi ${userName || 'User'}, to reset your OneSub password, click this mock link: ${mockResetLink} or use token: ${mockToken}. (In a real app, use the link).`, "color: blue; font-weight: bold;", "color: default;");
};

export const sendPasswordChangedConfirmation = (userEmail: string, userName: string | undefined): void => {
  console.log(`%cEMAIL_TO_USER (${userEmail}):%c Hi ${userName || 'User'}, your OneSub password has been successfully changed.`, "color: blue; font-weight: bold;", "color: default;");
};

export const sendProviderWelcomeEmail = (providerEmail: string, businessName: string): void => {
  console.log(`%cEMAIL_TO_PROVIDER (${providerEmail}):%c Welcome to the OneSub Platform, ${businessName}! We're excited to partner with you.`, "color: green; font-weight: bold;", "color: default;");
};

export const sendAdminProviderOnboardedAlert = (adminEmail: string, businessName: string): void => {
  console.log(`%cEMAIL_TO_ADMIN (${adminEmail}):%c Provider ${businessName} has been successfully onboarded.`, "color: purple; font-weight: bold;", "color: default;");
};

export const sendProviderInwardPaymentNotice = (providerEmail: string | undefined, bundleName: string, amount: number, date: string): void => {
  if(providerEmail) {
    console.log(`%cEMAIL_TO_PROVIDER (${providerEmail}):%c Inward Payment Received: €${amount.toFixed(2)} from OneSub for participation in '${bundleName}' on ${date}.`, "color: green; font-weight: bold;", "color: default;");
  }
};

export const sendProviderUpcomingPayoutNotice = (providerEmail: string | undefined, amount: number, date: string): void => {
  if(providerEmail) {
    console.log(`%cEMAIL_TO_PROVIDER (${providerEmail}):%c Upcoming Payout Notice: €${amount.toFixed(2)} from OneSub scheduled for ${date}.`, "color: green; font-weight: bold;", "color: default;");
  }
};

// New Notifications for User/Provider Status Changes
export const sendUserSuspendedEmail = (userEmail: string, userName: string): void => {
  console.log(`%cEMAIL_TO_USER (${userEmail}):%c Hi ${userName}, your OneSub account has been temporarily suspended. Please contact support.`, "color: orange; font-weight: bold;", "color: default;");
};

export const sendUserActivatedEmail = (userEmail: string, userName: string): void => {
  console.log(`%cEMAIL_TO_USER (${userEmail}):%c Hi ${userName}, your OneSub account has been reactivated. Welcome back!`, "color: blue; font-weight: bold;", "color: default;");
};

export const sendProviderSuspendedEmail = (providerEmail: string, businessName: string): void => {
  console.log(`%cEMAIL_TO_PROVIDER (${providerEmail}):%c Dear ${businessName}, your provider account on OneSub has been temporarily suspended. Please contact admin support.`, "color: orange; font-weight: bold;", "color: default;");
};

export const sendProviderActivatedEmail = (providerEmail: string, businessName: string): void => {
  console.log(`%cEMAIL_TO_PROVIDER (${providerEmail}):%c Dear ${businessName}, your provider account on OneSub has been reactivated.`, "color: green; font-weight: bold;", "color: default;");
};

export const sendAdminUserStatusChangeAlert = (adminEmail: string, targetUserEmail: string, targetUserName: string, newStatus: 'suspended' | 'activated'): void => {
  console.log(`%cEMAIL_TO_ADMIN (${adminEmail}):%c User ${targetUserName} (${targetUserEmail}) has been ${newStatus}.`, "color: purple; font-weight: bold;", "color: default;");
};

export const sendAdminProviderStatusChangeAlert = (adminEmail: string, targetProviderEmail: string, targetBusinessName: string, newStatus: 'suspended' | 'activated'): void => {
  console.log(`%cEMAIL_TO_ADMIN (${adminEmail}):%c Provider ${targetBusinessName} (${targetProviderEmail}) has been ${newStatus}.`, "color: purple; font-weight: bold;", "color: default;");
};
