import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HeartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store';
import { fetchProfile, fetchPreferenceOptions, updatePreferences } from '../store/slices/profileSlice';
import PreferencesSection from '../components/profile/PreferencesSection';
import type { NightlifePreferences as NightlifePreferencesType } from '../types';

const NightlifePreferences: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { profile, preferences, preferenceOptions, loading } = useSelector((state: RootState) => state.profile);
  const [localPreferences, setLocalPreferences] = useState<Partial<NightlifePreferencesType> | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchPreferenceOptions());
  }, [dispatch]);

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  const handlePreferenceChange = (
    category: keyof NightlifePreferencesType,
    values: string[] | { min: number; max: number }
  ) => {
    setHasChanges(true);
    setLocalPreferences(prev => ({
      ...prev,
      [category]: values
    }));
  };

  const handleSavePreferences = async () => {
    if (!localPreferences) return;
    await dispatch(updatePreferences(localPreferences));
    setHasChanges(false);
    navigate('/profile');
  };

  const getCompletionPercentage = () => {
    if (!localPreferences || !preferenceOptions) return 0;
    const totalCategories = Object.keys(preferenceOptions).length;
    const completedCategories = Object.entries(localPreferences).filter(
      ([_, values]) => {
        if (Array.isArray(values)) {
          return values.length > 0;
        }
        if (values && typeof values === 'object') {
          return 'min' in values && 'max' in values;
        }
        return false;
      }
    ).length;
    return Math.round((completedCategories / totalCategories) * 100);
  };

  const formatCategoryTitle = (category: string): string => {
    return category
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  if (!preferenceOptions) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link to="/profile" className="mr-4 text-white hover:text-light-blue transition-colors">
          <ArrowLeftIcon className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nightlife Preferences</h1>
          <p className="text-sm text-gray-300">
            Tell us about your perfect night out
          </p>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-sky-500/25 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Profile Completion</h2>
            <p className="text-sm text-gray-300">
              {getCompletionPercentage()}% complete
            </p>
          </div>
          <HeartIcon className="w-6 h-6 text-electric-blue" />
        </div>
        <div className="mt-4 w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-electric-blue h-2 rounded-full transition-all duration-500"
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </div>
      </div>

      {/* Preferences Sections */}
      <div className="space-y-8">
        {Object.entries(preferenceOptions).map(([category, options]) => (
          <div key={category} className="bg-sky-500/25 rounded-lg p-6">
            <PreferencesSection
              title={formatCategoryTitle(category)}
              options={options}
              selected={
                category === 'spendingRange'
                  ? (localPreferences?.[category as keyof NightlifePreferencesType] as { min: number; max: number })
                  : (localPreferences?.[category as keyof NightlifePreferencesType] as string[]) || []
              }
              onChange={(values) =>
                handlePreferenceChange(
                  category as keyof NightlifePreferencesType,
                  category === 'spendingRange' ? values as { min: number; max: number } : values as string[]
                )
              }
            />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4">
        <div className="container mx-auto flex justify-end">
          <button
            onClick={handleSavePreferences}
            disabled={loading || !hasChanges}
            className={`px-6 py-2 bg-electric-blue text-white rounded-lg transition-all
              ${(!hasChanges || loading)
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-light-blue active:scale-95'}`}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NightlifePreferences;
