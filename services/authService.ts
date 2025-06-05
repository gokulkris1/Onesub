
import { User, FullUserProfile } from '../types';
import { MOCK_USERS } from '../constants'; 
import * as notificationService from './notificationService';

// Helper to find a user (from MOCK_USERS or localStorage for new users)
const findUserByEmail = (email: string): FullUserProfile | null => {
    const mockUser = MOCK_USERS.find(u => u.email === email);
    if (mockUser) return mockUser;

    const storedNewUserRaw = localStorage.getItem('oneSubNewUser');
    if (storedNewUserRaw) {
        const storedNewUser: FullUserProfile = JSON.parse(storedNewUserRaw);
        if (storedNewUser.email === email) return storedNewUser;
    }
    return null;
};

// Helper to update a user (in MOCK_USERS or localStorage)
// This is a very simplified mock and not robust for concurrent changes or large scale.
const updateUserInMockStorage = (updatedUser: FullUserProfile): void => {
    const indexInMock = MOCK_USERS.findIndex(u => u.id === updatedUser.id);
    if (indexInMock !== -1) {
        MOCK_USERS[indexInMock] = { ...MOCK_USERS[indexInMock], ...updatedUser };
    }

    const storedNewUserRaw = localStorage.getItem('oneSubNewUser');
    if (storedNewUserRaw) {
        const storedNewUser: FullUserProfile = JSON.parse(storedNewUserRaw);
        if (storedNewUser.email === updatedUser.email) {
            localStorage.setItem('oneSubNewUser', JSON.stringify({...storedNewUser, ...updatedUser}));
        }
    }
     // Update current user in localStorage if it's the same user
    const currentStoredUserRaw = localStorage.getItem('oneSubUser');
    if (currentStoredUserRaw) {
        const currentStoredUser: FullUserProfile = JSON.parse(currentStoredUserRaw);
        if (currentStoredUser.id === updatedUser.id) {
            localStorage.setItem('oneSubUser', JSON.stringify(updatedUser));
        }
    }
};


export const loginUser = async (email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  const user = findUserByEmail(email);

  if (user && user.password === password) {
    if (user.isVerified === false) { // Check verification status
      throw new Error('Email not verified. Please check your inbox for a verification link.');
    }
    return user;
  }
  throw new Error('Invalid email or password.');
};

export const signupUser = async (email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (MOCK_USERS.find(u => u.email === email) || (localStorage.getItem('oneSubNewUser') && JSON.parse(localStorage.getItem('oneSubNewUser')!).email === email)) {
    throw new Error('This email is already registered. Please log in.');
  }

  const newUser: User = {
    id: `new-user-${Date.now()}`,
    email,
    password, 
    role: 'user',
    isVerified: false, // New users are not verified by default
    registrationDate: new Date().toISOString().split('T')[0], // Set registration date
    subscriptionStatus: 'none',
    activeSubscriptions: [],
    unlockedPerks: [], // Initialize unlockedPerks
    fullName: email.split('@')[0], 
    profilePictureUrl: `https://picsum.photos/seed/${Date.now()}/200/200`,
    // Initialize credit fields
    totalCreditsEarned: 0,
    creditsAvailable: 0,
    creditsRedeemed: 0,
  };

  localStorage.setItem('oneSubNewUser', JSON.stringify(newUser));
  
  const mockVerificationLink = `#/verify-email-mock-link-for-${email}`; // Not a real route, just for notification
  notificationService.sendWelcomeEmail(newUser.email, newUser.fullName);
  notificationService.sendVerificationEmail(newUser.email, newUser.fullName, mockVerificationLink);
  notificationService.sendNewUserAdminAlert(newUser.email, newUser.role);
  
  return newUser; 
};

export const markUserAsVerified = async (email: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = findUserByEmail(email);
    if (!user) {
        throw new Error("User not found for verification.");
    }
    const updatedUser = { ...user, isVerified: true };
    updateUserInMockStorage(updatedUser);
    
    // If it was the temp new user, we might want to move it to MOCK_USERS for persistence in this session
    // but for simplicity, login will find it in localStorage first if needed.
    // Or AuthContext can update its state and main localStorage copy.
    console.log(`AUTH_SERVICE: User ${email} marked as verified.`);
    return updatedUser;
};


export const logoutUser = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return Promise.resolve();
};

export const updateUserProfileData = async (currentUser: User, dataToUpdate: Partial<FullUserProfile>, currentPassword?: string, newPassword?: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    let userToUpdate = MOCK_USERS.find(u => u.id === currentUser.id);
    let isTempNewUser = false;
    if(!userToUpdate){
        const tempUserRaw = localStorage.getItem('oneSubNewUser');
        if(tempUserRaw){
            const tempUser = JSON.parse(tempUserRaw) as User;
            if(tempUser.id === currentUser.id){
                userToUpdate = tempUser;
                isTempNewUser = true;
            }
        }
    }

    if (!userToUpdate) {
        throw new Error("User not found to update.");
    }

    // Password change logic
    if (newPassword) {
        if (!currentPassword || userToUpdate.password !== currentPassword) {
            throw new Error("Current password does not match.");
        }
        if (newPassword.length < 6) {
            throw new Error("New password must be at least 6 characters long.");
        }
        dataToUpdate.password = newPassword; // Update password in the data to be merged
    } else {
        // Ensure password isn't accidentally wiped if not changing
        delete dataToUpdate.password;
    }

    // Ensure registrationDate is not overwritten if not explicitly in dataToUpdate
    if (dataToUpdate.registrationDate === undefined && userToUpdate.registrationDate) {
        dataToUpdate.registrationDate = userToUpdate.registrationDate;
    }


    const updatedUser: User = { ...userToUpdate, ...dataToUpdate };

    if(isTempNewUser){
        localStorage.setItem('oneSubNewUser', JSON.stringify(updatedUser));
    } else {
        const index = MOCK_USERS.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            MOCK_USERS[index] = updatedUser;
        }
    }
    // Also update the general 'oneSubUser' in localStorage if it's the current session user
    if (localStorage.getItem('oneSubUser') && JSON.parse(localStorage.getItem('oneSubUser')!).id === updatedUser.id) {
        localStorage.setItem('oneSubUser', JSON.stringify(updatedUser));
    }
    
    console.log("AUTH_SERVICE: User profile updated", updatedUser.fullName);
    // Simulate notification for password change if it occurred
    if (newPassword && dataToUpdate.password) {
        notificationService.sendPasswordChangedConfirmation(updatedUser.email, updatedUser.fullName || updatedUser.email);
    }

    return updatedUser;
};

export const requestPasswordReset = async (email: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    const user = findUserByEmail(email);
    if (!user) {
        // To prevent email enumeration, don't reveal if email exists
        console.log(`AUTH_SERVICE: Password reset requested for ${email} (if user exists, email sent).`);
        // Simulate sending email anyway for UX
        notificationService.sendPasswordResetEmail(email, "User", `#/reset-password-mock-link-for-${email}`, "MOCK_TOKEN_123");
        return "MOCK_TOKEN_123"; // Return mock token for testing/mock UI
    }
    const mockToken = `RESET_TOKEN_${Date.now()}`;
    // Store token temporarily (e.g., in localStorage or associate with user in mock DB)
    // For this mock, we'll just log it and assume the ResetPasswordPage gets it.
    localStorage.setItem(`resetToken_${email}`, mockToken);
    console.log(`AUTH_SERVICE: Password reset token for ${email}: ${mockToken}`);
    notificationService.sendPasswordResetEmail(user.email, user.fullName || user.email, `#/reset-password?token=${mockToken}&email=${email}`, mockToken);
    return mockToken;
};

export const resetPassword = async (email: string, token: string, newPassword: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = findUserByEmail(email);
    const storedToken = localStorage.getItem(`resetToken_${email}`);

    if (!user || !storedToken || storedToken !== token) {
        throw new Error("Invalid or expired password reset token.");
    }
    if (newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters long.");
    }

    const updatedUser = { ...user, password: newPassword };
    updateUserInMockStorage(updatedUser);
    
    localStorage.removeItem(`resetToken_${email}`); // Clean up token
    notificationService.sendPasswordChangedConfirmation(updatedUser.email, updatedUser.fullName || updatedUser.email);
    console.log(`AUTH_SERVICE: Password reset successfully for ${email}`);
    return updatedUser;
};