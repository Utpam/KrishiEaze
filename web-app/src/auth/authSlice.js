import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, profileAPI } from '../api';

const initialState = {
    user: null, 
    isAuthenticated: !!localStorage.getItem('accessToken'),
    loading: false,
    error: null,
    isNewUser: false, // Flag to check if we just registered
};

export const requestOtpThunk = createAsyncThunk(
    'auth/requestOtp',
    async ({ mobileNo }, { rejectWithValue }) => {
        try {
            const response = await authAPI.signupRequest({ mobileNo });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to request OTP');
        }
    }
);

export const verifyOtpThunk = createAsyncThunk(
    'auth/verifyOtp',
    async ({ mobileNo, otp }, { rejectWithValue }) => {
        try {
            const response = await authAPI.verifyOtp({ mobileNo, otp });
            return response.data; // Includes jwt/tokenResponse and isNewUser
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to verify OTP');
        }
    }
);

export const fetchProfileThunk = createAsyncThunk(
    'auth/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileAPI.getProfile();
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const updateProfileThunk = createAsyncThunk(
    'auth/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await profileAPI.updateProfile(profileData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.isNewUser = false;
            localStorage.removeItem('accessToken');
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // request OTP
            .addCase(requestOtpThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestOtpThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(requestOtpThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // verify OTP
            .addCase(verifyOtpThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtpThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                
                const token = action.payload.tokenResponse?.accessToken || action.payload.jwt;
                if (token) {
                    localStorage.setItem('accessToken', token);
                }
                state.isNewUser = action.payload.isNewUser || false;
            })
            .addCase(verifyOtpThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetch profile
            .addCase(fetchProfileThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfileThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // Set the full user profile
                state.isAuthenticated = true;
            })
            .addCase(fetchProfileThunk.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                localStorage.removeItem('accessToken');
            })
            // update profile
            .addCase(updateProfileThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfileThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming the response returns an ApiResponseDto with `data` property holding the updated user
                state.user = action.payload.data || action.payload; 
                state.isNewUser = false; // completed profile
            })
            .addCase(updateProfileThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
