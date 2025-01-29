import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ServiceRequest {
  id: string;
  tableId: string;
  type: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

interface ServiceRequestState {
  requests: ServiceRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceRequestState = {
  requests: [],
  loading: false,
  error: null,
};

export const createServiceRequest = createAsyncThunk(
  'serviceRequest/create',
  async ({ tableId, type }: { tableId: string; type: string }) => {
    // TODO: Replace with actual API call
    const mockResponse = {
      id: Math.random().toString(36).substr(2, 9),
      tableId,
      type,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockResponse as ServiceRequest;
  }
);

const serviceRequestSlice = createSlice({
  name: 'serviceRequest',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createServiceRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createServiceRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.push(action.payload);
      })
      .addCase(createServiceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create service request';
      });
  },
});

export const { clearError } = serviceRequestSlice.actions;
export default serviceRequestSlice.reducer;
