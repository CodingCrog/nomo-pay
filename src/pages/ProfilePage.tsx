import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useIdentity } from '../hooks/useIdentity';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi';

export const ProfilePage: React.FC = () => {
  const { colors } = useTheme();
  const { data: identity, loading } = useIdentity();

  if (loading) {
    return (
      <div className="min-h-screen pb-16 relative">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 relative">
      
      {/* Header */}
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold" style={{ color: colors.text1 }}>
          Profile
        </h1>
        <p className="text-sm mt-1" style={{ color: colors.text2 }}>
          Your personal information
        </p>
      </div>

      <div className="px-4 space-y-4">
        {/* Profile Card */}
        <div 
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: colors.background2 }}
        >
          <div className="flex items-center mb-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '20' }}
            >
              <FiUser size={32} style={{ color: colors.primary }} />
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-xl font-semibold" style={{ color: colors.text1 }}>
                {identity ? `${identity.firstname} ${identity.lastname}` : 'User Name'}
              </h2>
              <p className="text-sm" style={{ color: colors.text2 }}>
                {identity?.username ? `@${identity.username}` : 'Personal Account'}
              </p>
              {identity?.member_key && (
                <p className="text-xs mt-1" style={{ color: colors.text2 }}>
                  Member #{identity.member_key}
                </p>
              )}
            </div>
          </div>

          {/* Information Fields */}
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start">
              <FiMail size={20} style={{ color: colors.text2 }} className="mt-0.5 mr-3" />
              <div className="flex-1">
                <p className="text-sm" style={{ color: colors.text2 }}>Email</p>
                <p className="font-medium" style={{ color: colors.text1 }}>
                  {identity?.email || 'Not set'}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start">
              <FiPhone size={20} style={{ color: colors.text2 }} className="mt-0.5 mr-3" />
              <div className="flex-1">
                <p className="text-sm" style={{ color: colors.text2 }}>Phone</p>
                <p className="font-medium" style={{ color: colors.text1 }}>
                  {identity?.phone_number || 'Not set'}
                </p>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex items-start">
              <FiCalendar size={20} style={{ color: colors.text2 }} className="mt-0.5 mr-3" />
              <div className="flex-1">
                <p className="text-sm" style={{ color: colors.text2 }}>Date of Birth</p>
                <p className="font-medium" style={{ color: colors.text1 }}>
                  {identity?.date_of_birth ? new Date(identity.date_of_birth).toLocaleDateString() : 'Not set'}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start">
              <FiMapPin size={20} style={{ color: colors.text2 }} className="mt-0.5 mr-3" />
              <div className="flex-1">
                <p className="text-sm" style={{ color: colors.text2 }}>Address</p>
                {identity?.personal_address ? (
                  <div>
                    <p className="font-medium" style={{ color: colors.text1 }}>
                      {identity.personal_address.line1}
                    </p>
                    {identity.personal_address.line2 && (
                      <p className="font-medium" style={{ color: colors.text1 }}>
                        {identity.personal_address.line2}
                      </p>
                    )}
                    <p className="font-medium" style={{ color: colors.text1 }}>
                      {identity.personal_address.city}, {identity.personal_address.state} {identity.personal_address.zipcode}
                    </p>
                    <p className="font-medium" style={{ color: colors.text1 }}>
                      {identity.personal_address.country.name}
                    </p>
                  </div>
                ) : (
                  <p className="font-medium" style={{ color: colors.text1 }}>Not set</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div 
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: colors.background2 }}
        >
          <h3 className="font-semibold mb-4" style={{ color: colors.text1 }}>
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button 
              className="w-full text-left px-4 py-3 rounded-xl transition-colors"
              style={{ 
                backgroundColor: colors.background1,
                color: colors.text1 
              }}
            >
              Edit Profile Information
            </button>
            <button 
              className="w-full text-left px-4 py-3 rounded-xl transition-colors"
              style={{ 
                backgroundColor: colors.background1,
                color: colors.text1 
              }}
            >
              Change Password
            </button>
            <button 
              className="w-full text-left px-4 py-3 rounded-xl transition-colors"
              style={{ 
                backgroundColor: colors.background1,
                color: colors.text1 
              }}
            >
              Security Settings
            </button>
            <button 
              className="w-full text-left px-4 py-3 rounded-xl transition-colors"
              style={{ 
                backgroundColor: colors.background1,
                color: colors.text1 
              }}
            >
              Notification Preferences
            </button>
          </div>
        </div>

        {/* Debug Info */}
        {import.meta.env.VITE_FORCE_DEBUG && (
          <div 
            className="rounded-2xl p-4 shadow-sm text-xs font-mono"
            style={{ backgroundColor: colors.background2 }}
          >
            <p style={{ color: colors.text2 }}>Debug: Identity Data</p>
            <pre style={{ color: colors.text1 }}>
              {JSON.stringify(identity, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};