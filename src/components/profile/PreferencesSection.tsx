import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HeartIcon } from '@heroicons/react/24/outline';
import { AppDispatch, RootState } from '../../store';
import { updatePreferences } from '../../store/slices/profileSlice';

interface PreferencesSectionProps {
  title: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({
  title,
  options,
  selected,
  onChange,
}) => {
  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(v => v !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleToggle(option.value)}
            className={`px-4 py-2 rounded-lg text-sm text-left transition-all duration-200
              ${selected.includes(option.value)
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
