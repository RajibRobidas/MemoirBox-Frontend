import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';

interface ProfileSettingsProps {}

const ProfileSettings: React.FC<ProfileSettingsProps> = () => {
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    bio: 'Passionate about capturing life\'s precious moments and creating lasting memories with family and friends.',
    emailNotifications: true,
    pushNotifications: false,
    defaultSharing: 'private',
    collectionVisibility: true,
    timelineDisplay: 'year',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'UTC-8',
    theme: 'light'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authService.getCurrentUser();
        const userData = response.user;
        
        // Get stored user data from localStorage
        const storedUser = localStorage.getItem('memoirbox_user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        
        setFormData(prev => ({
          ...prev,
          displayName: userData.name || parsedUser?.name || '',
          email: userData.email || parsedUser?.email || ''
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Main Content */}
      <main className="min-h-screen pb-20 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8">
          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-warm mb-6">
            <div className="p-6">
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-6">Profile Information</h2>
              
              {/* Profile Avatar */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary-200">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop"
                      alt="Profile Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                      }}
                    />
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-smooth">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </button>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-heading font-medium text-text-primary">{formData.displayName}</h3>
                  <p className="text-text-secondary">{formData.email}</p>
                  <p className="text-sm text-text-secondary mt-1">Member since March 2023</p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Display Name</label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-warm mb-6">
            <div className="p-6">
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                {/* Password Change */}
                <div className="flex items-center justify-between py-3 border-b border-border-light">
                  <div>
                    <h3 className="font-medium text-text-primary">Change Password</h3>
                    <p className="text-sm text-text-secondary">Update your account password</p>
                  </div>
                  <button className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary-50 transition-smooth">
                    Change
                  </button>
                </div>

                {/* Email Preferences */}
                <div className="flex items-center justify-between py-3 border-b border-border-light">
                  <div>
                    <h3 className="font-medium text-text-primary">Email Notifications</h3>
                    <p className="text-sm text-text-secondary">Receive updates about your memories</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium text-text-primary">Push Notifications</h3>
                    <p className="text-sm text-text-secondary">Get notified about memory reminders</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="pushNotifications"
                      checked={formData.pushNotifications}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Sharing */}
          <div className="bg-white rounded-xl shadow-warm mb-6">
            <div className="p-6">
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-6">Privacy & Sharing</h2>
              
              <div className="space-y-6">
                {/* Default Memory Sharing */}
                <div className="flex items-center justify-between py-3 border-b border-border-light">
                  <div>
                    <h3 className="font-medium text-text-primary">Default Memory Sharing</h3>
                    <p className="text-sm text-text-secondary">Set default privacy for new memories</p>
                  </div>
                  <select
                    name="defaultSharing"
                    value={formData.defaultSharing}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="private">Private</option>
                    <option value="friends">Friends Only</option>
                    <option value="public">Public</option>
                  </select>
                </div>

                {/* Collection Visibility */}
                <div className="flex items-center justify-between py-3 border-b border-border-light">
                  <div>
                    <h3 className="font-medium text-text-primary">Collection Visibility</h3>
                    <p className="text-sm text-text-secondary">Who can see your memory collections</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="collectionVisibility"
                      checked={formData.collectionVisibility}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Data Export */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium text-text-primary">Export Data</h3>
                    <p className="text-sm text-text-secondary">Download all your memories and data</p>
                  </div>
                  <button className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary-50 transition-smooth">
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Application Preferences */}
          <div className="bg-white rounded-xl shadow-warm mb-6">
            <div className="p-6">
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-6">Application Preferences</h2>
              
              <div className="space-y-6">
                {/* Timeline Display */}
                <div className="flex items-center justify-between py-3 border-b border-border-light">
                  <div>
                    <h3 className="font-medium text-text-primary">Timeline Display</h3>
                    <p className="text-sm text-text-secondary">Choose default timeline view</p>
                  </div>
                  <select
                    name="timelineDisplay"
                    value={formData.timelineDisplay}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="year">Year View</option>
                    <option value="month">Month View</option>
                    <option value="day">Day View</option>
                  </select>
                </div>

                {/* Date Format */}
                <div className="flex items-center justify-between py-3 border-b border-border-light">
                  <div>
                    <h3 className="font-medium text-text-primary">Date Format</h3>
                    <p className="text-sm text-text-secondary">How dates are displayed</p>
                  </div>
                  <select
                    name="dateFormat"
                    value={formData.dateFormat}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                {/* Timezone */}
                <div className="flex items-center justify-between py-3 border-b border-border-light">
                  <div>
                    <h3 className="font-medium text-text-primary">Timezone</h3>
                    <p className="text-sm text-text-secondary">Your local timezone</p>
                  </div>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="UTC-8">UTC-8 (Pacific)</option>
                    <option value="UTC-5">UTC-5 (Eastern)</option>
                    <option value="UTC+0">UTC+0 (GMT)</option>
                    <option value="UTC+1">UTC+1 (CET)</option>
                  </select>
                </div>

                {/* Theme Selection */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium text-text-primary">Theme</h3>
                    <p className="text-sm text-text-secondary">Choose your preferred theme</p>
                  </div>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Management */}
          <div className="bg-white rounded-xl shadow-warm mb-6">
            <div className="p-6">
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-6">Storage Management</h2>
              
              {/* Storage Usage */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">Storage Used</span>
                  <span className="text-sm text-text-secondary">2.4 GB of 5 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '48%' }}></div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Memory Cleanup */}
                <div className="flex items-center justify-between py-3 border-b border-border-light">
                  <div>
                    <h3 className="font-medium text-text-primary">Memory Cleanup</h3>
                    <p className="text-sm text-text-secondary">Remove duplicate or low-quality photos</p>
                  </div>
                  <button className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary-50 transition-smooth">
                    Clean Up
                  </button>
                </div>

                {/* Backup Status */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium text-text-primary">Backup Status</h3>
                    <p className="text-sm text-success">Last backup: 2 hours ago</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm text-success">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-white rounded-xl shadow-warm mb-6">
            <div className="p-6">
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-6">Help & Support</h2>
              
              <div className="space-y-4">
                {/* FAQ */}
                <a href="#" className="flex items-center justify-between py-3 border-b border-border-light hover:bg-primary-50 -mx-6 px-6 transition-smooth">
                  <div>
                    <h3 className="font-medium text-text-primary">Frequently Asked Questions</h3>
                    <p className="text-sm text-text-secondary">Find answers to common questions</p>
                  </div>
                  <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </a>

                {/* Contact Support */}
                <a href="#" className="flex items-center justify-between py-3 border-b border-border-light hover:bg-primary-50 -mx-6 px-6 transition-smooth">
                  <div>
                    <h3 className="font-medium text-text-primary">Contact Support</h3>
                    <p className="text-sm text-text-secondary">Get help from our support team</p>
                  </div>
                  <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </a>

                {/* App Version */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium text-text-primary">App Version</h3>
                    <p className="text-sm text-text-secondary">Memoirbox Gallery v2.1.0</p>
                  </div>
                  <span className="text-sm text-success">Up to date</span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <button className="px-6 py-3 border border-border text-text-secondary rounded-lg hover:bg-primary-50 transition-smooth">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-primary text-black rounded-lg hover:bg-primary-600 transition-smooth"
            >
              Save Changes
            </button>
          </div>
        </div>
      </main>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-20 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-warm-md z-50">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Settings saved successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings; 