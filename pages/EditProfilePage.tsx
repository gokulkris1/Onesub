
import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Route, FullUserProfile } from '../types';

interface EditProfilePageProps {
  navigateTo: (page: Route) => void;
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({ navigateTo }) => {
  const { currentUser, updateUserProfile, isLoading, error: authError } = useAuth();
  
  const [formData, setFormData] = useState<Partial<FullUserProfile>>({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    profilePictureUrl: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || '',
        phone: currentUser.phone || '',
        dateOfBirth: currentUser.dateOfBirth || '',
        profilePictureUrl: currentUser.profilePictureUrl || '',
      });
    }
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    setSuccessMessage(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    setSuccessMessage(null);
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmitProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!formData.fullName?.trim()) {
      setFormError("Full name cannot be empty.");
      return;
    }

    try {
      await updateUserProfile(formData);
      setSuccessMessage("Profile updated successfully!");
    } catch (err: any) {
      setFormError(err.message || "Failed to update profile.");
    }
  };

  const handleSubmitPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
      setFormError("All password fields are required.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setFormError("New passwords do not match.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setFormError("New password must be at least 6 characters long.");
      return;
    }

    try {
      await updateUserProfile({}, passwordData.currentPassword, passwordData.newPassword);
      setSuccessMessage("Password changed successfully!");
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear fields
    } catch (err: any) {
      setFormError(err.message || "Failed to change password.");
    }
  };
  
  if (!currentUser) {
    // This should ideally be handled by App.tsx routing, but as a fallback:
    navigateTo('home');
    return <p className="text-center py-10">Loading user data or redirecting...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-8 text-center border-b border-slate-200 pb-4">
        Edit Profile
      </h2>

      {authError && !formError && ( // Show general auth context error if no specific form error
        <div className="mb-4 p-3 bg-red-100 rounded-md text-center">
            <p className="text-sm text-red-700">{authError}</p>
        </div>
      )}
      {formError && (
        <div className="mb-4 p-3 bg-red-100 rounded-md text-center">
            <p className="text-sm text-red-700">{formError}</p>
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 rounded-md text-center">
            <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Profile Details Form */}
      <form onSubmit={handleSubmitProfile} className="space-y-6 mb-10">
        <h3 className="text-xl font-semibold text-slate-700 mb-3">Personal Information</h3>
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full input-style" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
          <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="w-full input-style" />
        </div>
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
          <input type="date" name="dateOfBirth" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full input-style" />
        </div>
        <div>
          <label htmlFor="profilePictureUrl" className="block text-sm font-medium text-slate-700 mb-1">Profile Picture URL</label>
          <input type="url" name="profilePictureUrl" id="profilePictureUrl" value={formData.profilePictureUrl} onChange={handleInputChange} className="w-full input-style" placeholder="https://example.com/image.png"/>
        </div>
        <button type="submit" disabled={isLoading} className="w-full btn-primary">
          {isLoading ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>

      {/* Change Password Form */}
      <form onSubmit={handleSubmitPassword} className="space-y-6 pt-6 border-t border-slate-200">
        <h3 className="text-xl font-semibold text-slate-700 mb-3">Change Password</h3>
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
          <input type="password" name="currentPassword" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full input-style" />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
          <input type="password" name="newPassword" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full input-style" />
        </div>
        <div>
          <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
          <input type="password" name="confirmNewPassword" id="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} className="w-full input-style" />
        </div>
        <button type="submit" disabled={isLoading} className="w-full btn-primary">
          {isLoading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
      
      <button 
        onClick={() => navigateTo('account')}
        className="mt-8 w-full text-center py-2 px-4 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Back to Account
      </button>

      <style>{`
        .input-style {
          padding: 0.625rem 1rem; /* 10px 16px */
          background-color: #f8fafc; /* slate-50 */
          border: 1px solid #cbd5e1; /* slate-300 */
          color: #0f172a; /* slate-900 */
          border-radius: 0.375rem; /* rounded-md */
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
        }
        .input-style:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          border-color: #3b82f6; /* blue-500 */
          box-shadow: 0 0 0 2px #3b82f6; /* ring-2 ring-blue-500 */
        }
        .btn-primary {
          display: flex;
          justify-content: center;
          padding: 0.75rem 1rem; /* py-3 px-4 */
          border: 1px solid transparent;
          border-radius: 0.375rem; /* rounded-md */
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
          font-size: 0.875rem; /* text-sm */
          font-weight: 500; /* font-medium */
          color: white;
          background-color: #2563eb; /* bg-blue-600 */
          transition: background-color 0.15s ease-in-out;
        }
        .btn-primary:hover {
          background-color: #1d4ed8; /* bg-blue-700 */
        }
        .btn-primary:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          box-shadow: 0 0 0 2px white, 0 0 0 4px #2563eb; /* focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 */
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default EditProfilePage;
