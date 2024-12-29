import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import axios from 'axios';
import type { Venue, Staff, Section, VenueEvent, PricingRule } from '../../types';

interface VenueState {
  currentVenue: Venue | null;
  staff: Staff[];
  sections: Section[];
  events: VenueEvent[];
  pricingRules: PricingRule[];
  loading: boolean;
  error: string | null;
  activeStaff: {
    [sectionId: string]: Staff[];
  };
  metrics: {
    totalOrders: number;
    activeOrders: number;
    averageWaitTime: number;
    revenue: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
}

const initialState: VenueState = {
  currentVenue: null,
  staff: [],
  sections: [],
  events: [],
  pricingRules: [],
  loading: false,
  error: null,
  activeStaff: {},
  metrics: {
    totalOrders: 0,
    activeOrders: 0,
    averageWaitTime: 0,
    revenue: {
      daily: 0,
      weekly: 0,
      monthly: 0,
    },
  },
};

const venueNames = [
  "The Purple Lounge",
  "Bottcierge Bar & Grill",
  "Skyline Social",
  "The Rustic Barrel",
  "Urban Spirits",
  "The Crafty Tap",
  "Moonlight Tavern",
  "The Social House",
  "Coastal Kitchen",
  "The Local Spot"
];

const generateRandomVenue = (tableId: string): Venue => {
  const randomName = venueNames[Math.floor(Math.random() * venueNames.length)];
  return {
    id: `venue_${Math.random().toString(36).substr(2, 9)}`,
    name: randomName,
    address: "123 Main Street",
    description: "A cozy spot for food and drinks",
    tables: [{
      id: tableId,
      number: tableId,
      status: 'available',
      capacity: 4,
      x: 0,
      y: 0
    }]
  };
};

export const setRandomVenue = createAsyncThunk(
  'venue/setRandomVenue',
  async (tableId: string) => {
    const venue = generateRandomVenue(tableId);
    return venue;
  }
);

export const fetchVenueDetails = createAsyncThunk(
  'venue/fetchDetails',
  async (venueId: string, { rejectWithValue }) => {
    try {
      const [venueRes, staffRes, sectionsRes, eventsRes, pricingRes] = await Promise.all([
        api.get(`/venues/${venueId}`),
        api.get(`/venues/${venueId}/staff`),
        api.get(`/venues/${venueId}/sections`),
        api.get(`/venues/${venueId}/events`),
        api.get(`/venues/${venueId}/pricing-rules`),
      ]);

      return {
        venue: venueRes.data,
        staff: staffRes.data,
        sections: sectionsRes.data,
        events: eventsRes.data,
        pricingRules: pricingRes.data,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch venue details');
    }
  }
);

export const updateStaffStatus = createAsyncThunk(
  'venue/updateStaffStatus',
  async ({ 
    staffId, 
    status, 
    sectionId 
  }: { 
    staffId: string; 
    status: Staff['status']; 
    sectionId?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/staff/${staffId}/status`, {
        status,
        sectionId,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update staff status');
    }
  }
);

export const fetchVenueMetrics = createAsyncThunk(
  'venue/fetchMetrics',
  async (venueId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/venues/${venueId}/metrics`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch venue metrics');
    }
  }
);

export const updatePricingRule = createAsyncThunk(
  'venue/updatePricingRule',
  async ({ 
    ruleId, 
    updates 
  }: { 
    ruleId: string; 
    updates: Partial<PricingRule>;
  }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/pricing-rules/${ruleId}`, updates);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update pricing rule');
    }
  }
);

const venueSlice = createSlice({
  name: 'venue',
  initialState,
  reducers: {
    updateActiveStaff: (state, action) => {
      const { sectionId, staff } = action.payload;
      state.activeStaff[sectionId] = staff;
    },
    clearVenueError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVenueDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVenueDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVenue = action.payload.venue;
        state.staff = action.payload.staff;
        state.sections = action.payload.sections;
        state.events = action.payload.events;
        state.pricingRules = action.payload.pricingRules;
      })
      .addCase(fetchVenueDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateStaffStatus.fulfilled, (state, action) => {
        const staffIndex = state.staff.findIndex(s => s.id === action.payload.id);
        if (staffIndex !== -1) {
          state.staff[staffIndex] = action.payload;
        }
      })
      .addCase(fetchVenueMetrics.fulfilled, (state, action) => {
        state.metrics = action.payload;
      })
      .addCase(updatePricingRule.fulfilled, (state, action) => {
        const ruleIndex = state.pricingRules.findIndex(r => r.id === action.payload.id);
        if (ruleIndex !== -1) {
          state.pricingRules[ruleIndex] = action.payload;
        }
      })
      .addCase(setRandomVenue.fulfilled, (state, action) => {
        state.currentVenue = action.payload;
      });
  },
});

export const {
  updateActiveStaff,
  clearVenueError,
} = venueSlice.actions;

export default venueSlice.reducer;
