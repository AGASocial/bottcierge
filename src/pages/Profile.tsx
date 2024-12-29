import React from 'react';
import { useSelector } from 'react-redux';
import {
  UserCircleIcon,
  CreditCardIcon,
  BellIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import type { RootState } from '../store';

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-electric-blue flex items-center justify-center">
            <UserCircleIcon className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-300">{user.email}</p>
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
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCardIcon className="w-6 h-6" />
                <div>
                  <p className="font-medium">•••• 4242</p>
                  <p className="text-sm text-gray-300">Expires 12/24</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-electric-blue/20 text-electric-blue rounded-full text-sm">
                Default
              </span>
            </div>
          </div>
        </div>

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
