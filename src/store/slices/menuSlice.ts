import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { Product } from '../../types';

interface MenuState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
}

const initialState: MenuState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
};

export const getProducts = createAsyncThunk(
  'menu/getProducts',
  async () => {
    const response = await api.get('/menu/products');
    return response.data;
  }
);

export const getProductById = createAsyncThunk(
  'menu/getProductById',
  async (productId: string) => {
    const response = await api.get(`/menu/products/${productId}`);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  'menu/updateProduct',
  async ({ id, data }: { id: string; data: Partial<Product> }) => {
    const response = await api.put(`/menu/products/${id}`, data);
    return response.data;
  }
);

export const updateProductInventory = createAsyncThunk(
  'menu/updateInventory',
  async ({ id, inventory }: { id: string; inventory: { current: number } }) => {
    const response = await api.patch(`/menu/products/${id}/inventory`, inventory);
    return response.data;
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get products';
      })
      // Get product by ID
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get product';
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      // Update inventory
      .addCase(updateProductInventory.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });
  },
});

export const { clearError, setSelectedProduct } = menuSlice.actions;
export default menuSlice.reducer;
