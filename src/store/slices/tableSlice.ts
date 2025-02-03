import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { Table } from "../../types";

interface TableState {
  tables: Table[];
  currentTable: Table | null;
  currentTableCode: string | null;
  loading: boolean;
  error: string | null;
  qrScanning: boolean;
}

const initialState: TableState = {
  tables: [],
  currentTable: null,
  currentTableCode: null, // deprecated
  loading: false,
  error: null,
  qrScanning: false,
};

export const getTablesByVenueId = createAsyncThunk(
  "table/getTables",
  async (venueId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Table[]>(`/tables/venue/${venueId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update table status"
      );
    }
  }
);

export const updateTableStatus = createAsyncThunk(
  "table/updateTableStatus",
  async (tableId: string, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/tables/${tableId}/status`);
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update table status"
      );
    }
  }
);

export const getTableById = createAsyncThunk(
  "table/getTableById",
  async (tableId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Table>(`/tables/${tableId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update table status"
      );
    }
  }
);

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    selectTable: (state, action: PayloadAction<Table | null>) => {
      state.currentTable = action.payload;
    },
    setQRScanning: (state, action: PayloadAction<boolean>) => {
      state.qrScanning = action.payload;
    },
    // deprecated
    setTableCode: (state, action: PayloadAction<string>) => {
      state.currentTableCode = action.payload;
    },
    setTableError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTablesByVenueId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTablesByVenueId.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = action.payload;
      })
      .addCase(getTablesByVenueId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tables";
      })
      .addCase(getTableById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTableById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTable = action.payload;
      })
      .addCase(getTableById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch table";
      })
      .addCase(updateTableStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTableStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentTable = action.payload;
      })
      .addCase(updateTableStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to update table status";
      });
  },
});

export const { selectTable, setQRScanning, setTableCode, setTableError } =
  tableSlice.actions;
export default tableSlice.reducer;
