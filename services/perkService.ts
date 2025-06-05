

import { User, Perk, UserPerkStatus, Bundle, UnlockCriterionType } from '../types';
import { MOCK_USERS, MOCK_PERKS_CATALOG, BUNDLES_DATA, MOCK_PARTNERS } from '../constants'; // Assuming MOCK_PERKS_CATALOG is now in constants

// Helper to update a user in MOCK_USERS array by ID and localStorage
const updateUserInMockData = (updatedUser: User): void => {
  const index = MOCK_USERS.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    MOCK_USERS[index] = { ...MOCK_USERS[index], ...updatedUser };
  }
  
  const storedUserRaw = localStorage.getItem('oneSubUser');
  if (storedUserRaw) {
      const storedUser = JSON.parse(storedUserRaw);
      if (storedUser.id === updatedUser.id) {
          localStorage.setItem('oneSubUser', JSON.stringify(updatedUser));
      }
  }
};

const calculateTotalMonthlySpend = (user: User): number => {
    if (!user.activeSubscriptions) return 0;
    return user.activeSubscriptions.reduce((total, sub) => {
        if (sub.status === 'active') {
            return total + sub.monthlyAmountForCredits;
        }
        return total;
    }, 0);
};

const getAccountAgeInDays = (user: User): number => {
    if (!user.registrationDate) return 0;
    const regDate = new Date(user.registrationDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - regDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export const evaluateSinglePerkUnlock = (user: User, perk: Perk, allBundlesData: Bundle[]): boolean => {
    if (!perk.activeStatus) return false;
    if (perk.expiryDate && new Date(perk.expiryDate) < new Date()) return false;

    return perk.unlockCriteria.every(criterion => {
        switch (criterion.type) {
            case 'MIN_SUBSCRIPTIONS_LINKED':
                const activeSubsCount = user.activeSubscriptions?.filter(s => s.status === 'active').length || 0;
                return activeSubsCount >= (criterion.value as number);
            case 'MIN_MONTHLY_SPEND':
                const totalSpend = calculateTotalMonthlySpend(user);
                return totalSpend >= (criterion.value as number);
            case 'SPECIFIC_BUNDLE_SUBSCRIBED':
                return user.activeSubscriptions?.some(s => s.bundleId === criterion.value && s.status === 'active') || false;
            case 'ACCOUNT_AGE_DAYS':
                const accountAge = getAccountAgeInDays(user);
                return accountAge >= (criterion.value as number);
            default:
                return false;
        }
    });
};

export const refreshUserPerkStatuses = (user: User, perksCatalog: Perk[], allBundlesData: Bundle[]): User => {
    const updatedUserPerks: UserPerkStatus[] = (user.unlockedPerks || []).map(up => ({...up})); // Clone existing

    perksCatalog.forEach(perk => {
        const existingUserPerk = updatedUserPerks.find(up => up.perkId === perk.id);
        const meetsCriteria = evaluateSinglePerkUnlock(user, perk, allBundlesData);

        if (meetsCriteria) {
            if (!existingUserPerk) { // New unlock
                updatedUserPerks.push({
                    perkId: perk.id,
                    status: 'unlocked',
                    dateUnlocked: new Date().toISOString(),
                    redemptionInfo: perk.delivery, // Pre-populate with delivery info
                });
            } else if (existingUserPerk.status === 'locked') { // Was locked, now unlocked
                existingUserPerk.status = 'unlocked';
                existingUserPerk.dateUnlocked = new Date().toISOString();
                existingUserPerk.redemptionInfo = perk.delivery;
            }
            // If already unlocked or redeemed, do nothing to its status here
        } else {
            // If criteria no longer met for a previously unlocked (but not redeemed) perk, re-lock it.
            // This is optional business logic. For simplicity, we won't re-lock for now.
            // If it was locked and still doesn't meet criteria, it remains locked (or isn't in the list).
            if (existingUserPerk && existingUserPerk.status === 'unlocked') {
                 // console.log(`User ${user.id} no longer meets criteria for ${perk.id}, but keeping it unlocked.`);
            } else if (!existingUserPerk) {
                // Ensure all perks from catalog have at least a 'locked' status if not meeting criteria
                // This makes sure the Perks Locker can display all perks.
                 updatedUserPerks.push({
                    perkId: perk.id,
                    status: 'locked',
                });
            }
        }
    });
    
    const finalUserPerks = perksCatalog.map(perk => {
        const foundUserPerk = updatedUserPerks.find(up => up.perkId === perk.id);
        if (foundUserPerk) return foundUserPerk;
        return { perkId: perk.id, status: 'locked' as 'locked'}; // Default to locked if not found
    });


    const updatedUser = { ...user, unlockedPerks: finalUserPerks };
    updateUserInMockData(updatedUser);
    return updatedUser;
};


export const claimUserPerk = (user: User, perkIdToClaim: string): User => {
    const userPerk = user.unlockedPerks?.find(p => p.perkId === perkIdToClaim);

    if (!userPerk) {
        throw new Error("Perk not found for this user.");
    }
    if (userPerk.status === 'locked') {
        throw new Error("Perk is locked and cannot be claimed.");
    }
    if (userPerk.status === 'redeemed') {
        console.warn("Perk has already been redeemed.");
        return user; // Or throw error, depending on desired behavior
    }

    const catalogPerk = MOCK_PERKS_CATALOG.find(p => p.id === perkIdToClaim);
    if (!catalogPerk) {
        throw new Error("Perk details not found in catalog.");
    }
    if (catalogPerk.expiryDate && new Date(catalogPerk.expiryDate) < new Date()) {
        throw new Error("This perk offer has expired.");
    }
    if (!catalogPerk.activeStatus) {
        throw new Error("This perk is currently not active.");
    }


    const updatedPerks = (user.unlockedPerks || []).map(p =>
        p.perkId === perkIdToClaim
            ? { ...p, status: 'redeemed' as 'redeemed', dateRedeemed: new Date().toISOString(), redemptionInfo: catalogPerk.delivery }
            : p
    );

    const updatedUser = { ...user, unlockedPerks: updatedPerks };
    updateUserInMockData(updatedUser);

    // Simulate delivery notification for manual email if applicable
    if (catalogPerk.delivery.method === 'MANUAL_EMAIL') {
        console.log(`PERK_SERVICE: User ${user.email} claimed perk '${catalogPerk.title}'. Manual email delivery required with details: ${catalogPerk.delivery.instructions || 'Follow up with user.'}`);
    }

    return updatedUser;
};

export const getPerkUnlockProgressDisplay = (user: User, perk: Perk, allBundlesData: Bundle[]): { message: string; isUnlocked: boolean; progress?: { current: number; target: number; unit: string }[] } => {
    const userPerkStatus = user.unlockedPerks?.find(up => up.perkId === perk.id);
    if (userPerkStatus?.status === 'unlocked' || userPerkStatus?.status === 'redeemed') {
        return { message: userPerkStatus.status === 'unlocked' ? 'Perk Unlocked! Ready to Claim.' : 'Perk Redeemed.', isUnlocked: true };
    }

    if (!perk.activeStatus || (perk.expiryDate && new Date(perk.expiryDate) < new Date())) {
        return { message: 'This perk is currently unavailable.', isUnlocked: false };
    }

    const progressDetails: { current: number; target: number; unit: string, description: string, met: boolean }[] = [];
    let allCriteriaMet = true;

    perk.unlockCriteria.forEach(criterion => {
        let currentVal: number = 0;
        let targetVal: number = typeof criterion.value === 'string' ? parseFloat(criterion.value) : criterion.value; // Ensure value is number for comparison
        let unit: string = '';
        let met = false;

        switch (criterion.type) {
            case 'MIN_SUBSCRIPTIONS_LINKED':
                currentVal = user.activeSubscriptions?.filter(s => s.status === 'active').length || 0;
                unit = 'subscriptions';
                met = currentVal >= targetVal;
                break;
            case 'MIN_MONTHLY_SPEND':
                currentVal = calculateTotalMonthlySpend(user);
                unit = 'EUR spent/month';
                met = currentVal >= targetVal;
                break;
            case 'SPECIFIC_BUNDLE_SUBSCRIBED':
                const isSubscribed = user.activeSubscriptions?.some(s => s.bundleId === criterion.value && s.status === 'active') || false;
                currentVal = isSubscribed ? 1 : 0;
                targetVal = 1; // Target is to be subscribed
                unit = `subscribed to ${allBundlesData.find(b=>b.id === criterion.value)?.name || 'specific bundle'}`;
                met = isSubscribed;
                break;
            case 'ACCOUNT_AGE_DAYS':
                currentVal = getAccountAgeInDays(user);
                unit = 'days as member';
                met = currentVal >= targetVal;
                break;
        }
        if (!met) allCriteriaMet = false;
        progressDetails.push({ current: currentVal, target: targetVal, unit, description: criterion.description, met });
    });
    
    if (allCriteriaMet) { // Should have been caught by userPerkStatus check, but as a fallback
         return { message: 'Perk Unlocked! Ready to Claim.', isUnlocked: true };
    }

    // Construct message from unmet criteria
    const unmetMessages = progressDetails
        .filter(p => !p.met)
        .map(p => p.description);
        // .map(p => `${p.description} (Currently: ${p.current} / ${p.target} ${p.unit.includes('subscribed to') ? '': p.unit})`);

    const message = unmetMessages.length > 0 ? `To unlock: ${unmetMessages.join(' AND ')}` : 'Check criteria.';

    return { 
        message, 
        isUnlocked: false, 
        progress: progressDetails.map(p => ({current: p.current, target: p.target, unit: p.unit})) 
    };
};


// --- Admin Functions ---
export const addPerkToCatalog = (adminUser: User, newPerkData: Omit<Perk, 'id' | 'activeStatus'> & { activeStatus?: boolean }): Perk => {
    if (adminUser.role !== 'admin') throw new Error("Unauthorized");
    const newPerk: Perk = {
        id: `perk_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        ...newPerkData,
        activeStatus: newPerkData.activeStatus !== undefined ? newPerkData.activeStatus : true, // Default to active
    };
    MOCK_PERKS_CATALOG.push(newPerk);
    console.log(`ADMIN: Perk "${newPerk.title}" added by ${adminUser.email}`);
    return newPerk;
};

export const updatePerkInCatalog = (adminUser: User, perkId: string, updates: Partial<Omit<Perk, 'id'>>): Perk => {
    if (adminUser.role !== 'admin') throw new Error("Unauthorized");
    const perkIndex = MOCK_PERKS_CATALOG.findIndex(p => p.id === perkId);
    if (perkIndex === -1) throw new Error("Perk not found in catalog");

    MOCK_PERKS_CATALOG[perkIndex] = { ...MOCK_PERKS_CATALOG[perkIndex], ...updates };
    console.log(`ADMIN: Perk "${MOCK_PERKS_CATALOG[perkIndex].title}" updated by ${adminUser.email}`);
    return MOCK_PERKS_CATALOG[perkIndex];
};

export const deletePerkFromCatalog = (adminUser: User, perkId: string): void => {
    if (adminUser.role !== 'admin') throw new Error("Unauthorized");
    
    const perkIndex = MOCK_PERKS_CATALOG.findIndex(p => p.id === perkId);
    if (perkIndex === -1) {
        throw new Error("Perk not found to delete");
    }

    MOCK_PERKS_CATALOG.splice(perkIndex, 1); // Mutate the array in place
    
    // Also remove this perk from all users' unlockedPerks lists
    MOCK_USERS.forEach(user => {
        if (user.unlockedPerks) {
            user.unlockedPerks = user.unlockedPerks.filter(up => up.perkId !== perkId);
        }
    });
    console.log(`ADMIN: Perk ID "${perkId}" deleted by ${adminUser.email} and removed from users.`);
};

export const getPerkRedemptionStats = (perkId: string): { unlockedCount: number; redeemedCount: number } => {
    let unlockedCount = 0;
    let redeemedCount = 0;
    MOCK_USERS.forEach(user => {
        const userPerk = user.unlockedPerks?.find(up => up.perkId === perkId);
        if (userPerk) {
            if (userPerk.status === 'unlocked') {
                unlockedCount++;
            } else if (userPerk.status === 'redeemed') {
                unlockedCount++; // Redeemed implies it was unlocked
                redeemedCount++;
            }
        }
    });
    return { unlockedCount, redeemedCount };
};

export const getFullPerksCatalog = (): Perk[] => {
    // Return a deep copy to prevent direct modification of the constant
    return JSON.parse(JSON.stringify(MOCK_PERKS_CATALOG));
};
