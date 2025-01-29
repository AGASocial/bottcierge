import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  UserCircleIcon,
  CreditCardIcon,
  BellIcon,
  CogIcon,
  HeartIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import type { AppDispatch, RootState } from '../store';
import { fetchProfile } from '../store/slices/profileSlice';

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, preferences } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const getPreferencesSummary = () => {
    if (!preferences) return [];
    
    const summary = [];
    if (preferences.venues?.length > 0) {
      summary.push(`${preferences.venues.length} venues`);
    }
    if (preferences.musicGenres?.length > 0) {
      summary.push(`${preferences.musicGenres.length} music genres`);
    }
    if (preferences.events?.length > 0) {
      summary.push(`${preferences.events.length} event types`);
    }
    return summary;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-electric-blue flex items-center justify-center">
            <UserCircleIcon className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile?.name || 'Loading...'}</h1>
            <p className="text-gray-300">{profile?.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="space-y-6">
        {/* Payment Methods */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Payment Methods</h2>
            <button className="btn-secondary">Add New</button>
          </div>
          <div className="space-y-4">
            {profile?.paymentMethods?.map((method: any) => (
              <div key={method.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCardIcon className="w-6 h-6" />
                  <div>
                    <p className="font-medium">•••• {method.last4}</p>
                    <p className="text-sm text-gray-300">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                {method.isDefault && (
                  <span className="px-3 py-1 bg-electric-blue/20 text-electric-blue rounded-full text-sm">
                    Default
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Nightlife Preferences Summary */}
        <Link to="/preferences" className="block">
          <div className="glass-card p-6 hover:bg-white/5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <HeartIcon className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Nightlife Preferences</h2>
                </div>
                {preferences ? (
                  <p className="text-sm text-gray-300">
                    {getPreferencesSummary().join(' • ')}
                  </p>
                ) : (
                  <p className="text-sm text-gray-300">
                    Tell us about your perfect night out
                  </p>
                )}
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </Link>

        {/* Notifications */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Notifications</h2>
            <BellIcon className="w-6 h-6" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Order Updates</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-electric-blue"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span>Promotions</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-electric-blue"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Settings</h2>
            <CogIcon className="w-6 h-6" />
          </div>
          <div className="space-y-4">
            <button className="w-full text-left py-2 hover:text-electric-blue transition-colors">
              Change Password
            </button>
            <button className="w-full text-left py-2 hover:text-electric-blue transition-colors">
              Privacy Settings
            </button>
            <button className="w-full text-left py-2 hover:text-electric-blue transition-colors">
              Language & Region
            </button>
            <button className="w-full text-left py-2 text-red-400 hover:text-red-300 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
