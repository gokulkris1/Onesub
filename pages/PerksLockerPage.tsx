
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_PERKS_CATALOG, MOCK_PARTNERS, BUNDLES_DATA, GiftIcon } from '../constants';
import { Perk, UserPerkStatus, Route, Partner } from '../types';
import * as perkService from '../services/perkService';

interface PerksLockerPageProps {
  navigateTo: (page: Route) => void;
}

const PerksLockerPage: React.FC<PerksLockerPageProps> = ({ navigateTo }) => {
  const { currentUser, claimAndRedeemPerk, checkAndRefreshPerks, isLoading: authIsLoading } = useAuth();
  const [isLoadingPerks, setIsLoadingPerks] = useState(false);
  
  // Perks displayed are from the catalog, status comes from currentUser.unlockedPerks
  const perksToDisplay = MOCK_PERKS_CATALOG; 

  useEffect(() => {
    // Initial perk status check when component mounts or user changes
    if (currentUser) {
        handleRefreshPerks();
    }
  }, [currentUser?.id]); // Depend on currentUser.id to re-run if user logs in/out

  const handleRefreshPerks = async () => {
    if (!currentUser) return;
    setIsLoadingPerks(true);
    try {
      await checkAndRefreshPerks();
    } catch (error) {
      console.error("Error refreshing perks:", error);
      // Toast notification is handled by AuthContext
    } finally {
      setIsLoadingPerks(false);
    }
  };

  const handleClaimPerk = async (perkId: string) => {
    if (!currentUser) return;
    // No need for setIsLoadingPerks here as AuthContext's claimAndRedeemPerk handles its own loading state.
    try {
      await claimAndRedeemPerk(perkId);
    } catch (error) {
      console.error("Error claiming perk:", error);
       // Toast notification is handled by AuthContext
    }
  };
  
  if (!currentUser) {
    // Should be handled by App.tsx routing, but as a fallback:
    return (
        <div className="text-center p-8">
            <p className="text-xl text-slate-700">Please log in to view your Perks Locker.</p>
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-slate-200">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-4 sm:mb-0">
          <GiftIcon className="w-8 h-8 inline-block mr-2 text-blue-600" />
          Your Perks Locker
        </h2>
        <button
          onClick={handleRefreshPerks}
          disabled={authIsLoading || isLoadingPerks}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors duration-150 disabled:opacity-60"
        >
          {authIsLoading || isLoadingPerks ? 'Refreshing...' : 'Refresh Perk Status'}
        </button>
      </div>

      {perksToDisplay.length === 0 && !isLoadingPerks && (
        <p className="text-slate-600 text-center py-10">No perks available at the moment. Check back soon!</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {perksToDisplay.map((perk) => {
          const userPerk = currentUser.unlockedPerks?.find(up => up.perkId === perk.id);
          const partner = MOCK_PARTNERS.find(p => p.id === perk.partnerId);
          const { message: unlockMessage, isUnlocked, progress } = perkService.getPerkUnlockProgressDisplay(currentUser, perk, BUNDLES_DATA);

          let cardBgColor = 'bg-white';
          let borderColor = 'border-slate-200';
          if (userPerk?.status === 'unlocked') {
            cardBgColor = 'bg-green-50';
            borderColor = 'border-green-400';
          } else if (userPerk?.status === 'redeemed') {
            cardBgColor = 'bg-sky-50';
            borderColor = 'border-sky-400';
          } else if (!perk.activeStatus || (perk.expiryDate && new Date(perk.expiryDate) < new Date())) {
            cardBgColor = 'bg-slate-100 opacity-70';
            borderColor = 'border-slate-300';
          }


          return (
            <div key={perk.id} className={`rounded-xl shadow-lg overflow-hidden flex flex-col border ${borderColor} ${cardBgColor}`}>
              {perk.imageUrl && (
                <img src={perk.imageUrl} alt={perk.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-5 flex flex-col flex-grow">
                {partner && (
                  <div className="flex items-center mb-2">
                    <img src={partner.logoUrl} alt={partner.name} className="h-8 w-auto mr-2 object-contain" />
                    <span className="text-xs text-slate-500">Offered by {partner.name}</span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-slate-800 mb-1">{perk.title}</h3>
                <p className="text-xs text-slate-600 mb-3 flex-grow min-h-[3em]">{perk.description}</p>

                <div className="mt-auto space-y-3">
                  {userPerk?.status === 'redeemed' ? (
                    <div className="p-3 bg-sky-100 rounded-md text-center">
                      <p className="text-sm font-semibold text-sky-700">Perk Redeemed!</p>
                      {userPerk.redemptionInfo?.method === 'CODE' && userPerk.redemptionInfo.value && (
                        <p className="text-xs text-sky-600 mt-1">Your Code: <span className="font-bold">{userPerk.redemptionInfo.value}</span></p>
                      )}
                       {userPerk.redemptionInfo?.method === 'LINK' && userPerk.redemptionInfo.value && (
                         <a href={userPerk.redemptionInfo.value} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 hover:text-sky-700 underline mt-1 block">Access Perk Link</a>
                      )}
                      {userPerk.redemptionInfo?.instructions && <p className="text-xs text-slate-500 mt-1">{userPerk.redemptionInfo.instructions}</p>}
                    </div>
                  ) : userPerk?.status === 'unlocked' ? (
                    <div className="p-3 bg-green-100 rounded-md">
                      <p className="text-sm font-semibold text-green-700 mb-2 text-center">🎉 Unlocked! Ready to Claim.</p>
                      <button
                        onClick={() => handleClaimPerk(perk.id)}
                        disabled={authIsLoading}
                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors disabled:opacity-60"
                      >
                        {authIsLoading ? 'Processing...' : 'Claim Perk'}
                      </button>
                       {perk.delivery.instructions && <p className="text-xs text-slate-500 mt-2">{perk.delivery.instructions}</p>}
                    </div>
                  ) : ( // Locked
                    <div className="p-3 bg-slate-100 rounded-md">
                      <p className="text-sm font-semibold text-slate-700 mb-1">🔒 Locked</p>
                      <p className="text-xs text-slate-500">{unlockMessage}</p>
                      {/* Optional: Show detailed progress */}
                      {progress && progress.length > 0 && !isUnlocked && (
                        <div className="mt-2 space-y-1">
                          {progress.map((p, idx) => (
                            !p.unit.includes('subscribed to') && // Don't show progress bar for specific bundle subscription
                            <div key={idx}>
                                <div className="flex justify-between text-xs text-slate-500 mb-0.5">
                                    <span>{p.current >= p.target ? 'Completed' : `${p.current} / ${p.target} ${p.unit}`}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5">
                                    <div 
                                        className={`h-1.5 rounded-full ${p.current >= p.target ? 'bg-green-500' : 'bg-blue-500'}`} 
                                        style={{ width: `${Math.min(100, (p.current / p.target) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {perk.expiryDate && (
                     <p className="text-xs text-slate-400 text-center mt-1">
                        Offer expires: {new Date(perk.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                   {!perk.activeStatus && (
                     <p className="text-xs text-red-500 font-semibold text-center mt-1">Perk currently inactive.</p>
                   )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerksLockerPage;