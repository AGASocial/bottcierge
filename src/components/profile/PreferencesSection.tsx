import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HeartIcon } from '@heroicons/react/24/outline';
import { AppDispatch, RootState } from '../../store';
import { updatePreferences } from '../../store/slices/profileSlice';

interface PreferencesSectionProps {
  title: string;
  options: { value: string; label: string }[] | { min: number; max: number };
  selected: string[] | { min: number; max: number };
  onChange: (values: string[] | { min: number; max: number }) => void;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({
  title,
  options,
  selected,
  onChange,
}) => {
  const handleToggle = (value: string) => {
    if (!Array.isArray(selected)) return;
    const newSelected = selected.includes(value)
      ? selected.filter(v => v !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const handleRangeChange = (field: 'min' | 'max', value: number) => {
    if (Array.isArray(selected)) return;
    onChange({
      ...selected,
      [field]: value
    });
  };

  if ('min' in options) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">
          {title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum</label>
            <input
              type="number"
              value={(selected as { min: number; max: number }).min}
              onChange={(e) => handleRangeChange('min', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum</label>
            <input
              type="number"
              value={(selected as { min: number; max: number }).max}
              onChange={(e) => handleRangeChange('max', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">
        {title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {(options as { value: string; label: string }[]).map((option) => (
          <button
            key={option.value}
            onClick={() => handleToggle(option.value)}
            className={`px-4 py-2 rounded-lg text-sm text-left transition-all duration-200
              ${Array.isArray(selected) && selected.includes(option.value)
                ? 'bg-electric-blue text-white'
                : 'bg-white/5 hover:bg-white/10'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PreferencesSection;
