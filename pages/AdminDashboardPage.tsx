

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProviderApplicationInfo, PlatformUserInfo, AdminProviderInfo, User, Perk, Partner, UnlockCriterion } from '../types';
// import AISuggestionBox from '../components/AISuggestionBox'; 
import * as adminService from '../services/adminService';
import { formatCredits } from '../services/creditService'; 
import { MOCK_USERS, MOCK_PERKS_CATALOG, MOCK_PARTNERS, BUNDLES_DATA, GiftIcon } from '../constants'; 
import * as perkService from '../services/perkService';


const AdminDashboardPage: React.FC = () => {
  const { 
    currentUser, 
    adminSuspendUser, adminActivateUser, 
    adminSuspendProvider, adminActivateProvider, 
    adminAdjustUserCredits, 
    adminAddPerk, adminEditPerk, adminDeletePerk,
    isLoading: authIsLoading 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'onboarding' | 'users' | 'providers' | 'credits' | 'perks' | 'aiTools'>('overview');

  const [providerApps, setProviderApps] = useState<ProviderApplicationInfo[]>([]);
  const [platformUsersData, setPlatformUsersData] = useState<PlatformUserInfo[]>([]); 
  const [allUsersForCredits, setAllUsersForCredits] = useState<User[]>([]); 
  const [approvedProviders, setApprovedProviders] = useState<AdminProviderInfo[]>([]);
  const [overviewMetrics, setOverviewMetrics] = useState<any | null>(null); 
  const [isLoadingData, setIsLoadingData] = useState(false);

  // State for Perks Management
  const [perksCatalog, setPerksCatalog] = useState<Perk[]>([]);
  const [showAddPerkModal, setShowAddPerkModal] = useState(false);
  const [editingPerk, setEditingPerk] = useState<Perk | null>(null);
  const [newPerkData, setNewPerkData] = useState<Partial<Omit<Perk, 'id'>>>({
      title: '', partnerId: '', description: '', unlockCriteria: [{type: 'MIN_SUBSCRIPTIONS_LINKED', value: 1, description: ''}], delivery: {method: 'CODE', value: ''}, activeStatus: true, category: ''
  });


  const [newProviderForm, setNewProviderForm] = useState({
    businessName: '', contactEmail: '', taxId: '', street: '', city: '', serviceTypes: ''
  });
  const [creditAdjustment, setCreditAdjustment] = useState<{ userId: string; amount: string }>({ userId: '', amount: '' });


  const fetchData = async () => {
      if (currentUser?.role === 'admin') {
        setIsLoadingData(true);
        try {
          const [apps, usersInfo, providers, metrics, allFullUsers, currentPerks] = await Promise.all([
            adminService.getMockProviderApplications(),
            adminService.getMockPlatformUsers(), 
            adminService.getMockApprovedProviders(),
            adminService.getMockAdminOverviewMetrics(),
            adminService.getAllMockUsersFullProfile(), 
            perkService.getFullPerksCatalog(), // Fetch current perks catalog
          ]);
          setProviderApps(apps);
          setPlatformUsersData(usersInfo);
          setAllUsersForCredits(allFullUsers);
          setApprovedProviders(providers);
          setOverviewMetrics(metrics);
          setPerksCatalog(currentPerks);
        } catch (error) {
          console.error("Failed to fetch admin dashboard data:", error);
        } finally {
          setIsLoadingData(false);
        }
      }
    };

  useEffect(() => {
    fetchData();
  }, [currentUser]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProviderForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.email) {
        alert("Admin user email not found, cannot proceed with onboarding notification simulation.");
        return;
    }
    try {
      const onboardedApp = await adminService.onboardNewProvider(newProviderForm, currentUser.email);
      setProviderApps(prev => [...prev, onboardedApp]);
       if (onboardedApp.status === 'approved') { 
           const updatedProviders = await adminService.getMockApprovedProviders();
           setApprovedProviders(updatedProviders);
       }
      setNewProviderForm({ businessName: '', contactEmail: '', taxId: '', street: '', city: '', serviceTypes: '' }); 
      fetchData(); 
    } catch (error: any) {
      console.error(`Failed to onboard provider: ${error.message}`);
    }
  };

  const handleUserStatusChange = async (userId: string, currentStatus: 'active' | 'suspended') => {
    if (!currentUser || currentUser.id === userId) {
        alert("Admins cannot change their own status.");
        return;
    }
    try {
      const updatedUser = currentStatus === 'active' 
        ? await adminSuspendUser(userId) 
        : await adminActivateUser(userId);
      setPlatformUsersData(prevUsers => 
        prevUsers.map(u => u.id === userId ? { ...u, status: updatedUser.status } : u)
      );
      fetchData(); 
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const handleProviderStatusChange = async (providerId: string, currentStatus: 'active' | 'suspended') => {
     if (!currentUser || currentUser.id === providerId) { 
        alert("Admins cannot change their own provider status directly if applicable.");
        return;
    }
    try {
      const updatedProvider = currentStatus === 'active' 
        ? await adminSuspendProvider(providerId) 
        : await adminActivateProvider(providerId);
      setApprovedProviders(prevProviders => 
        prevProviders.map(p => p.id === providerId ? { ...p, status: updatedProvider.status } : p)
      );
      fetchData(); 
    } catch (error) {
      console.error("Failed to update provider status:", error);
    }
  };

  const handleCreditAdjustmentChange = (userId: string, amount: string) => {
    setCreditAdjustment({ userId, amount });
  };

  const handleApplyCreditAdjustment = async (targetUserId: string) => {
    if (creditAdjustment.userId !== targetUserId || creditAdjustment.amount === '') return;
    const amount = parseFloat(creditAdjustment.amount);
    if (isNaN(amount) || amount < 0) {
      alert("Invalid credit amount.");
      return;
    }
    try {
      const updatedUser = await adminAdjustUserCredits(targetUserId, amount);
      if (updatedUser) {
         setAllUsersForCredits(prevUsers => 
            prevUsers.map(u => u.id === targetUserId ? updatedUser : u)
         );
         setPlatformUsersData(prevPUsers => 
            prevPUsers.map(pu => pu.id === targetUserId ? { ...pu, creditsAvailable: updatedUser.creditsAvailable } : pu )
         );
      }
      setCreditAdjustment({ userId: '', amount: '' }); 
    } catch (error) {
      console.error("Failed to adjust credits:", error);
    }
  };

  // --- Perk Management Handlers ---
  const handleNewPerkChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith("criterion_")) {
        const [_, indexStr, field] = name.split("_");
        const index = parseInt(indexStr, 10);
        setNewPerkData(prev => {
            const criteria = [...(prev.unlockCriteria || [])];
            criteria[index] = { ...criteria[index], [field]: type === 'number' ? parseFloat(value) : value } as UnlockCriterion;
            return { ...prev, unlockCriteria: criteria};
        });
    } else if (name.startsWith("delivery_")) {
        const field = name.split("_")[1];
        setNewPerkData(prev => ({...prev, delivery: {...(prev.delivery!), [field]: value }}));
    } else {
        setNewPerkData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };
  
  const addUnlockCriterion = () => {
    setNewPerkData(prev => ({
        ...prev,
        unlockCriteria: [...(prev.unlockCriteria || []), { type: 'MIN_SUBSCRIPTIONS_LINKED', value: 1, description: '' }]
    }));
  };
  const removeUnlockCriterion = (index: number) => {
    setNewPerkData(prev => ({
        ...prev,
        unlockCriteria: prev.unlockCriteria?.filter((_, i) => i !== index)
    }));
  };


  const handleAddOrUpdatePerkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // Basic validation (can be more thorough)
    if (!newPerkData.title || !newPerkData.partnerId || !newPerkData.description || !newPerkData.delivery?.method) {
        alert("Please fill all required perk fields.");
        return;
    }
    if(newPerkData.unlockCriteria?.some(c => !c.type || c.value === undefined || !c.description)){
        alert("Please complete all fields for each unlock criterion.");
        return;
    }

    try {
        if (editingPerk) {
            await adminEditPerk(editingPerk.id, newPerkData);
        } else {
            await adminAddPerk(newPerkData as Omit<Perk, 'id' | 'activeStatus'> & { activeStatus?: boolean });
        }
        setShowAddPerkModal(false);
        setEditingPerk(null);
        setNewPerkData({ title: '', partnerId: '', description: '', unlockCriteria: [{type: 'MIN_SUBSCRIPTIONS_LINKED', value: 1, description: ''}], delivery: {method: 'CODE', value: ''}, activeStatus: true });
        fetchData(); // Refresh perks list
    } catch (err) {
        console.error("Failed to save perk", err);
        // Error toast handled by AuthContext
    }
  };

  const openEditPerkModal = (perk: Perk) => {
    setEditingPerk(perk);
    setNewPerkData({ ...perk }); // Pre-fill form
    setShowAddPerkModal(true);
  };

  const handleDeletePerk = async (perkId: string) => {
    if (!currentUser || !window.confirm("Are you sure you want to delete this perk? This action cannot be undone.")) return;
    try {
        await adminDeletePerk(perkId);
        fetchData(); // Refresh perks list
    } catch (err) {
        console.error("Failed to delete perk", err);
    }
  };
  // --- End Perk Management Handlers ---


  if (!currentUser || currentUser.role !== 'admin') {
    return <p className="text-red-600 text-center p-8">Access Denied. You must be an admin to view this page.</p>;
  }

  const renderSection = () => {
    if (isLoadingData) {
        return <p className="text-slate-600 text-center py-10">Loading admin data...</p>;
    }
    switch (activeTab) {
      case 'overview':
        return ( /* Overview content - unchanged */ 
            <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-slate-800 mb-4">Platform Overview</h3>
                {overviewMetrics ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-sky-100 p-4 rounded-lg shadow text-sky-800">
                            <p className="text-3xl font-bold">{overviewMetrics.totalUsers.toLocaleString()}</p>
                            <p className="text-sm">Total Users</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg shadow text-green-800">
                            <p className="text-3xl font-bold">{overviewMetrics.totalActiveProviders.toLocaleString()}</p>
                            <p className="text-sm">Active Providers</p>
                        </div>
                        <div className="bg-indigo-100 p-4 rounded-lg shadow text-indigo-800">
                            <p className="text-3xl font-bold">{overviewMetrics.totalActiveSubscriptions.toLocaleString()}</p>
                            <p className="text-sm">Active Subscriptions</p>
                        </div>
                        <div className="bg-amber-100 p-4 rounded-lg shadow text-amber-800">
                            <p className="text-3xl font-bold">€{overviewMetrics.mockMRR.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                            <p className="text-sm">Mock Monthly Recurring Revenue</p>
                        </div>
                    </div>
                ) : (
                    <p>Loading metrics...</p>
                )}
                <div className="mt-6 bg-slate-50 p-4 rounded-lg shadow">
                    <h4 className="text-lg font-medium text-slate-700">Recent Activity (Placeholder)</h4>
                    <p className="text-sm text-slate-500">Graphs and logs will appear here.</p>
                </div>
            </div>
        );
      case 'onboarding':
        return ( /* Onboarding content - unchanged */ 
          <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Provider Applications</h3>
                <div className="bg-slate-50 p-4 rounded-lg shadow">
                    {providerApps.length > 0 ? (
                        <ul className="divide-y divide-slate-200">
                        {providerApps.map(app => (
                            <li key={app.id} className="py-3 flex justify-between items-center">
                            <div>
                                <p className="font-medium text-slate-700">{app.businessName} <span className={`text-xs px-2 py-0.5 rounded-full ml-2 text-white ${app.status === 'pending' ? 'bg-yellow-500' : app.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}>{app.status}</span></p>
                                <p className="text-sm text-slate-500">{app.contactEmail} - Submitted: {new Date(app.dateSubmitted).toLocaleDateString()}</p>
                            </div>
                            <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md disabled:opacity-50" disabled>View Details (soon)</button>
                            </li>
                        ))}
                        </ul>
                    ) : <p className="text-slate-500">No pending provider applications.</p>}
                </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Onboard New Provider</h3>
              <form onSubmit={handleOnboardSubmit} className="bg-slate-50 p-6 rounded-lg shadow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                        <input type="text" name="businessName" id="businessName" value={newProviderForm.businessName} onChange={handleInputChange} className="w-full bg-white text-slate-900 p-2 rounded-md border border-slate-300 focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                        <input type="email" name="contactEmail" id="contactEmail" value={newProviderForm.contactEmail} onChange={handleInputChange} className="w-full bg-white text-slate-900 p-2 rounded-md border border-slate-300 focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="taxId" className="block text-sm font-medium text-slate-700 mb-1">Tax ID / VAT Number</label>
                        <input type="text" name="taxId" id="taxId" value={newProviderForm.taxId} onChange={handleInputChange} className="w-full bg-white text-slate-900 p-2 rounded-md border border-slate-300 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                     <div>
                        <label htmlFor="street" className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                        <input type="text" name="street" id="street" value={newProviderForm.street} onChange={handleInputChange} className="w-full bg-white text-slate-900 p-2 rounded-md border border-slate-300 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                     <div>
                        <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">City/Town</label>
                        <input type="text" name="city" id="city" value={newProviderForm.city} onChange={handleInputChange} className="w-full bg-white text-slate-900 p-2 rounded-md border border-slate-300 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="serviceTypes" className="block text-sm font-medium text-slate-700 mb-1">Types of Services Offered (comma-separated)</label>
                        <input type="text" name="serviceTypes" id="serviceTypes" value={newProviderForm.serviceTypes} onChange={handleInputChange} className="w-full bg-white text-slate-900 p-2 rounded-md border border-slate-300 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
                <button type="submit" disabled={authIsLoading} className="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50">
                    {authIsLoading ? 'Processing...' : 'Onboard Provider'}
                </button>
              </form>
            </div>
          </div>
        );
      case 'users':
        return ( /* Users content - unchanged */ 
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Platform User Management</h3>
             <div className="bg-slate-50 p-4 rounded-lg shadow overflow-x-auto">
                <table className="w-full min-w-max">
                    <thead>
                        <tr className="text-left border-b border-slate-200">
                            <th className="p-2 text-slate-600">Full Name</th>
                            <th className="p-2 text-slate-600">Email</th>
                            <th className="p-2 text-slate-600">Role</th>
                            <th className="p-2 text-slate-600">Status</th>
                            <th className="p-2 text-slate-600">Registered</th>
                            <th className="p-2 text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {platformUsersData.map(user => (
                            <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-100">
                                <td className="p-2 text-slate-700">{user.fullName}</td>
                                <td className="p-2 text-slate-500">{user.email}</td>
                                <td className="p-2 text-slate-500 capitalize">{user.role}</td>
                                <td className="p-2">
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-2 text-slate-500">{new Date(user.registrationDate).toLocaleDateString()}</td>
                                <td className="p-2">
                                    <button 
                                      onClick={() => handleUserStatusChange(user.id, user.status)}
                                      disabled={authIsLoading || currentUser?.id === user.id}
                                      className={`text-xs px-2 py-1 rounded-md mr-1 disabled:opacity-50 transition-colors
                                        ${user.status === 'active' 
                                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                                          : 'bg-green-600 hover:bg-green-700 text-white'}`}
                                    >
                                      {authIsLoading ? '...' : (user.status === 'active' ? 'Suspend' : 'Activate')}
                                    </button>
                                    <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md disabled:opacity-50" disabled>Edit (soon)</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        );
      case 'providers':
        return ( /* Providers content - unchanged */ 
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Approved Provider Management</h3>
            <div className="bg-slate-50 p-4 rounded-lg shadow overflow-x-auto">
                <table className="w-full min-w-max">
                    <thead>
                        <tr className="text-left border-b border-slate-200">
                            <th className="p-2 text-slate-600">Business Name</th>
                            <th className="p-2 text-slate-600">Contact Email</th>
                            <th className="p-2 text-slate-600">Service Count</th>
                            <th className="p-2 text-slate-600">Status</th>
                            <th className="p-2 text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {approvedProviders.map(provider => (
                            <tr key={provider.id} className="border-b border-slate-200 hover:bg-slate-100">
                                <td className="p-2 text-slate-700">{provider.businessName}</td>
                                <td className="p-2 text-slate-500">{provider.contactEmail}</td>
                                <td className="p-2 text-slate-500 text-center">{provider.serviceCount}</td>
                                <td className="p-2">
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${provider.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {provider.status}
                                    </span>
                                </td>
                                <td className="p-2">
                                     <button 
                                      onClick={() => handleProviderStatusChange(provider.id, provider.status)}
                                      disabled={authIsLoading || currentUser?.id === provider.id}
                                      className={`text-xs px-2 py-1 rounded-md mr-1 disabled:opacity-50 transition-colors
                                        ${provider.status === 'active' 
                                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                                          : 'bg-green-600 hover:bg-green-700 text-white'}`}
                                    >
                                      {authIsLoading ? '...' : (provider.status === 'active' ? 'Suspend' : 'Activate')}
                                    </button>
                                    <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md disabled:opacity-50" disabled>Manage (soon)</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        );
        case 'credits':
        return ( /* Credits content - unchanged */ 
            <div>
                <h3 className="text-xl font-semibold text-emerald-700 mb-4">User Credit Management</h3>
                <div className="bg-slate-50 p-4 rounded-lg shadow overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead>
                            <tr className="text-left border-b border-slate-200">
                                <th className="p-2 text-slate-600">User Name/Email</th>
                                <th className="p-2 text-slate-600 text-right">Total Earned</th>
                                <th className="p-2 text-slate-600 text-right">Available</th>
                                <th className="p-2 text-slate-600 text-right">Redeemed</th>
                                <th className="p-2 text-slate-600">Adjust Available</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsersForCredits.filter(user => user.role === 'user').map(user => (
                                <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-100">
                                    <td className="p-2 text-slate-700">{user.fullName || user.email}</td>
                                    <td className="p-2 text-slate-500 text-right">{formatCredits(user.totalCreditsEarned)}</td>
                                    <td className="p-2 text-emerald-600 font-semibold text-right">{formatCredits(user.creditsAvailable)}</td>
                                    <td className="p-2 text-slate-500 text-right">{formatCredits(user.creditsRedeemed)}</td>
                                    <td className="p-2">
                                        <div className="flex items-center space-x-1">
                                            <input 
                                                type="number"
                                                step="0.01"
                                                placeholder={formatCredits(user.creditsAvailable)}
                                                className="w-24 p-1 border border-slate-300 rounded-md text-xs text-right"
                                                value={creditAdjustment.userId === user.id ? creditAdjustment.amount : ''}
                                                onChange={(e) => handleCreditAdjustmentChange(user.id, e.target.value)}
                                            />
                                            <button
                                                onClick={() => handleApplyCreditAdjustment(user.id)}
                                                disabled={authIsLoading || creditAdjustment.userId !== user.id || creditAdjustment.amount === ''}
                                                className="text-xs bg-sky-500 hover:bg-sky-600 text-white px-2 py-1 rounded-md disabled:opacity-50"
                                            >
                                                Set
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
      case 'perks':
        return (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-indigo-700">Partner Perks Management</h3>
                    <button 
                        onClick={() => { setEditingPerk(null); setNewPerkData({ title: '', partnerId: MOCK_PARTNERS[0]?.id || '', description: '', unlockCriteria: [{type: 'MIN_SUBSCRIPTIONS_LINKED', value: 1, description: ''}], delivery: {method: 'CODE', value: ''}, activeStatus: true, category:'' }); setShowAddPerkModal(true); }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm"
                    >
                        Add New Perk
                    </button>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg shadow overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead>
                            <tr className="text-left border-b border-slate-200">
                                <th className="p-2 text-slate-600">Title</th>
                                <th className="p-2 text-slate-600">Partner</th>
                                <th className="p-2 text-slate-600">Criteria</th>
                                <th className="p-2 text-slate-600 text-center">Status</th>
                                <th className="p-2 text-slate-600 text-center">Unlocked/Redeemed</th>
                                <th className="p-2 text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {perksCatalog.map(perk => {
                                const partner = MOCK_PARTNERS.find(p => p.id === perk.partnerId);
                                const stats = perkService.getPerkRedemptionStats(perk.id);
                                return (
                                <tr key={perk.id} className="border-b border-slate-200 hover:bg-slate-100">
                                    <td className="p-2 text-slate-700 font-medium">{perk.title}</td>
                                    <td className="p-2 text-slate-500">{partner?.name || 'N/A'}</td>
                                    <td className="p-2 text-xs text-slate-500">
                                        {perk.unlockCriteria.map(c => c.description).join(' & ')}
                                    </td>
                                    <td className="p-2 text-center">
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${perk.activeStatus ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                                            {perk.activeStatus ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-2 text-xs text-slate-500 text-center">{stats.unlockedCount} / {stats.redeemedCount}</td>
                                    <td className="p-2 space-x-1">
                                        <button onClick={() => openEditPerkModal(perk)} className="text-xs bg-sky-500 hover:bg-sky-600 text-white px-2 py-1 rounded-md disabled:opacity-50">Edit</button>
                                        <button onClick={() => handleDeletePerk(perk.id)} className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md disabled:opacity-50">Del</button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        );
        case 'aiTools':
        return (
          <div className="space-y-8">
            <p className="text-slate-600 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              AI Suggestion Box feature is currently disabled. A backend proxy (e.g., Firebase Function) needs to be implemented to use AI features.
            </p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-8 text-center border-b border-slate-200 pb-4">
        Admin Panel
      </h2>
      <div className="mb-6 flex flex-wrap border-b border-slate-200">
        {(['overview', 'onboarding', 'users', 'providers', 'credits', 'perks', 'aiTools'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 sm:px-4 font-medium text-xs sm:text-sm rounded-t-md transition-colors mb-[-1px]
              ${activeTab === tab 
                ? 'bg-blue-600 text-white border-t border-l border-r border-slate-200' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-transparent'
              }`}
          >
            {tab === 'overview' ? 'Overview' : 
             tab === 'aiTools' ? 'AI & Platform Tools' : 
             `${tab.charAt(0).toUpperCase() + tab.slice(1)} Management`}
          </button>
        ))}
      </div>
      {renderSection()}

      {/* Add/Edit Perk Modal */}
      {showAddPerkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold">{editingPerk ? 'Edit Perk' : 'Add New Perk'}</h4>
                    <button onClick={() => { setShowAddPerkModal(false); setEditingPerk(null); }} className="text-slate-500 hover:text-slate-700">&times;</button>
                </div>
                <form onSubmit={handleAddOrUpdatePerkSubmit} className="space-y-4 text-sm">
                    <div>
                        <label htmlFor="perkTitle" className="block font-medium text-slate-700">Title</label>
                        <input type="text" name="title" id="perkTitle" value={newPerkData.title || ''} onChange={handleNewPerkChange} className="mt-1 block w-full input-style" required />
                    </div>
                    <div>
                        <label htmlFor="perkPartnerId" className="block font-medium text-slate-700">Partner</label>
                        <select name="partnerId" id="perkPartnerId" value={newPerkData.partnerId || ''} onChange={handleNewPerkChange} className="mt-1 block w-full input-style" required>
                            <option value="">Select Partner</option>
                            {MOCK_PARTNERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="perkDescription" className="block font-medium text-slate-700">Short Description</label>
                        <textarea name="description" id="perkDescription" value={newPerkData.description || ''} onChange={handleNewPerkChange} rows={2} className="mt-1 block w-full input-style" required></textarea>
                    </div>
                     <div>
                        <label htmlFor="perkLongDescription" className="block font-medium text-slate-700">Long Description (Optional)</label>
                        <textarea name="longDescription" id="perkLongDescription" value={newPerkData.longDescription || ''} onChange={handleNewPerkChange} rows={3} className="mt-1 block w-full input-style"></textarea>
                    </div>
                    <div>
                        <label htmlFor="perkImageUrl" className="block font-medium text-slate-700">Image URL (Optional)</label>
                        <input type="url" name="imageUrl" id="perkImageUrl" value={newPerkData.imageUrl || ''} onChange={handleNewPerkChange} className="mt-1 block w-full input-style" />
                    </div>
                    <div>
                        <label htmlFor="perkCategory" className="block font-medium text-slate-700">Category (Optional)</label>
                        <input type="text" name="category" id="perkCategory" value={newPerkData.category || ''} onChange={handleNewPerkChange} className="mt-1 block w-full input-style" />
                    </div>
                    
                    <fieldset className="border border-slate-300 p-3 rounded-md">
                        <legend className="text-sm font-medium text-slate-700 px-1">Unlock Criteria (AND logic)</legend>
                        {newPerkData.unlockCriteria?.map((crit, index) => (
                            <div key={index} className="space-y-2 border-b border-slate-200 py-2 last:border-b-0">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label htmlFor={`criterion_type_${index}`} className="block text-xs font-medium">Type</label>
                                        <select name={`criterion_${index}_type`} id={`criterion_type_${index}`} value={crit.type} onChange={handleNewPerkChange} className="mt-1 block w-full input-style-sm">
                                            <option value="MIN_SUBSCRIPTIONS_LINKED">Min Subscriptions</option>
                                            <option value="MIN_MONTHLY_SPEND">Min Monthly Spend (€)</option>
                                            <option value="SPECIFIC_BUNDLE_SUBSCRIBED">Specific Bundle ID</option>
                                            <option value="ACCOUNT_AGE_DAYS">Account Age (Days)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor={`criterion_value_${index}`} className="block text-xs font-medium">Value</label>
                                        <input type={crit.type === 'SPECIFIC_BUNDLE_SUBSCRIBED' ? 'text' : 'number'} name={`criterion_${index}_value`} id={`criterion_value_${index}`} value={crit.value} onChange={handleNewPerkChange} className="mt-1 block w-full input-style-sm" required />
                                    </div>
                                </div>
                                <div>
                                   <label htmlFor={`criterion_description_${index}`} className="block text-xs font-medium">User-Facing Description</label>
                                   <input type="text" name={`criterion_${index}_description`} id={`criterion_description_${index}`} value={crit.description} onChange={handleNewPerkChange} className="mt-1 block w-full input-style-sm" required placeholder="e.g., Link 2 subscriptions"/>
                                </div>
                                {newPerkData.unlockCriteria && newPerkData.unlockCriteria.length > 1 && (
                                    <button type="button" onClick={() => removeUnlockCriterion(index)} className="text-xs text-red-500 hover:text-red-700">Remove Criterion</button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addUnlockCriterion} className="mt-2 text-xs text-blue-500 hover:text-blue-700">+ Add Criterion</button>
                    </fieldset>

                    <fieldset className="border border-slate-300 p-3 rounded-md">
                        <legend className="text-sm font-medium text-slate-700 px-1">Delivery Method</legend>
                        <div className="grid grid-cols-2 gap-2">
                             <div>
                                <label htmlFor="delivery_method" className="block text-xs font-medium">Method</label>
                                <select name="delivery_method" id="delivery_method" value={newPerkData.delivery?.method || 'CODE'} onChange={handleNewPerkChange} className="mt-1 block w-full input-style-sm">
                                    <option value="CODE">Coupon Code</option>
                                    <option value="LINK">Link</option>
                                    <option value="MANUAL_EMAIL">Manual Email</option>
                                </select>
                            </div>
                            {newPerkData.delivery?.method !== 'MANUAL_EMAIL' && (
                            <div>
                                <label htmlFor="delivery_value" className="block text-xs font-medium">Value (Code/Link)</label>
                                <input type="text" name="delivery_value" id="delivery_value" value={newPerkData.delivery?.value || ''} onChange={handleNewPerkChange} className="mt-1 block w-full input-style-sm" />
                            </div>
                            )}
                        </div>
                        <div>
                           <label htmlFor="delivery_instructions" className="block text-xs font-medium mt-2">Instructions (Optional)</label>
                           <input type="text" name="delivery_instructions" id="delivery_instructions" value={newPerkData.delivery?.instructions || ''} onChange={handleNewPerkChange} className="mt-1 block w-full input-style-sm" placeholder="e.g., Apply code at checkout."/>
                        </div>
                    </fieldset>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="perkExpiryDate" className="block font-medium text-slate-700">Expiry Date (Optional)</label>
                            <input type="date" name="expiryDate" id="perkExpiryDate" value={newPerkData.expiryDate || ''} onChange={handleNewPerkChange} className="mt-1 block w-full input-style" />
                        </div>
                        <div className="flex items-center pt-5">
                            <input type="checkbox" name="activeStatus" id="perkActiveStatus" checked={newPerkData.activeStatus || false} onChange={handleNewPerkChange} className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                            <label htmlFor="perkActiveStatus" className="ml-2 font-medium text-slate-700">Active Perk</label>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-3">
                        <button type="button" onClick={() => { setShowAddPerkModal(false); setEditingPerk(null); }} className="px-4 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                        <button type="submit" disabled={authIsLoading} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md disabled:opacity-50">
                            {authIsLoading ? 'Saving...' : (editingPerk ? 'Update Perk' : 'Add Perk')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}


       <section className="mt-10 p-6 bg-slate-50 rounded-lg">
        <h3 className="text-xl font-semibold text-slate-800 mb-3">Admin Notification Preferences</h3>
        <div className="space-y-2 text-slate-700">
            <label className="flex items-center space-x-2 hover:text-slate-900 cursor-pointer">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 disabled:opacity-50" defaultChecked disabled/>
                <span>Email for new user registrations</span>
            </label>
            <label className="flex items-center space-x-2 hover:text-slate-900 cursor-pointer">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 disabled:opacity-50" defaultChecked disabled/>
                <span>Email for new provider applications</span>
            </label>
             <label className="flex items-center space-x-2 hover:text-slate-900 cursor-pointer">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 disabled:opacity-50" disabled/>
                <span>Daily platform summary email</span>
            </label>
        </div>
         <p className="text-xs text-slate-500 mt-2">(Notification preference management is a mock UI)</p>
      </section>
      <style>{`
        .input-style {
          padding: 0.5rem 0.75rem; 
          background-color: #f8fafc; /* slate-50 */
          border: 1px solid #cbd5e1; /* slate-300 */
          color: #0f172a; /* slate-900 */
          border-radius: 0.375rem; /* rounded-md */
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
          font-size: 0.875rem;
        }
        .input-style:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          border-color: #3b82f6; /* blue-500 */
          box-shadow: 0 0 0 1px #3b82f6; /* ring-1 ring-blue-500 */
        }
         .input-style-sm {
          padding: 0.375rem 0.625rem; /* Smaller padding */
          background-color: #f8fafc; 
          border: 1px solid #cbd5e1; 
          color: #0f172a; 
          border-radius: 0.375rem; 
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          font-size: 0.75rem; /* Smaller font */
        }
        .input-style-sm:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          border-color: #3b82f6; 
          box-shadow: 0 0 0 1px #3b82f6; 
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;