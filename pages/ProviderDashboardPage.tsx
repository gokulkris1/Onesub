
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProviderServiceInfo, ProviderStats } from '../types';
// import AISuggestionBox from '../components/AISuggestionBox'; // Import the new component
import * as providerService from '../services/providerService'; // For mock data and actions

const ProviderDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [services, setServices] = useState<ProviderServiceInfo[]>([]);
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.id && currentUser.role === 'provider') {
        setIsLoadingData(true);
        try {
          const data = await providerService.getMockProviderDashboardData(currentUser.id);
          setServices(data.services);
          setStats(data.stats);
        } catch (error) {
          console.error("Failed to fetch provider dashboard data:", error);
        } finally {
          setIsLoadingData(false);
        }
      }
    };
    fetchData();
  }, [currentUser]);

  /*
  const generateProviderBundlePrompt = () => {
    const providerServiceCategories = currentUser?.businessName // Example: extract from business name or a dedicated field
      ? `related to services typically offered by ${currentUser.businessName}` 
      : "in categories like Digital Art Tools, Cloud Storage, or Online Courses"; // Fallback

    return `I am a service provider on the 'OneSub' platform. My business is ${currentUser?.businessName || 'a digital service provider'}. 
    My primary service offerings are ${providerServiceCategories}.
    Suggest 3 unique and marketable subscription bundle ideas that I could participate in to expand my reach or increase value for subscribers. 
    For each bundle idea, please list:
    1. A catchy "Bundle Name".
    2. 2-3 other complementary "Service Types" from different providers that would create a compelling package with my offerings.
    3. The key "Benefit for Subscribers" of this specific bundle.
    Present the information as a numbered list, with each bundle clearly delineated.`;
  };
  */
  
  const simulatePaymentNotices = () => {
    if (currentUser?.email) {
        providerService.triggerProviderInwardPayment(currentUser.email, "Ultimate Harmony Pack", 15.50, new Date().toLocaleDateString());
        providerService.triggerProviderUpcomingPayout(currentUser.email, 150.75, "End of Next Month");
        alert("Simulated provider payment notifications logged to console.");
    } else {
        alert("Current user email not found for notification simulation.");
    }
  };

  if (!currentUser || currentUser.role !== 'provider') {
    return <p className="text-red-600 text-center p-8">Access Denied. You must be a provider to view this page.</p>;
  }
  
  if (isLoadingData) {
    return <p className="text-slate-600 text-center py-10">Loading provider data...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl space-y-8">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-2 text-center border-b border-slate-200 pb-4">
        Provider Dashboard
      </h2>
      <p className="text-center text-slate-700 -mt-4 mb-8">Welcome, {currentUser.businessName || currentUser.fullName || currentUser.email}!</p>

      <section className="p-6 bg-slate-50 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-blue-600 mb-4">Your Active Services in Bundles</h3>
        {services.length > 0 ? (
          <ul className="space-y-3">
            {services.map(service => (
              <li key={service.id} className="p-3 bg-slate-100 rounded-md">
                <p className="font-medium text-slate-800">{service.name}</p>
                <p className="text-sm text-slate-600">
                  Part of: {service.participatingBundles.join(', ')}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500">You currently have no services active in any bundles. (Mock Data)</p>
        )}
         <button className="mt-4 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50" disabled>
            Manage Services (soon)
        </button>
      </section>

      {stats && (
        <section className="p-6 bg-slate-50 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-green-600 mb-4">Subscription Insights (Mock Data)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
            <div className="p-4 bg-slate-100 rounded-md">
              <p className="text-3xl font-bold">{stats.totalSubscribers.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Total Subscribers via OneSub</p>
            </div>
            <div className="p-4 bg-slate-100 rounded-md">
              <h4 className="font-semibold text-slate-800 mb-1">Most Popular Bundles:</h4>
              {stats.popularBundles.map(bundle => (
                <p key={bundle.name} className="text-sm text-slate-600">
                  {bundle.name}: {bundle.subscriberCount.toLocaleString()} subs
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {stats && (
        <section className="p-6 bg-slate-50 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-yellow-500 mb-4">Revenue Share (Mock Data)</h3>
          <div className="p-4 bg-slate-100 rounded-md">
            <p className="text-2xl font-bold text-slate-800">€{stats.monthlyRevenueShare.toFixed(2)}</p>
            <p className="text-sm text-slate-500">Estimated Earnings This Month</p>
            <p className="text-xs text-slate-400 mt-1">Next Payout Date: End of Month (Mock)</p>
          </div>
           <div className="mt-4 space-x-3">
            <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50" disabled>
                View Detailed Reports (soon)
            </button>
            <button onClick={simulatePaymentNotices} className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md" title="For Dev: Simulates payment notices to provider">
                Simulate Payment Notices
            </button>
           </div>
        </section>
      )}
      
      <section className="p-6 bg-slate-50 rounded-lg shadow">
        <p className="text-slate-600 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            AI Suggestion Box feature is currently disabled. A backend proxy (e.g., Firebase Function) needs to be implemented to use AI features.
        </p>
        {/*
         <AISuggestionBox title="AI-Powered Growth Opportunities" generatePrompt={generateProviderBundlePrompt} />
        */}
      </section>

      <section className="p-6 bg-slate-50 rounded-lg">
        <h3 className="text-xl font-semibold text-slate-800 mb-3">Provider Notification Preferences</h3>
        <div className="space-y-2 text-slate-700">
            <label className="flex items-center space-x-2 hover:text-slate-900 cursor-pointer">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 disabled:opacity-50" defaultChecked disabled/>
                <span>Email for new subscribers to my services</span>
            </label>
            <label className="flex items-center space-x-2 hover:text-slate-900 cursor-pointer">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 disabled:opacity-50" defaultChecked disabled/>
                <span>Monthly bundle performance updates</span>
            </label>
             <label className="flex items-center space-x-2 hover:text-slate-900 cursor-pointer">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 disabled:opacity-50" disabled/>
                <span>Alerts for new bundle opportunities</span>
            </label>
        </div>
         <p className="text-xs text-slate-500 mt-2">(Notification preference management is a mock UI)</p>
      </section>
    </div>
  );
};

export default ProviderDashboardPage;