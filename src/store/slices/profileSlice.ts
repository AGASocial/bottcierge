import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface PreferenceOption {
  value: string;
  label: string;
}

export interface PreferenceOptions {
  venues: PreferenceOption[];
  musicGenres: PreferenceOption[];
  events: PreferenceOption[];
  drinks: PreferenceOption[];
  crowdSizes: PreferenceOption[];
  spendingHabits: PreferenceOption[];
  atmospheres: PreferenceOption[];
  nightOutFrequency: PreferenceOption[];
  transportation: PreferenceOption[];
  preferredNights: PreferenceOption[];
}

interface ProfileState {
  profile: any; // Will be typed properly once we have the user type
  preferences: any;
  preferenceOptions: PreferenceOptions | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  preferences: null,
  preferenceOptions: null,
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async () => {
    const response = await api.get('/profile');
    return response.data.data;
  }
);

export const fetchPreferenceOptions = createAsyncThunk(
  'profile/fetchPreferenceOptions',
  async () => {
    const response = await api.get('/profile/preferences/options');
    return response.data.data;
  }
);

export const updatePreferences = createAsyncThunk(
  'profile/updatePreferences',
  async (preferences: any) => {
    const response = await api.patch('/profile/preferences', preferences);
    return response.data.data;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.preferences = action.payload.preferences;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      // Fetch Preference Options
      .addCase(fetchPreferenceOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPreferenceOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.preferenceOptions = action.payload;
      })
      .addCase(fetchPreferenceOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch preference options';
      })
      // Update Preferences
      .addCase(updatePreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.preferences = action.payload.preferences;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update preferences';
      });
  },
});

export const { clearError } = profileSlice.actions;
export default profileSlice.reducer;
