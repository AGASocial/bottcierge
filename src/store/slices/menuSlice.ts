import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { Product, MenuCategory } from '../../types';

interface MenuState {
  products: Product[];
  categories: MenuCategory[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
}

const initialState: MenuState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  selectedProduct: null,
};

export const getCategories = createAsyncThunk(
  'menu/getCategories',
  async () => {
    const response = await api.get('/menu/categories');
    return response.data.data.filter((b: any) => b.isActive);
  }
);

export const getProducts = createAsyncThunk(
  'menu/getProducts',
  async () => {
    const response = await api.get('/menu/products');
    return response.data.data;
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
    clearError(state) {
      state.error = null;
    },
    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Categories
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      // Get Products
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
        state.error = action.error.message || 'Failed to fetch products';
      })
      // Get Product by ID
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
        state.error = action.error.message || 'Failed to fetch product';
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update product';
      })
      // Update Product Inventory
      .addCase(updateProductInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductInventory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProductInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update inventory';
      });
  },
});

export const { clearError, setSelectedProduct } = menuSlice.actions;
export default menuSlice.reducer;
