import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { User } from "../../types";
import { DEFAULT_USER_ID } from "../../utils/orderConstants";

interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await api.post("/auth/login", { email, password });
    // localStorage.setItem("token", response.data.token);
    return response.data.user;
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async () => {
    try {
      // Only proceed if we have a token
      // const token = localStorage.setItem("token", DEFAULT_USER_ID);

      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      // localStorage.removeItem("token");
      throw error;
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData: Partial<User>) => {
    const response = await api.post("/auth/register", userData);
    // localStorage.setItem("token", response.data.token);
    return response.data.user;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      // localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to login";
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to get current user";
        state.currentUser = null;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to register";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
