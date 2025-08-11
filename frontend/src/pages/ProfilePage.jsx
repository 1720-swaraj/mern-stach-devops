import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import Button from '../components/Common/Button';
import { 
  UserIcon, 
  EnvelopeIcon, 
  KeyIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch
  } = useForm();

  const newPassword = watch('newPassword');

  const onProfileSubmit = async (data) => {
    try {
      setIsUpdatingProfile(true);
      const result = await updateProfile(data);

      if (result.success) {
        // Profile updated successfully - toast is shown in context
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      setIsChangingPassword(true);
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });

      if (result.success) {
        resetPassword();
      }
    } catch (error) {
      console.error('Password change error:', error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: UserIcon },
    { id: 'password', label: 'Change Password', icon: KeyIcon }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account information and security settings
        </p>
      </div>

      {/* User Info Card */}
      <div className="card">
        <div className="card-body flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-primary-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
              <span>Account Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 mx-auto mb-1" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="form-label">
                    <UserIcon className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`form-input ${profileErrors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your full name"
                    {...registerProfile('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      },
                      maxLength: {
                        value: 50,
                        message: 'Name cannot exceed 50 characters'
                      }
                    })}
                  />
                  {profileErrors.name && (
                    <p className="form-error">{profileErrors.name.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="form-label">
                    <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`form-input ${profileErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your email address"
                    {...registerProfile('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {profileErrors.email && (
                    <p className="form-error">{profileErrors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Account Created:</span>
                    <span className="ml-2 text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Login:</span>
                    <span className="ml-2 text-gray-900">
                      {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={isUpdatingProfile}
                  disabled={isUpdatingProfile}
                >
                  Update Profile
                </Button>
              </div>
            </form>
          )}

          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label htmlFor="currentPassword" className="form-label">
                    <KeyIcon className="w-4 h-4 inline mr-2" />
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    className={`form-input ${passwordErrors.currentPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your current password"
                    {...registerPassword('currentPassword', {
                      required: 'Current password is required'
                    })}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="form-error">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    className={`form-input ${passwordErrors.newPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your new password"
                    {...registerPassword('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  {passwordErrors.newPassword && (
                    <p className="form-error">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label htmlFor="confirmNewPassword" className="form-label">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmNewPassword"
                    type="password"
                    className={`form-input ${passwordErrors.confirmNewPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Confirm your new password"
                    {...registerPassword('confirmNewPassword', {
                      required: 'Please confirm your new password',
                      validate: value =>
                        value === newPassword || 'Passwords do not match'
                    })}
                  />
                  {passwordErrors.confirmNewPassword && (
                    <p className="form-error">{passwordErrors.confirmNewPassword.message}</p>
                  )}
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• At least 6 characters long</li>
                  <li>• Should be unique and not easily guessable</li>
                  <li>• Consider using a mix of letters, numbers, and symbols</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={isChangingPassword}
                  disabled={isChangingPassword}
                >
                  Change Password
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
