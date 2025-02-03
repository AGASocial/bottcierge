import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Table } from '../../types';

interface TableState {
  tables: Table[];
  selectedTable: Table | null;
  currentTableCode: string | null;
  loading: boolean;
  error: string | null;
  qrScanning: boolean;
}

const initialState: TableState = {
  tables: [],
  selectedTable: null,
  currentTableCode: null, // deprecated
  loading: false,
  error: null,
  qrScanning: false,
};

export const getTables = createAsyncThunk(
  'table/getTables',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        number: '1',
        status: 'available',
        x: 20,
        y: 20,
        capacity: 4,
      },
      {
        id: '2',
        number: '2',
        status: 'occupied',
        x: 60,
        y: 20,
        capacity: 6,
      },
      // Add more mock tables as needed
    ] as Table[];
  }
);

export const getTableById = createAsyncThunk(
  'table/getTableById',
  async (tableId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: tableId,
      number: tableId,
      status: 'available',
      x: 20,
      y: 20,
      capacity: 4,
    } as Table;
  }
);

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    selectTable: (state, action: PayloadAction<Table | null>) => {
      state.selectedTable = action.payload;
    },
    setQRScanning: (state, action: PayloadAction<boolean>) => {
      state.qrScanning = action.payload;
    },
    setTableCode: (state, action: PayloadAction<string>) => {
      state.currentTableCode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTables.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = action.payload;
      })
      .addCase(getTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tables';
      })
      .addCase(getTableById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTableById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTable = action.payload;
        state.currentTableCode = action.payload.number;
      })
      .addCase(getTableById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch table';
      });
  },
});

export const { selectTable, setQRScanning, setTableCode } = tableSlice.actions;
export default tableSlice.reducer;
