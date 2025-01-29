import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import venueReducer from './slices/venueSlice';
import menuReducer from './slices/menuSlice';
import orderReducer from './slices/orderSlice';
import tableReducer from './slices/tableSlice';
import serviceRequestReducer from './slices/serviceRequestSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    venue: venueReducer,
    menu: menuReducer,
    order: orderReducer,
    table: tableReducer,
    serviceRequest: serviceRequestReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
