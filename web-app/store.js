import { configureStore } from '@reduxjs/toolkit';
import authReducer from './src/auth/authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});
