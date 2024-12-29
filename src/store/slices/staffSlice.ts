import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { Staff } from '../../types';

interface StaffState {
  staffMembers: Staff[];
  currentStaff: Staff | null;
  loading: boolean;
  error: string | null;
}

const initialState: StaffState = {
  staffMembers: [],
  currentStaff: null,
  loading: false,
  error: null,
};

export const getStaffMembers = createAsyncThunk(
  'staff/getStaffMembers',
  async () => {
    const response = await api.get('/staff');
    return response.data;
  }
);

export const getStaffById = createAsyncThunk(
  'staff/getStaffById',
  async (staffId: string) => {
    const response = await api.get(`/staff/${staffId}`);
    return response.data;
  }
);

export const createStaffMember = createAsyncThunk(
  'staff/createStaffMember',
  async (staffData: Partial<Staff>) => {
    const response = await api.post('/staff', staffData);
    return response.data;
  }
);

export const updateStaffMember = createAsyncThunk(
  'staff/updateStaffMember',
  async ({ id, data }: { id: string; data: Partial<Staff> }) => {
    const response = await api.put(`/staff/${id}`, data);
    return response.data;
  }
);

export const updateStaffMetrics = createAsyncThunk(
  'staff/updateMetrics',
  async ({ id, metrics }: { id: string; metrics: Staff['metrics'] }) => {
    const response = await api.patch(`/staff/${id}/metrics`, metrics);
    return response.data;
  }
);

export const deactivateStaffMember = createAsyncThunk(
  'staff/deactivateStaffMember',
  async (staffId: string) => {
    const response = await api.post(`/staff/${staffId}/deactivate`);
    return response.data;
  }
);

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentStaff: (state, action) => {
      state.currentStaff = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get staff members
      .addCase(getStaffMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStaffMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.staffMembers = action.payload;
      })
      .addCase(getStaffMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get staff members';
      })
      // Get staff by ID
      .addCase(getStaffById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStaffById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStaff = action.payload;
      })
      .addCase(getStaffById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get staff member';
      })
      // Create staff member
      .addCase(createStaffMember.fulfilled, (state, action) => {
        state.staffMembers.push(action.payload);
      })
      // Update staff member
      .addCase(updateStaffMember.fulfilled, (state, action) => {
        const index = state.staffMembers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.staffMembers[index] = action.payload;
        }
        if (state.currentStaff?.id === action.payload.id) {
          state.currentStaff = action.payload;
        }
      })
      // Update staff metrics
      .addCase(updateStaffMetrics.fulfilled, (state, action) => {
        const index = state.staffMembers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.staffMembers[index] = action.payload;
        }
        if (state.currentStaff?.id === action.payload.id) {
          state.currentStaff = action.payload;
        }
      })
      // Deactivate staff member
      .addCase(deactivateStaffMember.fulfilled, (state, action) => {
        const index = state.staffMembers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.staffMembers[index] = action.payload;
        }
        if (state.currentStaff?.id === action.payload.id) {
          state.currentStaff = action.payload;
        }
      });
  },
});

export const { clearError, setCurrentStaff } = staffSlice.actions;
export default staffSlice.reducer;
