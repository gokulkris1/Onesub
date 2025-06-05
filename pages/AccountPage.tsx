

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BUNDLES_DATA, GiftIcon } from '../constants';
import { Route, Bundle as BundleType, ActiveSubscription, BillingAddress as BillingAddressType } from '../types';
import { formatCurrency } from '../utils';
import * as billingService from '../services/billingService'; 
import { formatCredits } from '../services/creditService'; // Import formatCredits

interface AccountPageProps {
  navigateTo: (page: Route) => void;
}

interface MockBillingHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
}


const AccountPage: React.FC<AccountPageProps> = ({ navigateTo }) => {
  const { currentUser, cancelBundleSubscription, pauseUserSubscription, resumeUserSubscription, isLoading, refreshUserCredits } = useAuth();
  const [mockBillingHistory, setMockBillingHistory] = useState<MockBillingHistoryItem[]>([]);
  const [showBillingHistory, setShowBillingHistory] = useState(false);

  if (!currentUser) {
    return (
      <div className="text-center p-8">
        <p className="text-xl text-slate-700">Please log in to view your account.</p>
        <button 
            onClick={() => navigateTo('home')}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
        >
            Go to Homepage
        </button>
      </div>
    );
  }

  const handleEditProfile = () => {
    navigateTo('edit-profile');
  };

  const handleCancel = async (bundleId: string) => {
    const bundleDetails = BUNDLES_DATA.find(b => b.id === bundleId);
    if (window.confirm(`Are you sure you want to cancel your subscription to "${bundleDetails?.name || 'this bundle'}"?`)) {
      try {
        await cancelBundleSubscription(bundleId);
      } catch (error) {
        console.error("Failed to cancel subscription:", error);
        // Error toast will be shown by AuthContext
      }
    }
  };
  
  const handlePause = async (bundleId: string) => {
    const duration = prompt("For how many days would you like to pause this subscription? (e.g., 30, 60, 90)", "30");
    if (duration && !isNaN(parseInt(duration)) && parseInt(duration) > 0) {
      try {
        await pauseUserSubscription(bundleId, parseInt(duration));
      } catch (error) {
        console.error("Failed to pause subscription:", error);
        // Error toast will be shown by AuthContext
      }
    } else if (duration !== null) {
      alert("Invalid duration. Please enter a positive number of days.");
    }
  };

  const handleResume = async (bundleId: string) => {
    try {
      await resumeUserSubscription(bundleId);
    } catch (error) {
      console.error("Failed to resume subscription:", error);
      // Error toast will be shown by AuthContext
    }
  };

  const simulateBillingEvents = () => {
    if (currentUser?.activeSubscriptions && currentUser.activeSubscriptions.length > 0 && currentUser.email) {
        const firstSub = currentUser.activeSubscriptions[0];
        const bundleDetails = BUNDLES_DATA.find(b => b.id === firstSub.bundleId);
        if(bundleDetails) {
            const amount = firstSub.cycle === 'annually' ? firstSub.pricePaid / 12 : firstSub.pricePaid;
            billingService.triggerPaymentReminder(currentUser.email, bundleDetails.name, amount, firstSub.nextBillingDate || new Date().toISOString().split('T')[0] );
            billingService.triggerPaymentReceipt(currentUser.email, bundleDetails.name, amount, new Date().toISOString().split('T')[0]);
            alert("Simulated billing event notifications logged to console for the first active subscription.");
        }
    } else {
        alert("No active subscriptions to simulate billing events for, or user email missing.");
    }
  };
  
  const fetchMockBillingHistory = async () => {
      if (currentUser?.id) {
          const history = await billingService.getMockBillingHistory(currentUser.id);
          setMockBillingHistory(history);
          setShowBillingHistory(true);
      }
  };

  const handleRefreshCredits = async () => {
    try {
        await refreshUserCredits();
    } catch (error) {
        console.error("Failed to refresh credits from AccountPage:", error);
        // Toast notification handled by AuthContext
    }
  };


  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-8 text-center border-b border-slate-200 pb-4">
        My Account Dashboard
      </h2>

      {/* Profile Information Section */}
      <section className="mb-8 p-6 bg-slate-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-1 flex flex-col items-center md:items-start">
          {currentUser.profilePictureUrl && (
            <img 
              src={currentUser.profilePictureUrl} 
              alt={currentUser.fullName || currentUser.email}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg mb-4"
            />
          )}
          <button 
            onClick={handleEditProfile}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Edit Profile / Change Picture
          </button>
        </div>
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-2xl font-semibold text-blue-600">
            {currentUser.fullName || "Valued User"}
          </h3>
          <p className="text-slate-700">
            <span className="font-medium text-slate-800">Email:</span> {currentUser.email} {currentUser.isVerified === false && <span className="text-xs text-red-500 ml-1">(Not Verified)</span>}
          </p>
          {currentUser.phone && (
            <p className="text-slate-700">
              <span className="font-medium text-slate-800">Phone:</span> {currentUser.phone}
            </p>
          )}
          {currentUser.dateOfBirth && (
             <p className="text-slate-700">
              <span className="font-medium text-slate-800">Date of Birth:</span> {currentUser.dateOfBirth}
            </p>
          )}
        </div>
      </section>

      {/* OneSub Credits Section */}
      <section className="mb-8 p-6 bg-emerald-50 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-emerald-700 mb-3">OneSub Credits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-emerald-100 rounded text-center">
                <p className="text-xs text-emerald-600">Available</p>
                <p className="text-2xl font-bold text-emerald-700">{formatCredits(currentUser.creditsAvailable)}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded text-center">
                <p className="text-xs text-slate-500">Total Earned</p>
                <p className="text-lg font-semibold text-slate-700">{formatCredits(currentUser.totalCreditsEarned)}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded text-center">
                <p className="text-xs text-slate-500">Total Redeemed</p>
                <p className="text-lg font-semibold text-slate-700">{formatCredits(currentUser.creditsRedeemed)}</p>
            </div>
        </div>
        <p className="text-xs text-slate-600 mb-3">
            Earn 1% back in OneSub Credits for the monthly value of each active linked subscription. 
            Credits are added to your available balance and can be used towards future OneSub purchases or subscription payments on our platform.
        </p>
        <div className="flex items-center space-x-3">
            <button 
                onClick={handleRefreshCredits}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
            >
                {isLoading ? 'Processing...' : 'Simulate Monthly Credit Update'}
            </button>
            {currentUser.lastCreditUpdateTimestamp && (
                <p className="text-xs text-slate-500">Last Updated: {new Date(currentUser.lastCreditUpdateTimestamp).toLocaleString()}</p>
            )}
        </div>
        <p className="text-xs text-slate-500 mt-2"> (Note: Pending credits and unlock conditions are future enhancements. Currently, all earned credits are available immediately.)</p>
      </section>

      {/* My Perks Locker Section */}
      <section className="mb-8 p-6 bg-indigo-50 rounded-lg shadow">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-indigo-700">
                <GiftIcon className="w-6 h-6 inline-block mr-2 text-indigo-600" />
                My Perks Locker
            </h3>
            <button 
                onClick={() => navigateTo('perks-locker')}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
            >
                View All Perks
            </button>
        </div>
        <p className="text-xs text-slate-600 mt-2">
            Discover and claim exclusive rewards from our partners based on your activity and subscriptions.
        </p>
      </section>


      {/* Billing Address Section */}
      {currentUser.billingAddress && (
        <section className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-xl font-semibold text-slate-800 mb-3">Billing Address</h3>
          <address className="not-italic text-slate-700 space-y-1">
            <p>{currentUser.billingAddress.street}</p>
            <p>{currentUser.billingAddress.city}, {currentUser.billingAddress.county}</p>
            <p>{currentUser.billingAddress.eircode}</p>
            <p>{currentUser.billingAddress.country}</p>
          </address>
          <button 
            onClick={handleEditProfile} 
            className="mt-3 text-sm text-blue-600 hover:text-blue-500"
          >
            Edit Address
          </button>
        </section>
      )}
      
      {/* Subscriptions Section */}
      <section className="mb-8 p-6 bg-slate-50 rounded-lg">
        <h3 className="text-xl font-semibold text-green-600 mb-4">My Subscriptions</h3>
        {currentUser.activeSubscriptions && currentUser.activeSubscriptions.length > 0 ? (
          <ul className="space-y-6">
            {currentUser.activeSubscriptions.map((sub: ActiveSubscription) => {
              const bundleDetails = BUNDLES_DATA.find(b => b.id === sub.bundleId);
              if (!bundleDetails) return null;
              return (
                <li key={sub.bundleId} className={`p-4 rounded-md shadow ${sub.status === 'paused' ? 'bg-yellow-100 border border-yellow-300' : 'bg-slate-100'}`}>
                  <h4 className="text-lg font-semibold text-slate-800 mb-1">{bundleDetails.name}</h4>
                  <p className="text-sm text-slate-600">Cycle: <span className="capitalize">{sub.cycle}</span></p>
                  <p className="text-sm text-slate-600">Price Paid: {formatCurrency(sub.pricePaid)} ({sub.cycle === 'annually' ? 'per year' : 'per month'})</p>
                  <p className="text-sm text-slate-600">Subscribed: {new Date(sub.subscribedDate).toLocaleDateString()}</p>
                  <p className="text-xs text-slate-500">Monthly value for credits: {formatCurrency(sub.monthlyAmountForCredits)} (at {sub.creditRate*100}%)</p>
                  {sub.status === 'paused' && sub.pauseEndDate && (
                    <p className="text-sm text-yellow-700 font-semibold">Paused until: {new Date(sub.pauseEndDate).toLocaleDateString()}</p>
                  )}
                  {sub.status === 'active' && sub.nextBillingDate && <p className="text-sm text-slate-600">Next Billing: {new Date(sub.nextBillingDate).toLocaleDateString()}</p>}
                  
                  <div className="mt-3 space-x-2 flex flex-wrap gap-2">
                    {sub.status === 'active' && (
                        <>
                            <button 
                              onClick={() => handlePause(sub.bundleId)}
                              disabled={isLoading}
                              className="px-4 py-1.5 text-xs bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
                            >
                              {isLoading ? 'Processing...' : `Pause`}
                            </button>
                            <button 
                              onClick={() => handleCancel(sub.bundleId)}
                              disabled={isLoading}
                              className="px-4 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
                            >
                              {isLoading ? 'Processing...' : `Cancel`}
                            </button>
                        </>
                    )}
                    {sub.status === 'paused' && (
                         <button 
                          onClick={() => handleResume(sub.bundleId)}
                          disabled={isLoading}
                          className="px-4 py-1.5 text-xs bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
                        >
                          {isLoading ? 'Processing...' : `Resume`}
                        </button>
                    )}
                    <button className="px-4 py-1.5 text-xs bg-slate-400 hover:bg-slate-500 text-slate-900 font-semibold rounded-md transition-colors disabled:opacity-50" disabled>
                        Change Cycle (soon)
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : currentUser.subscriptionStatus === 'canceled' ? (
          <p className="text-slate-600">
            You previously had subscriptions. You can subscribe to a new bundle anytime.
          </p>
        ) : (
          <p className="text-slate-600">
            You do not have any active subscriptions.
          </p>
        )}
        {(!currentUser.activeSubscriptions || currentUser.activeSubscriptions.length === 0) && (
             <button 
                onClick={() => navigateTo('home')}
                className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition-colors"
            >
                Explore More Bundles
            </button>
        )}
      </section>
      
      <section className="mb-8 p-6 bg-slate-50 rounded-lg">
         <h3 className="text-xl font-semibold text-slate-800 mb-3">Billing & Payment</h3>
         <div className="space-x-3">
            <button onClick={fetchMockBillingHistory} className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50">
            View Billing History
            </button>
            <button 
                onClick={handleEditProfile} 
                className="text-sm text-blue-600 hover:text-blue-500"
            >
                Update Payment Method
            </button>
            <button onClick={simulateBillingEvents} className="text-sm text-yellow-500 hover:text-yellow-400" title="For Dev: Simulates payment reminder & receipt notifications for first active sub">
                Simulate Billing Notifications
            </button>
         </div>
         {showBillingHistory && (
            <div className="mt-4 overflow-x-auto">
                <h4 className="text-md font-semibold text-slate-700 mb-2">Billing History (Mock)</h4>
                <table className="w-full min-w-max text-sm text-left text-slate-700">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-200">
                        <tr>
                            <th scope="col" className="px-4 py-2">Date</th>
                            <th scope="col" className="px-4 py-2">Description</th>
                            <th scope="col" className="px-4 py-2 text-right">Amount</th>
                            <th scope="col" className="px-4 py-2 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockBillingHistory.map(item => (
                            <tr key={item.id} className="bg-slate-50 border-b border-slate-200 hover:bg-slate-100">
                                <td className="px-4 py-2">{new Date(item.date).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{item.description}</td>
                                <td className="px-4 py-2 text-right">{formatCurrency(item.amount)}</td>
                                <td className="px-4 py-2 text-center">
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                        item.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                        item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                         {mockBillingHistory.length === 0 && (
                            <tr><td colSpan={4} className="text-center py-3 text-slate-500">No billing history found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
         )}
      </section>

      <section className="p-6 bg-slate-50 rounded-lg">
        <h3 className="text-xl font-semibold text-slate-800 mb-3">Notification Preferences</h3>
        <div className="space-y-2 text-slate-700">
            <label className="flex items-center space-x-2 hover:text-slate-900 cursor-pointer">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 disabled:opacity-50" defaultChecked disabled/>
                <span>Email me about new bundles & offers</span>
            </label>
            <label className="flex items-center space-x-2 hover:text-slate-900 cursor-pointer">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 disabled:opacity-50" defaultChecked disabled/>
                <span>Send email for subscription confirmations & cancellations</span>
            </label>
             <label className="flex items-center space-x-2 hover:text-slate-900 cursor-pointer">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 disabled:opacity-50" disabled/>
                <span>Receive weekly summary emails</span>
            </label>
        </div>
         <p className="text-xs text-slate-500 mt-2">(Notification preference management is a mock UI)</p>
      </section>
    </div>
  );
};

export default AccountPage;