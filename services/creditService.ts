
import { User, Bundle, ActiveSubscription } from '../types';
import { MOCK_USERS } from '../constants'; // For updating user in mock storage

// Helper to update a user in MOCK_USERS array by ID and localStorage
const updateUserInMockData = (updatedUser: User): void => {
  const index = MOCK_USERS.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    MOCK_USERS[index] = { ...MOCK_USERS[index], ...updatedUser };
  } else {
    // If user not in MOCK_USERS (e.g. new user not yet pushed to MOCK_USERS),
    // this function won't update them in that array.
    // AuthContext is responsible for handling new users and persisting them correctly.
    console.warn(`CreditService: User with ID ${updatedUser.id} not found in MOCK_USERS array for direct update. Ensure AuthContext handles persistence.`);
  }
  
  // Always update the user in localStorage if they are the currently logged-in user
  const storedUserRaw = localStorage.getItem('oneSubUser');
  if (storedUserRaw) {
      const storedUser = JSON.parse(storedUserRaw);
      if (storedUser.id === updatedUser.id) {
          localStorage.setItem('oneSubUser', JSON.stringify(updatedUser));
      }
  }
};


export const calculateAndApplyMonthlyCredits = (user: User, bundlesData: Bundle[]): User => {
  let creditsEarnedThisCycle = 0;
  const now = new Date().toISOString();

  if (!user.activeSubscriptions) {
    return {
        ...user, // Return user as is, but update timestamp
        lastCreditUpdateTimestamp: now,
    };
  }

  user.activeSubscriptions.forEach(sub => {
    if (sub.status === 'active' && sub.creditRate > 0 && sub.monthlyAmountForCredits > 0) {
        // For this simulation, we just calculate based on the stored monthlyAmountForCredits
        // In a real system, you'd ensure this calculation happens once per billing period for each sub.
        creditsEarnedThisCycle += sub.monthlyAmountForCredits * sub.creditRate;
    }
  });
  
  creditsEarnedThisCycle = parseFloat(creditsEarnedThisCycle.toFixed(2));

  const newTotalCreditsEarned = parseFloat(((user.totalCreditsEarned || 0) + creditsEarnedThisCycle).toFixed(2));
  const newCreditsAvailable = parseFloat(((user.creditsAvailable || 0) + creditsEarnedThisCycle).toFixed(2));

  const updatedUser: User = {
    ...user,
    totalCreditsEarned: newTotalCreditsEarned,
    creditsAvailable: newCreditsAvailable,
    lastCreditUpdateTimestamp: now,
  };
  
  // Note: MOCK_USERS modification here is for broad demo consistency.
  // The primary source of truth for the logged-in user is AuthContext's state,
  // which should be updated by the caller of this service function.
  updateUserInMockData(updatedUser); 
  return updatedUser;
};

export const redeemUserCredits = (user: User, amountToRedeem: number): User => {
  const redeemableAmount = parseFloat(amountToRedeem.toFixed(2));
  if (redeemableAmount <= 0) {
    throw new Error("Amount to redeem must be positive.");
  }
  if (!user.creditsAvailable || user.creditsAvailable < redeemableAmount) {
    throw new Error("Insufficient available credits.");
  }

  const newCreditsAvailable = parseFloat((user.creditsAvailable - redeemableAmount).toFixed(2));
  const newCreditsRedeemed = parseFloat(((user.creditsRedeemed || 0) + redeemableAmount).toFixed(2));
  
  const updatedUser: User = {
    ...user,
    creditsAvailable: newCreditsAvailable,
    creditsRedeemed: newCreditsRedeemed,
    lastCreditUpdateTimestamp: new Date().toISOString(),
  };

  updateUserInMockData(updatedUser);
  return updatedUser;
};

export const adjustUserCreditsByAdmin = (adminPerformingUpdate: User, targetUserId: string, newAvailableBalance: number): User => {
    if (adminPerformingUpdate.role !== 'admin') {
        throw new Error("Unauthorized: Only admins can adjust credit balances.");
    }
    if (newAvailableBalance < 0) {
        throw new Error("Credit balance cannot be negative.");
    }

    const targetUserIndex = MOCK_USERS.findIndex(u => u.id === targetUserId);
    if (targetUserIndex === -1) {
        throw new Error(`User with ID ${targetUserId} not found.`);
    }

    const targetUser = MOCK_USERS[targetUserIndex];
    const oldAvailable = targetUser.creditsAvailable || 0;
    const difference = newAvailableBalance - oldAvailable;

    // Adjust totalEarned if available credits are increased beyond what was redeemed + current available
    // This logic might need refinement based on exact requirements for adjustments
    let newTotalEarned = targetUser.totalCreditsEarned || 0;
    if (difference > 0) { // Credits were added
        newTotalEarned += difference;
    } else { // Credits were removed
        // If credits are removed, totalEarned isn't typically reduced unless it's correcting an error.
        // For simplicity, we won't reduce totalEarned here, assuming adjustments affect 'available'.
        // A more complex system might track 'adjustments' separately.
    }


    const updatedUser: User = {
        ...targetUser,
        creditsAvailable: parseFloat(newAvailableBalance.toFixed(2)),
        totalCreditsEarned: parseFloat(newTotalEarned.toFixed(2)), // Potentially adjusted
        lastCreditUpdateTimestamp: new Date().toISOString(),
    };
    
    MOCK_USERS[targetUserIndex] = updatedUser; // Update in the main mock array
    
    // If the adjusted user is the currently logged-in user, update localStorage
    const storedUserRaw = localStorage.getItem('oneSubUser');
    if (storedUserRaw) {
        const storedUser = JSON.parse(storedUserRaw) as User;
        if (storedUser.id === targetUserId) {
            localStorage.setItem('oneSubUser', JSON.stringify(updatedUser));
        }
    }
    console.log(`ADMIN ACTION: User ${targetUser.email} credits adjusted by ${adminPerformingUpdate.email}. New available: ${updatedUser.creditsAvailable}`);
    return updatedUser;
};


export const formatCredits = (amount?: number): string => {
  if (amount === undefined || amount === null) return 'C0.00';
  // Using 'C' as a mock credit symbol, similar to currency formatting
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // Base currency for formatting, symbol will be replaced
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('$', 'C');
};
